import { router, publicProcedure, protectedProcedure } from "../server";
import { getBooks, getBorrowedByUserId } from "@/lib/data";
import { books } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidateTag } from "next/cache";

export const booksRouter = router({
	getAll: publicProcedure
		.input(
			z
				.object({
					search: z.string().optional(),
					authorId: z.string().optional(),
					categoryId: z.string().optional(),
					limit: z.number().min(1).max(100).default(20),
					offset: z.number().min(0).default(0),
				})
				.optional(),
		)
		.query(async ({ input }) => {
			return await getBooks(input || {});
		}),
	getBorrowedByUser: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session?.user?.id;
		if (!userId) return [];
		return await getBorrowedByUserId(userId);
	}),
	create: protectedProcedure
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
			ctx.db
				.insert(books)
				.values({ id, ...input })
				.run();
			revalidateTag("books", "page" as any);
			return { success: true, id };
		}),
	update: protectedProcedure
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
			revalidateTag("books", "page" as any);
			return { success: true };
		}),
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(books).where(eq(books.id, input.id)).run();
			revalidateTag("books", "page" as any);
			return { success: true };
		}),
});
