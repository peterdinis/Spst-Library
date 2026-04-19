import { router, protectedProcedure, adminProcedure } from "../server";
import { userHasAdminAccess } from "@/lib/admin-access";
import { bookOrders, books } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidateTag, unstable_cache } from "next/cache";
import { TRPCError } from "@trpc/server";
import { CACHE_TAGS, CACHE_TTL } from "../cache-config";
import { sendTransactionalEmail } from "@/lib/mail";

const orderStatusSchema = z.enum([
	"pending",
	"approved",
	"fulfilled",
	"cancelled",
]);

export const ordersRouter = router({
	create: protectedProcedure
		.input(
			z.object({
				bookId: z.string().min(1),
				note: z.string().max(500).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (await userHasAdminAccess(ctx.session)) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message:
						"Objednávky môžu vytvárať len čitatelia (nie účty so správcovským oprávnením).",
				});
			}

			const userId = ctx.session.user.id;
			if (!userId) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Chýba identifikátor používateľa.",
				});
			}

			const bookRow = await ctx.db.query.books.findFirst({
				where: eq(books.id, input.bookId),
			});

			if (!bookRow) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Kniha neexistuje v databáze.",
				});
			}

			const id = crypto.randomUUID();
			const now = new Date();
			await ctx.db.insert(bookOrders).values({
				id,
				userId,
				bookId: input.bookId,
				status: "pending",
				note: input.note != null && input.note !== "" ? input.note : null,
				createdAt: now,
				updatedAt: now,
			});

			if (ctx.session.user.email) {
				await sendTransactionalEmail(
					ctx.session.user.email,
					"Objednávka knihy bola prijatá",
					`
					<h1>Objednávka prijatá</h1>
					<p>Dobrý deň, ${ctx.session.user.name || "čitateľ"},</p>
					<p>Vaša objednávka na knihu <strong>${bookRow.title}</strong> bola úspešne odoslaná.</p>
					<p>Stav objednávky: <strong>Čaká na spracovanie</strong>.</p>
					<p>Keď knižnica objednávku schváli alebo vybaví, pošleme vám ďalšie oznámenie.</p>
					`,
				);
			}

			revalidateTag(CACHE_TAGS.orders, "default");
			return { success: true, id };
		}),

	myOrders: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;
		if (!userId) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "Chýba identifikátor používateľa.",
			});
		}

		// User-scoped cache key so each user's orders are cached independently
		const getCachedMyOrders = unstable_cache(
			async () =>
				ctx.db.query.bookOrders.findMany({
					where: eq(bookOrders.userId, userId),
					orderBy: (t, { desc: d }) => [d(t.createdAt)],
					with: { book: { with: { author: true, category: true } } },
				}),
			["orders", "user", userId],
			{
				tags: [CACHE_TAGS.orders],
				revalidate: CACHE_TTL.orders,
			},
		);

		return getCachedMyOrders();
	}),

	listAll: adminProcedure.query(async ({ ctx }) => {
		const getCachedAllOrders = unstable_cache(
			async () =>
				ctx.db.query.bookOrders.findMany({
					orderBy: (t, { desc: d }) => [d(t.createdAt)],
					with: {
						user: true,
						book: { with: { author: true, category: true } },
					},
				}),
			["orders", "all"],
			{
				tags: [CACHE_TAGS.orders],
				revalidate: CACHE_TTL.orders,
			},
		);

		return getCachedAllOrders();
	}),

	updateStatus: adminProcedure
		.input(
			z.object({
				id: z.string(),
				status: orderStatusSchema,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const current = await ctx.db.query.bookOrders.findFirst({
				where: eq(bookOrders.id, input.id),
				with: {
					user: true,
					book: true,
				},
			});
			if (!current) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Objednávka neexistuje.",
				});
			}

			await ctx.db
				.update(bookOrders)
				.set({ status: input.status, updatedAt: new Date() })
				.where(eq(bookOrders.id, input.id));

			const statusLabel: Record<
				"pending" | "approved" | "fulfilled" | "cancelled",
				string
			> = {
				pending: "Čaká",
				approved: "Schválená",
				fulfilled: "Vydaná",
				cancelled: "Zrušená",
			};

			if (current.user?.email) {
				await sendTransactionalEmail(
					current.user.email,
					`Aktualizácia objednávky: ${statusLabel[input.status]}`,
					`
					<h1>Objednávka aktualizovaná</h1>
					<p>Dobrý deň, ${current.user.name || "čitateľ"},</p>
					<p>Objednávka na knihu <strong>${current.book?.title ?? "Kniha"}</strong> bola aktualizovaná.</p>
					<p>Nový stav: <strong>${statusLabel[input.status]}</strong>.</p>
					`,
				);
			}

			revalidateTag(CACHE_TAGS.orders, "default");
			return { success: true };
		}),
});
