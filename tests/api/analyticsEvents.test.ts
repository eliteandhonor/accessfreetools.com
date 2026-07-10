import { describe, expect, it } from 'vitest';

import { POST as analyticsPost } from '../../src/pages/api/analytics/events';

function post(body: string, origin = 'https://accessfreetools.com') {
  return new Request('https://accessfreetools.com/api/analytics/events', {
    body,
    headers: {
      'content-type': 'application/json',
      origin,
      'user-agent': 'Mozilla/5.0 Chrome/140.0.0.0',
    },
    method: 'POST',
  });
}

describe('analytics event endpoint safeguards', () => {
  it('rejects oversized event bodies before storing them', async () => {
    const request = post(JSON.stringify({ pagePath: '/', pageTitle: 'x'.repeat(9000) }));
    const response = await analyticsPost({ clientAddress: '127.0.0.1', request } as never);

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toMatchObject({ ok: false });
  });

  it('rejects cross-origin event submissions', async () => {
    const request = post(JSON.stringify({ pagePath: '/' }), 'https://example.com');
    const response = await analyticsPost({ clientAddress: '127.0.0.1', request } as never);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ ok: false });
  });
});
