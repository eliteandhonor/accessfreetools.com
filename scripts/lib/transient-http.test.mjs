import { describe, expect, it } from 'vitest';
import {
  fetchWithTransientRetry,
  isSameUrlRedirect,
  isTransientHttpStatus,
} from './transient-http.mjs';

describe('transient HTTP helpers', () => {
  it('recognizes gateway responses without treating rate limits as gateways', () => {
    expect(isTransientHttpStatus(502)).toBe(true);
    expect(isTransientHttpStatus(503)).toBe(true);
    expect(isTransientHttpStatus(504)).toBe(true);
    expect(isTransientHttpStatus(429)).toBe(false);
  });

  it('recognizes only redirects that resolve to the same URL', () => {
    const url = 'https://accessfreetools.com/sitemap.xml';

    expect(isSameUrlRedirect(new Response('', {
      headers: { location: '/sitemap.xml' },
      status: 307,
    }), url)).toBe(true);
    expect(isSameUrlRedirect(new Response('', {
      headers: { location: '/tools/' },
      status: 307,
    }), url)).toBe(false);
    expect(isSameUrlRedirect(new Response('', { status: 200 }), url)).toBe(false);
  });

  it('retries a transient response and reports how many attempts were needed', async () => {
    const statuses = [504, 200];
    const result = await fetchWithTransientRetry(
      'https://accessfreetools.com/sitemap.xml',
      {},
      {
        fetchImpl: async () => new Response('', { status: statuses.shift() }),
      },
    );

    expect(result.attempts).toBe(2);
    expect(result.response.status).toBe(200);
  });
});
