import { ConvexError } from "convex/values";
import { GenericMutationCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";

/**
 * Jednoduchý rate limiter založený na databáze pre Convex.
 * @param ctx Convex kontext
 * @param key Unikátny kľúč (napr. "user_id:create_category")
 * @param limit Maximálny počet požiadaviek
 * @param windowMs Časové okno v milisekundách
 */
export async function checkRateLimit(
  ctx: GenericMutationCtx<DataModel>,
  key: string,
  limit: number,
  windowMs: number
) {
  const now = Date.now();
  const rateLimit = await ctx.db
    .query("rateLimits")
    .withIndex("by_key", (q) => q.eq("key", key))
    .unique();

  if (!rateLimit) {
    // Prvá požiadavka pre tento kľúč
    await ctx.db.insert("rateLimits", {
      key,
      count: 1,
      lastRequest: now,
      resetAt: now + windowMs,
    });
    return;
  }

  if (now > rateLimit.resetAt) {
    // Okno uplynulo, resetujeme počítadlo
    await ctx.db.patch(rateLimit._id, {
      count: 1,
      lastRequest: now,
      resetAt: now + windowMs,
    });
    return;
  }

  if (rateLimit.count >= limit) {
    throw new ConvexError({
      message: "Príliš veľa požiadaviek. Prosím, skúste to neskôr.",
      code: "RATE_LIMIT_EXCEEDED",
      resetAt: rateLimit.resetAt,
    });
  }

  // Zvýšime počítadlo
  await ctx.db.patch(rateLimit._id, {
    count: rateLimit.count + 1,
    lastRequest: now,
  });
}
