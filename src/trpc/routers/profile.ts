import { router, protectedProcedure } from "../server";
import { userSettings, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getBorrowedByUserId } from "@/lib/data";

export const profileRouter = router({
	/** Jedno volanie namiesto samostatných settings + výpožičiek (batch na klientovi). */
	getDashboard: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;
		if (!userId) return null;

		let settings = await ctx.db.query.userSettings.findFirst({
			where: eq(userSettings.userId, userId),
		});

		if (!settings) {
			await ctx.db
				.insert(userSettings)
				.values({
					userId,
					emailNotifications: true,
					dueReminders: true,
					systemUpdates: false,
				})
				.run();
			settings = await ctx.db.query.userSettings.findFirst({
				where: eq(userSettings.userId, userId),
			});
		}

		const [borrows, userRow] = await Promise.all([
			getBorrowedByUserId(userId),
			ctx.db.query.users.findFirst({
				where: eq(users.id, userId),
			}),
		]);

		return {
			settings,
			borrows,
			user: userRow,
		};
	}),
});
