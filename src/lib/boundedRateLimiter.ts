const MAX_BUCKETS = 4096;
const MAX_KEY_LENGTH = 256;
const MAX_EXPIRED_PER_ACCESS = 16;

// Returns null when admitted, otherwise a positive Retry-After in seconds.
export function createBoundedRateLimiter(limit: number, windowMs: number) {
  if (!Number.isSafeInteger(limit) || limit <= 0 || !Number.isSafeInteger(windowMs) || windowMs <= 0) {
    throw new RangeError('Rate limiter allowance and window must be positive safe integers.');
  }

  const buckets = new Map<string, { count: number; resetAt: number }>();
  const fullWindowRetry = Math.max(1, Math.ceil(windowMs / 1000));
  let lastNow = 0;

  return (key: unknown, time: number): number | null => {
    if (typeof key !== 'string' || !key.length || key.length > MAX_KEY_LENGTH || /[\s\u0000-\u001f\u007f]/u.test(key)
      || !Number.isSafeInteger(time) || time < 0 || time > Number.MAX_SAFE_INTEGER - windowMs) {
      return fullWindowRetry;
    }

    // A fixed window and nondecreasing clock keep insertion order in expiry order.
    // Clock rollback must not admit requests early or move a new expiry before older ones.
    const now = Math.max(time, lastNow);
    lastNow = now;
    let current = buckets.get(key);
    let expired = 0;
    if (current && current.resetAt <= now) {
      buckets.delete(key);
      current = undefined;
      expired++;
    }

    const entries = buckets.entries();
    let oldest = entries.next().value;
    while (oldest && oldest[1].resetAt <= now && expired < MAX_EXPIRED_PER_ACCESS) {
      buckets.delete(oldest[0]);
      expired++;
      oldest = entries.next().value;
    }

    if (current) {
      if (current.count < limit) {
        current.count++;
        return null;
      }
      return Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    }

    if (buckets.size >= MAX_BUCKETS) {
      // No active eviction or overflow identity allocation. A full Map has an oldest entry.
      return Math.max(1, Math.ceil((oldest![1].resetAt - now) / 1000));
    }

    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  };
}
