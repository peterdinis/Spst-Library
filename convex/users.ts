import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

/**
 * Get user by email
 */
export const getByEmail = query({
	args: { email: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
			.first();

		if (user) {
			const { passwordHash, ...userWithoutPassword } = user;
			return userWithoutPassword;
		}

		return null;
	},
});

/**
 * Get user by ID
 */
export const getById = query({
	args: { id: v.id("users") },
	handler: async (ctx, args) => {
		const user = await ctx.db.get(args.id);
		if (user) {
			const { passwordHash, ...userWithoutPassword } = user;
			return userWithoutPassword;
		}
		return null;
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
