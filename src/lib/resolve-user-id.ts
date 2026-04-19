import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Zhodnotí skutočné `users.id` z DB (email má prednosť pred JWT/sub),
 * aby FK na `borrowed_books` / notifikácie vždy sedeli.
 */
export async function resolveUserIdFromDb(
	email: string | null | undefined,
	fallbackId: string | null | undefined,
): Promise<string | undefined> {
	if (email) {
		const byEmailRows = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);
		const byEmail = byEmailRows[0];
		if (byEmail?.id) return byEmail.id;
	}
	if (fallbackId) {
		const byIdRows = await db
			.select()
			.from(users)
			.where(eq(users.id, fallbackId))
			.limit(1);
		const byId = byIdRows[0];
		if (byId?.id) return byId.id;
		return fallbackId;
	}
	return undefined;
}
