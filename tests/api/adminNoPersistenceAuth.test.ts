import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/lib/adminAgentReports', () => ({
  AGENT_TOOL_KINDS: ['route'], readAgentToolReports: vi.fn(() => []),
  refreshAgentToolReports: vi.fn(async () => []),
}));
vi.mock('../../src/lib/siteAnalytics', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/lib/siteAnalytics')>();
  return { ...actual, summarizeAnalytics: vi.fn(async () => ({ generatedAt: '2026-09-06T12:00:00Z' })) };
});

import { readAgentToolReports, refreshAgentToolReports } from '../../src/lib/adminAgentReports';
import { summarizeAnalytics } from '../../src/lib/siteAnalytics';
import { GET as analyticsGet } from '../../src/pages/api/analytics/events';
import { GET as agentGet, POST as agentPost } from '../../src/pages/api/admin/agent-tools';

const token = 'synthetic-admin-auth-only';
const routes = [
  { name: 'analytics GET', path: '/api/analytics/events', method: 'GET', handler: analyticsGet },
  { name: 'agent GET', path: '/api/admin/agent-tools', method: 'GET', handler: agentGet },
  { name: 'agent POST', path: '/api/admin/agent-tools', method: 'POST', handler: agentPost },
];

beforeEach(() => {
  // Set both aliases so real authorization never falls back to private config files.
  vi.stubEnv('AFT_ANALYTICS_TOKEN', token);
  vi.stubEnv('ADMIN_ANALYTICS_TOKEN', token);
  vi.clearAllMocks();
});
afterEach(() => vi.unstubAllEnvs());

describe('unchanged admin header authorization with synthetic data adapters', () => {
  for (const route of routes) {
    it.each(['missing', 'wrong', 'query', 'cookie', 'bearer', 'query-and-wrong-header'])('%s cannot authorize ' + route.name, async (mode) => {
      const headers: Record<string, string> = {};
      if (mode.includes('wrong')) headers['x-aft-analytics-token'] = 'synthetic-wrong';
      if (mode === 'cookie') headers.cookie = `access-free-tools-analytics-token=${token}`;
      if (mode === 'bearer') headers.authorization = `Bearer ${token}`;
      const query = mode.includes('query') ? `?token=${token}` : '';
      const response = await route.handler({ request: new Request(`https://admin-fixture.invalid${route.path}${query}`, {
        method: route.method, headers,
      }) } as never);
      expect(response.status).toBe(401);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(response.headers.get('set-cookie')).toBeNull();
      expect(await response.text()).not.toContain(token);
      expect(summarizeAnalytics).not.toHaveBeenCalled();
      expect(readAgentToolReports).not.toHaveBeenCalled();
      expect(refreshAgentToolReports).not.toHaveBeenCalled();
    });

    it('accepts only the explicit header and keeps no-store for ' + route.name, async () => {
      const response = await route.handler({ request: new Request(`https://admin-fixture.invalid${route.path}?token=wrong`, {
        method: route.method, headers: { 'x-aft-analytics-token': token },
      }) } as never);
      expect(response.status).toBe(200);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(response.headers.get('set-cookie')).toBeNull();
      expect(await response.text()).not.toContain(token);
      if (route.method === 'POST') expect(refreshAgentToolReports).toHaveBeenCalledOnce();
    });
  }
});
