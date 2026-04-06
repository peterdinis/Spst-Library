"use server";

import { protectedActionClient } from "./safe-action";
import { z } from "zod";
import { db } from "@/db";
import { authors, categories, books, borrowedBooks } from "@/db/schema";
import { uploadImageToAzure } from "./azure-storage";
import { eq, and } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { notifications } from "@/db/schema";
import { sendTransactionalEmail } from "./mail";
import { userHasAdminAccess } from "./admin-access";

export const createAuthorAction = protectedActionClient
	.schema(z.object({ name: z.string().min(1), bio: z.string().optional() }))
	.action(async ({ parsedInput: { name, bio } }) => {
		const id = crypto.randomUUID();
		db.insert(authors).values({ id, name, bio }).run();
		revalidateTag("authors", "page" as any);
		return { success: true, id };
	});

export const createCategoryAction = protectedActionClient
	.schema(z.object({ name: z.string().min(1) }))
	.action(async ({ parsedInput: { name } }) => {
		const id = crypto.randomUUID();
		db.insert(categories).values({ id, name }).run();
		revalidateTag("categories", "page" as any);
		return { success: true, id };
	});

export const createBookAction = protectedActionClient
	.schema(
		z.object({
			title: z.string().min(1),
			description: z.string().optional(),
			isbn: z.string().optional(),
			availableCopies: z.number().min(0),
			authorId: z.string().min(1),
			categoryId: z.string().min(1),
		}),
	)
	.action(
		async ({
			parsedInput: {
				title,
				description,
				isbn,
				availableCopies,
				authorId,
				categoryId,
			},
		}) => {
			const id = crypto.randomUUID();
			db.insert(books)
				.values({
					id,
					title,
					description,
					isbn,
					availableCopies,
					authorId,
					categoryId,
				})
				.run();
			revalidatePath("/admin/books", "page");
			revalidatePath("/", "page");
			revalidateTag("books", "page" as any);
			return { success: true, id };
		},
	);

export const borrowBookAction = protectedActionClient
	.schema(z.object({ bookId: z.string() }))
	.action(async ({ parsedInput: { bookId }, ctx: { session } }) => {
		if (await userHasAdminAccess(session)) {
			throw new Error(
				"Účty so správcovským oprávnením nemôžu požičiavať knihy ako čitatelia.",
			);
		}

		const userId = session?.user?.id;
		if (!userId) throw new Error("Neprihlásený používateľ");

		// Check if book exists and has copies
		const book = db
			.select({ availableCopies: books.availableCopies, title: books.title })
			.from(books)
			.where(eq(books.id, bookId))
			.get();

		if (!book) {
			throw new Error("Kniha nebola nájdená");
		}

		if (book.availableCopies <= 0) {
			throw new Error("Kniha momentálne nie je dostupná na vypožičanie");
		}

		// Check if user already has an active borrow for THIS specific book
		const existingBorrow = db
			.select()
			.from(borrowedBooks)
			.where(
				and(
					eq(borrowedBooks.userId, userId),
					eq(borrowedBooks.bookId, bookId),
					eq(borrowedBooks.status, "borrowed"),
				),
			)
			.get();

		if (existingBorrow) {
			throw new Error("Túto knihu už máte momentálne požičanú");
		}

		const dueDate = new Date();
		dueDate.setDate(dueDate.getDate() + 14);

		db.transaction((tx) => {
			tx.insert(borrowedBooks)
				.values({
					id: crypto.randomUUID(),
					userId: userId,
					bookId: bookId,
					borrowDate: new Date(),
					dueDate: dueDate,
					status: "borrowed",
				})
				.run();

			tx.update(books)
				.set({ availableCopies: book.availableCopies - 1 })
				.where(eq(books.id, bookId))
				.run();

			tx.insert(notifications)
				.values({
					id: crypto.randomUUID(),
					userId: userId,
					message: `Úspešne ste si požičali knihu "${book.title}". Termín vrátenia je ${dueDate.toLocaleDateString("sk-SK")}.`,
					type: "borrow",
					isRead: false,
				})
				.run();
		});

		if (session?.user?.email) {
			await sendTransactionalEmail(
				session.user.email,
				"Kniha bola úspešne požičaná",
				`
				<h1>Požičanie knihy</h1>
				<p>Dobrý deň, ${session.user.name || "čitateľ"},</p>
				<p>Úspešne ste si požičali knihu: <strong>${book.title}</strong>.</p>
				<p>Termín vrátenia je: <strong>${dueDate.toLocaleDateString("sk-SK")}</strong>.</p>
				<p>Ďakujeme, že využívate našu knižnicu!</p>
				`,
			);
		}

		revalidatePath("/", "page");
		revalidatePath("/profile", "page");
		revalidatePath("/books", "page");
		revalidatePath(`/books/${bookId}`, "page");
		revalidateTag("borrowed-books", "page" as any);
		revalidateTag("books", "page" as any);
		revalidateTag("notifications", "page" as any);
		return { success: true };
	});

export const returnBookAction = protectedActionClient
	.schema(z.object({ borrowId: z.string(), bookId: z.string() }))
	.action(async ({ parsedInput: { borrowId, bookId }, ctx: { session } }) => {
		const userId = session?.user?.id;
		if (!userId) throw new Error("Neprihlásený používateľ");
		const record = db
			.select()
			.from(borrowedBooks)
			.where(
				and(eq(borrowedBooks.id, borrowId), eq(borrowedBooks.userId, userId)),
			)
			.get();

		if (!record || record.status !== "borrowed") {
			throw new Error("Neplatný záznam o výpožičke");
		}

		const book = db
			.select({ availableCopies: books.availableCopies, title: books.title })
			.from(books)
			.where(eq(books.id, bookId))
			.get();

		db.transaction((tx) => {
			tx.update(borrowedBooks)
				.set({ status: "returned", returnDate: new Date() })
				.where(eq(borrowedBooks.id, borrowId))
				.run();

			tx.update(books)
				.set({ availableCopies: (book?.availableCopies ?? 0) + 1 })
				.where(eq(books.id, bookId))
				.run();

			tx.insert(notifications)
				.values({
					id: crypto.randomUUID(),
					userId: userId,
					message: `Kniha "${book?.title ?? "Kniha"}" bola úspešne vrátená. Ďakujeme!`,
					type: "return",
					isRead: false,
				})
				.run();
		});

		if (session?.user?.email && book) {
			await sendTransactionalEmail(
				session.user.email,
				"Kniha bola úspešne vrátená",
				`
				<h1>Vrátenie knihy</h1>
				<p>Dobrý deň, ${session.user.name || "čitateľ"},</p>
				<p>Kniha <strong>${book.title}</strong> bola úspešne vrátená.</p>
				<p>Dúfame, že sa vám páčila!</p>
				<p>Váš tím SPŠT Knižnica</p>
				`,
			);
		}

		revalidatePath("/", "page");
		revalidatePath("/profile", "page");
		revalidatePath("/books", "page");
		revalidatePath(`/books/${bookId}`, "page");
		revalidateTag("borrowed-books", "page" as any);
		revalidateTag("books", "page" as any);
		revalidateTag("notifications", "page" as any);
		return { success: true };
	});
