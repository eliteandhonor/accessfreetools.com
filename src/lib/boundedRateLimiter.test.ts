import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBoundedRateLimiter } from './boundedRateLimiter';

afterEach(() => vi.restoreAllMocks());

describe('bounded fixed-window rate limiter', () => {
  it.each([[60, 60_000], [5, 900_000]])('keeps the %i-request fixed window of %ims', (limit, windowMs) => {
    const check = createBoundedRateLimiter(limit, windowMs);
    for (let i = 0; i < limit; i++) expect(check('identity', 100)).toBeNull();
    expect(check('identity', 100)).toBe(windowMs / 1000);
    expect(check('identity', windowMs + 99)).toBe(1);
    expect(check('identity', windowMs + 100)).toBeNull();
  });

  it('retains at most 4096 keys and never creates overflow buckets or resets live quotas', () => {
    const check = createBoundedRateLimiter(5, 900_000);
    const set = vi.spyOn(Map.prototype, 'set');
    for (let i = 0; i < 4096; i++) expect(check(`key-${i}`, 0)).toBeNull();
    const buckets = set.mock.contexts[0] as Map<string, { count: number; resetAt: number }>;
    const deleteBucket = vi.spyOn(buckets, 'delete');
    set.mockClear();
    for (let i = 4096; i < 8192; i++) expect(check(`key-${i}`, 0)).toBe(900);
    expect(buckets.size).toBe(4096);
    expect(set).not.toHaveBeenCalled();
    expect(deleteBucket).not.toHaveBeenCalled();
    for (const key of ['key-0', 'key-4095']) {
      for (let i = 1; i < 5; i++) expect(check(key, 0)).toBeNull();
      expect(check(key, 0)).toBe(900);
    }
  });

  it('does not allocate buckets or coerce invalid keys', () => {
    const check = createBoundedRateLimiter(5, 900_000);
    const coerce = vi.fn(() => 'identity');
    const set = vi.spyOn(Map.prototype, 'set');
    for (const key of [null, undefined, 42, {}, { toString: coerce }, '', ' ', '\t', 'a\u0000b', 'a\u007fb', 'a'.repeat(257)]) {
      expect(check(key, 0)).toBe(900);
    }
    expect(set).not.toHaveBeenCalled();
    expect(coerce).not.toHaveBeenCalled();
    expect(check('a'.repeat(256), 0)).toBeNull();
    expect(set).toHaveBeenCalledTimes(1);
  });

  it('saturates denied counters at the allowance without changing expiry', () => {
    const check = createBoundedRateLimiter(5, 900_000);
    const set = vi.spyOn(Map.prototype, 'set');
    for (let i = 0; i < 5; i++) expect(check('identity', 0)).toBeNull();
    const bucket = set.mock.calls[0][1];
    for (let i = 0; i < 10_000; i++) expect(check('identity', 1234)).toBe(899);
    expect(bucket).toEqual({ count: 5, resetAt: 900_000 });
    expect(set).toHaveBeenCalledTimes(1);
  });

  it('removes at most 16 expired entries per access, including a requested late entry', () => {
    const check = createBoundedRateLimiter(5, 1000);
    const set = vi.spyOn(Map.prototype, 'set');
    for (let i = 0; i < 4096; i++) check(`old-${i}`, 0);
    const buckets = set.mock.contexts[0] as Map<string, { count: number; resetAt: number }>;
    const remove = vi.spyOn(buckets, 'delete');
    expect(check('old-4095', 1000)).toBeNull();
    expect(remove).toHaveBeenCalledTimes(16);
    expect(buckets.size).toBe(4081);
    for (let i = 0; i < 255; i++) {
      remove.mockClear();
      check('sweep', 1000);
      expect(remove.mock.calls.length).toBeLessThanOrEqual(16);
    }
    expect([...buckets.keys()]).toEqual(['old-4095', 'sweep']);
  });

  it('checks only the oldest entry per full overflow request and keeps expiry order on renewal', () => {
    const check = createBoundedRateLimiter(5, 1000);
    const set = vi.spyOn(Map.prototype, 'set');
    check('first', 0);
    for (let i = 1; i < 4096; i++) check(`later-${i}`, 500);
    const buckets = set.mock.contexts[0] as Map<string, { count: number; resetAt: number }>;
    const originalEntries = buckets.entries.bind(buckets);
    let reads = 0;
    vi.spyOn(buckets, 'entries').mockImplementation(() => {
      const iterator = originalEntries();
      const next = iterator.next.bind(iterator);
      iterator.next = () => { reads++; return next(); };
      return iterator;
    });
    for (let i = 0; i < 100; i++) expect(check(`overflow-${i}`, 999)).toBe(1);
    expect(reads).toBe(100);
    expect(check('first', 1000)).toBeNull();
    expect(check('overflow', 1000)).toBe(1);
    expect(buckets.keys().next().value).toBe('later-1');
    expect(buckets.get('later-1')).toEqual({ count: 1, resetAt: 1500 });
  });

  it('does not reset quotas or disorder expiries when the supplied clock moves backward', () => {
    const check = createBoundedRateLimiter(1, 1000);
    expect(check('first', 1000)).toBeNull();
    expect(check('second', 500)).toBeNull();
    expect(check('first', 0)).toBe(1);
    expect(check('second', 1999)).toBe(1);
    expect(check('second', 2000)).toBeNull();
  });

  it('fails closed on non-finite or unsafe time without creating buckets or poisoning the clock', () => {
    const check = createBoundedRateLimiter(5, 900_000);
    const set = vi.spyOn(Map.prototype, 'set');
    for (const now of [NaN, Infinity, -Infinity, -1, 1.5, Number.MAX_SAFE_INTEGER]) {
      expect(check('identity', now)).toBe(900);
    }
    expect(set).not.toHaveBeenCalled();
    expect(check('identity', 0)).toBeNull();
  });

  it('starts empty for each new limiter without shared counters or timers', () => {
    const first = createBoundedRateLimiter(1, 1000);
    expect(first('identity', 0)).toBeNull();
    expect(first('identity', 0)).toBe(1);
    const second = createBoundedRateLimiter(1, 1000);
    expect(second('identity', 0)).toBeNull();
    expect(first('identity', 0)).toBe(1);
  });

  it.each([[0, 1000], [Infinity, 1000], [1.5, 1000], [5, 0], [5, NaN], [5, 1.5]])(
    'rejects invalid internal allowance/window values %s/%s', (limit, windowMs) => {
      expect(() => createBoundedRateLimiter(limit, windowMs)).toThrow(RangeError);
    },
  );
});
