import z from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Názov je povinný").max(100, "Názov je príliš dlhý (max 100 znakov)"),
  description: z.string().max(500, "Popis je príliš dlhý (max 500 znakov)").optional(),
  slug: z.string().min(1, "Slug je povinný").max(100, "Slug je príliš dlhý").regex(/^[a-z0-9-]+$/, "Slug môže obsahovať len malé písmená, čísla a pomlčky"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Neplatný formát farby (použite #RRGGBB)").optional(),
  icon: z.string().max(50, "Názov ikony je príliš dlhý").optional(),
  isActive: z.boolean().optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();