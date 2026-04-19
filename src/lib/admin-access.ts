import type { Session } from "next-auth";

import { db } from "@/db";
import { admins, users, adminWhitelist } from "@/db/schema";
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

	const credentialsAdminRows = await db
		.select()
		.from(admins)
		.where(eq(admins.id, id))
		.limit(1);
	if (credentialsAdminRows[0]) return true;

	const byIdRows = await db
		.select()
		.from(users)
		.where(eq(users.id, id))
		.limit(1);
	const byId = byIdRows[0];
	if (byId?.isAdmin) return true;

	const email = session.user.email;
	if (email) {
		const byEmailRows = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);
		const byEmail = byEmailRows[0];
		if (byEmail?.isAdmin) return true;

		const whitelistedRows = await db
			.select()
			.from(adminWhitelist)
			.where(eq(adminWhitelist.email, email.toLowerCase()))
			.limit(1);
		if (whitelistedRows[0]) return true;
	}

	return false;
}
