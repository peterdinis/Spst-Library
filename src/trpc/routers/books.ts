import {
	router,
	publicProcedure,
	protectedProcedure,
	adminProcedure,
} from "../server";
import { getBooks, getBorrowedByUserId } from "@/lib/data";
import { books } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resolveUserIdFromDb } from "@/lib/resolve-user-id";
import { z } from "zod";
import { revalidateTag, unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTL } from "../cache-config";

export const booksRouter = router({
	getAll: publicProcedure
		.input(
			z
				.object({
					search: z.string().optional(),
					authorName: z.string().optional(),
					categoryId: z.string().optional(),
					limit: z.number().min(1).max(100).default(20),
					offset: z.number().min(0).default(0),
				})
				.optional(),
		)
		.query(async ({ input }) => {
			const resolvedInput = input || {};
			// Build a stable cache key from the input parameters
			const cacheKey = JSON.stringify(resolvedInput);
			const cached = unstable_cache(
				async () => getBooks(resolvedInput),
				["books", cacheKey],
				{
					tags: [CACHE_TAGS.books],
					revalidate: CACHE_TTL.books,
				},
			);
			return cached();
		}),

	getBorrowedByUser: protectedProcedure.query(async ({ ctx }) => {
		const userId = resolveUserIdFromDb(
			ctx.session?.user?.email,
			ctx.session?.user?.id,
		);
		if (!userId) return [];
		// User-scoped cache: key includes userId so each user gets their own cache entry
		const cached = unstable_cache(
			async () => getBorrowedByUserId(userId),
			["books", "borrowed", userId],
			{
				tags: [CACHE_TAGS.borrowedBooks],
				revalidate: CACHE_TTL.books,
			},
		);
		return cached();
	}),

	create: adminProcedure
		.input(
			z.object({
				title: z.string().min(1),
				description: z.string().optional(),
				coverUrl: z.string().optional(),
				isbn: z.string().optional(),
				availableCopies: z.number().min(0).default(1),
				authorId: z.string().min(1),
				categoryId: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const id = crypto.randomUUID();
			await ctx.db
				.insert(books)
				.values({ id, ...input })
				.run();
			revalidateTag(CACHE_TAGS.books, "default");
			return { success: true, id };
		}),

	update: adminProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string().min(1),
				description: z.string().optional(),
				coverUrl: z.string().optional(),
				isbn: z.string().optional(),
				availableCopies: z.number().min(0),
				authorId: z.string().min(1),
				categoryId: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;
			await ctx.db.update(books).set(data).where(eq(books.id, id)).run();
			revalidateTag(CACHE_TAGS.books, "default");
			return { success: true };
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(books).where(eq(books.id, input.id)).run();
			revalidateTag(CACHE_TAGS.books, "default");
			return { success: true };
		}),
});
