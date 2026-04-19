import { router, protectedProcedure } from "../server";
import { userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resolveUserIdFromDb } from "@/lib/resolve-user-id";
import { z } from "zod";
import { revalidateTag, unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTL } from "../cache-config";

export const settingsRouter = router({
	getSettings: protectedProcedure.query(async ({ ctx }) => {
		const userId = await resolveUserIdFromDb(
			ctx.session.user.email,
			ctx.session.user.id,
		);
		if (!userId) return null;

		let settings = await ctx.db.query.userSettings.findFirst({
			where: eq(userSettings.userId, userId),
		});

		if (!settings) {
			// Create default settings if they don't exist
			await ctx.db.insert(userSettings).values({
				userId,
				emailNotifications: true,
				dueReminders: true,
				systemUpdates: false,
			});

			settings = await ctx.db.query.userSettings.findFirst({
				where: eq(userSettings.userId, userId),
			});
		}

		// User-scoped cache: refresh settings from DB then cache per user
		const getCachedSettings = unstable_cache(
			async () =>
				ctx.db.query.userSettings.findFirst({
					where: eq(userSettings.userId, userId),
				}),
			["settings", userId],
			{
				tags: [CACHE_TAGS.settings],
				revalidate: CACHE_TTL.settings,
			},
		);

		return getCachedSettings() ?? settings;
	}),

	updateSettings: protectedProcedure
		.input(
			z.object({
				emailNotifications: z.boolean().optional(),
				dueReminders: z.boolean().optional(),
				systemUpdates: z.boolean().optional(),
				readingGoal: z
					.union([
						z.number().int().min(1).max(1000),
						z.null(),
					])
					.optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = await resolveUserIdFromDb(
				ctx.session.user.email,
				ctx.session.user.id,
			);
			if (!userId) return { success: false };

			await ctx.db
				.update(userSettings)
				.set(input)
				.where(eq(userSettings.userId, userId));

			revalidateTag(CACHE_TAGS.settings, "default");
			return { success: true };
		}),
});
