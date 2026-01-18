import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc} from "./_generated/dataModel";
import { z } from "zod";
import { PaginationOptions } from "convex/server";

// ==================== ZOD SCHEMAS ====================

/**
 * Zod schema for author validation
 */
export const authorSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  biography: z.string().max(5000, "Biography too long").optional(),
  birthYear: z
    .number()
    .int()
    .min(1000, "Birth year must be after 1000")
    .max(new Date().getFullYear(), "Birth year cannot be in the future")
    .optional(),
  deathYear: z
    .number()
    .int()
    .min(1000, "Death year must be after 1000")
    .max(new Date().getFullYear() + 10, "Death year seems unrealistic")
    .optional(),
  nationality: z.string().max(100, "Nationality too long").optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

/**
 * Zod schema for author creation
 */
export const createAuthorSchema = authorSchema.extend({
  photoFileId: z.string().optional(), // Will be validated as v.id("files") by Convex
});

/**
 * Zod schema for author updates
 */
export const updateAuthorSchema = authorSchema.partial().extend({
  id: z.string(), // Will be validated as v.id("authors") by Convex
  photoFileId: z.string().optional(),
});

/**
 * Custom refinement to ensure death year is after birth year
 */
export const authorWithDatesSchema = authorSchema.refine(
  (data) => {
    if (data.birthYear && data.deathYear) {
      return data.deathYear >= data.birthYear;
    }
    return true;
  },
  {
    message: "Death year must be after or equal to birth year",
    path: ["deathYear"],
  }
);

// ==================== HELPER FUNCTIONS ====================

/**
 * Validate author data with Zod
 */
function validateAuthorData(data: unknown): z.infer<typeof authorWithDatesSchema> {
  return authorWithDatesSchema.parse(data);
}

/**
 * Build searchable text from author fields
 */
function buildSearchableText(author: {
  name: string;
  biography?: string;
  nationality?: string;
}): string {
  return [author.name, author.biography || "", author.nationality || ""]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

// ==================== QUERIES ====================

/**
 * Get all authors with pagination
 */
export const list = query({
  args: {
    paginationOpts: v.optional(
      v.object({
        numItems: v.number(),
        cursor: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const authors = await ctx.db
      .query("authors")
      .order("desc")
      .paginate(args.paginationOpts as unknown as PaginationOptions);

    return authors;
  },
});

/**
 * Get a single author by ID with their photo file details
 */
export const getById = query({
  args: { id: v.id("authors") },
  handler: async (ctx, args) => {
    const author = await ctx.db.get(args.id);
    
    if (!author) {
      return null;
    }

    // Fetch photo file if it exists
    let photoFile = null;
    if (author.photoFileId) {
      photoFile = await ctx.db.get(author.photoFileId);
    }

    return {
      ...author,
      photoFile,
    };
  },
});

/**
 * Get author by name (exact match)
 */
export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const author = await ctx.db
      .query("authors")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    return author;
  },
});

/**
 * Get authors by nationality
 */
export const getByNationality = query({
  args: { 
    nationality: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("authors")
      .withIndex("by_nationality", (q) => q.eq("nationality", args.nationality));

    if (args.limit) {
      const authors = await query.take(args.limit);
      return authors;
    }

    return await query.collect();
  },
});

/**
 * Search authors by name, biography, or nationality
 */
export const search = query({
  args: { 
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("authors")
      .withSearchIndex("search_authors", (q) =>
        q.search("searchableText", args.searchTerm)
      )
      .take(args.limit || 20);

    return results;
  },
});

/**
 * Get authors with most books
 */
export const getTopAuthors = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const authors = await ctx.db.query("authors").collect();
    
    // Sort by book count descending
    const sorted = authors.sort((a, b) => b.bookCount - a.bookCount);
    
    return sorted.slice(0, args.limit || 10);
  },
});

/**
 * Get all nationalities (for filters)
 */
export const getNationalities = query({
  handler: async (ctx) => {
    const authors = await ctx.db.query("authors").collect();
    
    const nationalities = new Set(
      authors
        .map((a) => a.nationality)
        .filter((n): n is string => n !== undefined)
    );

    return Array.from(nationalities).sort();
  },
});

/**
 * Get author statistics
 */
export const getStats = query({
  handler: async (ctx) => {
    const authors = await ctx.db.query("authors").collect();
    
    const totalAuthors = authors.length;
    const totalBooks = authors.reduce((sum, a) => sum + a.bookCount, 0);
    const avgBooksPerAuthor = totalAuthors > 0 ? totalBooks / totalAuthors : 0;
    
    const authorsWithPhotos = authors.filter((a) => a.photoFileId).length;
    const authorsWithBiography = authors.filter((a) => a.biography).length;
    
    const nationalityCounts = authors.reduce((acc, author) => {
      if (author.nationality) {
        acc[author.nationality] = (acc[author.nationality] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topNationalities = Object.entries(nationalityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([nationality, count]) => ({ nationality, count }));

    return {
      totalAuthors,
      totalBooks,
      avgBooksPerAuthor: Math.round(avgBooksPerAuthor * 10) / 10,
      authorsWithPhotos,
      authorsWithBiography,
      topNationalities,
    };
  },
});

// ==================== MUTATIONS ====================

/**
 * Create a new author with Zod validation
 */
export const create = mutation({
  args: {
    name: v.string(),
    biography: v.optional(v.string()),
    birthYear: v.optional(v.number()),
    deathYear: v.optional(v.number()),
    nationality: v.optional(v.string()),
    photoFileId: v.optional(v.id("files")),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate input with Zod
    const validatedData = validateAuthorData({
      name: args.name,
      biography: args.biography,
      birthYear: args.birthYear,
      deathYear: args.deathYear,
      nationality: args.nationality,
      website: args.website,
    });

    const now = Date.now();

    // Build searchable text from all text fields
    const searchableText = buildSearchableText(validatedData);

    // Check for duplicate name
    const existing = await ctx.db
      .query("authors")
      .withIndex("by_name", (q) => q.eq("name", validatedData.name))
      .first();

    if (existing) {
      throw new Error(`Author with name "${validatedData.name}" already exists`);
    }

    const authorId = await ctx.db.insert("authors", {
      name: validatedData.name,
      biography: validatedData.biography,
      birthYear: validatedData.birthYear,
      deathYear: validatedData.deathYear,
      nationality: validatedData.nationality,
      photoFileId: args.photoFileId,
      website: validatedData.website,
      createdAt: now,
      updatedAt: now,
      bookCount: 0,
      searchableText,
    });

    // Update file entity reference if photo was provided
    if (args.photoFileId) {
      await ctx.db.patch(args.photoFileId, {
        entityType: "author_photo",
        entityId: authorId,
      });
    }

    return authorId;
  },
});

/**
 * Update an existing author with Zod validation
 */
export const update = mutation({
  args: {
    id: v.id("authors"),
    name: v.optional(v.string()),
    biography: v.optional(v.string()),
    birthYear: v.optional(v.number()),
    deathYear: v.optional(v.number()),
    nationality: v.optional(v.string()),
    photoFileId: v.optional(v.id("files")),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Author not found");
    }

    // Merge existing data with updates for validation
    const dataToValidate = {
      name: updates.name ?? existing.name,
      biography: updates.biography !== undefined ? updates.biography : existing.biography,
      birthYear: updates.birthYear !== undefined ? updates.birthYear : existing.birthYear,
      deathYear: updates.deathYear !== undefined ? updates.deathYear : existing.deathYear,
      nationality: updates.nationality !== undefined ? updates.nationality : existing.nationality,
      website: updates.website !== undefined ? updates.website : existing.website,
    };

    // Validate merged data with Zod
    const validatedData = validateAuthorData(dataToValidate);

    // Check for duplicate name if name is being changed
    if (updates.name && updates.name !== existing.name) {
      const duplicate = await ctx.db
        .query("authors")
        .withIndex("by_name", (q) => q.eq("name", updates.name!))
        .first();

      if (duplicate && duplicate._id !== id) {
        throw new Error(`Author with name "${updates.name}" already exists`);
      }
    }

    // Prepare update object
    const updateData: Partial<Doc<"authors">> = {
      name: validatedData.name,
      biography: validatedData.biography,
      birthYear: validatedData.birthYear,
      deathYear: validatedData.deathYear,
      nationality: validatedData.nationality,
      website: validatedData.website,
      updatedAt: Date.now(),
    };

    // Rebuild searchable text
    updateData.searchableText = buildSearchableText(validatedData);

    // Handle photo file ID separately (not in validated data)
    if (updates.photoFileId !== undefined) {
      updateData.photoFileId = updates.photoFileId;
    }

    await ctx.db.patch(id, updateData);

    // Update file entity reference if photo changed
    if (updates.photoFileId !== undefined) {
      // Remove old file reference
      if (existing.photoFileId && existing.photoFileId !== updates.photoFileId) {
        await ctx.db.patch(existing.photoFileId, {
          entityType: "other",
          entityId: undefined,
        });
      }

      // Add new file reference
      if (updates.photoFileId) {
        await ctx.db.patch(updates.photoFileId, {
          entityType: "author_photo",
          entityId: id,
        });
      }
    }

    return id;
  },
});

/**
 * Delete an author (only if they have no books)
 */
export const remove = mutation({
  args: { id: v.id("authors") },
  handler: async (ctx, args) => {
    const author = await ctx.db.get(args.id);
    
    if (!author) {
      throw new Error("Author not found");
    }

    // Check if author has any books
    const hasBooks = await ctx.db
      .query("books")
      .withIndex("by_author", (q) => q.eq("authorId", args.id))
      .first();

    if (hasBooks || author.bookCount > 0) {
      throw new Error(
        "Cannot delete author with existing books. Please reassign or delete books first."
      );
    }

    // Remove file entity reference if photo exists
    if (author.photoFileId) {
      await ctx.db.patch(author.photoFileId, {
        entityType: "other",
        entityId: undefined,
      });
    }

    await ctx.db.delete(args.id);
    
    return { success: true };
  },
});

/**
 * Increment book count for an author
 * (Called internally when a book is added)
 */
export const incrementBookCount = mutation({
  args: { authorId: v.id("authors") },
  handler: async (ctx, args) => {
    const author = await ctx.db.get(args.authorId);
    
    if (!author) {
      throw new Error("Author not found");
    }

    await ctx.db.patch(args.authorId, {
      bookCount: author.bookCount + 1,
      updatedAt: Date.now(),
    });

    return author.bookCount + 1;
  },
});

/**
 * Decrement book count for an author
 * (Called internally when a book is removed)
 */
export const decrementBookCount = mutation({
  args: { authorId: v.id("authors") },
  handler: async (ctx, args) => {
    const author = await ctx.db.get(args.authorId);
    
    if (!author) {
      throw new Error("Author not found");
    }

    const newCount = Math.max(0, author.bookCount - 1);

    await ctx.db.patch(args.authorId, {
      bookCount: newCount,
      updatedAt: Date.now(),
    });

    return newCount;
  },
});

/**
 * Recalculate book count for an author
 * (Useful for fixing data inconsistencies)
 */
export const recalculateBookCount = mutation({
  args: { authorId: v.id("authors") },
  handler: async (ctx, args) => {
    const books = await ctx.db
      .query("books")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .collect();

    await ctx.db.patch(args.authorId, {
      bookCount: books.length,
      updatedAt: Date.now(),
    });

    return books.length;
  },
});

/**
 * Bulk recalculate book counts for all authors
 */
export const recalculateAllBookCounts = mutation({
  handler: async (ctx) => {
    const authors = await ctx.db.query("authors").collect();
    
    let updated = 0;

    for (const author of authors) {
      const books = await ctx.db
        .query("books")
        .withIndex("by_author", (q) => q.eq("authorId", author._id))
        .collect();

      if (books.length !== author.bookCount) {
        await ctx.db.patch(author._id, {
          bookCount: books.length,
          updatedAt: Date.now(),
        });
        updated++;
      }
    }

    return { 
      totalAuthors: authors.length, 
      updated,
      message: `Recalculated book counts for ${updated} authors`,
    };
  },
});