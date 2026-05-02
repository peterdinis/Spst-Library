import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { userHasAdminAccess } from "@/lib/admin-access";
import { headers } from "next/headers";
import { defaultRateLimiter } from "@/lib/rate-limit";

export const createContext = async () => {
	const session = await auth();
	const headersList = await headers();
	const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

	return {
		session,
		db,
		ip,
	};
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;

// Rate limiting middleware
const rateLimitMiddleware = t.middleware(async ({ ctx, next }) => {
	// Identify user by their ID if logged in, otherwise use their IP
	const identifier = ctx.session?.user?.id || ctx.ip;

	const { success } = defaultRateLimiter.limit(`trpc_${identifier}`);

	if (!success) {
		throw new TRPCError({
			code: "TOO_MANY_REQUESTS",
			message: "Príliš veľa požiadaviek. Skúste to znova neskôr.",
		});
	}

	return next({ ctx });
});

export const publicProcedure = t.procedure.use(rateLimitMiddleware);

export const protectedProcedure = t.procedure
	.use(rateLimitMiddleware)
	.use(async ({ ctx, next }) => {
		if (!ctx.session?.user) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}
		return next({
			ctx: {
				session: { ...ctx.session, user: ctx.session.user },
			},
		});
	});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
	if (!(await userHasAdminAccess(ctx.session))) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Na túto akciu nemáte oprávnenie.",
		});
	}
	return next({ ctx });
});
