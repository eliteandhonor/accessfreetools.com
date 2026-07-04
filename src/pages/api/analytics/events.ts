import type { APIRoute } from 'astro';
import { isAnalyticsAdminToken, recordAnalyticsEvent, summarizeAnalytics, type AnalyticsPayload } from '../../../lib/siteAnalytics';

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

export const POST: APIRoute = async ({ clientAddress, request }) => {
  let payload: AnalyticsPayload;

  try {
    payload = (await request.json()) as AnalyticsPayload;
  } catch {
    return jsonResponse({ ok: false, message: 'Analytics event was not readable.' }, 400);
  }

  try {
    const result = await recordAnalyticsEvent(payload, request, clientAddress);
    return jsonResponse({ ok: true, ...result }, result.ignored ? 202 : 201);
  } catch (error) {
    console.error('Analytics event failed', error instanceof Error ? error.message : 'Unknown error');
    return jsonResponse({ ok: false, message: 'Analytics event could not be stored.' }, 500);
  }
};

export const GET: APIRoute = async ({ request }) => {
  const token = request.headers.get('x-aft-analytics-token') ?? '';

  if (!isAnalyticsAdminToken(token)) {
    return jsonResponse({ ok: false, message: 'Analytics token required.' }, 401);
  }

  const summary = await summarizeAnalytics();
  return jsonResponse({ ok: true, summary });
};
