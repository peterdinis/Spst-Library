// ==================== ZOD SCHEMAS ====================

import z from "zod";

/**
 * Zod schema for author validation
 */
export const authorSchema = z.object({
  name: z.string().min(1, "Meno je povinné").max(200, "Meno je príliš dlhé (max 200 znakov)"),
  biography: z.string().max(5000, "Životopis je príliš dlhý (max 5000 znakov)").optional(),
  birthYear: z
    .number()
    .int("Rok musí byť celé číslo")
    .min(1000, "Rok narodenia musí byť po roku 1000")
    .max(new Date().getFullYear(), "Rok narodenia nemôže byť v budúcnosti")
    .optional(),
  deathYear: z
    .number()
    .int("Rok musí byť celé číslo")
    .min(1000, "Rok úmrtia musí byť po roku 1000")
    .max(new Date().getFullYear() + 10, "Rok úmrtia je nereálny")
    .optional(),
  nationality: z.string().max(100, "Národnosť je príliš dlhá (max 100 znakov)").optional(),
  website: z.string().url("Neplatná URL adresa").optional().or(z.literal("")),
});

/**
 * Zod schema for author creation
 */
export const createAuthorSchema = authorSchema.extend({
  photoFileId: z.string().optional(), // Will be validated as v.id("files") by Convex
});

/**
 * Zod schema for author updates
 */
export const updateAuthorSchema = authorSchema.partial().extend({
  id: z.string(), // Will be validated as v.id("authors") by Convex
  photoFileId: z.string().optional(),
});

/**
 * Custom refinement to ensure death year is after birth year
 */
export const authorWithDatesSchema = authorSchema.refine(
  (data) => {
    if (data.birthYear && data.deathYear) {
      return data.deathYear >= data.birthYear;
    }
    return true;
  },
  {
    message: "Death year must be after or equal to birth year",
    path: ["deathYear"],
  }
);