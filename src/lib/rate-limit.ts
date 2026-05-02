import { LRUCache } from "lru-cache";

type RateLimiterOptions = {
	max: number; // Max requests per window
	windowMs: number; // Window size in milliseconds
};

export class RateLimiter {
	private cache: LRUCache<string, { count: number; expiresAt: number }>;
	private max: number;
	private windowMs: number;

	constructor(options: RateLimiterOptions) {
		this.max = options.max;
		this.windowMs = options.windowMs;
		this.cache = new LRUCache({
			max: 5000, // Max 5000 unique keys to prevent memory leaks
			ttl: options.windowMs,
		});
	}

	/**
	 * Checks if the request is allowed based on the rate limit.
	 * @param identifier A unique string identifying the requester (e.g., IP address or User ID)
	 * @returns Object indicating success and remaining requests
	 */
	limit(
		identifier: string,
	): { success: boolean; limit: number; remaining: number } {
		const now = Date.now();
		const record = this.cache.get(identifier);

		if (!record) {
			this.cache.set(identifier, { count: 1, expiresAt: now + this.windowMs });
			return { success: true, limit: this.max, remaining: this.max - 1 };
		}

		if (now > record.expiresAt) {
			// Window expired, reset
			this.cache.set(identifier, { count: 1, expiresAt: now + this.windowMs });
			return { success: true, limit: this.max, remaining: this.max - 1 };
		}

		const newCount = record.count + 1;
		this.cache.set(identifier, {
			count: newCount,
			expiresAt: record.expiresAt,
		});

		const remaining = Math.max(0, this.max - newCount);
		return { success: newCount <= this.max, limit: this.max, remaining };
	}
}

// Default global instances
export const defaultRateLimiter = new RateLimiter({
	max: 100, // 100 requests per minute
	windowMs: 60 * 1000,
});

export const strictRateLimiter = new RateLimiter({
	max: 20, // 20 requests per minute (for sensitive actions)
	windowMs: 60 * 1000,
});
