import { router, publicProcedure, protectedProcedure } from '../server';
import { getAuthors } from '@/lib/data';
import { authors } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';

export const authorsRouter = router({
  getAll: publicProcedure.query(async () => {
    return await getAuthors();
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = crypto.randomUUID();
      await ctx.db.insert(authors).values({ id, ...input }).run();
      revalidateTag("authors", "page" as "page");
      return { success: true, id };
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        bio: z.string().optional(),
        imageUrl: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await ctx.db.update(authors).set(data).where(eq(authors.id, id)).run();
      revalidateTag("authors", "page" as "page");
      return { success: true };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(authors).where(eq(authors.id, input.id)).run();
      revalidateTag("authors", "page" as "page");
      return { success: true };
    }),
});
