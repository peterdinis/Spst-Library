import { Id } from "convex/_generated/dataModel";
import { z } from "zod";

export const BookStatus = z.enum(["available", "reserved", "maintenance", "lost"]);

export const BookSchema = z.object({
  title: z.string().min(1, "Názov je povinný").max(200, "Názov je príliš dlhý"),
  authorId: z.string().refine((val): val is Id<"authors"> => true, {
    message: "Neplatné ID autora",
  }),
  isbn: z.string().optional(),
  description: z.string().max(5000, "Popis je príliš dlhý").optional(),
  coverImageUrl: z.string().url("Neplatná URL adresa").optional().or(z.literal("")),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear() + 1).optional(),
  publisher: z.string().max(200, "Vydavateľ je príliš dlhý").optional(),
  pages: z.number().int().positive("Počet strán musí byť kladné číslo").optional(),
  language: z.string().max(50, "Jazyk je príliš dlhý").optional(),
  categoryId: z.string().refine((val): val is Id<"categories"> => true, {
    message: "Neplatné ID kategórie",
  }),
  totalCopies: z.number().int().min(1, "Minimálny počet kópií je 1"),
  availableCopies: z.number().int().min(0).optional(),
  location: z.string().max(100, "Lokácia je príliš dlhá").optional(),
  tags: z.array(z.string()).max(20, "Príliš veľa tagov").optional(),
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
});

export const UpdateBookSchema = BookSchema.partial().omit({
  addedAt: true,
  searchableText: true,
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