import type { APIRoute } from 'astro';
import { ApiToolValidationError, getApiTool, runApiTool, serializeApiTool } from '../../../../lib/apiToolRegistry';
import { checkApiAccess, checkRateLimit, jsonResponse, readJsonBody } from '../../../../lib/apiHttp';

export const prerender = false;

export const POST: APIRoute = async ({ clientAddress, params, request }) => {
  const accessError = checkApiAccess(request);
  if (accessError) return accessError;

  const limitError = checkRateLimit(clientAddress || 'unknown');
  if (limitError) return limitError;

  const slug = params.slug ?? '';
  const tool = getApiTool(slug);

  if (!tool) {
    return jsonResponse({ ok: false, message: 'Tool not found.' }, 404);
  }

  try {
    const body = (await readJsonBody(request)) as { inputs?: unknown };
    const run = runApiTool(slug, body?.inputs ?? body);

    return jsonResponse({
      ok: true,
      inputs: body?.inputs ?? body,
      run,
      tool: serializeApiTool(tool),
    });
  } catch (error) {
    if (error instanceof ApiToolValidationError) {
      return jsonResponse({ ok: false, issues: error.issues, message: error.message }, 400);
    }

    return jsonResponse(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Tool could not run.',
      },
      400,
    );
  }
};

export const GET: APIRoute = () => jsonResponse({ ok: false, message: 'Use POST to run a tool.' }, 405);
