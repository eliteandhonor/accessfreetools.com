import { defineMiddleware } from 'astro:middleware';

const CANONICAL_HOST = 'accessfreetools.com';
const WWW_HOST = `www.${CANONICAL_HOST}`;
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
const LEGACY_PATH_REDIRECTS = new Map([
  ['/calculators', '/categories/calculators/'],
  ['/calculators/', '/categories/calculators/'],
  ['/deep-research', '/categories/ai-tools/'],
  ['/deep-research/', '/categories/ai-tools/'],
  ['/resources', '/free-calculator-resources/'],
  ['/resources/', '/free-calculator-resources/'],
  ['/advanced-age-calculator', '/tools/age-calculator/'],
  ['/advanced-age-calculator/', '/tools/age-calculator/'],
  [
    '/maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025',
    '/tools/ad-revenue-calculator/',
  ],
  [
    '/maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025/',
    '/tools/ad-revenue-calculator/',
  ],
]);

function hostnameFromHeader(host: string) {
  if (host.startsWith('[')) {
    return host.slice(1, host.indexOf(']'));
  }

  return host.split(':')[0] ?? host;
}

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);

  const legacyTarget = LEGACY_PATH_REDIRECTS.get(url.pathname);

  if (legacyTarget) {
    const hostHeader =
      context.request.headers.get('x-forwarded-host') ?? context.request.headers.get('host') ?? url.host;
    const requestHostname = hostnameFromHeader(hostHeader).toLowerCase();
    const isLocalHost = LOCAL_HOSTS.has(requestHostname);
    const redirectOrigin = isLocalHost ? `http://${hostHeader}` : `https://${CANONICAL_HOST}`;
    const redirectUrl = new URL(legacyTarget, redirectOrigin);

    return context.redirect(redirectUrl.toString(), 301);
  }

  if (url.hostname.toLowerCase() === WWW_HOST) {
    url.hostname = CANONICAL_HOST;
    url.protocol = 'https:';
    return context.redirect(url.toString(), 301);
  }

  return next();
});
