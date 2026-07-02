import type { APIRoute } from 'astro';
import { listApiTools } from '../../../../lib/apiToolRegistry';
import { cacheableMetadataJsonResponse, setMetadataCache } from '../../../../lib/apiHttp';

export const prerender = false;

export const GET: APIRoute = ({ cache }) => {
  setMetadataCache(cache);

  return cacheableMetadataJsonResponse({
    ok: true,
    tools: listApiTools(),
  });
};
