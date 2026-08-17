const SAFE_METHODS = new Set(['GET', 'HEAD']);
const INTERNAL_PREFIX = /^\/(?:api|admin|mcp|\.analytics)(?:\/|$)/i;
const STATIC_PREFIX = /^\/(?:_astro|assets|fonts|images|medium|pinterest|social)(?:\/|$)/i;
const FILE_EXTENSION = /\.[a-z0-9]{2,8}(?:\/+)?$/i;
const LEGACY_REDIRECTS = new Map([
  ['/calculators', '/categories/calculators/'],
  ['/deep-research', '/categories/ai-tools/'],
  ['/advanced-age-calculator', '/tools/age-calculator/'],
  ['/tools/love', '/tools/love-calculator/'],
  [
    '/maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025',
    '/tools/ad-revenue-calculator/',
  ],
]);

function collapseRepeatedPublicPageSlashes(pathname) {
  if (!pathname.includes('//')) return null;
  if (INTERNAL_PREFIX.test(pathname) || STATIC_PREFIX.test(pathname) || FILE_EXTENSION.test(pathname)) return null;

  const collapsed = pathname.replace(/\/{2,}/g, '/');
  return collapsed === pathname ? null : collapsed;
}

function normalizeLegacyPath(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

export function redirectLocationForRequest(requestUrl, method = 'GET') {
  if (!SAFE_METHODS.has(String(method).toUpperCase())) return null;

  const url = new URL(requestUrl || '/', 'http://localhost');
  const collapsedPath = collapseRepeatedPublicPageSlashes(url.pathname);
  const candidatePath = collapsedPath ?? url.pathname;
  const legacyTarget = LEGACY_REDIRECTS.get(normalizeLegacyPath(candidatePath));
  const destinationPath = legacyTarget ?? collapsedPath;
  return destinationPath ? `${destinationPath}${url.search}` : null;
}
