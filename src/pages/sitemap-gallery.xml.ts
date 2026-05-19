export const prerender = true;
import type { APIRoute } from 'astro';
import { gallerySitemapEntries, renderUrlSet } from '../data/discovery';

export const GET: APIRoute = () => {
  const body = renderUrlSet(gallerySitemapEntries);

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
