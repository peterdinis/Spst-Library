import { relations } from "drizzle-orm";
import {
	pgTable,
	text,
	integer,
	boolean,
	timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	name: text("name"),
	email: text("email").unique(),
	image: text("image"),
	isAdmin: boolean("is_admin").default(false).notNull(),
});

export const authors = pgTable("authors", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	bio: text("bio"),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at", { mode: "date" }).$defaultFn(
		() => new Date(),
	),
});

export const categories = pgTable("categories", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).$defaultFn(
		() => new Date(),
	),
});

export const books = pgTable("books", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	coverUrl: text("cover_url"),
	isbn: text("isbn"),
	availableCopies: integer("available_copies").default(1).notNull(),
	authorId: text("author_id").references(() => authors.id),
	categoryId: text("category_id").references(() => categories.id),
	createdAt: timestamp("created_at", { mode: "date" }).$defaultFn(
		() => new Date(),
	),
});

export const borrowedBooks = pgTable("borrowed_books", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.references(() => users.id)
		.notNull(),
	bookId: text("book_id")
		.references(() => books.id)
		.notNull(),
	borrowDate: timestamp("borrow_date", { mode: "date" }).notNull(),
	dueDate: timestamp("due_date", { mode: "date" }).notNull(),
	returnDate: timestamp("return_date", { mode: "date" }),
	status: text("status", { enum: ["borrowed", "returned"] })
		.default("borrowed")
		.notNull(),
});

/** Objednávka knihy na prevzatie (spracovanie v knižnici) */
export const bookOrders = pgTable("book_orders", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.references(() => users.id)
		.notNull(),
	bookId: text("book_id")
		.references(() => books.id)
		.notNull(),
	status: text("status", {
		enum: ["pending", "approved", "fulfilled", "cancelled"],
	})
		.default("pending")
		.notNull(),
	note: text("note"),
	createdAt: timestamp("created_at", { mode: "date" }).$defaultFn(
		() => new Date(),
	),
	updatedAt: timestamp("updated_at", { mode: "date" }).$defaultFn(
		() => new Date(),
	),
});

export const notifications = pgTable("notifications", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.references(() => users.id)
		.notNull(),
	message: text("message").notNull(),
	type: text("type", {
		enum: ["borrow", "return", "reminder", "system"],
	}).notNull(),
	isRead: boolean("is_read").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).$defaultFn(
		() => new Date(),
	),
});

export const userSettings = pgTable("user_settings", {
	userId: text("user_id")
		.primaryKey()
		.references(() => users.id)
		.notNull(),
	emailNotifications: boolean("email_notifications")
		.default(true)
		.notNull(),
	dueReminders: boolean("due_reminders").default(true).notNull(),
	systemUpdates: boolean("system_updates").default(false).notNull(),
	/** Ročný cieľ počtu prečítaných (vrátených) kníh; null = ešte nenastavené */
	readingGoal: integer("reading_goal"),
});

export const admins = pgTable("admins", {
	id: text("id").primaryKey(),
	username: text("username").unique().notNull(),
	password: text("password").notNull(),
	adminCode: text("admin_code").notNull(),
	name: text("name"),
	createdAt: timestamp("created_at", { mode: "date" }).$defaultFn(
		() => new Date(),
	),
});

export const adminWhitelist = pgTable("admin_whitelist", {
	id: text("id").primaryKey(),
	email: text("email").unique().notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).$defaultFn(
		() => new Date(),
	),
});

export const images = pgTable("images", {
	id: text("id").primaryKey(), // Uploadthing key
	url: text("url").notNull(),
	fileName: text("file_name").notNull(),
	size: integer("size").notNull(),
	userId: text("user_id").references(() => users.id).notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).$defaultFn(
		() => new Date(),
	),
});

export const usersRelations = relations(users, ({ many, one }) => ({
	borrowedBooks: many(borrowedBooks),
	bookOrders: many(bookOrders),
	notifications: many(notifications),
	images: many(images),
	settings: one(userSettings, {
		fields: [users.id],
		references: [userSettings.userId],
	}),
}));

export const imagesRelations = relations(images, ({ one }) => ({
	user: one(users, {
		fields: [images.userId],
		references: [users.id],
	}),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
	user: one(users, {
		fields: [userSettings.userId],
		references: [users.id],
	}),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
	books: many(books),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	books: many(books),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
	author: one(authors, {
		fields: [books.authorId],
		references: [authors.id],
	}),
	category: one(categories, {
		fields: [books.categoryId],
		references: [categories.id],
	}),
	bookOrders: many(bookOrders),
}));

export const borrowedBooksRelations = relations(borrowedBooks, ({ one }) => ({
	user: one(users, {
		fields: [borrowedBooks.userId],
		references: [users.id],
	}),
	book: one(books, {
		fields: [borrowedBooks.bookId],
		references: [books.id],
	}),
}));

export const bookOrdersRelations = relations(bookOrders, ({ one }) => ({
	user: one(users, {
		fields: [bookOrders.userId],
		references: [users.id],
	}),
	book: one(books, {
		fields: [bookOrders.bookId],
		references: [books.id],
	}),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id],
	}),
}));
