import { router, adminProcedure } from "../server";
import { adminWhitelist } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

export const adminWhitelistRouter = router({
	/** Zoznam whitelisted e-mailov */
	list: adminProcedure.query(async ({ ctx }) => {
		try {
			const list = await ctx.db
				.select()
				.from(adminWhitelist)
				.orderBy(desc(adminWhitelist.createdAt))
				.all();
			return { list, error: null };
		} catch (e: unknown) {
			return {
				list: [],
				error:
					e instanceof Error ? e.message : "Chyba pri načítaní whitelistu.",
			};
		}
	}),

	/** Pridať e-mail do whitelistu */
	add: adminProcedure
		.input(z.object({ email: z.string().email() }))
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.db
					.insert(adminWhitelist)
					.values({
						id: crypto.randomUUID(),
						email: input.email.toLowerCase(),
					})
					.run();
				return { success: true };
			} catch (e: unknown) {
				throw new Error(
					"Tento e-mail už je na whiteliste alebo nastala chyba.",
				);
			}
		}),

	/** Odobrať e-mail z whitelistu */
	remove: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.db
					.delete(adminWhitelist)
					.where(eq(adminWhitelist.id, input.id))
					.run();
				return { success: true };
			} catch (e: unknown) {
				throw new Error("Nepodarilo sa odstrániť položku.");
			}
		}),
});
