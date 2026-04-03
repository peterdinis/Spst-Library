import { router, publicProcedure, protectedProcedure } from '../server';
import { getCategories } from '@/lib/data';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';

export const categoriesRouter = router({
  getAll: publicProcedure.query(async () => {
    return await getCategories();
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const id = crypto.randomUUID();
      await ctx.db.insert(categories).values({ id, ...input }).run();
      revalidateTag("categories", "page" as any);
      return { success: true, id };
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await ctx.db.update(categories).set(data).where(eq(categories.id, id)).run();
      revalidateTag("categories", "page" as any);
      return { success: true };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(categories).where(eq(categories.id, input.id)).run();
      revalidateTag("categories", "page" as any);
      return { success: true };
    }),
});
