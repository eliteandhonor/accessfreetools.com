import { getApiBetaToken } from './privateEnv';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 60;
const METADATA_CACHE_SECONDS = 300;
const METADATA_STALE_WHILE_REVALIDATE_SECONDS = 600;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export function jsonResponse(body: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'application/json',
      ...headers,
    },
  });
}

export function cacheableMetadataJsonResponse(body: unknown, status = 200, space?: number) {
  return new Response(JSON.stringify(body, null, space), {
    status,
    headers: {
      'cache-control': `public, max-age=${METADATA_CACHE_SECONDS}, stale-while-revalidate=${METADATA_STALE_WHILE_REVALIDATE_SECONDS}`,
      'content-type': 'application/json',
    },
  });
}

type MetadataCacheOptions = {
  maxAge: number;
  swr: number;
  tags: string[];
};

export function setMetadataCache(cache: { enabled?: boolean; set?: (options: MetadataCacheOptions) => void } | undefined) {
  if (!cache?.enabled || typeof cache.set !== 'function') return;

  cache.set({
    maxAge: METADATA_CACHE_SECONDS,
    swr: METADATA_STALE_WHILE_REVALIDATE_SECONDS,
    tags: ['api-metadata'],
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

  if (headerToken === betaToken || bearerToken === betaToken) {
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
