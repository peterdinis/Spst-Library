import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { db } from "./index";
import {
	admins,
	adminWhitelist,
	authors,
	bookOrders,
	books,
	borrowedBooks,
	categories,
	images,
	notifications,
	userSettings,
	users,
} from "./schema";

type StressConfig = {
	adminsCount: number;
	whitelistCount: number;
	usersCount: number;
	categoriesCount: number;
	authorsCount: number;
	booksCount: number;
	ordersCount: number;
	borrowedCount: number;
	notificationsCount: number;
	imagesCount: number;
	batchSize: number;
};

function readNumberEnv(name: string, fallback: number): number {
	const raw = process.env[name];
	if (!raw) return fallback;
	const parsed = Number(raw);
	return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback;
}

function getConfig(): StressConfig {
	return {
		adminsCount: readNumberEnv("STRESS_ADMINS", 8),
		whitelistCount: readNumberEnv("STRESS_WHITELIST", 200),
		usersCount: readNumberEnv("STRESS_USERS", 2000),
		categoriesCount: readNumberEnv("STRESS_CATEGORIES", 250),
		authorsCount: readNumberEnv("STRESS_AUTHORS", 1500),
		booksCount: readNumberEnv("STRESS_BOOKS", 20000),
		ordersCount: readNumberEnv("STRESS_ORDERS", 30000),
		borrowedCount: readNumberEnv("STRESS_BORROWED", 25000),
		notificationsCount: readNumberEnv("STRESS_NOTIFICATIONS", 50000),
		imagesCount: readNumberEnv("STRESS_IMAGES", 3000),
		batchSize: Math.max(100, readNumberEnv("STRESS_BATCH_SIZE", 1000)),
	};
}

async function clearDatabase() {
	console.log("Cleaning existing data...");
	await db.delete(images);
	await db.delete(notifications);
	await db.delete(bookOrders);
	await db.delete(borrowedBooks);
	await db.delete(userSettings);
	await db.delete(adminWhitelist);
	await db.delete(admins);
	await db.delete(books);
	await db.delete(authors);
	await db.delete(categories);
	await db.delete(users);
}

function chunkArray<T>(items: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		chunks.push(items.slice(i, i + size));
	}
	return chunks;
}

async function insertInBatches<T>(
	label: string,
	rows: T[],
	insertFn: (chunk: T[]) => Promise<unknown>,
	batchSize: number,
) {
	const chunks = chunkArray(rows, batchSize);
	for (let i = 0; i < chunks.length; i++) {
		await insertFn(chunks[i]);
		if ((i + 1) % 10 === 0 || i === chunks.length - 1) {
			console.log(`${label}: batch ${i + 1}/${chunks.length}`);
		}
	}
}

function pickId(ids: string[]): string {
	return ids[Math.floor(Math.random() * ids.length)];
}

async function main() {
	const config = getConfig();
	console.log("Starting stress seed with config:", config);

	await clearDatabase();

	const now = new Date();
	const adminPassword = await bcrypt.hash("admin123", 10);

	const adminRows = Array.from({ length: config.adminsCount }, (_, i) => ({
		id: crypto.randomUUID(),
		username: `admin${i + 1}`,
		password: adminPassword,
		adminCode: `SPST-${1000 + i}`,
		name: faker.person.fullName(),
		createdAt: now,
	}));
	await insertInBatches(
		"admins",
		adminRows,
		async (chunk) => db.insert(admins).values(chunk),
		config.batchSize,
	);

	const whitelistRows = Array.from({ length: config.whitelistCount }, () => ({
		id: crypto.randomUUID(),
		email: faker.internet.email().toLowerCase(),
		createdAt: now,
	}));
	await insertInBatches(
		"admin_whitelist",
		whitelistRows,
		async (chunk) =>
			db.insert(adminWhitelist).values(chunk).onConflictDoNothing(),
		config.batchSize,
	);

	const userRows = Array.from({ length: config.usersCount }, () => ({
		id: crypto.randomUUID(),
		name: faker.person.fullName(),
		email: faker.internet.email().toLowerCase(),
		image: faker.image.avatar(),
		isAdmin: false,
	}));
	await insertInBatches(
		"users",
		userRows,
		async (chunk) => db.insert(users).values(chunk).onConflictDoNothing(),
		config.batchSize,
	);

	const userIds = userRows.map((u) => u.id);

	const settingsRows = userIds.map((userId) => ({
		userId,
		emailNotifications: Math.random() > 0.1,
		dueReminders: Math.random() > 0.2,
		systemUpdates: Math.random() > 0.5,
		readingGoal:
			Math.random() > 0.2 ? faker.number.int({ min: 5, max: 120 }) : null,
	}));
	await insertInBatches(
		"user_settings",
		settingsRows,
		async (chunk) =>
			db.insert(userSettings).values(chunk).onConflictDoNothing(),
		config.batchSize,
	);

	const categoryRows = Array.from({ length: config.categoriesCount }, () => ({
		id: crypto.randomUUID(),
		name: faker.commerce.department(),
		createdAt: faker.date.past({ years: 6 }),
	}));
	await insertInBatches(
		"categories",
		categoryRows,
		async (chunk) => db.insert(categories).values(chunk),
		config.batchSize,
	);
	const categoryIds = categoryRows.map((c) => c.id);

	const authorRows = Array.from({ length: config.authorsCount }, () => ({
		id: crypto.randomUUID(),
		name: faker.person.fullName(),
		bio: faker.lorem.paragraphs({ min: 1, max: 3 }),
		imageUrl: faker.image.urlPicsumPhotos({ width: 300, height: 400 }),
		createdAt: faker.date.past({ years: 10 }),
	}));
	await insertInBatches(
		"authors",
		authorRows,
		async (chunk) => db.insert(authors).values(chunk),
		config.batchSize,
	);
	const authorIds = authorRows.map((a) => a.id);

	const bookRows = Array.from({ length: config.booksCount }, () => ({
		id: crypto.randomUUID(),
		title: faker.lorem.words({ min: 2, max: 6 }),
		description: faker.lorem.paragraphs({ min: 1, max: 2 }),
		coverUrl: faker.image.urlLoremFlickr({ category: "books" }),
		isbn: faker.commerce.isbn(),
		availableCopies: faker.number.int({ min: 0, max: 30 }),
		authorId: pickId(authorIds),
		categoryId: pickId(categoryIds),
		createdAt: faker.date.past({ years: 5 }),
	}));
	await insertInBatches(
		"books",
		bookRows,
		async (chunk) => db.insert(books).values(chunk),
		config.batchSize,
	);
	const bookIds = bookRows.map((b) => b.id);

	const imageRows = Array.from({ length: config.imagesCount }, () => ({
		id: `img_${crypto.randomUUID()}`,
		url: faker.image.urlPicsumPhotos({ width: 600, height: 900 }),
		fileName: faker.system.fileName({ extensionCount: 1 }),
		size: faker.number.int({ min: 10_000, max: 8_000_000 }),
		userId: pickId(userIds),
		createdAt: faker.date.recent({ days: 180 }),
	}));
	await insertInBatches(
		"images",
		imageRows,
		async (chunk) => db.insert(images).values(chunk),
		config.batchSize,
	);

	const orderStatuses = [
		"pending",
		"approved",
		"fulfilled",
		"cancelled",
	] as const;
	const orderRows = Array.from({ length: config.ordersCount }, () => {
		const createdAt = faker.date.past({ years: 2 });
		return {
			id: crypto.randomUUID(),
			userId: pickId(userIds),
			bookId: pickId(bookIds),
			status: faker.helpers.arrayElement(orderStatuses),
			note: Math.random() < 0.4 ? faker.lorem.sentence() : null,
			createdAt,
			updatedAt: faker.date.between({ from: createdAt, to: now }),
		};
	});
	await insertInBatches(
		"book_orders",
		orderRows,
		async (chunk) => db.insert(bookOrders).values(chunk),
		config.batchSize,
	);

	const borrowedRows = Array.from({ length: config.borrowedCount }, () => {
		const borrowDate = faker.date.past({ years: 2 });
		const dueDate = new Date(borrowDate);
		dueDate.setDate(dueDate.getDate() + faker.number.int({ min: 7, max: 30 }));
		const returned = Math.random() > 0.35;
		const returnDate = returned
			? faker.date.between({ from: borrowDate, to: now })
			: null;
		return {
			id: crypto.randomUUID(),
			userId: pickId(userIds),
			bookId: pickId(bookIds),
			borrowDate,
			dueDate,
			returnDate,
			status: returned ? ("returned" as const) : ("borrowed" as const),
		};
	});
	await insertInBatches(
		"borrowed_books",
		borrowedRows,
		async (chunk) => db.insert(borrowedBooks).values(chunk),
		config.batchSize,
	);

	const notificationTypes = ["borrow", "return", "reminder", "system"] as const;
	const notificationRows = Array.from(
		{ length: config.notificationsCount },
		() => ({
			id: crypto.randomUUID(),
			userId: pickId(userIds),
			message: faker.lorem.sentence(),
			type: faker.helpers.arrayElement(notificationTypes),
			isRead: Math.random() > 0.5,
			createdAt: faker.date.recent({ days: 365 }),
		}),
	);
	await insertInBatches(
		"notifications",
		notificationRows,
		async (chunk) => db.insert(notifications).values(chunk),
		config.batchSize,
	);

	console.log("Stress seed complete.");
	console.log(
		JSON.stringify(
			{
				admins: adminRows.length,
				whitelist: whitelistRows.length,
				users: userRows.length,
				settings: settingsRows.length,
				categories: categoryRows.length,
				authors: authorRows.length,
				books: bookRows.length,
				images: imageRows.length,
				orders: orderRows.length,
				borrowed: borrowedRows.length,
				notifications: notificationRows.length,
			},
			null,
			2,
		),
	);
}

main().catch((err) => {
	console.error("Stress seed failed:", err);
	process.exit(1);
});
