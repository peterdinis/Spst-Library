-- Run once against existing DB: sqlite3 sqlite.db < drizzle/add_author_image_url.sql
ALTER TABLE `authors` ADD COLUMN `image_url` text;
