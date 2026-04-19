import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

function getConnectionString(): string {
	const url = process.env.DATABASE_URL?.trim();
	if (!url) {
		throw new Error(
			"DATABASE_URL is not set. Add it to your environment (PostgreSQL connection string).",
		);
	}
	return url;
}

declare global {
	var __spst_pg_pool: Pool | undefined;
}

const pool =
	globalThis.__spst_pg_pool ??
	new Pool({
		connectionString: getConnectionString(),
	});

if (process.env.NODE_ENV !== "production") {
	globalThis.__spst_pg_pool = pool;
}

export const db = drizzle(pool, { schema });
