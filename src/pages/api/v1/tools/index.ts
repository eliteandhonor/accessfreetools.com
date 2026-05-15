import type { APIRoute } from 'astro';
import { listApiTools } from '../../../../lib/apiToolRegistry';
import { jsonResponse } from '../../../../lib/apiHttp';

export const prerender = false;

export const GET: APIRoute = () =>
  jsonResponse({
    ok: true,
    tools: listApiTools(),
  });
