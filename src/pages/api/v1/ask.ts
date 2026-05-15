import type { APIRoute } from 'astro';
import { answerUtilityQuestion } from '../../../lib/askToolRouter';
import { checkApiAccess, checkRateLimit, jsonResponse, readJsonBody } from '../../../lib/apiHttp';

export const prerender = false;

export const POST: APIRoute = async ({ clientAddress, request }) => {
  const accessError = checkApiAccess(request);
  if (accessError) return accessError;

  const limitError = checkRateLimit(clientAddress || 'unknown');
  if (limitError) return limitError;

  try {
    const body = (await readJsonBody(request)) as { message?: unknown };
    const message = typeof body.message === 'string' ? body.message : '';
    const answer = await answerUtilityQuestion(message);

    return jsonResponse({
      ok: true,
      ...answer,
    });
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Ask Access Free Tools could not answer that yet.',
      },
      400,
    );
  }
};

export const GET: APIRoute = () => jsonResponse({ ok: false, message: 'Use POST to ask a utility question.' }, 405);
