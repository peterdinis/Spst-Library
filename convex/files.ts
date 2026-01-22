import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a file record in Convex after successful upload to UploadThing
 */
export const createFileRecord = mutation({
	args: {
		storageId: v.string(), // UploadThing file key
		url: v.string(), // UploadThing CDN URL
		name: v.string(), // Original file name
		type: v.string(), // MIME type
		size: v.number(), // File size in bytes
		uploadedBy: v.optional(v.string()), // User ID or email
		entityType: v.union(
			v.literal("author_photo"),
			v.literal("book_cover"),
			v.literal("other"),
		),
		entityId: v.optional(v.string()), // Reference to entity
	},
	handler: async (ctx, args) => {
		const fileId = await ctx.db.insert("files", {
			storageId: args.storageId,
			url: args.url,
			name: args.name,
			type: args.type,
			size: args.size,
			uploadedAt: Date.now(),
			uploadedBy: args.uploadedBy,
			entityType: args.entityType,
			entityId: args.entityId,
		});

		return fileId;
	},
});

/**
 * Get file by ID
 */
export const getFileById = query({
	args: { id: v.id("files") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

/**
 * Get file URL by storage ID (UploadThing key)
 */
export const getFileByStorageId = query({
	args: { storageId: v.string() },
	handler: async (ctx, args) => {
		const file = await ctx.db
			.query("files")
			.withIndex("by_storage_id", (q) => q.eq("storageId", args.storageId))
			.first();

		return file;
	},
});

/**
 * Get all files for a specific entity
 */
export const getFilesByEntity = query({
	args: {
		entityType: v.union(
			v.literal("author_photo"),
			v.literal("book_cover"),
			v.literal("other"),
		),
		entityId: v.string(),
	},
	handler: async (ctx, args) => {
		const files = await ctx.db
			.query("files")
			.withIndex("by_entity", (q) =>
				q.eq("entityType", args.entityType).eq("entityId", args.entityId),
			)
			.collect();

		return files;
	},
});

/**
 * Delete a file record
 */
export const deleteFile = mutation({
	args: { id: v.id("files") },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
		return { success: true };
	},
});
