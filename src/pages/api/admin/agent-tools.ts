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
  return request.headers.get('x-aft-analytics-token') ?? '';
}

function parseKind(value: unknown): AgentToolKind | 'all' {
  if (value === 'all' || value === undefined || value === null || value === '') return 'all';
  if (typeof value === 'string' && AGENT_TOOL_KINDS.includes(value as AgentToolKind)) return value as AgentToolKind;
  return 'all';
}

function requestOrigin(request: Request) {
  return new URL(request.url).origin;
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

  let body: { claim?: unknown; kind?: unknown; lane?: unknown; slug?: unknown; task?: unknown; verifyUrls?: unknown } = {};
  try {
    body = (await request.json()) as {
      claim?: unknown;
      kind?: unknown;
      lane?: unknown;
      slug?: unknown;
      task?: unknown;
      verifyUrls?: unknown;
    };
  } catch {
    body = {};
  }

  const origin = requestOrigin(request);
  const refreshed = await refreshAgentToolReports({
    inputs: {
      claim: body.claim,
      lane: body.lane,
      slug: body.slug,
      task: body.task,
      verifyUrls: body.verifyUrls,
    },
    kind: parseKind(body.kind),
    origin,
  });

  return jsonResponse({
    ok: true,
    refreshed,
    reports: readAgentToolReports(),
  });
};
