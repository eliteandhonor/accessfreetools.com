export const prerender = true;
import type { APIRoute } from 'astro';
import { renderUrlSet, toolSitemapEntries } from '../data/discovery';
import { DISCOVERY_CACHE_CONTROL } from '../lib/cacheHeaders';

export const GET: APIRoute = () =>
  new Response(renderUrlSet(toolSitemapEntries), {
    headers: {
      'Cache-Control': DISCOVERY_CACHE_CONTROL,
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });

