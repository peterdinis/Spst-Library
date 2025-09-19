import { z } from "zod";

export const createBookSchema = z.object({
  name: z.string().min(1, "Meno knihy je povinné"),
  description: z.string().optional(),
  year: z.number().int().optional(),
  isAvailable: z.boolean().optional(),
  isNew: z.boolean().optional(),
  categoryId: z.number().int().optional(),
  authorId: z.number().int(),
});

// Typ inferovaný zo schema
export type CreateBookDto = z.infer<typeof createBookSchema>;