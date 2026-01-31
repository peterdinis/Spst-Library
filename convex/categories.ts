import { v, ConvexError } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { Id } from "./_generated/dataModel";
import { categoryCreateSchema, categoryUpdateSchema } from "types/categoryTypes";
import { checkRateLimit } from "./rateLimit";

export const listAllActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// GET all categories with pagination
export const getCategories = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    parentCategoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    const {
      paginationOpts,
      search,
      isActive,
      parentCategoryId
    } = args;

    // Apply search if provided
    if (search) {
      const searchResults = await ctx.db
        .query("categories")
        .withSearchIndex("search_categories", (q) => 
          q.search("searchableText", search)
        )
        .collect();

      // Apply additional filters to search results
      let filteredResults = searchResults;
      
      if (isActive !== undefined) {
        filteredResults = filteredResults.filter(c => c.isActive === isActive);
      }
      
      if (parentCategoryId !== undefined) {
        filteredResults = filteredResults.filter(c => c.parentCategoryId === parentCategoryId);
      }

      // Manual pagination for search results
      const startIndex = (paginationOpts.cursor as unknown as number) || 0;
      const endIndex = startIndex + paginationOpts.numItems;
      const paginatedResults = filteredResults.slice(startIndex, endIndex);

      // Get subcategory counts
      const categoriesWithSubCounts = await Promise.all(
        paginatedResults.map(async (category) => {
          const subcategories = await ctx.db
            .query("categories")
            .withIndex("by_parent", (q) => q.eq("parentCategoryId", category._id))
            .collect();
          
          return {
            ...category,
            subcategoryCount: subcategories.length
          };
        })
      );

      return {
        page: categoriesWithSubCounts,
        isDone: endIndex >= filteredResults.length,
        continueCursor: endIndex < filteredResults.length ? (endIndex as any) : undefined,
      };
    }

    // Non-search query
    let page;
    
    if (parentCategoryId !== undefined) {
      page = await ctx.db.query("categories")
        .withIndex("by_parent", (q) => q.eq("parentCategoryId", parentCategoryId))
        .order("desc")
        .paginate(paginationOpts);
    } else if (isActive !== undefined) {
      page = await ctx.db.query("categories")
        .withIndex("by_active", (q) => q.eq("isActive", isActive))
        .order("desc")
        .paginate(paginationOpts);
    } else {
      page = await ctx.db.query("categories")
        .order("desc")
        .paginate(paginationOpts);
    }
    
    // Get subcategory counts
    const categoriesWithSubCounts = await Promise.all(
      page.page.map(async (category) => {
        const subcategories = await ctx.db
          .query("categories")
          .withIndex("by_parent", (q) => q.eq("parentCategoryId", category._id))
          .collect();
        
        return {
          ...category,
          subcategoryCount: subcategories.length
        };
      })
    );

    return {
      ...page,
      page: categoriesWithSubCounts,
    };
  },
});

// GET single category by ID
export const getCategoryById = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);
    if (!category) return null;

    // Get parent category if exists
    const parentCategory = category.parentCategoryId 
      ? await ctx.db.get(category.parentCategoryId)
      : null;

    // Get subcategories
    const subcategories = await ctx.db
      .query("categories")
      .withIndex("by_parent", (q) => q.eq("parentCategoryId", args.id))
      .collect();

    // Get books in this category
    const books = await ctx.db
      .query("books")
      .withIndex("by_category", (q) => q.eq("categoryId", args.id))
      .take(10);

    return {
      ...category,
      parentCategory,
      subcategories,
      booksPreview: books,
    };
  },
});

export const searchCategories = query({
  args: {
    query: v.string(),
    paginationOpts: paginationOptsValidator,
    filters: v.optional(v.object({
      isActive: v.optional(v.boolean()),
      hasParent: v.optional(v.boolean()),
      minBookCount: v.optional(v.number()),
      maxBookCount: v.optional(v.number()),
    }))
  },
  handler: async (ctx, args) => {
    const { query: searchQuery, paginationOpts, filters } = args;

    let results = await ctx.db
      .query("categories")
      .withSearchIndex("search_categories", (q) => 
        q.search("searchableText", searchQuery)
      )
      .collect();

    // Apply filters
    if (filters) {
      results = results.filter(category => {
        if (filters.isActive !== undefined && category.isActive !== filters.isActive) {
          return false;
        }
        if (filters.hasParent !== undefined) {
          const hasParent = category.parentCategoryId !== null && category.parentCategoryId !== undefined;
          if (filters.hasParent !== hasParent) return false;
        }
        if (filters.minBookCount !== undefined && category.bookCount < filters.minBookCount) {
          return false;
        }
        if (filters.maxBookCount !== undefined && category.bookCount > filters.maxBookCount) {
          return false;
        }
        return true;
      });
    }

    const startIndex = (paginationOpts.cursor as unknown as number) || 0;
    const endIndex = startIndex + paginationOpts.numItems;
    const paginatedResults = results.slice(startIndex, endIndex);

    return {
      page: paginatedResults,
      isDone: endIndex >= results.length,
      continueCursor: endIndex < results.length ? (endIndex as any) : undefined,
      total: results.length,
    };
  },
});

// GET category by slug
export const getCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!category) return null;

    // Duplicate logic instead of calling getCategoryById
    const parentCategory = category.parentCategoryId 
      ? await ctx.db.get(category.parentCategoryId)
      : null;

    const subcategories = await ctx.db
      .query("categories")
      .withIndex("by_parent", (q) => q.eq("parentCategoryId", category._id))
      .collect();

    const books = await ctx.db
      .query("books")
      .withIndex("by_category", (q) => q.eq("categoryId", category._id))
      .take(10);

    return {
      ...category,
      parentCategory,
      subcategories,
      booksPreview: books,
    };
  },
});

// GET category tree (hierarchical structure)
export const getCategoryTree = query({
  args: { includeInactive: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let allCategories;
    
    if (!args.includeInactive) {
      allCategories = await ctx.db
        .query("categories")
        .withIndex("by_active", (q) => q.eq("isActive", true))
        .collect();
    } else {
      allCategories = await ctx.db.query("categories").collect();
    }

    // Build tree structure
    const buildTree = (parentId: Id<"categories"> | null = null): any[] => {
      return allCategories
        .filter(category => category.parentCategoryId === parentId)
        .map(category => ({
          ...category,
          children: buildTree(category._id)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    };

    return buildTree();
  },
});

// CREATE category
export const createCategory = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    slug: v.string(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    parentCategoryId: v.optional(v.id("categories")),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { parentCategoryId, ...data } = args;
    
    // Rate limiting: 5 categories per minute per "anonymous/session" (simplified key)
    // Ideálne by sme tu mali userId, ak je užívateľ prihlásený
    await checkRateLimit(ctx, `create_category_global`, 5, 60000);
    
    // Validate with Zod
    const validationResult = categoryCreateSchema.safeParse(data);
    if (!validationResult.success) {
      throw new ConvexError(validationResult.error.issues[0]?.message || "Neplatné údaje kategórie");
    }
    
    const existingCategory = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", data.slug))
      .first();

    if (existingCategory) {
      throw new ConvexError(`Kategória so slugom "${data.slug}" už existuje.`);
    }

    if (parentCategoryId) {
      const parentCategory = await ctx.db.get(parentCategoryId);
      if (!parentCategory) {
        throw new ConvexError(`Nadradená kategória nebola nájdená.`);
      }
    }

    const now = Date.now();
    const category: any = {
      ...data,
      parentCategoryId: parentCategoryId || undefined,
      bookCount: 0,
      isActive: data.isActive ?? true,
      createdAt: now,
      updatedAt: now,
      searchableText: `${data.name} ${data.description || ""} ${data.slug}`.toLowerCase(),
    };

    const categoryId = await ctx.db.insert("categories", category);
    return await ctx.db.get(categoryId);
  },
});

// UPDATE category
export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    slug: v.optional(v.string()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    parentCategoryId: v.optional(v.union(v.id("categories"), v.null())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Validate with Zod
    const validationResult = categoryUpdateSchema.safeParse(updates);
    if (!validationResult.success) {
      throw new Error(`Validation error: ${validationResult.error.message}`);
    }
    
    const category = await ctx.db.get(id);
    
    if (!category) {
      throw new Error(`Category with ID "${id}" not found`);
    }

    if (updates.slug && updates.slug !== category.slug) {
      const existingCategory = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", updates.slug!))
        .first();

      if (existingCategory && existingCategory._id !== id) {
        throw new Error(`Category with slug "${updates.slug}" already exists`);
      }
    }

    if (updates.parentCategoryId !== undefined) {
      if (updates.parentCategoryId === id) {
        throw new Error("Category cannot be its own parent");
      }

      if (updates.parentCategoryId) {
        let currentParentId: Id<"categories"> | null | undefined = updates.parentCategoryId;
        const visited = new Set<string>();
        
        while (currentParentId) {
          if (visited.has(currentParentId)) {
            throw new Error("Circular parent reference detected");
          }
          visited.add(currentParentId);
          
          const parent: any = await ctx.db.get(currentParentId);
          if (!parent) break;
          
          if (parent._id === id) {
            throw new Error("Circular parent reference detected");
          }
          
          currentParentId = parent.parentCategoryId || undefined;
        }
      }
    }

    const newName = updates.name ?? category.name;
    const newDescription = updates.description !== undefined ? updates.description : category.description;
    const newSlug = updates.slug ?? category.slug;
    
    const updatedData: any = {
      updatedAt: Date.now(),
      searchableText: `${newName} ${newDescription || ""} ${newSlug}`.toLowerCase(),
    };

    // Only add fields that were actually provided
    if (updates.name !== undefined) updatedData.name = updates.name;
    if (updates.description !== undefined) updatedData.description = updates.description;
    if (updates.slug !== undefined) updatedData.slug = updates.slug;
    if (updates.color !== undefined) updatedData.color = updates.color;
    if (updates.icon !== undefined) updatedData.icon = updates.icon;
    if (updates.isActive !== undefined) updatedData.isActive = updates.isActive;
    if (updates.parentCategoryId !== undefined) {
      updatedData.parentCategoryId = updates.parentCategoryId || undefined;
    }

    await ctx.db.patch(id, updatedData);
    return await ctx.db.get(id);
  },
});

// DELETE category
export const deleteCategory = mutation({
  args: {
    id: v.id("categories"),
    moveBooksTo: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);
    if (!category) {
      throw new Error(`Category with ID "${args.id}" not found`);
    }

    const books = await ctx.db
      .query("books")
      .withIndex("by_category", (q) => q.eq("categoryId", args.id))
      .collect();

    if (books.length > 0) {
      if (args.moveBooksTo) {
        const targetCategory = await ctx.db.get(args.moveBooksTo);
        if (!targetCategory) {
          throw new Error(`Target category with ID "${args.moveBooksTo}" not found`);
        }

        await Promise.all(
          books.map(book => ctx.db.patch(book._id, { categoryId: args.moveBooksTo }))
        );

        await ctx.db.patch(args.id, { bookCount: 0 });
        await ctx.db.patch(args.moveBooksTo, { 
          bookCount: targetCategory.bookCount + books.length 
        });
      } else {
        throw new Error(
          `Category has ${books.length} books. Provide moveBooksTo ID or delete books first.`
        );
      }
    }

    const subcategories = await ctx.db
      .query("categories")
      .withIndex("by_parent", (q) => q.eq("parentCategoryId", args.id))
      .collect();

    if (subcategories.length > 0) {
      throw new Error(
        `Category has ${subcategories.length} subcategories. Remove them first.`
      );
    }

    await ctx.db.delete(args.id);
    return { success: true, deletedBooks: books.length };
  },
});

// TOGGLE category active status
export const toggleCategoryActive = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);
    if (!category) {
      throw new Error(`Category with ID "${args.id}" not found`);
    }

    const newStatus = !category.isActive;
    await ctx.db.patch(args.id, { 
      isActive: newStatus,
      updatedAt: Date.now(),
    });

    return { id: args.id, isActive: newStatus };
  },
});

// GET categories with stats
export const getCategoriesWithStats = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("categories")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("desc")
      .paginate(args.paginationOpts as any);

    const categoriesWithStats = await Promise.all(
      result.page.map(async (category) => {
        // Use the pre-calculated bookCount if available, otherwise fetch
        // For stats like available/reserved, we still need to fetch or have more fields
        const books = await ctx.db
          .query("books")
          .withIndex("by_category", (q) => q.eq("categoryId", category._id))
          .collect();

        const availableBooks = books.filter(book => 
          book.status === "available" && book.availableCopies > 0
        ).length;

        return {
          ...category,
          totalBooks: books.length,
          availableBooks,
          reservedBooks: books.filter(book => book.status === "reserved").length,
        };
      })
    );

    const totalResults = await ctx.db
      .query("categories")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return { ...result, page: categoriesWithStats, total: totalResults.length };
  },
});

// BULK update categories
export const bulkUpdateCategories = mutation({
  args: {
    updates: v.array(v.object({
      id: v.id("categories"),
      name: v.optional(v.string()),
      color: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
    }))
  },
  handler: async (ctx, args) => {
    const results = [];
    
    for (const update of args.updates) {
      try {
        const category = await ctx.db.get(update.id);
        if (!category) {
          results.push({ id: update.id, success: false, error: "Not found" });
          continue;
        }

        const patchData: any = { updatedAt: Date.now() };
        
        if (update.name !== undefined) {
          patchData.name = update.name;
          patchData.searchableText = `${update.name} ${category.description || ""} ${category.slug}`.toLowerCase();
        }
        if (update.color !== undefined) patchData.color = update.color;
        if (update.isActive !== undefined) patchData.isActive = update.isActive;

        await ctx.db.patch(update.id, patchData);
        results.push({ id: update.id, success: true });
      } catch (error) {
        results.push({ 
          id: update.id, 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    }

    return results;
  },
});

// Internal: Update book count for category
export const updateCategoryBookCount = internalMutation({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const books = await ctx.db
      .query("books")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .collect();

    await ctx.db.patch(args.categoryId, { bookCount: books.length });
    return books.length;
  },
});