import { router, publicProcedure } from "../server";
import { fetchEntraDirectoryUsers } from "@/lib/microsoft-graph";

export const entraRouter = router({
	/** Používatelia z Entra (Graph). Vyžaduje app permission User.Read.All + admin consent. */
	listDirectoryUsers: publicProcedure.query(async () => {
		try {
			const users = await fetchEntraDirectoryUsers();
			return { users, error: null as string | null };
		} catch (e: unknown) {
			const message =
				e instanceof Error
					? e.message
					: "Nepodarilo sa načítať používateľov z Entra.";
			return {
				users: [] as Awaited<ReturnType<typeof fetchEntraDirectoryUsers>>,
				error: message,
			};
		}
	}),
});
