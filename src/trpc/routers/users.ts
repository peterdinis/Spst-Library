import { router, adminProcedure } from "../server";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

export const usersRouter = router({
	/** Zoznam používateľov, ktorí sa už prihlásili do aplikácie. */
	listLoggedUsers: adminProcedure.query(async ({ ctx }) => {
		try {
			const loggedUsers = await ctx.db
				.select()
				.from(users)
				.orderBy(desc(users.isAdmin))
				.all();
			return { users: loggedUsers, error: null };
		} catch (e: unknown) {
			const message =
				e instanceof Error
					? e.message
					: "Nepodarilo sa načítať prihlásených používateľov.";
			return { users: [], error: message };
		}
	}),
});
