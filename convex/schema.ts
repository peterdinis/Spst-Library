import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Autentifikácia
    email: v.string(),
    passwordHash: v.string(),
    emailVerified: v.boolean(),
    
    // Základné informácie
    firstName: v.string(),
    lastName: v.string(),
    fullName: v.string(),
    imageUrl: v.optional(v.string()),
    
    // Kontaktné informácie
    phone: v.optional(v.string()),
    address: v.optional(
      v.object({
        line1: v.optional(v.string()),
        line2: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        postalCode: v.optional(v.string()),
        country: v.optional(v.string()),
      })
    ),
    
    // Knižničné informácie
    libraryCardNumber: v.optional(v.string()),
    membershipType: v.union(
      v.literal("student"),
      v.literal("regular"),
      v.literal("premium"),
      v.literal("senior"),
      v.literal("staff"),
      v.literal("corporate")
    ),
    membershipStartDate: v.number(),
    membershipEndDate: v.optional(v.number()),
    
    // Role a oprávnenia
    roles: v.array(
      v.union(
        v.literal("member"),
        v.literal("librarian"),
        v.literal("admin"),
        v.literal("super_admin")
      )
    ),
    
    // Status
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended")
    ),
    
    // Štatistiky
    totalBorrowed: v.number(),
    currentBorrowed: v.number(),
    totalReservations: v.number(),
    totalFines: v.number(),
    currentFines: v.number(),
    
    // Nastavenia
    preferences: v.optional(
      v.object({
        language: v.optional(v.string()),
        notifications: v.optional(
          v.object({
            email: v.optional(v.boolean()),
            sms: v.optional(v.boolean()),
            push: v.optional(v.boolean()),
          })
        ),
        theme: v.optional(
          v.union(v.literal("light"), v.literal("dark"), v.literal("auto"))
        ),
      })
    ),
    
    // Časové značky
    createdAt: v.number(),
    updatedAt: v.number(),
    lastLoginAt: v.optional(v.number()),
    
    // Indexované polia pre vyhľadávanie
    searchableText: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_library_card", ["libraryCardNumber"])
    .index("by_membership_type", ["membershipType"])
    .index("by_status", ["status"])
    .searchIndex("search_users", {
      searchField: "searchableText",
      filterFields: ["membershipType", "status"],
    }),

  // Sessions pre autentifikáciu
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    lastUsedAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"])
    .index("by_expires", ["expiresAt"]),

  // Author tabuľka (z pôvodného kódu)
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

  // Categories tabuľka (z pôvodného kódu)
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

  // Books tabuľka (z pôvodného kódu)
  books: defineTable({
    title: v.string(),
    authorId: v.id("authors"),
    isbn: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
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

  // BookCategories tabuľka (z pôvodného kódu)
  bookCategories: defineTable({
    bookId: v.id("books"),
    categoryId: v.id("categories"),
    addedAt: v.number(),
  })
    .index("by_book", ["bookId"])
    .index("by_category", ["categoryId"])
    .index("by_book_and_category", ["bookId", "categoryId"]),

  // Files tabuľka (z pôvodného kódu)
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
    entityId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  })
    .index("by_storage_id", ["storageId"])
    .index("by_entity", ["entityType", "entityId"])
    .index("by_uploaded_at", ["uploadedAt"])
    .index("by_type", ["entityType"]),

  // ---------------------------
  // NOVÉ TABUĽKY PRE WORK OS SYSTÉM
  // ---------------------------

  // WorkOS synchronizácia
  workosSyncLogs: defineTable({
    type: v.union(
      v.literal("user_sync"),
      v.literal("organization_sync"),
      v.literal("directory_sync")
    ),
    status: v.union(
      v.literal("success"),
      v.literal("error"),
      v.literal("partial")
    ),
    recordsProcessed: v.number(),
    recordsCreated: v.number(),
    recordsUpdated: v.number(),
    recordsFailed: v.number(),
    startedAt: v.number(),
    completedAt: v.number(),
    durationMs: v.number(),
    error: v.optional(v.string()),
    triggeredBy: v.optional(v.string()),
  })
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_started_at", ["startedAt"]),

  // WorkOS organizácie
  workosOrganizations: defineTable({
    workosId: v.string(),
    name: v.string(),
    slug: v.optional(v.string()),
    industry: v.optional(v.string()),
    domain: v.optional(v.string()),
    userCount: v.number(),
    isActive: v.boolean(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastSyncAt: v.optional(v.number()),
  })
    .index("by_workos_id", ["workosId"])
    .index("by_domain", ["domain"])
    .index("by_active", ["isActive"]),

  // WorkOS connections (directory connections)
  workosConnections: defineTable({
    workosId: v.string(),
    organizationId: v.id("workosOrganizations"),
    name: v.string(),
    connectionType: v.union(
      v.literal("okta"),
      v.literal("google"),
      v.literal("azure"),
      v.literal("onelogin"),
      v.literal("generic")
    ),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("deleted")
    ),
    userCount: v.number(),
    syncEnabled: v.boolean(),
    lastSyncAt: v.optional(v.number()),
    syncInterval: v.optional(v.number()), // in minutes
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workos_id", ["workosId"])
    .index("by_organization", ["organizationId"])
    .index("by_type", ["connectionType"])
    .index("by_status", ["status"]),

  // ---------------------------
  // KNIHOVNÍCKE OPERÁCIE
  // ---------------------------

  // Pôžičky kníh
  borrowings: defineTable({
    userId: v.id("users"),
    bookId: v.id("books"),
    copyId: v.optional(v.string()), // ID konkrétnej kópie knihy
    borrowedAt: v.number(),
    dueDate: v.number(),
    returnedAt: v.optional(v.number()),
    status: v.union(
      v.literal("active"),
      v.literal("returned"),
      v.literal("overdue"),
      v.literal("lost")
    ),
    renewedCount: v.number(),
    lastRenewedAt: v.optional(v.number()),
    fineAmount: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_book", ["bookId"])
    .index("by_status", ["status"])
    .index("by_due_date", ["dueDate"])
    .index("by_user_and_status", ["userId", "status"]),

  // Notifikácie
  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("borrow_due"),
      v.literal("reservation_ready"),
      v.literal("fine_issued"),
      v.literal("membership_expiry"),
      v.literal("system"),
      v.literal("promotional")
    ),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
    channel: v.union(
      v.literal("email"),
      v.literal("sms"),
      v.literal("push"),
      v.literal("in_app")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("read"),
      v.literal("failed")
    ),
    sentAt: v.optional(v.number()),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"])
    .index("by_user_and_status", ["userId", "status"]),

  // Aktivita používateľov
  userActivities: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("login"),
      v.literal("logout"),
      v.literal("borrow"),
      v.literal("return"),
      v.literal("reserve"),
      v.literal("cancel_reservation"),
      v.literal("search"),
      v.literal("view_book"),
      v.literal("profile_update"),
      v.literal("payment")
    ),
    description: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    metadata: v.optional(v.any()),
    occurredAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"])
    .index("by_date", ["occurredAt"])
    .index("by_user_and_type", ["userId", "type"]),
});