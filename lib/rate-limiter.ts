/**
 * Rate limiter ini menggunakan in-memory Map dan hanya efektif untuk
 * single-instance server. Untuk production multi-instance, upgrade ke
 * Upstash Redis menggunakan package @upstash/ratelimit.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

interface RateLimitResult {
  allowed: boolean;
  retryAfter: number; // seconds until the window resets; 0 if allowed
}

// Module-level Map — persists across requests within the same server process
const store = new Map<string, RateLimitEntry>();

/**
 * Check whether a request identified by `key` is within the allowed rate.
 *
 * @param key      - Unique identifier, e.g. "magic-link:email@test.com" or "admin-login:192.168.1.1"
 * @param limit    - Maximum number of requests allowed within the window
 * @param windowMs - Window duration in milliseconds (e.g. 15 * 60 * 1000 for 15 minutes)
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // No existing entry, or the previous window has expired → start a fresh window
  if (!entry || now - entry.windowStart >= windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, retryAfter: 0 };
  }

  // Still within the current window
  if (entry.count < limit) {
    entry.count += 1;
    store.set(key, entry);
    return { allowed: true, retryAfter: 0 };
  }

  // Limit exceeded — calculate seconds until the window resets
  const windowEndsAt = entry.windowStart + windowMs;
  const retryAfter = Math.ceil((windowEndsAt - now) / 1000);
  return { allowed: false, retryAfter };
}