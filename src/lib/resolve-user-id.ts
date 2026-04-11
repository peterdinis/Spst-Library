import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Zhodnotí skutočné `users.id` z DB (email má prednosť pred JWT/sub),
 * aby FK na `borrowed_books` / notifikácie vždy sedeli.
 */
export function resolveUserIdFromDb(
	email: string | null | undefined,
	fallbackId: string | null | undefined,
): string | undefined {
	if (email) {
		const byEmail = db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.get();
		if (byEmail?.id) return byEmail.id;
	}
	if (fallbackId) {
		const byId = db
			.select()
			.from(users)
			.where(eq(users.id, fallbackId))
			.get();
		if (byId?.id) return byId.id;
		return fallbackId;
	}
	return undefined;
}
