import type { APIRoute } from 'astro';
import { getApiTool, serializeApiTool } from '../../../../lib/apiToolRegistry';
import { cacheableMetadataJsonResponse, jsonResponse, setMetadataCache } from '../../../../lib/apiHttp';

export const prerender = false;

export const GET: APIRoute = ({ cache, params }) => {
  const tool = getApiTool(params.slug ?? '');

  if (!tool) {
    return jsonResponse({ ok: false, message: 'Tool not found.' }, 404);
  }

  setMetadataCache(cache);

  return cacheableMetadataJsonResponse({
    ok: true,
    tool: serializeApiTool(tool),
  });
};
