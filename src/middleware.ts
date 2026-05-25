import { defineMiddleware } from 'astro:middleware';
import { getRedirectedBlogGuidePath } from './data/blogGuideCanonicals';

const CANONICAL_HOST = 'accessfreetools.com';
const WWW_HOST = `www.${CANONICAL_HOST}`;
const HTML_CACHE_CONTROL = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';
const HSTS_HEADER = 'max-age=31536000; includeSubDomains';
const LEGACY_REDIRECTS = new Map<string, string>([
  ['/calculators', '/categories/calculators/'],
  ['/deep-research', '/categories/ai-tools/'],
  ['/advanced-age-calculator', '/tools/age-calculator/'],
  [
    '/maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025',
    '/tools/ad-revenue-calculator/',
  ],
]);

function normalizeLegacyPath(pathname: string) {
  return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function isProductionHost(url: URL) {
  const host = url.hostname.toLowerCase();
  return host === CANONICAL_HOST || host === WWW_HOST;
}

function isLocalHost(url: URL) {
  const host = url.hostname.toLowerCase();
  return host === 'localhost' || host === '::1' || host.startsWith('127.');
}

function isPagePath(pathname: string) {
  if (pathname === '/' || pathname.endsWith('/')) return false;
  if (/^\/(?:api|mcp)(?:\/|$)/i.test(pathname)) return false;
  if (/^\/(?:robots\.txt|llms\.txt|feed\.xml|sitemap(?:-[a-z]+)?\.xml)$/i.test(pathname)) return false;
  return !/\.[a-z0-9]{2,8}$/i.test(pathname);
}

function isCacheableHtmlPath(pathname: string) {
  if (/^\/(?:api|admin|mcp|\.analytics)(?:\/|$)/i.test(pathname)) return false;
  if (/^\/(?:robots\.txt|llms\.txt|feed\.xml|sitemap(?:-[a-z]+)?\.xml)$/i.test(pathname)) return false;
  if (/\.[a-z0-9]{2,8}$/i.test(pathname)) return false;
  return pathname === '/' || pathname.endsWith('/');
}

function applyResponseHeaders(response: Response, url: URL) {
  if (!isLocalHost(url)) {
    response.headers.set('Strict-Transport-Security', HSTS_HEADER);
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  if (!isLocalHost(url) && isCacheableHtmlPath(url.pathname)) {
    response.headers.set('Cache-Control', HTML_CACHE_CONTROL);
  }

  return response;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const legacyTarget = LEGACY_REDIRECTS.get(normalizeLegacyPath(url.pathname));
  const duplicateBlogTarget = getRedirectedBlogGuidePath(url.pathname);

  if (url.hostname.toLowerCase() === WWW_HOST) {
    url.hostname = CANONICAL_HOST;
    url.protocol = 'https:';
    return applyResponseHeaders(context.redirect(url.toString(), 301), url);
  }

  if (legacyTarget && url.hostname.toLowerCase() === CANONICAL_HOST) {
    url.pathname = legacyTarget;
    url.protocol = 'https:';
    return applyResponseHeaders(context.redirect(url.toString(), 301), url);
  }

  if (duplicateBlogTarget && url.hostname.toLowerCase() === CANONICAL_HOST) {
    url.pathname = duplicateBlogTarget;
    url.protocol = 'https:';
    return applyResponseHeaders(context.redirect(url.toString(), 301), url);
  }

  if (['GET', 'HEAD'].includes(context.request.method.toUpperCase()) && url.hostname.toLowerCase() === CANONICAL_HOST && isPagePath(url.pathname)) {
    url.pathname = `${url.pathname}/`;
    url.protocol = 'https:';
    return applyResponseHeaders(context.redirect(url.toString(), 301), url);
  }

  const response = await next();
  return applyResponseHeaders(response, url);
});
