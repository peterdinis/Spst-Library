import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/auth";
import { db } from "@/db";

export const createContext = async () => {
	const session = await auth();
	return {
		session,
		db,
	};
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
	if (!ctx.session?.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({
		ctx: {
			session: { ...ctx.session, user: ctx.session.user },
		},
	});
});
