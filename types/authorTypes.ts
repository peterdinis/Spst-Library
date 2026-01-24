// ==================== ZOD SCHEMAS ====================

import z from "zod";

/**
 * Zod schema for author validation
 */
export const authorSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  biography: z.string().max(5000, "Biography too long").optional(),
  birthYear: z
    .number()
    .int()
    .min(1000, "Birth year must be after 1000")
    .max(new Date().getFullYear(), "Birth year cannot be in the future")
    .optional(),
  deathYear: z
    .number()
    .int()
    .min(1000, "Death year must be after 1000")
    .max(new Date().getFullYear() + 10, "Death year seems unrealistic")
    .optional(),
  nationality: z.string().max(100, "Nationality too long").optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
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