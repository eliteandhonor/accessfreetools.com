import type { APIRoute } from 'astro';
import { getApiTool, serializeApiTool } from '../../../../lib/apiToolRegistry';
import { jsonResponse } from '../../../../lib/apiHttp';

export const prerender = false;

export const GET: APIRoute = ({ params }) => {
  const tool = getApiTool(params.slug ?? '');

  if (!tool) {
    return jsonResponse({ ok: false, message: 'Tool not found.' }, 404);
  }

  return jsonResponse({
    ok: true,
    tool: serializeApiTool(tool),
  });
};
