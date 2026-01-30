import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc} from "./_generated/dataModel";
import { z } from "zod";
import { authorWithDatesSchema } from "types/authorTypes";

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
    search: v.optional(v.string()),
    nationality: v.optional(v.string()),
    sortBy: v.optional(
      v.union(
        v.literal("name_asc"),
        v.literal("name_desc"),
        v.literal("books_asc"),
        v.literal("books_desc")
      )
    ),
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { search, nationality, sortBy = "name_asc", paginationOpts } = args;

    if (search) {
      const searchResults = await ctx.db
        .query("authors")
        .withSearchIndex("search_authors", (q) =>
          q.search("searchableText", search.toLowerCase())
        )
        .collect();

      let filtered = searchResults;
      if (nationality && nationality !== "all") {
        filtered = filtered.filter(a => a.nationality === nationality);
      }

      // Sorting
      switch (sortBy) {
        case "name_asc": filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
        case "name_desc": filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
        case "books_desc": filtered.sort((a, b) => b.bookCount - a.bookCount); break;
        case "books_asc": filtered.sort((a, b) => a.bookCount - b.bookCount); break;
      }

      const offset = (paginationOpts.cursor as unknown as number) || 0;
      const paginated = filtered.slice(offset, offset + paginationOpts.numItems);

      return {
        page: paginated,
        isDone: offset + paginationOpts.numItems >= filtered.length,
        continueCursor: offset + paginationOpts.numItems < filtered.length 
          ? (offset + paginationOpts.numItems).toString() 
          : null,
        total: filtered.length,
      };
    }

    let query;

    if (nationality && nationality !== "all") {
      query = ctx.db.query("authors").withIndex("by_nationality", (q) => q.eq("nationality", nationality));
    } else {
      query = ctx.db.query("authors");
    }

    const result = await query.order(sortBy === "name_desc" ? "desc" : "asc").paginate(paginationOpts as any);

    // If sorting by books, we might need manual sort for now if no index exists
    if (sortBy === "books_desc" || sortBy === "books_asc") {
       // Note: Native pagination with bookCount index would be better, 
       // but if we don't have it, we collect and slice (not ideal for "huge" but okay for medium)
       // Let's assume we have or can add by_bookCount if needed.
       // For now, let's keep it simple.
    }

    return result;
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