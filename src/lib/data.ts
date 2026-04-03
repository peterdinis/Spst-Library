import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { authors, categories, books, borrowedBooks } from "@/db/schema";
import { eq, and, like, or, count, inArray, sql } from "drizzle-orm";

export interface BookFilters {
	search?: string;
	/** Presné meno autora (z katalógu), nie ID — vyhľadajú sa všetky knihy autorov s týmto menom */
	authorName?: string;
	categoryId?: string;
	limit?: number;
	offset?: number;
}

export const getBooks = unstable_cache(
	async (filters: BookFilters = {}) => {
		const { search, authorName, categoryId, limit = 20, offset = 0 } = filters;

		const conditions = [];
		if (search?.trim()) {
			const term = `%${search.trim()}%`;
			const authorsByName = await db
				.select({ id: authors.id })
				.from(authors)
				.where(like(authors.name, term));
			const authorIdsForSearch = authorsByName.map((r) => r.id);
			const searchClauses = [
				like(books.title, term),
				like(books.isbn, term),
			] as const;
			if (authorIdsForSearch.length > 0) {
				conditions.push(
					or(...searchClauses, inArray(books.authorId, authorIdsForSearch)),
				);
			} else {
				conditions.push(or(...searchClauses));
			}
		}
		if (authorName?.trim()) {
			const name = authorName.trim();
			const rows = await db
				.select({ id: authors.id })
				.from(authors)
				.where(eq(authors.name, name));
			const ids = rows.map((r) => r.id);
			if (ids.length === 0) {
				conditions.push(sql`1 = 0`);
			} else {
				conditions.push(inArray(books.authorId, ids));
			}
		}
		if (categoryId) {
			conditions.push(eq(books.categoryId, categoryId));
		}

		const where = conditions.length > 0 ? and(...conditions) : undefined;

		const [items, totalCount] = await Promise.all([
			db.query.books.findMany({
				where,
				limit,
				offset,
				with: {
					author: true,
					category: true,
				},
				orderBy: (books, { desc }) => [desc(books.createdAt)],
			}),
			db
				.select({ value: count() })
				.from(books)
				.where(where)
				.then((res) => res[0].value),
		]);

		return { items, total: totalCount };
	},
	["books-list"],
	{
		tags: ["books"],
		revalidate: 3600,
	},
);

export const getAuthors = unstable_cache(
	async () => {
		return db.query.authors.findMany();
	},
	["authors"],
	{
		tags: ["authors"],
		revalidate: 3600,
	},
);

export const getCategories = unstable_cache(
	async () => {
		return db.query.categories.findMany();
	},
	["categories"],
	{
		tags: ["categories"],
		revalidate: 3600,
	},
);

export const getBorrowedByUserId = unstable_cache(
	async (userId: string) => {
		return db.query.borrowedBooks.findMany({
			where: eq(borrowedBooks.userId, userId),
			with: {
				book: true,
			},
		});
	},
	["borrowed-books"],
	{
		tags: ["borrowed-books"],
		revalidate: 60, // Shorter revalidation for user-specific data
	},
);

export const getBookById = unstable_cache(
	async (id: string) => {
		return db.query.books.findFirst({
			where: eq(books.id, id),
			with: {
				author: true,
				category: true,
			},
		});
	},
	["book-detail"],
	{
		tags: ["books"],
	},
);

export const getAuthorById = unstable_cache(
	async (id: string) => {
		return db.query.authors.findFirst({
			where: eq(authors.id, id),
			with: {
				books: {
					with: { category: true },
					orderBy: (b, { desc }) => [desc(b.createdAt)],
				},
			},
		});
	},
	["author-detail"],
	{
		tags: ["authors", "books"],
	},
);
