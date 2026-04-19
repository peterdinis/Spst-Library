import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/trpc/cache-config";
import { db } from "@/db";
import { authors, books, borrowedBooks } from "@/db/schema";
import { eq, and, like, or, count, inArray, sql } from "drizzle-orm";

export interface BookFilters {
	search?: string;
	/** Presné meno autora (z katalógu), nie ID — vyhľadajú sa všetky knihy autorov s týmto menom */
	authorName?: string;
	categoryId?: string;
	limit?: number;
	offset?: number;
}

export async function getBooks(filters: BookFilters = {}) {
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
}

export const getAuthors = unstable_cache(
	async () => {
		return db.query.authors.findMany();
	},
	["authors"],
	{
		tags: [CACHE_TAGS.authors],
		revalidate: 3600,
	},
);

export const getCategories = unstable_cache(
	async () => {
		return db.query.categories.findMany();
	},
	["categories"],
	{
		tags: [CACHE_TAGS.categories],
		revalidate: 3600,
	},
);

export const getBorrowedByUserId = unstable_cache(
	async (userId: string) => {
		return db.query.borrowedBooks.findMany({
			where: eq(borrowedBooks.userId, userId),
			with: {
				book: {
					with: { author: true },
				},
			},
		});
	},
	["borrowed-books"],
	{
		tags: [CACHE_TAGS.borrowedBooks],
		revalidate: 60, // Shorter revalidation for user-specific data
	},
);

export const isBookBorrowedByUser = unstable_cache(
	async (userId: string, bookId: string) => {
		const rows = await db
			.select()
			.from(borrowedBooks)
			.where(
				and(
					eq(borrowedBooks.userId, userId),
					eq(borrowedBooks.bookId, bookId),
					eq(borrowedBooks.status, "borrowed"),
				),
			)
			.limit(1);
		return Boolean(rows[0]);
	},
	["is-book-borrowed"],
	{
		tags: [CACHE_TAGS.borrowedBooks],
		revalidate: 60,
	},
);

export async function getBookById(id: string) {
	return db.query.books.findFirst({
		where: eq(books.id, id),
		with: {
			author: true,
			category: true,
		},
	});
}

export async function getAuthorById(id: string) {
	return db.query.authors.findFirst({
		where: eq(authors.id, id),
		with: {
			books: {
				with: { category: true },
				orderBy: (b, { desc }) => [desc(b.createdAt)],
			},
		},
	});
}
