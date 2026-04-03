import { db } from './index';
import { authors, categories, books, admins } from './schema';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  // 0. Seed Admin
  console.log('Seeding admin...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await db.insert(admins).values({
    id: crypto.randomUUID(),
    username: 'admin',
    password: hashedPassword,
    adminCode: 'SPST2026',
    name: 'Hlavný Administrátor',
  }).run();

  // 1. Seed Categories
  console.log('Seeding categories...');
  const categoryNames = ['Beletria', 'Náučná literatúra', 'Sci-fi & Fantasy', 'Detektívky', 'História'];
  const categoryIds: string[] = [];

  for (const name of categoryNames) {
    const id = crypto.randomUUID();
    await db.insert(categories).values({ id, name }).run();
    categoryIds.push(id);
  }

  // 2. Seed Authors
  console.log('Seeding authors...');
  const authorIds: string[] = [];
  for (let i = 0; i < 10; i++) {
    const id = crypto.randomUUID();
    await db.insert(authors).values({
      id,
      name: faker.person.fullName(),
      bio: faker.person.bio(),
    }).run();
    authorIds.push(id);
  }

  // 3. Seed Books
  console.log('Seeding books...');
  for (let i = 0; i < 30; i++) {
    await db.insert(books).values({
      id: crypto.randomUUID(),
      title: faker.commerce.productName() + ' - ' + faker.word.adjective(),
      description: faker.commerce.productDescription(),
      isbn: faker.commerce.isbn(),
      availableCopies: faker.number.int({ min: 1, max: 10 }),
      authorId: faker.helpers.arrayElement(authorIds),
      categoryId: faker.helpers.arrayElement(categoryIds),
      coverUrl: faker.image.url({ width: 300, height: 400 }),
    }).run();
  }

  console.log('Database seeded successfully!');
}

main().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
