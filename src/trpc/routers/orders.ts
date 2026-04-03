import { router, publicProcedure, protectedProcedure } from "../server";
import { bookOrders, books } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { TRPCError } from "@trpc/server";

const orderStatusSchema = z.enum(["pending", "approved", "fulfilled", "cancelled"]);

export const ordersRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        bookId: z.string().min(1),
        note: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if ((ctx.session.user as { role?: string }).role === "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Objednávky môžu vytvárať len čitatelia prihlásení cez Microsoft (nie administrátorský účet).",
        });
      }

      const userId = ctx.session.user.id;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Chýba identifikátor používateľa." });
      }

      const bookRow = await ctx.db.query.books.findFirst({
        where: eq(books.id, input.bookId),
      });

      if (!bookRow) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Kniha neexistuje v databáze." });
      }

      const id = crypto.randomUUID();
      const now = new Date();
      ctx.db.insert(bookOrders).values({
        id,
        userId,
        bookId: input.bookId,
        status: "pending",
        note: input.note != null && input.note !== "" ? input.note : null,
        createdAt: now,
        updatedAt: now,
      }).run();
      revalidateTag("book-orders", "page" as "page");
      return { success: true, id };
    }),

  myOrders: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Chýba identifikátor používateľa." });
    }
    return ctx.db.query.bookOrders.findMany({
      where: eq(bookOrders.userId, userId),
      orderBy: (t, { desc: d }) => [d(t.createdAt)],
      with: { book: { with: { author: true, category: true } } },
    });
  }),

  listAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.bookOrders.findMany({
      orderBy: (t, { desc: d }) => [d(t.createdAt)],
      with: {
        user: true,
        book: { with: { author: true, category: true } },
      },
    });
  }),

  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: orderStatusSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      ctx.db
        .update(bookOrders)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(bookOrders.id, input.id))
        .run();
      revalidateTag("book-orders", "page" as "page");
      return { success: true };
    }),
});
