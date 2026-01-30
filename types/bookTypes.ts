import { Id } from "convex/_generated/dataModel";
import { z } from "zod";

export const BookStatus = z.enum(["available", "reserved", "maintenance", "lost"]);

export const BookSchema = z.object({
  title: z.string().min(1, "Názov je povinný").max(200, "Názov je príliš dlhý"),
  authorId: z.custom<Id<"authors">>(),
  author: z.string().optional(), 
  isbn: z.string().optional(),
  description: z.string().max(5000, "Popis je príliš dlhý (max 5000 znakov)").optional(),
  coverFileId: z.custom<Id<"files">>().optional(),
  publishedYear: z.number().int("Rok musí byť celé číslo").min(1000, "Rok musí byť aspoň 1000").max(new Date().getFullYear() + 1, "Neplatný rok vydania").optional(),
  publisher: z.string().max(200, "Vydavateľ je príliš dlhý").optional(),
  pages: z.number().int("Počet strán musí byť celé číslo").positive("Počet strán musí byť kladné číslo").optional(),
  language: z.string().max(50, "Jazyk je príliš dlhý").optional(),
  categoryId: z.custom<Id<"categories">>(),
  totalCopies: z.number().int("Počet kópií musí byť celé číslo").min(1, "Minimálny počet kópií je 1"),
  availableCopies: z.number().int().min(0).optional(),
  location: z.string().max(100, "Lokácia je príliš dlhá").optional(),
  tags: z.array(z.string().min(1, "Tag nemôže byť prázdny")).max(20, "Maximálne 20 tagov").optional(),
  status: BookStatus.optional(),
  addedAt: z.number().optional(),
  updatedAt: z.number().optional(),
  searchableText: z.string().optional(),
});

export const CreateBookSchema = BookSchema.omit({
  availableCopies: true,
  addedAt: true,
  updatedAt: true,
  searchableText: true,
}).extend({
  tags: z.array(z.string()).default([]),
  status: BookStatus.default("available"),
  // Pre validáciu v konvexe potrebujeme string, nie Id<"files">
  coverFileId: z.string().optional(), // Zmenené pre validáciu
});

export const UpdateBookSchema = BookSchema.partial().omit({
  addedAt: true,
  searchableText: true,
}).extend({
  // Pre validáciu v konvexe potrebujeme string pre optional polia
  coverFileId: z.string().optional(), // Zmenené pre validáciu
});

export const GetBooksQuerySchema = z.object({
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
  status: BookStatus.optional(),
  search: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type Book = z.infer<typeof BookSchema>;
export type CreateBookInput = z.infer<typeof CreateBookSchema>;
export type UpdateBookInput = z.infer<typeof UpdateBookSchema>;
export type GetBooksQuery = z.infer<typeof GetBooksQuerySchema>;
export type BookStatusType = z.infer<typeof BookStatus>;