import { defineMiddleware } from 'astro:middleware';
import { getRedirectedBlogGuidePath } from './data/blogGuideCanonicals';

const CANONICAL_HOST = 'accessfreetools.com';
const WWW_HOST = `www.${CANONICAL_HOST}`;
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

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  const legacyTarget = LEGACY_REDIRECTS.get(normalizeLegacyPath(url.pathname));
  const duplicateBlogTarget = getRedirectedBlogGuidePath(url.pathname);

  if (url.hostname.toLowerCase() === WWW_HOST) {
    url.hostname = CANONICAL_HOST;
    url.protocol = 'https:';
    return context.redirect(url.toString(), 301);
  }

  if (legacyTarget && url.hostname.toLowerCase() === CANONICAL_HOST) {
    url.pathname = legacyTarget;
    url.protocol = 'https:';
    return context.redirect(url.toString(), 301);
  }

  if (duplicateBlogTarget && url.hostname.toLowerCase() === CANONICAL_HOST) {
    url.pathname = duplicateBlogTarget;
    url.protocol = 'https:';
    return context.redirect(url.toString(), 301);
  }

  return next();
});
