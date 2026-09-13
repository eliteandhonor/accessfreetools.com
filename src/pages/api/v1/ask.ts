import type { APIRoute } from 'astro';
import { answerUtilityQuestion, AskUnavailableError } from '../../../lib/askToolRouter';
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
    const answer = await answerUtilityQuestion(message, { signal: request.signal });

    return jsonResponse({
      ok: true,
      ...answer,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return jsonResponse({ ok: false, code: 'ASK_TIMEOUT', message: 'The question router took too long. Try again shortly.' }, 504);
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      return jsonResponse({ ok: false, code: 'ASK_CANCELLED', message: 'The request was cancelled.' }, 408);
    }
    if (error instanceof AskUnavailableError) {
      return jsonResponse({ ok: false, code: 'ASK_UNAVAILABLE', message: error.message }, 503);
    }
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
