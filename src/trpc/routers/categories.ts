import { router, publicProcedure, adminProcedure } from "../server";
import { getCategories } from "@/lib/data";
import { categories } from "@/db/schema";
import { count, desc, eq, like } from "drizzle-orm";
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
	list: publicProcedure
		.input(
			z.object({
				search: z.string().optional(),
				limit: z.number().min(1).max(80).default(20),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ ctx, input }) => {
			const term = input.search?.trim();
			const where = term
				? like(categories.name, `%${term}%`)
				: undefined;

			const [items, totalRows] = await Promise.all([
				ctx.db.query.categories.findMany({
					where,
					limit: input.limit,
					offset: input.offset,
					orderBy: [desc(categories.createdAt)],
				}),
				ctx.db
					.select({ value: count() })
					.from(categories)
					.where(where)
					.then((rows) => rows[0]?.value ?? 0),
			]);

			return { items, total: totalRows };
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
			await ctx.db.update(categories).set(data).where(eq(categories.id, id));
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
