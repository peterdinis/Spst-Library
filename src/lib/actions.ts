"use server";

import { protectedActionClient } from "./safe-action";
import { z } from "zod";
import { db } from "@/db";
import { users, authors, categories, books, borrowedBooks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { notifications } from "@/db/schema";
import { sendTransactionalEmail } from "./mail";
import { resolveUserIdFromDb } from "./resolve-user-id";

export const createAuthorAction = protectedActionClient
	.inputSchema(z.object({ name: z.string().min(1), bio: z.string().optional() }))
	.action(async ({ parsedInput: { name, bio } }) => {
		const id = crypto.randomUUID();
		db.insert(authors).values({ id, name, bio }).run();
		revalidateTag("authors", "default");
		return { success: true, id };
	});

export const createCategoryAction = protectedActionClient
	.inputSchema(z.object({ name: z.string().min(1) }))
	.action(async ({ parsedInput: { name } }) => {
		const id = crypto.randomUUID();
		db.insert(categories).values({ id, name }).run();
		revalidateTag("categories", "default");
		return { success: true, id };
	});

export const createBookAction = protectedActionClient
	.inputSchema(
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
			revalidateTag("books", "default");
			return { success: true, id };
		},
	);

export const borrowBookAction = protectedActionClient
	.inputSchema(z.object({ bookId: z.string() }))
	.action(async ({ parsedInput: { bookId }, ctx: { session } }) => {
		try {
			const u = session.user;
			if (!u) {
				throw new Error("Neprihlásený používateľ alebo chýbajúce ID používateľa");
			}

			let userId = resolveUserIdFromDb(u.email, u.id);
			if (!userId) {
				throw new Error("Neprihlásený používateľ alebo chýbajúce ID používateľa");
			}

			// Zaistíme, že používateľ naozaj existuje v tabuľke users (kvôli Foreign Key pre admins)
			let existingUser = db
				.select()
				.from(users)
				.where(eq(users.id, userId))
				.get();

			if (!existingUser) {
				try {
					db.insert(users).values({
						id: userId,
						name: u.name || "Neznámy",
						email: u.email || `user-${userId}@local.spst`,
						isAdmin: (u as { role?: string }).role === "admin",
					}).run();
				} catch {
					const byEmail = u.email
						? db
								.select()
								.from(users)
								.where(eq(users.email, u.email))
								.get()
						: undefined;
					if (byEmail?.id) {
						userId = byEmail.id;
						existingUser = byEmail;
					} else {
						throw new Error(
							"Nepodarilo sa uložiť používateľa do databázy (konflikt ID/email).",
						);
					}
				}
			}

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

			if (u.email) {
				try {
					await sendTransactionalEmail(
						u.email,
						"Kniha bola úspešne požičaná",
						`
					<h1>Požičanie knihy</h1>
					<p>Dobrý deň, ${u.name || "čitateľ"},</p>
					<p>Úspešne ste si požičali knihu: <strong>${book.title}</strong>.</p>
					<p>Termín vrátenia je: <strong>${dueDate.toLocaleDateString("sk-SK")}</strong>.</p>
					<p>Ďakujeme, že využívate našu knižnicu!</p>
					`,
					);
				} catch (mailErr) {
					console.error("borrowBookAction: email send failed", mailErr);
				}
			}

			revalidatePath("/", "page");
			revalidatePath("/profile", "page");
			revalidatePath("/books", "page");
			revalidatePath(`/books/${bookId}`, "page");
			revalidateTag("borrowed-books", "default");
			revalidateTag("books", "default");
			revalidateTag("notifications", "default");
			return { success: true, userId };
		} catch (e: any) {
			console.error("borrowBookAction ERROR:", e);
			throw new Error("DETAIL CHYBY: " + (e.message || String(e)));
		}
	});

export const returnBookAction = protectedActionClient
	.inputSchema(z.object({ borrowId: z.string(), bookId: z.string() }))
	.action(async ({ parsedInput: { borrowId, bookId }, ctx: { session } }) => {
		const userId = resolveUserIdFromDb(
			session?.user?.email,
			session?.user?.id,
		);
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
		revalidateTag("borrowed-books", "default");
		revalidateTag("books", "default");
		revalidateTag("notifications", "default");
		return { success: true };
	});
