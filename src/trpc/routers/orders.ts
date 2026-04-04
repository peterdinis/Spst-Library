import { router, publicProcedure, protectedProcedure } from "../server";
import { bookOrders, books } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidateTag, unstable_cache } from "next/cache";
import { TRPCError } from "@trpc/server";
import { CACHE_TAGS, CACHE_TTL } from "../cache-config";

const orderStatusSchema = z.enum([
	"pending",
	"approved",
	"fulfilled",
	"cancelled",
]);

export const ordersRouter = router({
	create: protectedProcedure
		.input(
			z.object({
				bookId: z.string().min(1),
				note: z.string().max(500).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if ((ctx.session.user as { role?: string }).role === "admin") {
				throw new TRPCError({
					code: "FORBIDDEN",
					message:
						"Objednávky môžu vytvárať len čitatelia prihlásení cez Microsoft (nie administrátorský účet).",
				});
			}

			const userId = ctx.session.user.id;
			if (!userId) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Chýba identifikátor používateľa.",
				});
			}

			const bookRow = await ctx.db.query.books.findFirst({
				where: eq(books.id, input.bookId),
			});

			if (!bookRow) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Kniha neexistuje v databáze.",
				});
			}

			const id = crypto.randomUUID();
			const now = new Date();
			ctx.db
				.insert(bookOrders)
				.values({
					id,
					userId,
					bookId: input.bookId,
					status: "pending",
					note: input.note != null && input.note !== "" ? input.note : null,
					createdAt: now,
					updatedAt: now,
				})
				.run();
			revalidateTag(CACHE_TAGS.orders, "default");
			return { success: true, id };
		}),

	myOrders: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;
		if (!userId) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "Chýba identifikátor používateľa.",
			});
		}

		// User-scoped cache key so each user's orders are cached independently
		const getCachedMyOrders = unstable_cache(
			async () =>
				ctx.db.query.bookOrders.findMany({
					where: eq(bookOrders.userId, userId),
					orderBy: (t, { desc: d }) => [d(t.createdAt)],
					with: { book: { with: { author: true, category: true } } },
				}),
			["orders", "user", userId],
			{
				tags: [CACHE_TAGS.orders],
				revalidate: CACHE_TTL.orders,
			},
		);

		return getCachedMyOrders();
	}),

	listAll: publicProcedure.query(async ({ ctx }) => {
		const getCachedAllOrders = unstable_cache(
			async () =>
				ctx.db.query.bookOrders.findMany({
					orderBy: (t, { desc: d }) => [d(t.createdAt)],
					with: {
						user: true,
						book: { with: { author: true, category: true } },
					},
				}),
			["orders", "all"],
			{
				tags: [CACHE_TAGS.orders],
				revalidate: CACHE_TTL.orders,
			},
		);

		return getCachedAllOrders();
	}),

	updateStatus: publicProcedure
		.input(
			z.object({
				id: z.string(),
				status: orderStatusSchema,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			ctx.db
				.update(bookOrders)
				.set({ status: input.status, updatedAt: new Date() })
				.where(eq(bookOrders.id, input.id))
				.run();
			revalidateTag(CACHE_TAGS.orders, "default");
			return { success: true };
		}),
});
