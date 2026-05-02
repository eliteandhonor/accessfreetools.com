export const prerender = true;
import type { APIRoute } from 'astro';
import { renderUrlSet, toolSitemapEntries } from '../data/discovery';

export const GET: APIRoute = () =>
  new Response(renderUrlSet(toolSitemapEntries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });

