import { router, publicProcedure, adminProcedure } from "../server";
import { getAuthors } from "@/lib/data";
import { authors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidateTag, unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTL } from "../cache-config";

const getCachedAuthors = unstable_cache(async () => getAuthors(), ["authors"], {
	tags: [CACHE_TAGS.authors],
	revalidate: CACHE_TTL.authors,
});

export const authorsRouter = router({
	getAll: publicProcedure.query(async () => {
		return getCachedAuthors();
	}),

	create: adminProcedure
		.input(
			z.object({
				name: z.string().min(1),
				bio: z.string().optional(),
				imageUrl: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const id = crypto.randomUUID();
			await ctx.db.insert(authors).values({ id, ...input });
			revalidateTag(CACHE_TAGS.authors, "default");
			return { success: true, id };
		}),

	update: adminProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1),
				bio: z.string().optional(),
				imageUrl: z.string().nullable().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;
			await ctx.db.update(authors).set(data).where(eq(authors.id, id));
			revalidateTag(CACHE_TAGS.authors, "default");
			return { success: true };
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(authors).where(eq(authors.id, input.id));
			revalidateTag(CACHE_TAGS.authors, "default");
			return { success: true };
		}),
});
