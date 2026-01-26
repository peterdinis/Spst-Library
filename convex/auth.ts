import { v, ConvexError } from "convex/values";
import { mutation } from "./_generated/server";

// Simple password hashing using Web Crypto API (available in Convex)
async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(
	password: string,
	hash: string,
): Promise<boolean> {
	const passwordHash = await hashPassword(password);
	return passwordHash === hash;
}

/**
 * Register new user
 */
export const register = mutation({
	args: {
		email: v.string(),
		password: v.string(),
		firstName: v.string(),
		lastName: v.string(),
	},
	handler: async (ctx, args) => {
		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(args.email)) {
			throw new ConvexError("Neplatný formát emailu");
		}

		// Validate password length
		if (args.password.length < 6) {
			throw new ConvexError("Heslo musí mať aspoň 6 znakov");
		}

		// Check if user already exists
		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
			.first();

		if (existingUser) {
			throw new ConvexError("Používateľ s týmto emailom už existuje");
		}

		// Hash password
		const passwordHash = await hashPassword(args.password);

		// Build searchable text
		const fullName = `${args.firstName} ${args.lastName}`;
		const searchableText = [
			args.email.toLowerCase(),
			args.firstName,
			args.lastName,
			fullName,
		]
			.filter(Boolean)
			.join(" ")
			.toLowerCase();

		const now = Date.now();

		// Create user
		const userId = await ctx.db.insert("users", {
			email: args.email.toLowerCase(),
			passwordHash,
			emailVerified: false,
			firstName: args.firstName,
			lastName: args.lastName,
			fullName,
			membershipType: "regular" as const,
			membershipStartDate: now,
			roles: ["member"],
			status: "active" as const,
			totalBorrowed: 0,
			currentBorrowed: 0,
			totalReservations: 0,
			totalFines: 0,
			currentFines: 0,
			createdAt: now,
			updatedAt: now,
			lastLoginAt: now,
			searchableText,
		});

		// Create session
		const sessionToken = await generateSessionToken();
		const expiresAt = now + 30 * 24 * 60 * 60 * 1000; // 30 days

		await ctx.db.insert("sessions", {
			userId,
			token: sessionToken,
			expiresAt,
			createdAt: now,
			lastUsedAt: now,
		});

		return {
			userId,
			token: sessionToken,
			user: {
				_id: userId,
				email: args.email.toLowerCase(),
				firstName: args.firstName,
				lastName: args.lastName,
				fullName,
			},
		};
	},
});

/**
 * Login user
 */
export const login = mutation({
	args: {
		email: v.string(),
		password: v.string(),
	},
	handler: async (ctx, args) => {
		// Find user by email
		const user = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
			.first();

		if (!user) {
			throw new ConvexError("Neplatný email alebo heslo");
		}

		// Verify password
		const isValid = await verifyPassword(args.password, user.passwordHash);
		if (!isValid) {
			throw new ConvexError("Neplatný email alebo heslo");
		}

		// Check if user is active
		if (user.status !== "active") {
			throw new ConvexError("Váš účet je deaktivovaný");
		}

		const now = Date.now();

		// Update last login
		await ctx.db.patch(user._id, {
			lastLoginAt: now,
			updatedAt: now,
		});

		// Create new session
		const sessionToken = await generateSessionToken();
		const expiresAt = now + 30 * 24 * 60 * 60 * 1000; // 30 days

		await ctx.db.insert("sessions", {
			userId: user._id,
			token: sessionToken,
			expiresAt,
			createdAt: now,
			lastUsedAt: now,
		});

		return {
			userId: user._id,
			token: sessionToken,
			user: {
				_id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				fullName: user.fullName,
				roles: user.roles,
			},
		};
	},
});

/**
 * Logout user (delete session)
 */
export const logout = mutation({
	args: {
		token: v.string(),
	},
	handler: async (ctx, args) => {
		const session = await ctx.db
			.query("sessions")
			.withIndex("by_token", (q) => q.eq("token", args.token))
			.first();

		if (session) {
			await ctx.db.delete(session._id);
		}

		return { success: true };
	},
});

/**
 * Get current user from session token
 * Note: This is a mutation because it needs to update session lastUsedAt
 */
export const getCurrentUser = mutation({
	args: {
		token: v.string(),
	},
	handler: async (ctx, args) => {
		const session = await ctx.db
			.query("sessions")
			.withIndex("by_token", (q) => q.eq("token", args.token))
			.first();

		if (!session) {
			return null;
		}

		// Check if session is expired
		if (session.expiresAt < Date.now()) {
			await ctx.db.delete(session._id);
			return null;
		}

		// Update last used
		await ctx.db.patch(session._id, {
			lastUsedAt: Date.now(),
		});

		const user = await ctx.db.get(session.userId);
		if (!user) {
			return null;
		}

		// Return user without password hash
		const { passwordHash, ...userWithoutPassword } = user;
		return userWithoutPassword;
	},
});

/**
 * Generate random session token
 */
async function generateSessionToken(): Promise<string> {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
		"",
	);
}
