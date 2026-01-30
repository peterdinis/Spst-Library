// convex/reservations.ts
import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Vytvorenie novej rezervácie
 */
export const createReservation = mutation({
  args: {
    userId: v.id("users"),
    bookId: v.id("books"),
    pickupLocation: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const book = await ctx.db.get(args.bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    // Overenie dostupnosti knihy
    if (book.availableCopies === 0) {
      // Kniha nie je dostupná, ale môže byť rezervovaná
      // Získanie počtu aktívnych rezervácií pre túto knihu
      const activeReservations = await ctx.db
        .query("reservations")
        .withIndex("by_book_and_status", (q) =>
          q.eq("bookId", args.bookId).eq("status", "pending")
        )
        .collect();

      if (activeReservations.length >= book.totalCopies * 2) {
        // Maximum 2 rezervácie na kópiu
        throw new Error("Maximum reservations reached for this book");
      }
    }

    // Overenie, či používateľ už nemá túto knihu rezervovanú
    const existingReservation = await ctx.db
      .query("reservations")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", args.userId).eq("status", "pending")
      )
      .filter((q) => q.eq(q.field("bookId"), args.bookId))
      .first();

    if (existingReservation) {
      throw new Error("You already have a pending reservation for this book");
    }

    // Výpočet priority (poradie vo fronte)
    const pendingReservations = await ctx.db
      .query("reservations")
      .withIndex("by_book_and_status", (q) =>
        q.eq("bookId", args.bookId).eq("status", "pending")
      )
      .collect();

    const priority = pendingReservations.length + 1;

    // Vytvorenie rezervácie
    const reservationId = await ctx.db.insert("reservations", {
      userId: args.userId,
      bookId: args.bookId,
      status: "pending",
      requestedAt: Date.now(),
      pickupLocation: args.pickupLocation,
      notes: args.notes,
      priority,
      metadata: {
        userEmail: user.email,
        userName: user.fullName,
        bookTitle: book.title,
        bookAuthorId: book.authorId,
      },
    });

    // Aktualizácia štatistík knihy
    await ctx.db.patch(args.bookId, {
      status: book.availableCopies > 0 ? "available" : "reserved",
    });

    // Vytvorenie notifikácie
    await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "reservation_ready",
      title: "Rezervácia vytvorená",
      message: `Rezervovali ste si knihu "${book.title}". ${book.availableCopies > 0 ? "Kniha je dostupná na vyzdvihnutie." : "Čakáte vo fronte."}`,
      data: {
        reservationId,
        bookTitle: book.title,
        priority,
        estimatedWaitTime: book.availableCopies > 0 ? 0 : pendingReservations.length * 7, // dni
      },
      channel: "in_app",
      status: "pending",
      createdAt: Date.now(),
    });

    // Aktivity log
    await ctx.db.insert("userActivities", {
      userId: args.userId,
      type: "reserve",
      description: `Reserved book: ${book.title}`,
      metadata: {
        reservationId,
        bookId: args.bookId,
        priority,
      },
      occurredAt: Date.now(),
    });

    return reservationId;
  },
});

/**
 * Potvrdenie rezervácie (pre knihovníkov)
 */
export const confirmReservation = mutation({
  args: {
    reservationId: v.id("reservations"),
    pickupDeadlineDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.reservationId);
    if (!reservation) {
      throw new Error("Reservation not found");
    }

    if (reservation.status !== "pending") {
      throw new Error(`Cannot confirm reservation in status: ${reservation.status}`);
    }

    const book = await ctx.db.get(reservation.bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    // Nastavenie deadlinu na vyzdvihnutie (default 7 dní)
    const pickupDeadline = Date.now() + (args.pickupDeadlineDays || 7) * 24 * 60 * 60 * 1000;

    // Aktualizácia rezervácie
    await ctx.db.patch(args.reservationId, {
      status: "confirmed",
      confirmedAt: Date.now(),
      pickupDeadline,
      metadata: {
        ...reservation.metadata,
        confirmedBy: "system",
      },
    });

    // Ak je kniha dostupná, označiť ako ready_for_pickup
    if (book.availableCopies > 0) {
      await ctx.db.patch(args.reservationId, {
        status: "ready_for_pickup",
        readyAt: Date.now(),
      });

      // Zníženie dostupných kópií
      await ctx.db.patch(reservation.bookId, {
        availableCopies: book.availableCopies - 1,
      });
    }

    // Notifikácia používateľovi
    await ctx.db.insert("notifications", {
      userId: reservation.userId,
      type: "reservation_ready",
      title: "Rezervácia potvrdená",
      message: `Vaša rezervácia pre "${book.title}" bola potvrdená. ${book.availableCopies > 0 ? "Kniha je pripravená na vyzdvihnutie." : "Čakáte vo fronte."}`,
      data: {
        reservationId: args.reservationId,
        bookTitle: book.title,
        pickupDeadline,
        isReady: book.availableCopies > 0,
      },
      channel: "in_app",
      status: "pending",
      createdAt: Date.now(),
    });

    return true;
  },
});

/**
 * Zrušenie rezervácie
 */
export const cancelReservation = mutation({
  args: {
    reservationId: v.id("reservations"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.reservationId);
    if (!reservation) {
      throw new Error("Reservation not found");
    }

    const book = await ctx.db.get(reservation.bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    // Môže sa zrušiť iba pending alebo confirmed rezervácia
    if (!["pending", "confirmed"].includes(reservation.status)) {
      throw new Error(`Cannot cancel reservation in status: ${reservation.status}`);
    }

    // Aktualizácia rezervácie
    await ctx.db.patch(args.reservationId, {
      status: "cancelled",
      cancelledAt: Date.now(),
      cancelledReason: args.reason,
    });

    // Ak bola kniha pripravená na vyzdvihnutie, vrátiť kópiu
    if (reservation.status === "ready_for_pickup") {
      await ctx.db.patch(reservation.bookId, {
        availableCopies: book.availableCopies + 1,
      });

      // Presunúť ďalšiu rezerváciu vo fronte na vyzdvihnutie
      await processNextReservation(ctx, reservation.bookId);
    }

    // Aktualizácia priorít ostatných rezervácií
    await updateReservationPriorities(ctx, reservation.bookId);

    // Notifikácia
    await ctx.db.insert("notifications", {
      userId: reservation.userId,
      type: "system",
      title: "Rezervácia zrušená",
      message: `Vaša rezervácia pre "${book.title}" bola zrušená.`,
      data: {
        reservationId: args.reservationId,
        reason: args.reason,
      },
      channel: "in_app",
      status: "pending",
      createdAt: Date.now(),
    });

    // Aktivita
    await ctx.db.insert("userActivities", {
      userId: reservation.userId,
      type: "cancel_reservation",
      description: `Cancelled reservation for: ${book.title}`,
      metadata: {
        reservationId: args.reservationId,
        reason: args.reason,
      },
      occurredAt: Date.now(),
    });

    return true;
  },
});

/**
 * Vyzdvihnutie rezervovanej knihy (začiatok výpožičky)
 */
export const pickupReservation = mutation({
  args: {
    reservationId: v.id("reservations"),
  },
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.reservationId);
    if (!reservation) {
      throw new Error("Reservation not found");
    }

    if (reservation.status !== "ready_for_pickup") {
      throw new Error("Reservation is not ready for pickup");
    }

    const book = await ctx.db.get(reservation.bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    // Vytvorenie výpožičky
    const borrowingId = await ctx.db.insert("borrowings", {
      userId: reservation.userId,
      bookId: reservation.bookId,
      borrowedAt: Date.now(),
      dueDate: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 dní
      status: "active",
      renewedCount: 0,
      fineAmount: 0,
      metadata: {
        reservationId: args.reservationId,
        pickedUpAt: Date.now(),
      },
    });

    // Aktualizácia rezervácie
    await ctx.db.patch(args.reservationId, {
      status: "picked_up",
      pickedUpAt: Date.now(),
    });

    // Aktualizácia štatistík používateľa
    const user = await ctx.db.get(reservation.userId);
    if (user) {
      await ctx.db.patch(reservation.userId, {
        currentBorrowed: (user.currentBorrowed || 0) + 1,
        totalBorrowed: (user.totalBorrowed || 0) + 1,
      });
    }

    // Presunúť ďalšiu rezerváciu vo fronte na vyzdvihnutie
    await processNextReservation(ctx, reservation.bookId);

    // Notifikácia
    await ctx.db.insert("notifications", {
      userId: reservation.userId,
      type: "system",
      title: "Kniha vyzdvihnutá",
      message: `Úspešne ste vyzdvihli knihu "${book.title}". Vrátiť ju musíte do ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}.`,
      data: {
        reservationId: args.reservationId,
        borrowingId,
        dueDate: Date.now() + 14 * 24 * 60 * 60 * 1000,
      },
      channel: "in_app",
      status: "pending",
      createdAt: Date.now(),
    });

    // Schedule borrowing email
    const userEmail = user?.email;
    if (userEmail) {
      await ctx.scheduler.runAfter(0, internal.emails.sendEmail, {
        to: userEmail,
        subject: `Kniha vyzdvihnutá: ${book.title}`,
        text: `Dobrý deň ${user?.firstName},\n\núspešne ste vyzdvihli knihu "${book.title}". Termín na vrátenie je ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}.\n\nPríjemné čítanie,\nSPŠT Knižnica`,
        html: `<p>Dobrý deň <strong>${user?.firstName}</strong>,</p><p>úspešne ste vyzdvihli knihu "<strong>${book.title}</strong>".</p><p>Termín na vrátenie je <strong>${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</strong>.</p><p>Príjemné čítanie,<br>SPŠT Knižnica</p>`,
      });
    }

    return borrowingId;
  },
});

/**
 * Získanie rezervácií používateľa
 */
export const getUserReservations = query({
  args: {
    userId: v.id("users"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("ready_for_pickup"),
        v.literal("picked_up"),
        v.literal("cancelled"),
        v.literal("expired")
      )
    ),
    includeBookDetails: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("reservations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    const reservations = await query.collect();

    if (args.includeBookDetails) {
      const reservationsWithDetails = await Promise.all(
        reservations.map(async (reservation) => {
          const book = await ctx.db.get(reservation.bookId);
          const author = book ? await ctx.db.get(book.authorId) : null;
          
          return {
            ...reservation,
            book: {
              id: book?._id,
              title: book?.title,
              author: author?.name,
              coverImageUrl: book?.coverImageUrl,
              availableCopies: book?.availableCopies,
            },
            estimatedWaitTime: await calculateWaitTime(ctx, reservation),
          };
        })
      );

      return reservationsWithDetails;
    }

    return reservations;
  },
});

/**
 * Získanie všetkých rezervácií (pre adminov)
 */
export const getAllReservations = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("ready_for_pickup"),
        v.literal("picked_up"),
        v.literal("cancelled"),
        v.literal("expired")
      )
    ),
    bookId: v.optional(v.id("books")),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query;
    if (args.status) {
      query = ctx.db.query("reservations").withIndex("by_status", (q) => q.eq("status", args.status!));
    } else if (args.bookId) {
      query = ctx.db.query("reservations").withIndex("by_book", (q) => q.eq("bookId", args.bookId!));
    } else {
      query = ctx.db.query("reservations").withIndex("by_requested_at");
    }

    const reservations = await query.order("desc").collect();

    // Paginácia
    const start = args.offset || 0;
    const end = args.limit ? start + args.limit : undefined;
    const paginatedReservations = reservations.slice(start, end);

    // Načítanie detailov
    const reservationsWithDetails = await Promise.all(
      paginatedReservations.map(async (reservation) => {
        const [user, book] = await Promise.all([
          ctx.db.get(reservation.userId),
          ctx.db.get(reservation.bookId),
        ]);

        const author = book ? await ctx.db.get(book.authorId) : null;

        return {
          ...reservation,
          user: {
            id: user?._id,
            name: user?.fullName,
            email: user?.email,
            membershipType: user?.membershipType,
          },
          book: {
            id: book?._id,
            title: book?.title,
            author: author?.name,
            isbn: book?.isbn,
          },
        };
      })
    );

    // Štatistiky
    const stats = {
      total: reservations.length,
      byStatus: {} as Record<string, number>,
      byBook: {} as Record<string, number>,
    };

    reservations.forEach(reservation => {
      stats.byStatus[reservation.status] = (stats.byStatus[reservation.status] || 0) + 1;
      stats.byBook[reservation.bookId] = (stats.byBook[reservation.bookId] || 0) + 1;
    });

    return {
      reservations: reservationsWithDetails,
      pagination: {
        total: reservations.length,
        page: Math.floor(start / (args.limit || reservations.length)) + 1,
        limit: args.limit || reservations.length,
        hasMore: end ? reservations.length > end : false,
      },
      stats,
    };
  },
});

/**
 * Vymazanie všetkých rezervácií (pre čistenie)
 */
export const deleteAllReservations = mutation({
  args: {
    confirm: v.boolean(),
    olderThan: v.optional(v.number()), // timestamp
    status: v.optional(
      v.union(
        v.literal("cancelled"),
        v.literal("expired"),
        v.literal("picked_up")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (!args.confirm) {
      throw new Error("Please confirm deletion");
    }

    let query;
    if (args.olderThan) {
      query = ctx.db.query("reservations").withIndex("by_requested_at", (q) => q.lt("requestedAt", args.olderThan!));
    } else {
      query = ctx.db.query("reservations");
    }

    const allReservations = await query.collect();
    
    let reservationsToDelete = allReservations;
    if (args.status) {
      reservationsToDelete = allReservations.filter(r => r.status === args.status);
    }

    // Vymazanie
    for (const reservation of reservationsToDelete) {
      await ctx.db.delete(reservation._id);
    }

    return {
      deletedCount: reservationsToDelete.length,
      message: `Deleted ${reservationsToDelete.length} reservations`,
    };
  },
});

/**
 * Kontrola expirovaných rezervácií (cron job)
 */
export const checkExpiredReservations = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredReservations = await ctx.db
      .query("reservations")
      .withIndex("by_status", (q) => q.eq("status", "ready_for_pickup"))
      .filter((q) => q.neq(q.field("pickupDeadline"), undefined))
      .filter((q) => q.lt(q.field("pickupDeadline"), now))
      .collect();

    let expiredCount = 0;
    let cancelledCount = 0;

    for (const reservation of expiredReservations) {
      // Zrušiť expirovanú rezerváciu
      await ctx.db.patch(reservation._id, {
        status: "expired",
        cancelledAt: now,
        cancelledReason: "Pickup deadline expired",
      });

      // Vrátiť kópiu knihy
      const book = await ctx.db.get(reservation.bookId);
      if (book) {
        await ctx.db.patch(reservation.bookId, {
          availableCopies: book.availableCopies + 1,
        });
      }

      // Notifikácia používateľovi
      await ctx.db.insert("notifications", {
        userId: reservation.userId,
        type: "system",
        title: "Rezervácia expirovala",
        message: "Vaša rezervácia expirovala, pretože ste si knihu nevyzdvihli v stanovenom čase.",
        data: {
          reservationId: reservation._id,
        },
        channel: "in_app",
        status: "pending",
        createdAt: now,
      });

      expiredCount++;

      // Presunúť ďalšiu rezerváciu
      const nextReservation = await getNextPendingReservation(ctx, reservation.bookId);
      if (nextReservation) {
        await ctx.db.patch(nextReservation._id, {
          status: "ready_for_pickup",
          readyAt: now,
          pickupDeadline: now + 7 * 24 * 60 * 60 * 1000,
        });

        // Znížiť dostupné kópie
        if (book) {
          await ctx.db.patch(reservation.bookId, {
            availableCopies: book.availableCopies - 1,
          });
        }

        cancelledCount++;
      }
    }

    return {
      expiredCount,
      cancelledCount,
      nextReservationsProcessed: cancelledCount,
    };
  },
});

// Pomocné funkcie
async function processNextReservation(ctx: any, bookId: any) {
  const nextReservation = await getNextPendingReservation(ctx, bookId);
  if (!nextReservation) return;

  const book = await ctx.db.get(bookId);
  if (!book || book.availableCopies === 0) return;

  // Aktualizácia nasledujúcej rezervácie
  await ctx.db.patch(nextReservation._id, {
    status: "ready_for_pickup",
    readyAt: Date.now(),
    pickupDeadline: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 dní
  });

  // Zníženie dostupných kópií
  await ctx.db.patch(bookId, {
    availableCopies: book.availableCopies - 1,
  });

  // Notifikácia používateľovi
  await ctx.db.insert("notifications", {
    userId: nextReservation.userId,
    type: "reservation_ready",
    title: "Rezervácia pripravená",
    message: "Vaša rezervovaná kniha je pripravená na vyzdvihnutie.",
    data: {
      reservationId: nextReservation._id,
      pickupDeadline: Date.now() + 7 * 24 * 60 * 60 * 1000,
    },
    channel: "in_app",
    status: "pending",
    createdAt: Date.now(),
  });
}

async function getNextPendingReservation(ctx: any, bookId: any) {
  const pendingReservations = await ctx.db
    .query("reservations")
    .withIndex("by_book_and_status", (q: any) =>
      q.eq("bookId", bookId).eq("status", "pending")
    )
    .order("asc")
    .first();

  return pendingReservations;
}

async function updateReservationPriorities(ctx: any, bookId: any) {
  const pendingReservations = await ctx.db
    .query("reservations")
    .withIndex("by_book_and_status", (q: any) =>
      q.eq("bookId", bookId).eq("status", "pending")
    )
    .order("asc")
    .collect();

  for (let i = 0; i < pendingReservations.length; i++) {
    await ctx.db.patch(pendingReservations[i]._id, {
      priority: i + 1,
    });
  }
}

async function calculateWaitTime(ctx: any, reservation: any) {
  if (reservation.status === "ready_for_pickup") return 0;

  const book = await ctx.db.get(reservation.bookId);
  if (!book) return null;

  if (book.availableCopies > 0) return 0;

  // Počet rezervácií pred touto
  const reservationsBefore = await ctx.db
    .query("reservations")
    .withIndex("by_book_and_status", (q: any) =>
      q.eq("bookId", reservation.bookId).eq("status", "pending")
    )
    .filter((q: any) => q.lt(q.field("priority"), reservation.priority || 0))
    .collect();

  // Odhad: priemer 7 dní na rezerváciu
  return reservationsBefore.length * 7;
}

/**
 * Získanie štatistík rezervácií
 */
export const getReservationStats = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const allReservations = await ctx.db
      .query("reservations")
      .withIndex("by_requested_at")
      .collect();

    const filteredReservations = allReservations.filter(reservation => {
      if (args.startDate && reservation.requestedAt < args.startDate) return false;
      if (args.endDate && reservation.requestedAt > args.endDate) return false;
      return true;
    });

    const stats = {
      totalReservations: filteredReservations.length,
      byStatus: {} as Record<string, number>,
      byMonth: {} as Record<string, number>,
      averageWaitTime: 0,
      pickupRate: 0,
      cancellationRate: 0,
    };

    let totalWaitTime = 0;
    let pickedUpCount = 0;
    let cancelledCount = 0;

    filteredReservations.forEach(reservation => {
      // Štatistiky podľa stavu
      stats.byStatus[reservation.status] = (stats.byStatus[reservation.status] || 0) + 1;

      // Štatistiky podľa mesiaca
      const date = new Date(reservation.requestedAt);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      stats.byMonth[monthKey] = (stats.byMonth[monthKey] || 0) + 1;

      // Časové štatistiky
      if (reservation.readyAt && reservation.requestedAt) {
        totalWaitTime += (reservation.readyAt - reservation.requestedAt) / (24 * 60 * 60 * 1000); // v dňoch
      }

      if (reservation.status === "picked_up") pickedUpCount++;
      if (reservation.status === "cancelled") cancelledCount++;
    });

    if (filteredReservations.length > 0) {
      stats.averageWaitTime = totalWaitTime / filteredReservations.length;
      stats.pickupRate = (pickedUpCount / filteredReservations.length) * 100;
      stats.cancellationRate = (cancelledCount / filteredReservations.length) * 100;
    }

    return stats;
  },
});

/**
 * Získanie výpožičiek používateľa
 */
export const getUserBorrowings = query({
  args: {
    userId: v.id("users"),
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("returned"),
        v.literal("overdue"),
        v.literal("lost")
      )
    ),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("borrowings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    const borrowings = await query.collect();

    // Filter by status if provided
    const filteredBorrowings = args.status
      ? borrowings.filter((b) => b.status === args.status)
      : borrowings;

    // Fetch book and author details for each borrowing
    const borrowingsWithDetails = await Promise.all(
      filteredBorrowings.map(async (borrowing) => {
        const book = await ctx.db.get(borrowing.bookId);
        const author = book ? await ctx.db.get(book.authorId) : null;

        return {
          ...borrowing,
          book: book
            ? {
                _id: book._id,
                title: book.title,
                coverImageUrl: book.coverImageUrl,
                isbn: book.isbn,
              }
            : null,
          author: author
            ? {
                _id: author._id,
                name: author.name,
              }
            : null,
        };
      })
    );

    return borrowingsWithDetails;
  },
});

/**
 * Vrátenie knihy
 */
export const returnBook = mutation({
  args: {
    borrowingId: v.id("borrowings"),
  },
  handler: async (ctx, args) => {
    const borrowing = await ctx.db.get(args.borrowingId);
    if (!borrowing) {
      throw new Error("Borrowing not found");
    }

    if (borrowing.status === "returned") {
      throw new Error("Book already returned");
    }

    const now = Date.now();
    const isOverdue = borrowing.dueDate < now;

    // Aktualizácia stavu výpožičky
    await ctx.db.patch(args.borrowingId, {
      status: "returned",
      returnedAt: now,
    });

    // Aktualizácia knihy
    const book = await ctx.db.get(borrowing.bookId);
    if (book) {
      await ctx.db.patch(borrowing.bookId, {
        availableCopies: book.availableCopies + 1,
        status: "available",
      });

      // Spracovanie nasledujúcej rezervácie
      await processNextReservation(ctx, borrowing.bookId);
    }

    // Aktualizácia štatistík používateľa
    const user = await ctx.db.get(borrowing.userId);
    if (user) {
      await ctx.db.patch(borrowing.userId, {
        currentBorrowed: Math.max(0, (user.currentBorrowed || 0) - 1),
      });
    }

    // Notifikácia
    await ctx.db.insert("notifications", {
      userId: borrowing.userId,
      type: "system",
      title: "Kniha vrátená",
      message: `Kniha "${book?.title || "neznáma"}" bola úspešne vrátená.`,
      channel: "in_app",
      status: "pending",
      createdAt: now,
    });

    // Schedule return email
    if (user?.email) {
      await ctx.scheduler.runAfter(0, internal.emails.sendEmail, {
        to: user.email,
        subject: `Kniha vrátená: ${book?.title || "neznáma"}`,
        text: `Dobrý deň ${user.firstName},\n\nkniha "${book?.title || "neznáma"}" bola úspešne vrátená. Ďakujeme!\n\nS pozdravom,\nSPŠT Knižnica`,
        html: `<p>Dobrý deň <strong>${user.firstName}</strong>,</p><p>kniha "<strong>${book?.title || "neznáma"}</strong>" bola úspešne vrátená. Ďakujeme!</p><p>S pozdravom,<br>SPŠT Knižnica</p>`,
      });
    }

    // Aktivita
    await ctx.db.insert("userActivities", {
      userId: borrowing.userId,
      type: "return",
      description: `Returned book: ${book?.title || "unknown"}`,
      metadata: {
        borrowingId: args.borrowingId,
        bookId: borrowing.bookId,
      },
      occurredAt: now,
    });

    return true;
  },
});

/**
 * Predĺženie výpožičky
 */
export const renewBook = mutation({
  args: {
    borrowingId: v.id("borrowings"),
  },
  handler: async (ctx, args) => {
    const borrowing = await ctx.db.get(args.borrowingId);
    if (!borrowing) {
      throw new Error("Borrowing not found");
    }

    if (borrowing.status !== "active") {
      throw new Error("Only active borrowings can be renewed");
    }

    if ((borrowing.renewedCount || 0) >= 3) {
      throw new Error("Maximum renewal limit reached (3)");
    }

    // Skontrolovať či nie je kniha rezervovaná niekým iným
    const hasActiveReservations = await ctx.db
      .query("reservations")
      .withIndex("by_book_and_status", (q) =>
        q.eq("bookId", borrowing.bookId).eq("status", "pending")
      )
      .first();

    if (hasActiveReservations) {
      throw new Error("Cannot renew: book has pending reservations");
    }

    const now = Date.now();
    const newDueDate = borrowing.dueDate + 14 * 24 * 60 * 60 * 1000; // +14 dní

    await ctx.db.patch(args.borrowingId, {
      dueDate: newDueDate,
      renewedCount: (borrowing.renewedCount || 0) + 1,
      lastRenewedAt: now,
    });

    const book = await ctx.db.get(borrowing.bookId);

    // Notifikácia
    await ctx.db.insert("notifications", {
      userId: borrowing.userId,
      type: "system",
      title: "Výpožička predĺžená",
      message: `Výpožička knihy "${book?.title || "neznáma"}" bola predĺžená do ${new Date(newDueDate).toLocaleDateString()}.`,
      channel: "in_app",
      status: "pending",
      createdAt: now,
    });

    // Aktivita
    await ctx.db.insert("userActivities", {
      userId: borrowing.userId,
      type: "borrow",
      description: `Renewed book: ${book?.title || "unknown"}`,
      metadata: {
        borrowingId: args.borrowingId,
        bookId: borrowing.bookId,
        newDueDate,
      },
      occurredAt: now,
    });

    return true;
  },
});