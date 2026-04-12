import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/auth";

export const actionClient = createSafeActionClient();

export const protectedActionClient = actionClient.use(async ({ next }) => {
	const session = await auth();

	if (!session?.user) {
		throw new Error("Relácia nebola nájdená. Prihláste sa znova.");
	}

	return next({ ctx: { session } });
});
