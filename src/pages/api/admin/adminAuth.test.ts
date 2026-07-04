import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GET as agentToolsGet } from './agent-tools';
import { GET as analyticsGet } from '../analytics/events';

function getRequest(url: string, headers?: HeadersInit) {
  return new Request(url, { headers });
}

describe('admin API authentication', () => {
  beforeEach(() => {
    process.env.AFT_ANALYTICS_TOKEN = 'test-admin-token';
  });

  afterEach(() => {
    delete process.env.AFT_ANALYTICS_TOKEN;
  });

  it('accepts analytics admin tokens from headers, not query strings', async () => {
    const queryTokenResponse = await analyticsGet({
      request: getRequest('https://accessfreetools.com/api/analytics/events?token=test-admin-token'),
    } as never);
    expect(queryTokenResponse.status).toBe(401);

    const headerTokenResponse = await analyticsGet({
      request: getRequest('https://accessfreetools.com/api/analytics/events', {
        'x-aft-analytics-token': 'test-admin-token',
      }),
    } as never);
    expect(headerTokenResponse.status).toBe(200);
  });

  it('accepts agent-tool admin tokens from headers, not query strings', async () => {
    const queryTokenResponse = await agentToolsGet({
      request: getRequest('https://accessfreetools.com/api/admin/agent-tools?token=test-admin-token'),
    } as never);
    expect(queryTokenResponse.status).toBe(401);

    const headerTokenResponse = await agentToolsGet({
      request: getRequest('https://accessfreetools.com/api/admin/agent-tools', {
        'x-aft-analytics-token': 'test-admin-token',
      }),
    } as never);
    expect(headerTokenResponse.status).toBe(200);
  });
});
