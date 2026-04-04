import { router, protectedProcedure } from "../server";
import { notifications } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
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
			await ctx.db
				.update(notifications)
				.set({ isRead: true })
				.where(eq(notifications.id, input.id))
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
});
