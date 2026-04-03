import { router, protectedProcedure } from "../server";
import { notifications } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { revalidateTag } from "next/cache";

export const notificationsRouter = router({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session?.user?.id;
		if (!userId) return [];

		// Check for upcoming deadlines (due in <= 2 days)
		const twoDaysFromNow = new Date();
		twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

		const upcomingBooks = await ctx.db.query.borrowedBooks.findMany({
			where: (bb, { and, eq, lte, gt }) =>
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
			// Check if a reminder already exists for this book
			const existingReminder = await ctx.db.query.notifications.findFirst({
				where: (n, { and, eq }) =>
					and(
						eq(n.userId, userId),
						eq(n.type, "reminder"),
						// Simple heuristic: if message contains the book title, it's a reminder for it
						// Or better, we could add a referenceId column, but let's keep it simple for now
						// We'll use a specific message format
					),
			});

			// To be more precise, let's just check if we sent a reminder in the last 24h for "this" book
			// For simplicity in this demo, I'll just check for any reminder with the book title
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

		return await ctx.db.query.notifications.findMany({
			where: eq(notifications.userId, userId),
			orderBy: [desc(notifications.createdAt)],
			limit: 20,
		});
	}),

	markAsRead: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(notifications)
				.set({ isRead: true })
				.where(eq(notifications.id, input.id))
				.run();

			revalidateTag("notifications", "page" as any);
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

		revalidateTag("notifications", "page" as any);
		return { success: true };
	}),
});
