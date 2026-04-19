import { router, publicProcedure, adminProcedure } from "../server";
import { getCategories } from "@/lib/data";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidateTag, unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTL } from "../cache-config";

const getCachedCategories = unstable_cache(
	async () => getCategories(),
	["categories"],
	{
		tags: [CACHE_TAGS.categories],
		revalidate: CACHE_TTL.categories,
	},
);

export const categoriesRouter = router({
	getAll: publicProcedure.query(async () => {
		return getCachedCategories();
	}),

	create: adminProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const id = crypto.randomUUID();
			await ctx.db.insert(categories).values({ id, ...input });
			revalidateTag(CACHE_TAGS.categories, "default");
			return { success: true, id };
		}),

	update: adminProcedure
		.input(z.object({ id: z.string(), name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;
			await ctx.db
				.update(categories)
				.set(data)
				.where(eq(categories.id, id));
			revalidateTag(CACHE_TAGS.categories, "default");
			return { success: true };
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(categories).where(eq(categories.id, input.id));
			revalidateTag(CACHE_TAGS.categories, "default");
			return { success: true };
		}),
});
