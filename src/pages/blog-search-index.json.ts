export const prerender = true;
import type { APIRoute } from 'astro';
import { getBlogSearchIndex } from '../data/blogSearchIndex';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      posts: getBlogSearchIndex(),
    }),
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'application/json; charset=utf-8',
      },
    },
  );
