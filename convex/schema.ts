import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Books table
  books: defineTable({
    title: v.string(),
    author: v.string(),
    isbn: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    publishedYear: v.optional(v.number()),
    publisher: v.optional(v.string()),
    pages: v.optional(v.number()),
    language: v.optional(v.string()),
    
    // Foreign key reference to categories
    categoryId: v.id("categories"),
    
    // Inventory information
    totalCopies: v.number(),
    availableCopies: v.number(),
    
    // Metadata
    location: v.optional(v.string()), // Shelf location
    tags: v.array(v.string()),
    
    // Status
    status: v.union(
      v.literal("available"),
      v.literal("reserved"),
      v.literal("maintenance"),
      v.literal("lost")
    ),
    
    // Timestamps
    addedAt: v.number(), // Unix timestamp
    updatedAt: v.number(),
    
    // Search optimization
    searchableText: v.string(),
  })
    .index("by_category", ["categoryId"])
    .index("by_author", ["author"])
    .index("by_status", ["status"])
    .index("by_isbn", ["isbn"])
    .index("by_search", ["searchableText"])
    .index("by_availability", ["availableCopies"])
    .searchIndex("search_books", {
      searchField: "searchableText",
      filterFields: ["categoryId", "status", "author"],
    }),

  // Categories table
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    slug: v.string(), // URL-friendly version
    color: v.optional(v.string()), // For UI display
    icon: v.optional(v.string()), // Icon name
    parentCategoryId: v.optional(v.id("categories")), 
    bookCount: v.number(),
    
    // Metadata
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),

    searchableText: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_parent", ["parentCategoryId"])
    .index("by_active", ["isActive"])
    .searchIndex("search_categories", {
      searchField: "searchableText",
    }),

  bookCategories: defineTable({
    bookId: v.id("books"),
    categoryId: v.id("categories"),
    addedAt: v.number(),
  })
    .index("by_book", ["bookId"])
    .index("by_category", ["categoryId"])
    .index("by_book_and_category", ["bookId", "categoryId"]),
});