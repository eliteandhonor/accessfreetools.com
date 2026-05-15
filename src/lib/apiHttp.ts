import { getApiBetaToken } from './privateEnv';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 60;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'application/json',
    },
  });
}

export async function readJsonBody(request: Request) {
  try {
    return (await request.json()) as unknown;
  } catch {
    throw new Error('Request body must be valid JSON.');
  }
}

export function checkApiAccess(request: Request) {
  const betaToken = getApiBetaToken();
  if (!betaToken) return null;

  const headerToken = request.headers.get('x-aft-api-token') || '';
  const bearerToken = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1] || '';
  const queryToken = new URL(request.url).searchParams.get('token') || '';

  if (headerToken === betaToken || bearerToken === betaToken || queryToken === betaToken) {
    return null;
  }

  return jsonResponse(
    {
      ok: false,
      message: 'API beta token required.',
    },
    401,
  );
}

export function checkRateLimit(key: string) {
  const now = Date.now();
  const current = rateLimitBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  current.count += 1;

  if (current.count <= RATE_LIMIT_MAX) {
    return null;
  }

  return jsonResponse(
    {
      ok: false,
      message: 'Too many API requests. Try again shortly.',
    },
    429,
  );
}
