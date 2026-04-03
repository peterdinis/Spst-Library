import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  image: text('image'),
});

export const authors = sqliteTable('authors', {
  id: text('id').primaryKey(), // using uuid or similar
  name: text('name').notNull(),
  bio: text('bio'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const books = sqliteTable('books', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  coverUrl: text('cover_url'),
  isbn: text('isbn'),
  availableCopies: integer('available_copies').default(1).notNull(),
  authorId: text('author_id').references(() => authors.id),
  categoryId: text('category_id').references(() => categories.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const borrowedBooks = sqliteTable('borrowed_books', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  bookId: text('book_id').references(() => books.id).notNull(),
  borrowDate: integer('borrow_date', { mode: 'timestamp' }).notNull(),
  dueDate: integer('due_date', { mode: 'timestamp' }).notNull(),
  returnDate: integer('return_date', { mode: 'timestamp' }),
  status: text('status', { enum: ['borrowed', 'returned'] }).default('borrowed').notNull(),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  type: text('type', { enum: ['borrow', 'return', 'reminder', 'system'] }).notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const userSettings = sqliteTable('user_settings', {
  userId: text('user_id').primaryKey().references(() => users.id).notNull(),
  emailNotifications: integer('email_notifications', { mode: 'boolean' }).default(true).notNull(),
  dueReminders: integer('due_reminders', { mode: 'boolean' }).default(true).notNull(),
  systemUpdates: integer('system_updates', { mode: 'boolean' }).default(false).notNull(),
});

export const admins = sqliteTable('admins', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  password: text('password').notNull(),
  adminCode: text('admin_code').notNull(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many, one }) => ({
  borrowedBooks: many(borrowedBooks),
  notifications: many(notifications),
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
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

export const booksRelations = relations(books, ({ one }) => ({
  author: one(authors, {
    fields: [books.authorId],
    references: [authors.id],
  }),
  category: one(categories, {
    fields: [books.categoryId],
    references: [categories.id],
  }),
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

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
