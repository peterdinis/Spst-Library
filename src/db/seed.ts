import { db } from "./index";
import { authors, categories, books, admins } from "./schema";
import bcrypt from "bcryptjs";

async function clearDatabase() {
	console.log("Cleaning existing data...");
	await db.delete(books);
	await db.delete(authors);
	await db.delete(categories);
	await db.delete(admins);
}

async function main() {
	console.log("Seeding database...");
	await clearDatabase();

	console.log("Seeding admin...");
	const hashedPassword = await bcrypt.hash("admin123", 10);
	await db.insert(admins).values({
		id: crypto.randomUUID(),
		username: "admin",
		password: hashedPassword,
		adminCode: "SPST2026",
		name: "Hlavný Administrátor",
	});

	console.log("Seeding categories...");
	const categoryList = [
		{ name: "Slovenská literatúra" },
		{ name: "Svetová literatúra" },
		{ name: "Poézia" },
		{ name: "Dráma" },
		{ name: "Povinná literatúra" },
	];

	const insertedCategories: Record<string, string> = {};

	for (const cat of categoryList) {
		const id = crypto.randomUUID();
		await db.insert(categories).values({ id, name: cat.name });
		insertedCategories[cat.name] = id;
	}

	console.log("Seeding authors...");
	const authorsList = [
		{
			name: "Jozef Gregor Tajovský",
			bio: "Slovenský prozaik a dramatik, jeden z vedúcich predstaviteľov druhej vlny slovenského realizmu.",
			imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Jozef_Gregor_Tajovsk%C3%BD.jpg",
		},
		{
			name: "Pavol Országh Hviezdoslav",
			bio: "Najväčší slovenský básnik, dramatik a prekladateľ. Patrí k zakladateľským osobnostiam slovenskej kultúry.",
			imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Pavol_Orsz%C3%A1gh_Hviezdoslav.jpg",
		},
		{
			name: "Janko Jesenský",
			bio: "Slovenský básnik, prozaik, prekladateľ z ruštiny, národný umelec.",
			imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Janko_Jesensk%C3%BD.jpg",
		},
		{
			name: "William Shakespeare",
			bio: "Jeden z najvýznamnejších anglických spisovateľov a dramatikov.",
			imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Shakespeare.jpg",
		},
	];

	const insertedAuthors: Record<string, string> = {};
	for (const author of authorsList) {
		const id = crypto.randomUUID();
		await db.insert(authors).values({
			id,
			name: author.name,
			bio: author.bio,
			imageUrl: author.imageUrl,
		});
		insertedAuthors[author.name] = id;
	}

	console.log("Seeding books...");
	const booksList = [
		{
			title: "Maco Mlieč",
			description: "Kriticko-realistická poviedka Jozefa Gregora Tajovského.",
			isbn: "978-80-1234-567-1",
			availableCopies: 15,
			authorId: insertedAuthors["Jozef Gregor Tajovský"],
			categoryId: insertedCategories["Povinná literatúra"],
			coverUrl: "https://slovenska-kniznica.com/images/maco-mliec.jpg",
		},
		{
			title: "Hájnikova žena",
			description: "Vrcholné lyricko-epické dielo Pavla Országha Hviezdoslava.",
			isbn: "978-80-8912-345-2",
			availableCopies: 10,
			authorId: insertedAuthors["Pavol Országh Hviezdoslav"],
			categoryId: insertedCategories["Povinná literatúra"],
			coverUrl: "https://slovenska-kniznica.com/images/hajnikova-zena.jpg",
		},
		{
			title: "Krvavé sonety",
			description: "Lyrická výpoveď o prvej svetovej vojne z pera P.O. Hviezdoslava.",
			isbn: "978-80-9999-123-3",
			availableCopies: 5,
			authorId: insertedAuthors["Pavol Országh Hviezdoslav"],
			categoryId: insertedCategories["Poézia"],
			coverUrl: "https://slovenska-kniznica.com/images/krvave-sonety.jpg",
		},
		{
			title: "Hamlet",
			description: "Najslávnejšia tragédia Williama Shakespeara.",
			isbn: "978-00-1111-222-4",
			availableCopies: 20,
			authorId: insertedAuthors["William Shakespeare"],
			categoryId: insertedCategories["Dráma"],
			coverUrl: "https://slovenska-kniznica.com/images/hamlet.jpg",
		},
	];

	for (const book of booksList) {
		await db.insert(books).values({
			id: crypto.randomUUID(),
			...book,
		});
	}

	console.log("Database seeded successfully with realistic data!");
}

main().catch((err) => {
	console.error("Seed error:", err);
	process.exit(1);
});
