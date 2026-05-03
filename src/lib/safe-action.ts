import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { getClientIpFromForwardedHeader } from "./client-ip";
import { defaultRateLimiter } from "./rate-limit";

export const actionClient = createSafeActionClient().use(async ({ next }) => {
	const headersList = await headers();
	const ip = getClientIpFromForwardedHeader(headersList.get("x-forwarded-for"));

	const session = await auth();

	const { success: ipOk } = defaultRateLimiter.limit(`action_ip_${ip}`);
	if (!ipOk) {
		throw new Error("Príliš veľa požiadaviek. Skúste to znova neskôr.");
	}

	const userId = session?.user?.id;
	if (userId) {
		const { success: userOk } = defaultRateLimiter.limit(`action_user_${userId}`);
		if (!userOk) {
			throw new Error("Príliš veľa požiadaviek. Skúste to znova neskôr.");
		}
	}

	return next({ ctx: { session, ip } });
});

export const protectedActionClient = actionClient.use(async ({ ctx, next }) => {
	if (!ctx.session?.user) {
		throw new Error("Relácia nebola nájdená. Prihláste sa znova.");
	}

	return next({ ctx: { session: ctx.session } });
});
