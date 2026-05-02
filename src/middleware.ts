import { defineMiddleware } from 'astro:middleware';

const CANONICAL_HOST = 'accessfreetools.com';
const WWW_HOST = `www.${CANONICAL_HOST}`;

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);

  if (url.hostname.toLowerCase() === WWW_HOST) {
    url.hostname = CANONICAL_HOST;
    url.protocol = 'https:';
    return context.redirect(url.toString(), 301);
  }

  return next();
});
