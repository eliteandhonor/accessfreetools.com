export const prerender = true;
import type { APIRoute } from 'astro';
import { categorySitemapEntries, renderUrlSet } from '../data/discovery';

export const GET: APIRoute = () =>
  new Response(renderUrlSet(categorySitemapEntries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });

