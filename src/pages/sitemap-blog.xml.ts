export const prerender = true;
import type { APIRoute } from 'astro';
import { blogSitemapEntries, renderUrlSet } from '../data/discovery';

export const GET: APIRoute = () =>
  new Response(renderUrlSet(blogSitemapEntries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });

