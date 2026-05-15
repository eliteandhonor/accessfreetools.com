import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import type { APIRoute } from 'astro';
import { isAnalyticsAdminToken } from '../../../lib/siteAnalytics';

export const prerender = false;

const AGENT_TOOL_KINDS = ['ask-audit', 'api-ready', 'mcp-smoke', 'link-helper', 'seo-console', 'content-quality'];

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'application/json',
    },
  });
}

function unixPath(value: string) {
  return value.replace(/\\/g, '/');
}

function readJson(path: string) {
  if (!existsSync(path)) return null;

  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
  } catch (error) {
    return { parseError: error instanceof Error ? error.message : String(error) };
  }
}

export const GET: APIRoute = ({ request }) => {
  const token = request.headers.get('x-aft-analytics-token') ?? new URL(request.url).searchParams.get('token') ?? '';

  if (!isAnalyticsAdminToken(token)) {
    return jsonResponse({ ok: false, message: 'Admin analytics token required.' }, 401);
  }

  const outputRoot = resolve('output', 'agent-tools');
  const reports = AGENT_TOOL_KINDS.map((kind) => {
    const jsonPath = join(outputRoot, kind, 'latest.json');
    const markdownPath = join(outputRoot, kind, 'latest.md');
    const report = readJson(jsonPath);

    return {
      generatedAt: report?.generatedAt ?? null,
      jsonPath: existsSync(jsonPath) ? unixPath(relative(process.cwd(), jsonPath)) : '',
      kind,
      markdownPath: existsSync(markdownPath) ? unixPath(relative(process.cwd(), markdownPath)) : '',
      report,
      status: typeof report?.status === 'string' ? report.status : 'not-run',
      updatedAt: existsSync(jsonPath) ? new Date(statSync(jsonPath).mtimeMs).toISOString() : null,
    };
  });

  return jsonResponse({
    ok: true,
    reports,
  });
};

