/**
 * Central cache configuration for all tRPC routers.
 *
 * CACHE_TAGS – Next.js cache tags used with `unstable_cache` and `revalidateTag`.
 * CACHE_TTL  – Revalidation periods in seconds for server-side caches.
 * CLIENT_STALE_TIME – TanStack Query staleTime in milliseconds (client-side).
 */

export const CACHE_TAGS = {
	books: "books",
	authors: "authors",
	categories: "categories",
	notifications: "notifications",
	orders: "book-orders",
	settings: "settings",
	entra: "entra-users",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/** Server-side revalidation periods (seconds). */
export const CACHE_TTL = {
	books: 60, // 1 min – changes on borrow/return events
	authors: 300, // 5 min – infrequent changes
	categories: 300, // 5 min – infrequent changes
	notifications: 30, // 30 s  – near-real-time
	orders: 60, // 1 min
	settings: 120, // 2 min
	entra: 600, // 10 min – external Microsoft Graph API
} as const;

/** Client-side staleTime values (milliseconds) for TanStack Query. */
export const CLIENT_STALE_TIME = {
	books: 60 * 1000,
	authors: 5 * 60 * 1000,
	categories: 5 * 60 * 1000,
	notifications: 30 * 1000,
	orders: 60 * 1000,
	settings: 2 * 60 * 1000,
	entra: 10 * 60 * 1000,
} as const;
