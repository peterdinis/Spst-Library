import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users, admins } from "@/db/schema";
import { eq } from "drizzle-orm";
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

				const admin = db
					.select()
					.from(admins)
					.where(eq(admins.username, credentials.username as string))
					.get();
				if (!admin) return null;

				const isPasswordValid = await bcrypt.compare(
					credentials.password as string,
					admin.password,
				);
				const isAdminCodeValid = credentials.adminCode === admin.adminCode;

				if (!isPasswordValid || !isAdminCodeValid) return null;

				// Zabezpečíme, že lokálny admin má záznam v tabuľke `users`,
				// aby nepadal Foreign Key Constraint pri požičiavaní kníh a notifikáciách.
				const existingAdminInUsers = db
					.select()
					.from(users)
					.where(eq(users.id, admin.id))
					.get();
					
				if (!existingAdminInUsers) {
					try {
						db.insert(users)
							.values({
								id: admin.id,
								name: admin.name || admin.username,
								email: `admin-${admin.username}@local.spst`,
								isAdmin: true,
							})
							.run();
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

				const existingUser = db
					.select()
					.from(users)
					.where(eq(users.email, user.email))
					.get();

				if (!existingUser) {
					db.insert(users)
						.values({
							id: (user.id || profile?.oid || crypto.randomUUID()) as string,
							name: user.name,
							email: user.email,
							image: user.image,
							isAdmin: false,
						})
						.run();
				} else {
					db.update(users)
						.set({
							name: user.name,
							image: user.image,
						})
						.where(eq(users.email, user.email))
						.run();
				}

				// Attach role from DB so the jwt callback can read it
				const dbUser = db
					.select()
					.from(users)
					.where(eq(users.email, user.email))
					.get();

				if (dbUser?.isAdmin) {
					(user as any).role = "admin";
				}
			}
			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				// Persists role into JWT for both Credentials admins and Entra admins
				token.role = (user as any).role ?? null;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub as string;
				(session.user as any).role = token.role ?? null;
			}
			return session;
		},
	},
});
