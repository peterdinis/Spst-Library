import { v } from "convex/values";
import { query, mutation, internalMutation} from "./_generated/server";

/**
 * INTERNAL: Vytvorenie notifikácie
 */
export const create = internalMutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      data: args.data,
      channel: args.channel,
      status: "pending",
      createdAt: Date.now(),
    });

    return notificationId;
  },
});

/**
 * INTERNAL: Hromadné vytvorenie notifikácií
 */
export const bulkCreate = internalMutation({
  args: {
    notifications: v.array(
      v.object({
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
      })
    ),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    const notificationIds = [];

    for (const notification of args.notifications) {
      const id = await ctx.db.insert("notifications", {
        ...notification,
        status: "pending",
        createdAt: timestamp,
      });
      notificationIds.push(id);
    }

    return notificationIds;
  },
});

/**
 * Získanie notifikácií pre používateľa
 */
export const getUserNotifications = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("sent"),
        v.literal("delivered"),
        v.literal("read"),
        v.literal("failed")
      )
    ),
    channel: v.optional(
      v.union(
        v.literal("email"),
        v.literal("sms"),
        v.literal("push"),
        v.literal("in_app")
      )
    ),
    type: v.optional(
      v.union(
        v.literal("borrow_due"),
        v.literal("reservation_ready"),
        v.literal("fine_issued"),
        v.literal("membership_expiry"),
        v.literal("system"),
        v.literal("promotional")
      )
    ),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    if (args.channel) {
      query = query.filter((q) => q.eq(q.field("channel"), args.channel));
    }

    if (args.type) {
      query = query.filter((q) => q.eq(q.field("type"), args.type));
    }

    const notifications = await (args.limit ? query.take(args.limit) : query.collect());

    // Načítajte používateľské informácie pre každú notifikáciu
    const notificationsWithUsers = await Promise.all(
      notifications.map(async (notification) => {
        const user = await ctx.db.get(notification.userId);
        return {
          ...notification,
          user: {
            id: user?._id,
            name: user?.fullName,
            email: user?.email,
          },
        };
      })
    );

    return notificationsWithUsers;
  },
});

/**
 * Získanie neprečítaných notifikácií pre používateľa
 */
export const getUnreadNotifications = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => 
        q.or(
          q.eq(q.field("status"), "delivered"),
          q.eq(q.field("status"), "pending")
        )
      )
      .filter((q) => q.eq(q.field("readAt"), undefined))
      .order("desc")
      .take(args.limit || 50);

    return notifications;
  },
});

/**
 * Získanie štatistík notifikácií pre používateľa
 */
export const getNotificationStats = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const allNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const stats = {
      total: allNotifications.length,
      unread: allNotifications.filter(n => !n.readAt).length,
      byType: {} as Record<string, number>,
      byChannel: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
    };

    allNotifications.forEach(notification => {
      stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
      stats.byChannel[notification.channel] = (stats.byChannel[notification.channel] || 0) + 1;
      stats.byStatus[notification.status] = (stats.byStatus[notification.status] || 0) + 1;
    });

    return stats;
  },
});

/**
 * Označenie notifikácie ako prečítanej
 */
export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    await ctx.db.patch(args.notificationId, {
      status: "read",
      readAt: Date.now(),
    });

    return true;
  },
});

/**
 * Hromadné označenie notifikácií ako prečítaných
 */
export const markAllAsRead = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", args.userId).eq("status", "delivered")
      )
      .filter((q) => q.eq(q.field("readAt"), undefined))
      .collect();

    const timestamp = Date.now();
    for (const notification of notifications) {
      await ctx.db.patch(notification._id, {
        status: "read",
        readAt: timestamp,
      });
    }

    return notifications.length;
  },
});

/**
 * Označenie notifikácie ako odoslanej
 */
export const markAsSent = internalMutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      status: "sent",
      sentAt: Date.now(),
    });

    return true;
  },
});

/**
 * Označenie notifikácie ako doručenej
 */
export const markAsDelivered = internalMutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      status: "delivered",
    });

    return true;
  },
});

/**
 * Označenie notifikácie ako zlyhanej
 */
export const markAsFailed = internalMutation({
  args: {
    notificationId: v.id("notifications"),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      status: "failed",
      data: {
        ...(await ctx.db.get(args.notificationId))?.data,
        error: args.error,
      },
    });

    return true;
  },
});

/**
 * Vymazanie notifikácie
 */
export const remove = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.notificationId);
    return true;
  },
});

/**
 * Vymazanie všetkých starých notifikácií
 */
export const cleanupOldNotifications = internalMutation({
  args: {
    olderThanDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const cutoffDate = Date.now() - (args.olderThanDays || 90) * 24 * 60 * 60 * 1000;
    
    const oldNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_created_at", (q) => q.lt("createdAt", cutoffDate))
      .collect();

    let deletedCount = 0;
    for (const notification of oldNotifications) {
      await ctx.db.delete(notification._id);
      deletedCount++;
    }

    return deletedCount;
  },
});

/**
 * INTERNAL: Získanie notifikácie
 */
export const get = internalMutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.notificationId);
  },
});

/**
 * INTERNAL: Získanie čakajúcich notifikácií
 */
export const getPending = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

/**
 * Vytvorenie notifikácie o splatnosti výpožičky
 */
export const createBorrowDueNotification = internalMutation({
  args: {
    userId: v.id("users"),
    borrowingId: v.id("borrowings"),
    bookTitle: v.string(),
    dueDate: v.number(),
    daysRemaining: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // Skontrolujte, či používateľ chce tieto notifikácie
    if (!user.preferences?.notifications?.email) {
      return null;
    }

    const title = "Kniha sa blíži k dátumu splatnosti";
    const message = `Kniha "${args.bookTitle}" má dátum splatnosti ${new Date(args.dueDate).toLocaleDateString()}. Zostáva ${args.daysRemaining} dní.`;

    return await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "borrow_due",
      title,
      message,
      data: {
        borrowingId: args.borrowingId,
        bookTitle: args.bookTitle,
        dueDate: args.dueDate,
        daysRemaining: args.daysRemaining,
      },
      channel: "email",
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

/**
 * Vytvorenie notifikácie o pokute
 */
export const createFineNotification = internalMutation({
  args: {
    userId: v.id("users"),
    borrowingId: v.id("borrowings"),
    bookTitle: v.string(),
    fineAmount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const title = "Nová pokuta";
    const message = `Máte novú pokutu vo výške ${args.fineAmount} € za knihu "${args.bookTitle}". Dôvod: ${args.reason}`;

    return await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "fine_issued",
      title,
      message,
      data: {
        borrowingId: args.borrowingId,
        bookTitle: args.bookTitle,
        fineAmount: args.fineAmount,
        reason: args.reason,
      },
      channel: user.preferences?.notifications?.sms ? "sms" : "in_app",
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

/**
 * Vytvorenie notifikácie o expirácii členstva
 */
export const createMembershipExpiryNotification = internalMutation({
  args: {
    userId: v.id("users"),
    expiryDate: v.number(),
    daysRemaining: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const title = "Členstvo expiruje čoskoro";
    const message = `Vaše členstvo v knižnici expiruje ${new Date(args.expiryDate).toLocaleDateString()}. Zostáva ${args.daysRemaining} dní.`;

    return await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "membership_expiry",
      title,
      message,
      data: {
        expiryDate: args.expiryDate,
        daysRemaining: args.daysRemaining,
      },
      channel: "email",
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

/**
 * Vytvorenie systémovej notifikácie
 */
export const createSystemNotification = internalMutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    return await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "system",
      title: args.title,
      message: args.message,
      data: args.data,
      channel: "in_app",
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

/**
 * Vytvorenie promo notifikácie
 */
export const createPromotionalNotification = internalMutation({
  args: {
    userIds: v.array(v.id("users")),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    const notificationIds = [];

    for (const userId of args.userIds) {
      const user = await ctx.db.get(userId);
      if (!user) continue;

      // Skontrolujte, či používateľ chce promo notifikácie
      if (user.preferences?.notifications?.email === false) {
        continue;
      }

      const id = await ctx.db.insert("notifications", {
        userId,
        type: "promotional",
        title: args.title,
        message: args.message,
        data: args.data,
        channel: "email",
        status: "pending",
        createdAt: timestamp,
      });
      notificationIds.push(id);
    }

    return notificationIds;
  },
});