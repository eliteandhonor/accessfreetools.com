import type { APIRoute } from 'astro';
import {
  AGENT_TOOL_KINDS,
  readAgentToolReports,
  refreshAgentToolReports,
  type AgentToolKind,
} from '../../../lib/adminAgentReports';
import { isAnalyticsAdminToken } from '../../../lib/siteAnalytics';

export const prerender = false;

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'application/json',
    },
  });
}

function getToken(request: Request) {
  return request.headers.get('x-aft-analytics-token') ?? new URL(request.url).searchParams.get('token') ?? '';
}

function parseKind(value: unknown): AgentToolKind | 'all' {
  if (value === 'all' || value === undefined || value === null || value === '') return 'all';
  if (typeof value === 'string' && AGENT_TOOL_KINDS.includes(value as AgentToolKind)) return value as AgentToolKind;
  return 'all';
}

export const GET: APIRoute = ({ request }) => {
  if (!isAnalyticsAdminToken(getToken(request))) {
    return jsonResponse({ ok: false, message: 'Admin analytics token required.' }, 401);
  }

  return jsonResponse({
    ok: true,
    reports: readAgentToolReports(),
  });
};

export const POST: APIRoute = async ({ request }) => {
  if (!isAnalyticsAdminToken(getToken(request))) {
    return jsonResponse({ ok: false, message: 'Admin analytics token required.' }, 401);
  }

  let body: { kind?: unknown } = {};
  try {
    body = (await request.json()) as { kind?: unknown };
  } catch {
    body = {};
  }

  const origin = new URL(request.url).origin;
  const refreshed = await refreshAgentToolReports({ kind: parseKind(body.kind), origin });

  return jsonResponse({
    ok: true,
    refreshed,
    reports: readAgentToolReports(),
  });
};
