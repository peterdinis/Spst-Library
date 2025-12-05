import { z } from 'zod';

// Book schemas
export const bookSchema = z.object({
    title: z.string().min(1, 'Názov knihy je povinný').max(200, 'Názov je príliš dlhý'),
    authorId: z.string().min(1, 'Autor je povinný'),
    categoryId: z.string().min(1, 'Kategória je povinná'),
    isbn: z.string().min(10, 'ISBN musí mať aspoň 10 znakov').max(17, 'ISBN je príliš dlhý'),
    description: z.string().min(10, 'Popis musí mať aspoň 10 znakov').max(1000, 'Popis je príliš dlhý'),
    publishedYear: z.number().min(1000, 'Neplatný rok').max(new Date().getFullYear(), 'Rok nemôže byť v budúcnosti'),
    totalCopies: z.number().min(1, 'Musí byť aspoň 1 kópia').max(100, 'Príliš veľa kópií'),
    availableCopies: z.number().min(0, 'Nemôže byť záporné'),
    coverUrl: z.string().url('Neplatná URL').optional().or(z.literal('')),
});

export const createBookSchema = bookSchema;
export const updateBookSchema = bookSchema.partial().extend({
    id: z.string().min(1, 'ID je povinné'),
});

export type BookFormData = z.infer<typeof bookSchema>;
export type CreateBookData = z.infer<typeof createBookSchema>;
export type UpdateBookData = z.infer<typeof updateBookSchema>;

// Author schemas
export const authorSchema = z.object({
    name: z.string().min(2, 'Meno autora je povinné').max(100, 'Meno je príliš dlhé'),
    biography: z.string().min(10, 'Biografia musí mať aspoň 10 znakov').max(2000, 'Biografia je príliš dlhá'),
    birthDate: z.string().optional().or(z.literal('')),
    nationality: z.string().min(2, 'Národnosť je povinná').max(50, 'Národnosť je príliš dlhá').optional().or(z.literal('')),
    photoUrl: z.string().url('Neplatná URL').optional().or(z.literal('')),
});

export const createAuthorSchema = authorSchema;
export const updateAuthorSchema = authorSchema.partial().extend({
    id: z.string().min(1, 'ID je povinné'),
});

export type AuthorFormData = z.infer<typeof authorSchema>;
export type CreateAuthorData = z.infer<typeof createAuthorSchema>;
export type UpdateAuthorData = z.infer<typeof updateAuthorSchema>;

// Category schemas
export const categorySchema = z.object({
    name: z.string().min(2, 'Názov kategórie je povinný').max(100, 'Názov je príliš dlhý'),
    description: z.string().min(10, 'Popis musí mať aspoň 10 znakov').max(500, 'Popis je príliš dlhý'),
});

export const createCategorySchema = categorySchema;
export const updateCategorySchema = categorySchema.partial().extend({
    id: z.string().min(1, 'ID je povinné'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;
