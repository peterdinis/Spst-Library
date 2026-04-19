import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users, admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resolveUserIdFromDb } from "@/lib/resolve-user-id";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
	secret: process.env.AUTH_SECRET,
	providers: [
		MicrosoftEntraID({
			clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID,
			clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET,
			issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
		}),
		Credentials({
			id: "admin-login",
			name: "Admin Login",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
				adminCode: { label: "Admin Code", type: "text" },
			},
			async authorize(credentials) {
				if (
					!credentials?.username ||
					!credentials?.password ||
					!credentials?.adminCode
				) {
					return null;
				}

				const adminRows = await db
					.select()
					.from(admins)
					.where(eq(admins.username, credentials.username as string))
					.limit(1);
				const admin = adminRows[0];
				if (!admin) return null;

				const isPasswordValid = await bcrypt.compare(
					credentials.password as string,
					admin.password,
				);
				const isAdminCodeValid = credentials.adminCode === admin.adminCode;

				if (!isPasswordValid || !isAdminCodeValid) return null;

				const existingRows = await db
					.select()
					.from(users)
					.where(eq(users.id, admin.id))
					.limit(1);
				const existingAdminInUsers = existingRows[0];

				if (!existingAdminInUsers) {
					try {
						await db.insert(users).values({
							id: admin.id,
							name: admin.name || admin.username,
							email: `admin-${admin.username}@local.spst`,
							isAdmin: true,
						});
					} catch (e) {
						console.error("Failed to sync admin to users table", e);
					}
				}

				return {
					id: admin.id,
					name: admin.name || admin.username,
					email: admin.username,
					role: "admin",
				};
			},
		}),
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			if (account?.provider === "microsoft-entra-id") {
				if (!user.email) return false;

				const existingRows = await db
					.select()
					.from(users)
					.where(eq(users.email, user.email))
					.limit(1);
				const existingUser = existingRows[0];

				if (!existingUser) {
					await db.insert(users).values({
						id: (user.id || profile?.oid || crypto.randomUUID()) as string,
						name: user.name,
						email: user.email,
						image: user.image,
						isAdmin: false,
					});
				} else {
					await db
						.update(users)
						.set({
							name: user.name,
							image: user.image,
						})
						.where(eq(users.email, user.email));
				}

				const dbUserRows = await db
					.select()
					.from(users)
					.where(eq(users.email, user.email))
					.limit(1);
				const dbUser = dbUserRows[0];

				if (dbUser?.isAdmin) {
					(user as { role?: string }).role = "admin";
				}
			}
			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				token.role = (user as { role?: string }).role ?? null;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				const sub = token.sub as string | undefined;
				const resolved =
					(await resolveUserIdFromDb(session.user.email, sub)) ?? sub;
				if (!resolved) {
					console.error("NextAuth session: chýba token.sub aj DB používateľ", {
						email: session.user.email,
					});
				}
				session.user.id = resolved ?? "";
				(session.user as { role?: string | null }).role =
					(token.role as string | null) ?? null;
			}
			return session;
		},
	},
});
