import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { defaultRateLimiter } from "./rate-limit";

export const actionClient = createSafeActionClient().use(async ({ next }) => {
	const headersList = await headers();
	const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
	
	// Check session for user ID
	const session = await auth();
	const identifier = session?.user?.id || ip;

	const { success } = defaultRateLimiter.limit(`action_${identifier}`);

	if (!success) {
		throw new Error("Príliš veľa požiadaviek. Skúste to znova neskôr.");
	}

	return next({ ctx: { session, ip } });
});

export const protectedActionClient = actionClient.use(async ({ ctx, next }) => {
	if (!ctx.session?.user) {
		throw new Error("Relácia nebola nájdená. Prihláste sa znova.");
	}

	return next({ ctx: { session: ctx.session } });
});
