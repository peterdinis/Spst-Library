import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Create or update user from WorkOS
 */
export const createOrUpdateFromWorkOS = mutation({
	args: {
		workosId: v.string(),
		email: v.string(),
		firstName: v.string(),
		lastName: v.string(),
		fullName: v.string(),
		imageUrl: v.optional(v.string()),
		workosOrganizationId: v.optional(v.string()),
		workosConnectionId: v.optional(v.string()),
		workosProfile: v.optional(
			v.object({
				idpId: v.optional(v.string()),
				firstName: v.optional(v.string()),
				lastName: v.optional(v.string()),
				email: v.optional(v.string()),
				username: v.optional(v.string()),
				rawAttributes: v.optional(v.any()),
			}),
		),
	},
	handler: async (ctx, args) => {
		const now = Date.now();

		// Check if user already exists by workosId
		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_workos_id", (q) => q.eq("workosId", args.workosId))
			.first();

		// Build searchable text
		const searchableText = [
			args.email,
			args.firstName,
			args.lastName,
			args.fullName,
		]
			.filter(Boolean)
			.join(" ")
			.toLowerCase();

		if (existingUser) {
			// Update existing user
			await ctx.db.patch(existingUser._id, {
				email: args.email,
				firstName: args.firstName,
				lastName: args.lastName,
				fullName: args.fullName,
				imageUrl: args.imageUrl,
				workosOrganizationId: args.workosOrganizationId,
				workosConnectionId: args.workosConnectionId,
				workosProfile: args.workosProfile,
				workosStatus: "active" as const,
				lastLoginAt: now,
				lastSyncWithWorkos: now,
				updatedAt: now,
				searchableText,
			});

			return existingUser._id;
		}

		// Create new user
		const userId = await ctx.db.insert("users", {
			workosId: args.workosId,
			email: args.email,
			emailVerified: true,
			firstName: args.firstName,
			lastName: args.lastName,
			fullName: args.fullName,
			imageUrl: args.imageUrl,
			workosOrganizationId: args.workosOrganizationId,
			workosConnectionId: args.workosConnectionId,
			workosProfile: args.workosProfile,
			membershipType: "regular" as const,
			membershipStartDate: now,
			roles: ["member"] as const[],
			workosStatus: "active" as const,
			totalBorrowed: 0,
			currentBorrowed: 0,
			totalReservations: 0,
			totalFines: 0,
			currentFines: 0,
			createdAt: now,
			updatedAt: now,
			lastLoginAt: now,
			lastSyncWithWorkos: now,
			searchableText,
		});

		return userId;
	},
});

/**
 * Get user by WorkOS ID
 */
export const getByWorkOSId = query({
	args: { workosId: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_workos_id", (q) => q.eq("workosId", args.workosId))
			.first();

		return user;
	},
});

/**
 * Get user by email
 */
export const getByEmail = query({
	args: { email: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", args.email))
			.first();

		return user;
	},
});

/**
 * Get user by ID
 */
export const getById = query({
	args: { id: v.id("users") },
	handler: async (ctx, args) => {
		const user = await ctx.db.get(args.id);
		return user;
	},
});

/**
 * Update user profile
 */
export const updateProfile = mutation({
	args: {
		userId: v.id("users"),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
		phone: v.optional(v.string()),
		address: v.optional(
			v.object({
				line1: v.optional(v.string()),
				line2: v.optional(v.string()),
				city: v.optional(v.string()),
				state: v.optional(v.string()),
				postalCode: v.optional(v.string()),
				country: v.optional(v.string()),
			}),
		),
		preferences: v.optional(
			v.object({
				language: v.optional(v.string()),
				notifications: v.optional(
					v.object({
						email: v.optional(v.boolean()),
						sms: v.optional(v.boolean()),
						push: v.optional(v.boolean()),
					}),
				),
				theme: v.optional(
					v.union(v.literal("light"), v.literal("dark"), v.literal("auto")),
				),
			}),
		),
	},
	handler: async (ctx, args) => {
		const { userId, ...updateData } = args;

		const user = await ctx.db.get(userId);
		if (!user) {
			throw new ConvexError("User not found");
		}

		// Build searchable text if name changed
		let searchableText = user.searchableText;
		if (updateData.firstName || updateData.lastName) {
			const firstName = updateData.firstName ?? user.firstName;
			const lastName = updateData.lastName ?? user.lastName;
			const fullName = `${firstName} ${lastName}`;
			searchableText = [user.email, firstName, lastName, fullName]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
		}

		const updateFields: Partial<Doc<"users">> = {
			updatedAt: Date.now(),
			searchableText,
		};

		if (updateData.firstName !== undefined) {
			updateFields.firstName = updateData.firstName;
			updateFields.fullName = `${updateData.firstName} ${user.lastName}`;
		}
		if (updateData.lastName !== undefined) {
			updateFields.lastName = updateData.lastName;
			updateFields.fullName = `${user.firstName} ${updateData.lastName}`;
		}
		if (updateData.phone !== undefined) updateFields.phone = updateData.phone;
		if (updateData.address !== undefined)
			updateFields.address = updateData.address;
		if (updateData.preferences !== undefined)
			updateFields.preferences = updateData.preferences;

		await ctx.db.patch(userId, updateFields);

		return userId;
	},
});

/**
 * Update last login time
 */
export const updateLastLogin = mutation({
	args: { userId: v.id("users") },
	handler: async (ctx, args) => {
		await ctx.db.patch(args.userId, {
			lastLoginAt: Date.now(),
			updatedAt: Date.now(),
		});
	},
});

/**
 * Get current user (by WorkOS session)
 */
export const getCurrentUser = query({
	args: { workosId: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_workos_id", (q) => q.eq("workosId", args.workosId))
			.first();

		return user;
	},
});
