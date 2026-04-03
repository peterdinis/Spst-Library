import { router, protectedProcedure } from "../server";
import { userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidateTag } from "next/cache";

export const settingsRouter = router({
	getSettings: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;
		if (!userId) return null;

		let settings = await ctx.db.query.userSettings.findFirst({
			where: eq(userSettings.userId, userId),
		});

		if (!settings) {
			// Create default settings if they don't exist
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

		return settings;
	}),

	updateSettings: protectedProcedure
		.input(
			z.object({
				emailNotifications: z.boolean().optional(),
				dueReminders: z.boolean().optional(),
				systemUpdates: z.boolean().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			if (!userId) return { success: false };

			await ctx.db
				.update(userSettings)
				.set(input)
				.where(eq(userSettings.userId, userId))
				.run();

			revalidateTag("settings", "page" as any);
			return { success: true };
		}),
});
