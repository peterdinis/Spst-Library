import { router, adminProcedure } from "../server";
import { users, adminWhitelist } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const usersRouter = router({
	/** Zoznam používateľov, ktorí sa už prihlásili do aplikácie. */
	listLoggedUsers: adminProcedure.query(async ({ ctx }) => {
		try {
			const loggedUsers = await ctx.db
				.select()
				.from(users)
				.orderBy(desc(users.isAdmin));
			return { users: loggedUsers, error: null };
		} catch (e: unknown) {
			const message =
				e instanceof Error
					? e.message
					: "Nepodarilo sa načítať prihlásených používateľov.";
			return { users: [], error: message };
		}
	}),

	/** Zmení status administrátora pre používateľa. */
	toggleAdminStatus: adminProcedure
		.input(z.object({ id: z.string(), isAdmin: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.db
					.update(users)
					.set({ isAdmin: input.isAdmin })
					.where(eq(users.id, input.id));

				// Ak odoberáme práva, skúsime ich odobrať aj z whitelistu (podľa mailu)
				if (!input.isAdmin) {
					const userRows = await ctx.db
						.select({ email: users.email })
						.from(users)
						.where(eq(users.id, input.id))
						.limit(1);
					const user = userRows[0];

					if (user?.email) {
						await ctx.db
							.delete(adminWhitelist)
							.where(eq(adminWhitelist.email, user.email));
					}
				}

				return { success: true };
			} catch (e: unknown) {
				const message =
					e instanceof Error ? e.message : "Chyba pri zmene práv.";
				throw new Error(message);
			}
		}),
});
