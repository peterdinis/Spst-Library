import { router, adminProcedure } from "../server";
import { fetchEntraDirectoryUsers } from "@/lib/microsoft-graph";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTL } from "../cache-config";

const getCachedEntraUsers = unstable_cache(
	async () => {
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
	},
	["entra-users"],
	{
		tags: [CACHE_TAGS.entra],
		revalidate: CACHE_TTL.entra,
	},
);

export const entraRouter = router({
	/** Používatelia z Entra (Graph). Vyžaduje app permission User.Read.All + admin consent. */
	listDirectoryUsers: adminProcedure.query(async () => {
		return getCachedEntraUsers();
	}),
});
