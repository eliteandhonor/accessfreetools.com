export const prerender = true;
import type { APIRoute } from 'astro';
import { renderUrlSet, staticSitemapEntries } from '../data/discovery';

export const GET: APIRoute = () =>
  new Response(renderUrlSet(staticSitemapEntries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });

