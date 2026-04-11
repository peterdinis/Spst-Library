import { router, protectedProcedure, adminProcedure } from "../server";
import {
	notifications,
	books,
	authors,
	categories,
	borrowedBooks,
	bookOrders,
} from "@/db/schema";
import { eq, desc, isNotNull, and } from "drizzle-orm";
import { z } from "zod";
import { revalidateTag, unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTL } from "../cache-config";

export const notificationsRouter = router({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session?.user?.id;
		if (!userId) return [];

		// Check for upcoming deadlines (due in <= 2 days)
		const twoDaysFromNow = new Date();
		twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

		const upcomingBooks = await ctx.db.query.borrowedBooks.findMany({
			where: (bb, { and, eq, lte }) =>
				and(
					eq(bb.userId, userId),
					eq(bb.status, "borrowed"),
					lte(bb.dueDate, twoDaysFromNow),
				),
			with: {
				book: true,
			},
		});

		for (const bb of upcomingBooks) {
			const message = `Pripomienka: Kniha "${bb.book.title}" má termín vrátenia o menej ako 2 dni!`;

			const alreadySent = await ctx.db.query.notifications.findFirst({
				where: (n, { and, eq }) =>
					and(eq(n.userId, userId), eq(n.message, message)),
			});

			if (!alreadySent) {
				await ctx.db
					.insert(notifications)
					.values({
						id: crypto.randomUUID(),
						userId,
						message,
						type: "reminder",
						isRead: false,
					})
					.run();
			}
		}

		// User-scoped cache: each user gets their own notifications cache entry
		const getCachedNotifications = unstable_cache(
			async () =>
				ctx.db.query.notifications.findMany({
					where: eq(notifications.userId, userId),
					orderBy: [desc(notifications.createdAt)],
					limit: 20,
				}),
			["notifications", userId],
			{
				tags: [CACHE_TAGS.notifications],
				revalidate: CACHE_TTL.notifications,
			},
		);

		return getCachedNotifications();
	}),

	markAsRead: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session?.user?.id;
			if (!userId) return { success: false };

			await ctx.db
				.update(notifications)
				.set({ isRead: true })
				.where(
					and(
						eq(notifications.id, input.id),
						eq(notifications.userId, userId),
					),
				)
				.run();

			revalidateTag(CACHE_TAGS.notifications, "default");
			return { success: true };
		}),

	markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
		const userId = ctx.session?.user?.id;
		if (!userId) return { success: false };

		await ctx.db
			.update(notifications)
			.set({ isRead: true })
			.where(eq(notifications.userId, userId))
			.run();

		revalidateTag(CACHE_TAGS.notifications, "default");
		return { success: true };
	}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session?.user?.id;
			if (!userId) return { success: false };

			await ctx.db
				.delete(notifications)
				.where(
					and(
						eq(notifications.id, input.id),
						eq(notifications.userId, userId),
					),
				)
				.run();

			revalidateTag(CACHE_TAGS.notifications, "default");
			return { success: true };
		}),

	deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
		const userId = ctx.session?.user?.id;
		if (!userId) return { success: false };

		await ctx.db
			.delete(notifications)
			.where(eq(notifications.userId, userId))
			.run();

		revalidateTag(CACHE_TAGS.notifications, "default");
		return { success: true };
	}),

	listAdminFeed: adminProcedure.query(async ({ ctx }) => {
		const [
			recentBooks,
			recentAuthors,
			recentCategories,
			recentBorrows,
			recentReturns,
			recentOrders,
		] = await Promise.all([
			ctx.db
				.select({
					id: books.id,
					title: books.title,
					createdAt: books.createdAt,
				})
				.from(books)
				.orderBy(desc(books.createdAt))
				.limit(20),
			ctx.db
				.select({
					id: authors.id,
					name: authors.name,
					createdAt: authors.createdAt,
				})
				.from(authors)
				.orderBy(desc(authors.createdAt))
				.limit(20),
			ctx.db
				.select({
					id: categories.id,
					name: categories.name,
					createdAt: categories.createdAt,
				})
				.from(categories)
				.orderBy(desc(categories.createdAt))
				.limit(20),
			ctx.db.query.borrowedBooks.findMany({
				where: eq(borrowedBooks.status, "borrowed"),
				orderBy: (t, { desc: d }) => [d(t.borrowDate)],
				limit: 20,
				with: {
					user: true,
					book: true,
				},
			}),
			ctx.db.query.borrowedBooks.findMany({
				where: isNotNull(borrowedBooks.returnDate),
				orderBy: (t, { desc: d }) => [d(t.returnDate)],
				limit: 20,
				with: {
					user: true,
					book: true,
				},
			}),
			ctx.db.query.bookOrders.findMany({
				orderBy: (t, { desc: d }) => [d(t.createdAt)],
				limit: 20,
				with: {
					user: true,
					book: true,
				},
			}),
		]);

		const feed = [
			...recentBooks.map((item) => ({
				id: `book:${item.id}`,
				type: "book_created" as const,
				title: "Pridaná nová kniha",
				description: `Kniha "${item.title}" bola pridaná do katalógu.`,
				createdAt: item.createdAt,
			})),
			...recentAuthors.map((item) => ({
				id: `author:${item.id}`,
				type: "author_created" as const,
				title: "Pridaný nový autor",
				description: `Autor "${item.name}" bol pridaný do databázy.`,
				createdAt: item.createdAt,
			})),
			...recentCategories.map((item) => ({
				id: `category:${item.id}`,
				type: "category_created" as const,
				title: "Pridaná nová kategória",
				description: `Kategória "${item.name}" bola pridaná do systému.`,
				createdAt: item.createdAt,
			})),
			...recentBorrows.map((item) => ({
				id: `borrow:${item.id}`,
				type: "borrowed" as const,
				title: "Kniha bola požičaná",
				description: `${item.user?.name ?? item.user?.email ?? "Používateľ"} si požičal(a) "${item.book?.title ?? "Kniha"}".`,
				createdAt: item.borrowDate,
			})),
			...recentReturns.map((item) => ({
				id: `return:${item.id}`,
				type: "returned" as const,
				title: "Kniha bola vrátená",
				description: `${item.user?.name ?? item.user?.email ?? "Používateľ"} vrátil(a) "${item.book?.title ?? "Kniha"}".`,
				createdAt: item.returnDate ?? item.borrowDate,
			})),
			...recentOrders.map((item) => ({
				id: `order:${item.id}`,
				type: "order_created" as const,
				title: "Vytvorená objednávka",
				description: `${item.user?.name ?? item.user?.email ?? "Používateľ"} vytvoril(a) objednávku na "${item.book?.title ?? "Kniha"}".`,
				createdAt: item.createdAt,
			})),
		]
			.filter((item) => Boolean(item.createdAt))
			.sort(
				(a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
			)
			.slice(0, 60);

		return feed;
	}),
});
