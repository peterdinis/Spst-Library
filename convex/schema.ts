import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  authors: defineTable({
    name: v.string(),
    biography: v.optional(v.string()),
    birthYear: v.optional(v.number()),
    deathYear: v.optional(v.number()),
    nationality: v.optional(v.string()),
    photoFileId: v.optional(v.id("files")),
    website: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    bookCount: v.number(),
    searchableText: v.string(),
  })
    .index("by_name", ["name"])
    .index("by_nationality", ["nationality"])
    .searchIndex("search_authors", {
      searchField: "searchableText",
    }),

  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    slug: v.string(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    parentCategoryId: v.optional(v.id("categories")),
    bookCount: v.number(),
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

  books: defineTable({
    title: v.string(),
    authorId: v.id("authors"),
    isbn: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()), // Ponechané pre spätnú kompatibilitu
    coverFileId: v.optional(v.id("files")),
    publishedYear: v.optional(v.number()),
    publisher: v.optional(v.string()),
    pages: v.optional(v.number()),
    language: v.optional(v.string()),
    categoryId: v.id("categories"),
    totalCopies: v.number(),
    availableCopies: v.number(),
    location: v.optional(v.string()),
    tags: v.array(v.string()),
    status: v.union(
      v.literal("available"),
      v.literal("reserved"),
      v.literal("maintenance"),
      v.literal("lost")
    ),
    addedAt: v.number(),
    updatedAt: v.number(),
    searchableText: v.string(),
  })
    .index("by_category", ["categoryId"])
    .index("by_author", ["authorId"])
    .index("by_status", ["status"])
    .index("by_isbn", ["isbn"])
    .index("by_availability", ["availableCopies"])
    .searchIndex("search_books", {
      searchField: "searchableText",
      filterFields: ["categoryId", "status", "authorId"],
    }),

  bookCategories: defineTable({
    bookId: v.id("books"),
    categoryId: v.id("categories"),
    addedAt: v.number(),
  })
    .index("by_book", ["bookId"])
    .index("by_category", ["categoryId"])
    .index("by_book_and_category", ["bookId", "categoryId"]),

  files: defineTable({
    storageId: v.string(),
    url: v.string(),
    name: v.string(),
    type: v.string(),
    size: v.number(),
    uploadedAt: v.number(),
    uploadedBy: v.optional(v.string()),
    entityType: v.union(
      v.literal("author_photo"),
      v.literal("book_cover"),
      v.literal("other")
    ),
    // Zmenené na optional string, lebo entityId môže byť rôzneho typu
    entityId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  })
    .index("by_storage_id", ["storageId"])
    .index("by_entity", ["entityType", "entityId"])
    .index("by_uploaded_at", ["uploadedAt"])
    .index("by_type", ["entityType"]),
});