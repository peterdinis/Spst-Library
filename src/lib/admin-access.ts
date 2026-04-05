import type { Session } from "next-auth";

import { db } from "@/db";
import { admins, users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Prístup do admin rozhrania: záznam v `admins` (credentials) alebo `users.is_admin` (Microsoft).
 * Vždy číta aktuálny stav z DB, nie len JWT.
 */
export async function userHasAdminAccess(
	session: Session | null,
): Promise<boolean> {
	if (!session?.user?.id) return false;

	const id = session.user.id;

	const credentialsAdmin = db
		.select()
		.from(admins)
		.where(eq(admins.id, id))
		.get();
	if (credentialsAdmin) return true;

	const byId = db.select().from(users).where(eq(users.id, id)).get();
	if (byId?.isAdmin) return true;

	const email = session.user.email;
	if (email) {
		const byEmail = db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.get();
		if (byEmail?.isAdmin) return true;

		// Check the special permission whitelist
		const { adminWhitelist } = await import("@/db/schema");
		const whitelisted = db
			.select()
			.from(adminWhitelist)
			.where(eq(adminWhitelist.email, email.toLowerCase()))
			.get();
		if (whitelisted) return true;
	}

	return false;
}
