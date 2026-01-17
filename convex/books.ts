import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Typ pre návratovú hodnotu s autorom a kategóriou
interface BookWithRelations extends Doc<"books"> {
  author: Doc<"authors">;
  category: Doc<"categories">;
}

// Vytvorenie novej knihy
export const create = mutation({
  args: {
    title: v.string(),
    authorId: v.id("authors"),
    isbn: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    publishedYear: v.optional(v.number()),
    publisher: v.optional(v.string()),
    pages: v.optional(v.number()),
    language: v.optional(v.string()),
    categoryId: v.id("categories"),
    totalCopies: v.number(),
    location: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(
      v.union(
        v.literal("available"),
        v.literal("reserved"),
        v.literal("maintenance"),
        v.literal("lost")
      )
    ),
  },
  handler: async (ctx, args) => {
    // Validácia vstupu
    const validatedData: CreateBookInput = validateWithZod(CreateBookSchema, args);
    
    const now = Date.now();
    
    // Skontrolovať či autor existuje
    const author = await ctx.db.get(validatedData.authorId);
    if (!author) {
      throw new ConvexError("Autor neexistuje");
    }
    
    // Skontrolovať či kategória existuje
    const category = await ctx.db.get(validatedData.categoryId);
    if (!category) {
      throw new ConvexError("Kategória neexistuje");
    }
    
    // Vytvoriť searchable text
    const searchableText = createSearchableText({
      ...validatedData,
      author: author.name
    });
    
    // Vytvoriť knihu
    const bookId = await ctx.db.insert("books", {
      ...validatedData,
      availableCopies: validatedData.totalCopies,
      tags: validatedData.tags || [],
      addedAt: now,
      updatedAt: now,
      searchableText,
    });

    // Aktualizovať počet kníh autora
    const authorBooks = await ctx.db
      .query("books")
      .withIndex("by_author", (q) => q.eq("authorId", validatedData.authorId))
      .collect();
    
    await ctx.db.patch(validatedData.authorId, {
      bookCount: authorBooks.length + 1,
      updatedAt: now,
    });

    // Aktualizovať počet kníh v kategórii
    const categoryBooks = await ctx.db
      .query("books")
      .withIndex("by_category", (q) => q.eq("categoryId", validatedData.categoryId))
      .collect();
    
    await ctx.db.patch(validatedData.categoryId, {
      bookCount: categoryBooks.length + 1,
      updatedAt: now,
    });

    return bookId;
  },
});

// Aktualizácia existujúcej knihy
export const update = mutation({
  args: {
    id: v.id("books"),
    title: v.optional(v.string()),
    authorId: v.optional(v.id("authors")),
    isbn: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    publishedYear: v.optional(v.number()),
    publisher: v.optional(v.string()),
    pages: v.optional(v.number()),
    language: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    totalCopies: v.optional(v.number()),
    availableCopies: v.optional(v.number()),
    location: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(
      v.union(
        v.literal("available"),
        v.literal("reserved"),
        v.literal("maintenance"),
        v.literal("lost")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    
    // Validácia vstupu
    const validatedData: UpdateBookInput = validateWithZod(
      UpdateBookSchema, 
      updateData
    );
    
    // Skontrolovať či kniha existuje
    const existingBook = await ctx.db.get(id);
    if (!existingBook) {
      throw new ConvexError("Kniha neexistuje");
    }
    
    const now = Date.now();
    
    // Ak sa mení autor, skontrolovať či nový autor existuje
    if (validatedData.authorId) {
      const newAuthor = await ctx.db.get(validatedData.authorId);
      if (!newAuthor) {
        throw new ConvexError("Nový autor neexistuje");
      }
      
      // Odpočítať knihu od starého autora
      const oldAuthorBooks = await ctx.db
        .query("books")
        .withIndex("by_author", (q) => q.eq("authorId", existingBook.authorId))
        .collect();
      
      await ctx.db.patch(existingBook.authorId, {
        bookCount: Math.max(0, oldAuthorBooks.length - 1),
        updatedAt: now,
      });
      
      // Pridať knihu novému autorovi
      const newAuthorBooks = await ctx.db
        .query("books")
        .withIndex("by_author", (q) => q.eq("authorId", validatedData.authorId!))
        .collect();
      
      await ctx.db.patch(validatedData.authorId, {
        bookCount: newAuthorBooks.length + 1,
        updatedAt: now,
      });
    }
    
    // Ak sa mení kategória, skontrolovať či nová kategória existuje
    if (validatedData.categoryId) {
      const newCategory = await ctx.db.get(validatedData.categoryId);
      if (!newCategory) {
        throw new ConvexError("Nová kategória neexistuje");
      }
      
      // Odpočítať knihu od starej kategórie
      const oldCategoryBooks = await ctx.db
        .query("books")
        .withIndex("by_category", (q) => q.eq("categoryId", existingBook.categoryId))
        .collect();
      
      await ctx.db.patch(existingBook.categoryId, {
        bookCount: Math.max(0, oldCategoryBooks.length - 1),
        updatedAt: now,
      });
      
      // Pridať knihu novej kategórii
      const newCategoryBooks = await ctx.db
        .query("books")
        .withIndex("by_category", (q) => q.eq("categoryId", validatedData.categoryId!))
        .collect();
      
      await ctx.db.patch(validatedData.categoryId!, {
        bookCount: newCategoryBooks.length + 1,
        updatedAt: now,
      });
    }
    
    // Vytvoriť nový searchable text ak sa zmenil obsah
    const needsNewSearchableText = 
      validatedData.title !== undefined ||
      validatedData.isbn !== undefined ||
      validatedData.description !== undefined ||
      validatedData.publisher !== undefined ||
      validatedData.tags !== undefined;
    
    let searchableText = existingBook.searchableText;
    if (needsNewSearchableText) {
      const author = await ctx.db.get(validatedData.authorId || existingBook.authorId);
      searchableText = createSearchableText({
        ...existingBook,
        ...validatedData,
        author: author?.name || ""
      });
    }
    
    // Aktualizovať knihu
    await ctx.db.patch(id, {
      ...validatedData,
      updatedAt: now,
      searchableText,
    });
    
    return id;
  },
});

// Získať knihu podľa ID s autorom a kategóriou
export const getById = query({
  args: { id: v.id("books") },
  handler: async (ctx, args): Promise<BookWithRelations | null> => {
    const book = await ctx.db.get(args.id);
    if (!book) return null;
    
    const author = await ctx.db.get(book.authorId);
    const category = await ctx.db.get(book.categoryId);
    
    if (!author || !category) {
      throw new ConvexError("Chýbajúce dáta autora alebo kategórie");
    }
    
    return {
      ...book,
      author,
      category,
    };
  },
});

// Získať všetky knihy s filterom
export const getAll = query({
  args: {
    categoryId: v.optional(v.id("categories")),
    authorId: v.optional(v.id("authors")),
    status: v.optional(
      v.union(
        v.literal("available"),
        v.literal("reserved"),
        v.literal("maintenance"),
        v.literal("lost")
      )
    ),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Validácia query parametrov
    const queryParams: GetBooksQuery = validateWithZod(GetBooksQuerySchema, args);
    
    let query = ctx.db.query("books");
    
    // Aplikovať filtre
    if (queryParams.categoryId) {
      query = query.withIndex("by_category", (q) => 
        q.eq("categoryId", queryParams.categoryId!)
      );
    } else if (queryParams.authorId) {
      query = query.withIndex("by_author", (q) => 
        q.eq("authorId", queryParams.authorId!)
      );
    } else if (queryParams.status) {
      query = query.withIndex("by_status", (q) => 
        q.eq("status", queryParams.status!)
      );
    } else if (queryParams.search) {
      // Použiť full-text search
      const results = await ctx.db
        .query("books")
        .withSearchIndex("search_books", (q) =>
          q.search("searchableText", queryParams.search!)
        )
        .collect();
      
      return results;
    }
    
    // Získať dáta s pagináciou
    const books = await query
      .order("desc")
      .take(queryParams.limit)
      .skip(queryParams.offset)
      .collect();
    
    // Získať autorov a kategórie pre každú knihu
    const booksWithRelations = await Promise.all(
      books.map(async (book) => {
        const [author, category] = await Promise.all([
          ctx.db.get(book.authorId),
          ctx.db.get(book.categoryId),
        ]);
        
        return {
          ...book,
          author: author || { name: "Neznámy autor" } as Doc<"authors">,
          category: category || { name: "Neznáma kategória" } as Doc<"categories">,
        };
      })
    );
    
    return booksWithRelations;
  },
});

// Odstrániť knihu
export const remove = mutation({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.id);
    if (!book) {
      throw new ConvexError("Kniha neexistuje");
    }
    
    const now = Date.now();
    
    // Odpočítať knihu od autora
    const authorBooks = await ctx.db
      .query("books")
      .withIndex("by_author", (q) => q.eq("authorId", book.authorId))
      .collect();
    
    await ctx.db.patch(book.authorId, {
      bookCount: Math.max(0, authorBooks.length - 1),
      updatedAt: now,
    });
    
    // Odpočítať knihu od kategórie
    const categoryBooks = await ctx.db
      .query("books")
      .withIndex("by_category", (q) => q.eq("categoryId", book.categoryId))
      .collect();
    
    await ctx.db.patch(book.categoryId, {
      bookCount: Math.max(0, categoryBooks.length - 1),
      updatedAt: now,
    });
    
    // Odstrániť knihu
    await ctx.db.delete(args.id);
    
    // Odstrániť asociácie s kategóriami
    const bookCategories = await ctx.db
      .query("bookCategories")
      .withIndex("by_book", (q) => q.eq("bookId", args.id))
      .collect();
    
    await Promise.all(
      bookCategories.map((bc) => ctx.db.delete(bc._id))
    );
    
    return true;
  },
});

// Získať dostupné knihy
export const getAvailableBooks = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const books = await ctx.db
      .query("books")
      .withIndex("by_status", (q) => q.eq("status", "available"))
      .order("desc")
      .take(args.limit || 20)
      .skip(args.offset || 0)
      .collect();
    
    return books;
  },
});

// Získať knihy podľa kategórie
export const getByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const books = await ctx.db
      .query("books")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .order("desc")
      .collect();
    
    return books;
  },
});

// Získať knihy podľa autora
export const getByAuthor = query({
  args: { authorId: v.id("authors") },
  handler: async (ctx, args) => {
    const books = await ctx.db
      .query("books")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();
    
    return books;
  },
});

// Vyhľadať knihy
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) {
      return [];
    }
    
    const results = await ctx.db
      .query("books")
      .withSearchIndex("search_books", (q) =>
        q.search("searchableText", args.query.toLowerCase())
      )
      .take(50)
      .collect();
    
    return results;
  },
});

// Získať štatistiky
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allBooks = await ctx.db.query("books").collect();
    
    const totalBooks = allBooks.length;
    const availableBooks = allBooks.filter(b => b.status === "available").length;
    const reservedBooks = allBooks.filter(b => b.status === "reserved").length;
    const totalCopies = allBooks.reduce((sum, book) => sum + book.totalCopies, 0);
    const availableCopies = allBooks.reduce((sum, book) => sum + book.availableCopies, 0);
    
    return {
      totalBooks,
      availableBooks,
      reservedBooks,
      totalCopies,
      availableCopies,
      categories: await ctx.db.query("categories").collect().then(cats => cats.length),
      authors: await ctx.db.query("authors").collect().then(authors => authors.length),
    };
  },
});