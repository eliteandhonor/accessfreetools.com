const SAFE_METHODS = new Set(['GET', 'HEAD']);
const INTERNAL_PREFIX = /^\/(?:api|admin|mcp|\.analytics)(?:\/|$)/i;
const STATIC_PREFIX = /^\/(?:_astro|assets|fonts|images|medium|pinterest|social)(?:\/|$)/i;
const FILE_EXTENSION = /\.[a-z0-9]{2,8}(?:\/+)?$/i;

export function collapseRepeatedPublicPageSlashes(pathname: string, method: string) {
  if (!SAFE_METHODS.has(method.toUpperCase()) || !pathname.includes('//')) return null;
  if (INTERNAL_PREFIX.test(pathname) || STATIC_PREFIX.test(pathname) || FILE_EXTENSION.test(pathname)) return null;

  const collapsed = pathname.replace(/\/{2,}/g, '/');
  return collapsed === pathname ? null : collapsed;
}
