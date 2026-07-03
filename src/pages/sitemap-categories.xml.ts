export const prerender = true;
import type { APIRoute } from 'astro';
import { categorySitemapEntries, renderUrlSet } from '../data/discovery';
import { DISCOVERY_CACHE_CONTROL } from '../lib/cacheHeaders';

export const GET: APIRoute = () =>
  new Response(renderUrlSet(categorySitemapEntries), {
    headers: {
      'Cache-Control': DISCOVERY_CACHE_CONTROL,
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });

