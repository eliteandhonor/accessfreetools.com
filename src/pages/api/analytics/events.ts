import type { APIRoute } from 'astro';
import {
  isAnalyticsAdminToken,
  isAnalyticsRequestRateLimited,
  recordAnalyticsEvent,
  summarizeAnalytics,
  type AnalyticsPayload,
} from '../../../lib/siteAnalytics';

export const prerender = false;
const MAX_ANALYTICS_REQUEST_BYTES = 8192;

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'application/json',
    },
  });
}

async function readAnalyticsPayload(request: Request) {
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_ANALYTICS_REQUEST_BYTES) {
    return { ok: false as const, status: 413, message: 'Analytics event was too large.' };
  }

  const reader = request.body?.getReader();
  if (!reader) return { ok: false as const, status: 400, message: 'Analytics event was not readable.' };

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_ANALYTICS_REQUEST_BYTES) {
      await reader.cancel().catch(() => {});
      return { ok: false as const, status: 413, message: 'Analytics event was too large.' };
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return {
      ok: true as const,
      payload: JSON.parse(new TextDecoder().decode(body)) as AnalyticsPayload,
    };
  } catch {
    return { ok: false as const, status: 400, message: 'Analytics event was not readable.' };
  }
}

export const POST: APIRoute = async ({ clientAddress, request }) => {
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      const hostname = new URL(origin).hostname;
      if (!['accessfreetools.com', 'www.accessfreetools.com', '127.0.0.1', 'localhost'].includes(hostname)) {
        return jsonResponse({ ok: false, message: 'Analytics origin was not accepted.' }, 403);
      }
    } catch {
      return jsonResponse({ ok: false, message: 'Analytics origin was not accepted.' }, 403);
    }
  }

  if (isAnalyticsRequestRateLimited(request, clientAddress)) {
    return jsonResponse({ ok: false, message: 'Too many analytics events.' }, 429);
  }

  const parsed = await readAnalyticsPayload(request);
  if (!parsed.ok) return jsonResponse({ ok: false, message: parsed.message }, parsed.status);
  const payload = parsed.payload;

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
