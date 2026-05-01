export const prerender = true;
import type { APIRoute } from 'astro';
import { getToolSearchIndex } from '../data/toolSearchIndex';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      tools: getToolSearchIndex(),
    }),
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'application/json; charset=utf-8',
      },
    },
  );
