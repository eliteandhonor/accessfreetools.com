export const prerender = true;
import type { APIRoute } from 'astro';
import { gallerySitemapEntries, renderUrlSet } from '../data/discovery';
import { DISCOVERY_CACHE_CONTROL } from '../lib/cacheHeaders';

export const GET: APIRoute = () => {
  const body = renderUrlSet(gallerySitemapEntries);

  return new Response(body, {
    headers: {
      'Cache-Control': DISCOVERY_CACHE_CONTROL,
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
