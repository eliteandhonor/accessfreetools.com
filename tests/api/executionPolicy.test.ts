import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST as mcpPost } from '../../src/pages/mcp';
import { POST as runPost } from '../../src/pages/api/v1/run/[slug]';
import { POST as askPost } from '../../src/pages/api/v1/ask';
import { GET as toolsGet } from '../../src/pages/api/v1/tools/index';
import { answerUtilityQuestion } from '../../src/lib/askToolRouter';
import { createServer, request as httpRequest } from 'node:http';
import { createRequestFromNodeRequest, writeResponse } from 'astro/app/node';

vi.mock('../../src/lib/privateEnv', () => ({
  getApiBetaToken: () => process.env.AFT_API_BETA_TOKEN || '',
  getOllamaApiKey: () => 'controlled-test-key',
  isAskEnabled: () => true,
  loadPrivateEnv: () => {},
}));

let sequence = 0;
const input = { mode: 'percent-of', percent: 18, value: 240 };
const pending = () => new Promise<never>(() => {});
const ambiguous = 'Please help me choose a utility for my project.';
const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubEnv('AFT_API_BETA_TOKEN', 'controlled-beta');
  vi.stubEnv('AFT_ASK_FORCE_FALLBACK', 'false');
  vi.stubEnv('AFT_ASK_ALLOW_LOCAL_ROUTER', 'false');
  fetchMock.mockReset().mockImplementation(() => { throw new Error('Unexpected network'); });
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

async function call(kind: 'REST' | 'MCP' | 'Ask', options: {
  headers?: Record<string, string>; query?: string; address?: string; method?: string;
  signal?: AbortSignal; message?: string;
} = {}) {
  const method = options.method || 'tools/call';
  const body = kind === 'REST' ? { inputs: input } : kind === 'Ask' ? { message: options.message || 'What is 18% of 240?' } : {
    jsonrpc: '2.0', id: ++sequence, method,
    params: method === 'initialize' ? { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'policy-test', version: '1' } }
      : method === 'tools/call' ? { name: 'run_tool', arguments: { slug: 'percentage-calculator', inputs: input } } : {},
  };
  const request = new Request(`https://example.test/${kind}${options.query || ''}`, {
    method: 'POST', body: JSON.stringify(body), signal: options.signal,
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream',
      'mcp-protocol-version': '2025-06-18', ...options.headers },
  });
  return (kind === 'REST' ? runPost : kind === 'MCP' ? mcpPost : askPost)({
    request, clientAddress: options.address || `policy-${++sequence}`, params: { slug: 'percentage-calculator' },
  } as never);
}

describe.each(['REST', 'MCP', 'Ask'] as const)('%s execution access', kind => {
  it.each([
    { headers: {}, query: '' },
    { headers: { 'x-aft-api-token': 'wrong' }, query: '' },
    { headers: { authorization: 'Bearer wrong' }, query: '' },
    { headers: {}, query: '?token=controlled-beta' },
  ] as { headers: Record<string, string>; query: string }[])('rejects missing/wrong/query credentials: %j', async options => {
    const response = await call(kind, options);
    expect(response.status).toBe(401);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each([{ 'x-aft-api-token': 'controlled-beta' }, { authorization: 'Bearer controlled-beta' }] as Record<string, string>[])(
    'accepts supported headers: %j', async headers => {
      expect((await call(kind, { headers })).status).toBe(200);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
  it('is public when the optional token is unset', async () => {
    vi.stubEnv('AFT_API_BETA_TOKEN', '');
    expect((await call(kind)).status).toBe(200);
  });
});

it.each(['initialize', 'tools/list', 'tools/call'])('MCP %s follows beta access and remains compatible', async method => {
  expect((await call('MCP', { method })).status).toBe(401);
  const response = await call('MCP', { method, headers: { authorization: 'Bearer controlled-beta' } });
  expect(response.status).toBe(200);
  expect(response.headers.get('cache-control')).toBe('no-store');
  expect(await response.json()).toHaveProperty('result');
});

it('keeps HTTP discovery public while execution is gated', async () => {
  const response = await toolsGet({} as never);
  expect(response.status).toBe(200);
  expect((await response.json()).tools.length).toBeGreaterThan(1);
});

it('does not turn one admitted MCP POST into a batch of tool executions', async () => {
  const rpc = { jsonrpc: '2.0', id: 1, method: 'tools/call', params: {
    name: 'run_tool', arguments: { slug: 'percentage-calculator', inputs: input },
  } };
  const request = new Request('https://example.test/mcp', { method: 'POST', body: JSON.stringify([rpc, { ...rpc, id: 2 }]),
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream',
      authorization: 'Bearer controlled-beta', 'mcp-protocol-version': '2025-06-18' } });
  const response = await mcpPost({ request, clientAddress: `batch-${++sequence}` } as never);
  expect(response.status).toBe(400);
  expect(await response.json()).toMatchObject({ error: { code: -32600 } });
  expect(fetchMock).not.toHaveBeenCalled();
});

it('shares a 60-request fixed window across REST, MCP and Ask with Retry-After and reset', async () => {
  vi.useFakeTimers();
  const address = `quota-${++sequence}`;
  const headers = { authorization: 'Bearer controlled-beta' };
  for (let i = 0; i < 60; i++) expect((await call(i % 2 ? 'REST' : 'MCP', { address, headers })).status).toBe(200);
  for (const kind of ['REST', 'MCP', 'Ask'] as const) {
    const response = await call(kind, { address, headers });
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('60');
    expect(response.headers.get('cache-control')).toBe('no-store');
  }
  await vi.advanceTimersByTimeAsync(60_000);
  expect((await call('MCP', { address, headers })).status).toBe(200);
});

describe('Ask upstream lifetime', () => {
  it.each(['request', 'body'])('Astro Node socket disconnect aborts the upstream %s', async phase => {
    let upstreamSignal: AbortSignal | undefined;
    let completed: Response | undefined;
    let handlerError: unknown;
    fetchMock.mockImplementation((_url, options) => {
      upstreamSignal = options.signal;
      return phase === 'request' ? pending() : Promise.resolve({ ok: true, json: pending });
    });
    const server = createServer(async (incoming, outgoing) => {
      try {
        const request = createRequestFromNodeRequest(incoming);
        completed = await askPost({ request, clientAddress: `socket-${++sequence}` } as never);
        await writeResponse(completed, outgoing);
      } catch (error) { handlerError = error; }
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Missing local test port');
    const client = httpRequest({ host: '127.0.0.1', port: address.port, path: '/api/v1/ask', method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer controlled-beta' } });
    client.on('error', () => {});
    try {
      client.end(JSON.stringify({ message: ambiguous }));
      await vi.waitFor(() => expect(upstreamSignal).toBeDefined());
      expect(upstreamSignal!.aborted).toBe(false);
      client.destroy();
      await vi.waitFor(() => expect(completed?.status).toBe(408));
      expect(upstreamSignal!.aborted).toBe(true);
      expect(handlerError).toBeUndefined();
    } finally {
      client.destroy();
      server.closeAllConnections();
      await new Promise<void>(resolve => server.close(() => resolve()));
    }
  });
  it.each(['request', 'body'])('bounds a stalled %s and aborts upstream without a fake answer', async phase => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(phase === 'request' ? pending : async () => ({ ok: true, json: pending }));
    let response: Response | undefined;
    const task = call('Ask', { headers: { authorization: 'Bearer controlled-beta' }, message: ambiguous }).then(value => { response = value; });
    await vi.advanceTimersByTimeAsync(30_001);
    expect(response?.status).toBe(504);
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
    const body = await response!.json();
    expect(body).toMatchObject({ ok: false, code: 'ASK_TIMEOUT' });
    expect(body).not.toHaveProperty('run');
    expect(JSON.stringify(body)).not.toContain(ambiguous);
    await task;
    expect(vi.getTimerCount()).toBe(0);
  });
  it.each(['request', 'body'])('disconnect cancels a stalled %s without waiting for the deadline', async phase => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(phase === 'request' ? pending : async () => ({ ok: true, json: pending }));
    const controller = new AbortController();
    let response: Response | undefined;
    const task = call('Ask', { signal: controller.signal, headers: { authorization: 'Bearer controlled-beta' }, message: ambiguous }).then(value => { response = value; });
    await vi.advanceTimersByTimeAsync(1);
    controller.abort(new Error('private caller reason'));
    await vi.advanceTimersByTimeAsync(0);
    expect(response?.status).toBe(408);
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
    expect(await response!.json()).toMatchObject({ code: 'ASK_CANCELLED', ok: false });
    await task;
    expect(vi.getTimerCount()).toBe(0);
  });
  it('does not start upstream work for an already cancelled caller', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(answerUtilityQuestion(ambiguous, { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('reports unavailable separately from invalid input without leaking provider errors', async () => {
    fetchMock.mockRejectedValue(new Error('private key or response body'));
    const response = await call('Ask', { headers: { authorization: 'Bearer controlled-beta' }, message: ambiguous });
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, code: 'ASK_UNAVAILABLE', message: 'The question router is unavailable. Try again shortly.' });
  });
  it('cleans deadline resources after provider success and leaves deterministic questions offline', async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const add = vi.spyOn(controller.signal, 'addEventListener');
    const remove = vi.spyOn(controller.signal, 'removeEventListener');
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ message: { tool_calls: [{ function: {
      name: 'aft_percentage_calculator', arguments: input,
    } }] } })));
    expect((await answerUtilityQuestion(ambiguous, { signal: controller.signal })).run.result).toMatchObject({ amount: expect.closeTo(43.2, 10) });
    expect(vi.getTimerCount()).toBe(0);
    expect(remove.mock.calls.length).toBe(add.mock.calls.length);
    fetchMock.mockClear();
    expect((await answerUtilityQuestion('What is 18% of 240?')).route.source).toBe('parser');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
