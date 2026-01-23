import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { 
  CreateBookInput, 
  CreateBookSchema, 
  GetBooksQuery, 
  GetBooksQuerySchema, 
  UpdateBookInput, 
  UpdateBookSchema,
} from "types/bookTypes";
import { validateWithZod, createSearchableText } from "helpers/backendHelpers";

interface BookWithRelations extends Doc<"books"> {
  author: Doc<"authors">;
  category: Doc<"categories">;
  coverFile: Doc<"files"> | null; // Pridané
}

// Pridané nové rozhranie pre getAll query
interface BookWithAllRelations extends Doc<"books"> {
  author: Doc<"authors">;
  category: Doc<"categories">;
  coverFile: Doc<"files"> | null;
}

export const create = mutation({
  args: {
    title: v.string(),
    authorId: v.id("authors"),
    isbn: v.optional(v.string()),
    description: v.optional(v.string()),
    coverFileId: v.optional(v.id("files")),
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
    // Konvertovať Convex ID na string pre validáciu
    const dataForValidation = {
      ...args,
      authorId: args.authorId as string,
      categoryId: args.categoryId as string,
      coverFileId: args.coverFileId as string,
    };

    // Validácia vstupu
    const validatedData: CreateBookInput = validateWithZod(CreateBookSchema, dataForValidation);
    
    const now = Date.now();
    
    // Skontrolovať či autor existuje
    const author = await ctx.db.get(args.authorId);
    if (!author) {
      throw new ConvexError("Autor neexistuje");
    }
    
    // Skontrolovať či kategória existuje
    const category = await ctx.db.get(args.categoryId);
    if (!category) {
      throw new ConvexError("Kategória neexistuje");
    }
    
    // Vytvoriť searchable text
    const searchableText = createSearchableText({
      title: validatedData.title,
      author: author.name,
      isbn: validatedData.isbn,
      description: validatedData.description,
      publisher: validatedData.publisher,
      tags: validatedData.tags,
    });
    
    // Vytvoriť knihu
    const bookId = await ctx.db.insert("books", {
      title: validatedData.title,
      authorId: args.authorId,
      isbn: validatedData.isbn,
      description: validatedData.description,
      coverFileId: args.coverFileId,
      publishedYear: validatedData.publishedYear,
      publisher: validatedData.publisher,
      pages: validatedData.pages,
      language: validatedData.language,
      categoryId: args.categoryId,
      totalCopies: validatedData.totalCopies,
      availableCopies: validatedData.totalCopies,
      location: validatedData.location,
      tags: validatedData.tags || [],
      status: validatedData.status,
      addedAt: now,
      updatedAt: now,
      searchableText,
    });

    // Update file entity reference if cover was provided
    if (args.coverFileId) {
      await ctx.db.patch(args.coverFileId, {
        entityType: "book_cover",
        entityId: bookId,
      });
    }

    // Aktualizovať počet kníh autora
    const authorBooks = await ctx.db
      .query("books")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .collect();
    
    await ctx.db.patch(args.authorId, {
      bookCount: authorBooks.length,
      updatedAt: now,
    });

    // Aktualizovať počet kníh v kategórii
    const categoryBooks = await ctx.db
      .query("books")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .collect();
    
    await ctx.db.patch(args.categoryId, {
      bookCount: categoryBooks.length,
      updatedAt: now,
    });

    return bookId;
  },
});

export const update = mutation({
  args: {
    id: v.id("books"),
    title: v.optional(v.string()),
    authorId: v.optional(v.id("authors")),
    isbn: v.optional(v.string()),
    description: v.optional(v.string()),
    coverFileId: v.optional(v.id("files")),
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
    
    // Skontrolovať či kniha existuje
    const existingBook = await ctx.db.get(id);
    if (!existingBook) {
      throw new ConvexError("Kniha neexistuje");
    }
    
    // Pripraviť dáta pre validáciu
    const validationData: Record<string, unknown> = { ...updateData };
    if (updateData.authorId) {
      validationData.authorId = updateData.authorId as string;
    }
    if (updateData.categoryId) {
      validationData.categoryId = updateData.categoryId as string;
    }
    if (updateData.coverFileId) {
      validationData.coverFileId = updateData.coverFileId as string;
    }
    
    // Validácia vstupu
    const validatedData: UpdateBookInput = validateWithZod(UpdateBookSchema, validationData);
    
    const now = Date.now();
    
    // Ak sa mení autor
    if (validatedData.authorId && validatedData.authorId !== existingBook.authorId) {
      const newAuthor = await ctx.db.get(validatedData.authorId as Id<"authors">);
      if (!newAuthor) {
        throw new ConvexError("Nový autor neexistuje");
      }
      
      // Aktualizovať počty
      const [oldAuthorBooks, newAuthorBooks] = await Promise.all([
        ctx.db.query("books").withIndex("by_author", (q) => q.eq("authorId", existingBook.authorId)).collect(),
        ctx.db.query("books").withIndex("by_author", (q) => q.eq("authorId", validatedData.authorId as Id<"authors">)).collect(),
      ]);
      
      await Promise.all([
        ctx.db.patch(existingBook.authorId, {
          bookCount: Math.max(0, oldAuthorBooks.length - 1),
          updatedAt: now,
        }),
        ctx.db.patch(validatedData.authorId as Id<"authors">, {
          bookCount: newAuthorBooks.length,
          updatedAt: now,
        }),
      ]);
    }
    
    // Ak sa mení kategória
    if (validatedData.categoryId && validatedData.categoryId !== existingBook.categoryId) {
      const newCategory = await ctx.db.get(validatedData.categoryId as Id<"categories">);
      if (!newCategory) {
        throw new ConvexError("Nová kategória neexistuje");
      }
      
      // Aktualizovať počty
      const [oldCategoryBooks, newCategoryBooks] = await Promise.all([
        ctx.db.query("books").withIndex("by_category", (q) => q.eq("categoryId", existingBook.categoryId)).collect(),
        ctx.db.query("books").withIndex("by_category", (q) => q.eq("categoryId", validatedData.categoryId as Id<"categories">)).collect(),
      ]);
      
      await Promise.all([
        ctx.db.patch(existingBook.categoryId, {
          bookCount: Math.max(0, oldCategoryBooks.length - 1),
          updatedAt: now,
        }),
        ctx.db.patch(validatedData.categoryId as Id<"categories">, {
          bookCount: newCategoryBooks.length,
          updatedAt: now,
        }),
      ]);
    }
    
    // Vytvoriť nový searchable text ak je potreba
    let searchableText = existingBook.searchableText;
    const needsNewSearchableText = 
      validatedData.title !== undefined ||
      validatedData.isbn !== undefined ||
      validatedData.description !== undefined ||
      validatedData.publisher !== undefined ||
      validatedData.tags !== undefined;
    
    if (needsNewSearchableText) {
      const authorId = (validatedData.authorId as Id<"authors">) || existingBook.authorId;
      const author = await ctx.db.get(authorId);
      searchableText = createSearchableText({
        title: validatedData.title ?? existingBook.title,
        author: author?.name ?? "",
        isbn: validatedData.isbn ?? existingBook.isbn,
        description: validatedData.description ?? existingBook.description,
        publisher: validatedData.publisher ?? existingBook.publisher,
        tags: validatedData.tags ?? existingBook.tags,
      });
    }
    
    // Pripraviť polia pre update
    const updateFields: Record<string, unknown> = {
      updatedAt: now,
      searchableText,
    };
    
    // Pridať iba zmenené polia
    if (validatedData.title !== undefined) updateFields.title = validatedData.title;
    if (validatedData.authorId !== undefined) updateFields.authorId = validatedData.authorId as Id<"authors">;
    if (validatedData.isbn !== undefined) updateFields.isbn = validatedData.isbn;
    if (validatedData.description !== undefined) updateFields.description = validatedData.description;
    if (validatedData.coverFileId !== undefined) updateFields.coverFileId = validatedData.coverFileId as Id<"files">;
    if (validatedData.publishedYear !== undefined) updateFields.publishedYear = validatedData.publishedYear;
    if (validatedData.publisher !== undefined) updateFields.publisher = validatedData.publisher;
    if (validatedData.pages !== undefined) updateFields.pages = validatedData.pages;
    if (validatedData.language !== undefined) updateFields.language = validatedData.language;
    if (validatedData.categoryId !== undefined) updateFields.categoryId = validatedData.categoryId as Id<"categories">;
    if (validatedData.totalCopies !== undefined) updateFields.totalCopies = validatedData.totalCopies;
    if (validatedData.availableCopies !== undefined) updateFields.availableCopies = validatedData.availableCopies;
    if (validatedData.location !== undefined) updateFields.location = validatedData.location;
    if (validatedData.tags !== undefined) updateFields.tags = validatedData.tags;
    if (validatedData.status !== undefined) updateFields.status = validatedData.status;
    
    await ctx.db.patch(id, updateFields);

    // Update file entity reference if cover file changed
    if (validatedData.coverFileId !== undefined) {
      // Remove old file reference
      if (existingBook.coverFileId && existingBook.coverFileId !== validatedData.coverFileId) {
        await ctx.db.patch(existingBook.coverFileId, {
          entityType: "other",
          entityId: undefined,
        });
      }

      // Add new file reference
      if (validatedData.coverFileId) {
        await ctx.db.patch(validatedData.coverFileId as Id<"files">, {
          entityType: "book_cover",
          entityId: id,
        });
      }
    }
    
    return id;
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args): Promise<BookWithRelations | null> => {
    // Skúsiť konvertovať na Convex ID
    try {
      const bookId = args.id as Id<"books">;
      const book = await ctx.db.get(bookId);
      if (!book) return null;
      
      const [author, category, coverFile] = await Promise.all([
        ctx.db.get(book.authorId),
        ctx.db.get(book.categoryId),
        book.coverFileId ? ctx.db.get(book.coverFileId) : Promise.resolve(null),
      ]);
      
      if (!author || !category) {
        return null;
      }
      
      return {
        ...book,
        author,
        category,
        coverFile,
      };
    } catch (error) {
      // Ak nie je validné Convex ID, vrátiť null
      return null;
    }
  },
});

export const getWithCover = query({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    const book = await ctx.db.get(args.id);
    if (!book) {
      return null;
    }

    // Fetch author, category and cover file if it exists
    const [author, category, coverFile] = await Promise.all([
      ctx.db.get(book.authorId),
      ctx.db.get(book.categoryId),
      book.coverFileId ? ctx.db.get(book.coverFileId) : Promise.resolve(null),
    ]);

    if (!author || !category) {
      return null;
    }

    return {
      ...book,
      author,
      category,
      coverFile,
    };
  },
});

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
  handler: async (ctx, args): Promise<BookWithAllRelations[]> => { // Zmenený return type
    // Pripraviť query parametre pre validáciu
    const validationData: Record<string, unknown> = {};
    if (args.categoryId) validationData.categoryId = args.categoryId as string;
    if (args.authorId) validationData.authorId = args.authorId as string;
    if (args.status) validationData.status = args.status;
    if (args.search) validationData.search = args.search;
    if (args.limit) validationData.limit = args.limit;
    if (args.offset) validationData.offset = args.offset;

    const queryParams: GetBooksQuery = validateWithZod(GetBooksQuerySchema, validationData);
    
    let books: Doc<"books">[] = [];
    
    // Aplikovať filtre
    if (queryParams.categoryId) {
      books = await ctx.db
        .query("books")
        .withIndex("by_category", (q) => 
          q.eq("categoryId", queryParams.categoryId as Id<"categories">)
        )
        .order("desc")
        .collect();
    } else if (queryParams.authorId) {
      books = await ctx.db
        .query("books")
        .withIndex("by_author", (q) => 
          q.eq("authorId", queryParams.authorId as Id<"authors">)
        )
        .order("desc")
        .collect();
    } else if (queryParams.status) {
      books = await ctx.db
        .query("books")
        .withIndex("by_status", (q) => 
          q.eq("status", queryParams.status!)
        )
        .order("desc")
        .collect();
    } else if (queryParams.search) {
      books = await ctx.db
        .query("books")
        .withSearchIndex("search_books", (q) =>
          q.search("searchableText", queryParams.search!.toLowerCase())
        )
        .collect();
    } else {
      books = await ctx.db
        .query("books")
        .order("desc")
        .collect();
    }
    
    // Paginácia
    const start = queryParams.offset || 0;
    const end = start + (queryParams.limit || 20);
    const paginatedBooks = books.slice(start, end);
    
    // Získať autorov a kategórie (a cover files)
    const booksWithRelations: BookWithAllRelations[] = await Promise.all(
      paginatedBooks.map(async (book) => {
        const [author, category, coverFile] = await Promise.all([
          ctx.db.get(book.authorId),
          ctx.db.get(book.categoryId),
          book.coverFileId ? ctx.db.get(book.coverFileId) : Promise.resolve(null),
        ]);
        
        return {
          ...book,
          author: author || {
            _id: book.authorId,
            name: "Neznámy autor",
            bookCount: 0,
            createdAt: 0,
            updatedAt: 0,
            searchableText: "",
          } as Doc<"authors">,
          category: category || {
            _id: book.categoryId,
            name: "Neznáma kategória",
            slug: "",
            bookCount: 0,
            isActive: true,
            createdAt: 0,
            updatedAt: 0,
            searchableText: "",
          } as Doc<"categories">,
          coverFile,
        };
      })
    );
    
    return booksWithRelations;
  },
});

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
    
    // Remove file entity reference if cover exists
    if (book.coverFileId) {
      await ctx.db.patch(book.coverFileId, {
        entityType: "other",
        entityId: undefined,
      });
    }
    
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
      .take(args.limit || 20);
    
    return books;
  },
});

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
      .collect();
    
    return results;
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allBooks = await ctx.db.query("books").collect();
    
    const totalBooks = allBooks.length;
    const availableBooks = allBooks.filter(b => b.status === "available").length;
    const reservedBooks = allBooks.filter(b => b.status === "reserved").length;
    const totalCopies = allBooks.reduce((sum, book) => sum + book.totalCopies, 0);
    const availableCopies = allBooks.reduce((sum, book) => sum + book.availableCopies, 0);
    
    const categories = await ctx.db.query("categories").collect();
    const authors = await ctx.db.query("authors").collect();
    
    return {
      totalBooks,
      availableBooks,
      reservedBooks,
      totalCopies,
      availableCopies,
      categories: categories.length,
      authors: authors.length,
    };
  },
});