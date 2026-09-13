import { createServer, IncomingMessage } from 'node:http';
import { Socket } from 'node:net';
import { createRequestFromNodeRequest, getAbortControllerCleanup } from 'astro/app/node';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { POST as askPost } from '../../src/pages/api/v1/ask';
import { POST as mcpPost } from '../../src/pages/mcp';
import { POST as runPost } from '../../src/pages/api/v1/run/[slug]';
import { withRequestDeadline } from '../../src/lib/askRequest';
import * as mcpFactory from '../../src/lib/aftMcpServer';

vi.mock('../../src/lib/privateEnv', () => ({
  getApiBetaToken: () => process.env.AFT_API_BETA_TOKEN || '',
  getOllamaApiKey: () => 'synthetic-judge-key',
  isAskEnabled: () => true,
  loadPrivateEnv: () => {},
}));

const fetchMock = vi.fn<typeof fetch>();
const nativeFetch = globalThis.fetch;
const input = { mode: 'percent-of', percent: 18, value: 240 };
const ambiguous = 'Please help me choose a utility for my project.';
const tokenHeaders = { authorization: 'Bearer synthetic-judge-beta' };
let sequence = 0;
const address = () => `cor06-judge-${++sequence}`;
const pending = () => new Promise<never>(() => {});

beforeEach(() => {
  vi.stubEnv('AFT_API_BETA_TOKEN', 'synthetic-judge-beta');
  vi.stubEnv('AFT_ASK_FORCE_FALLBACK', 'false');
  vi.stubEnv('AFT_ASK_ALLOW_LOCAL_ROUTER', 'false');
  fetchMock.mockReset().mockImplementation(() => { throw new Error('Network forbidden in judge tests'); });
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function request(body: unknown, headers: Record<string, string> = tokenHeaders, signal?: AbortSignal) {
  return new Request('https://example.test/ask', {
    method: 'POST', signal, body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', ...headers },
  });
}

function ask(signal?: AbortSignal) {
  return askPost({ request: request({ message: ambiguous }, tokenHeaders, signal), clientAddress: address() } as never);
}

function rpc(id: number) {
  return { jsonrpc: '2.0', id, method: 'tools/call',
    params: { name: 'run_tool', arguments: { slug: 'percentage-calculator', inputs: input } } };
}

function mcp(body: unknown, clientAddress: string, headers: Record<string, string> = tokenHeaders) {
  return mcpPost({ clientAddress, request: request(body, {
    accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2025-06-18', ...headers,
  }) } as never);
}

it('J1: releases an unread provider error body before discarding its deadline', async () => {
  vi.useFakeTimers();
  const cancel = vi.fn();
  const upstream = new Response(new ReadableStream<Uint8Array>({ cancel }), { status: 503 });
  fetchMock.mockResolvedValue(upstream);
  try {
    const response = await ask();
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ ok: false, code: 'ASK_UNAVAILABLE' });
    expect(vi.getTimerCount()).toBe(0);
    const signal = fetchMock.mock.calls[0][1]?.signal;
    expect(signal?.aborted || cancel.mock.calls.length > 0).toBe(true);
  } finally {
    await upstream.body?.cancel();
  }
});

it('J2: a batch cannot perform 61 executions using the final one-request allowance', async () => {
  const clientAddress = address();
  for (let i = 0; i < 59; i++) {
    const response = await runPost({ clientAddress, params: { slug: 'percentage-calculator' },
      request: request({ inputs: input }) } as never);
    expect(response.status).toBe(200);
  }
  const response = await mcp(Array.from({ length: 61 }, (_, i) => rpc(i + 1)), clientAddress);
  const body = await response.json();
  const completed = Array.isArray(body)
    ? body.filter(item => item.result && !item.result.isError).length : 0;
  expect((await mcp(rpc(100), clientAddress)).status).toBe(429);
  expect(fetchMock).not.toHaveBeenCalled();
  expect(completed).toBeLessThanOrEqual(1);
});

it('rejects unauthorized batches before reading their body and without spending quota', async () => {
  const clientAddress = address();
  for (let i = 0; i < 61; i++) {
    const raw = request([rpc(1), rpc(2)], { accept: 'application/json, text/event-stream' });
    const json = vi.spyOn(raw, 'json');
    expect((await mcpPost({ clientAddress, request: raw } as never)).status).toBe(401);
    expect(json).not.toHaveBeenCalled();
  }
  expect((await mcp(rpc(3), clientAddress)).status).toBe(200);
  expect(fetchMock).not.toHaveBeenCalled();
});

it.each(['', '{private-body-sentinel', 'null', 'false', '17', '"private-body-sentinel"', '{}'])(
  'returns a sanitized JSON-RPC 400 for malformed MCP body %j', async body => {
    const raw = new Request('https://example.test/mcp', { method: 'POST', body,
      headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream',
        'mcp-protocol-version': '2025-06-18', ...tokenHeaders } });
    const json = vi.spyOn(raw, 'json');
    const response = await mcpPost({ clientAddress: address(), request: raw } as never);
    expect(response.status).toBe(400);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(response.headers.get('content-type')).toContain('application/json');
    const result = await response.json();
    expect(result).toMatchObject({ jsonrpc: '2.0', id: null, error: { code: -32700 } });
    expect(JSON.stringify(result)).not.toContain('private-body-sentinel');
    expect(json).toHaveBeenCalledOnce();
    expect(fetchMock).not.toHaveBeenCalled();
  },
);

it.each([[], [rpc(1)], [rpc(1), rpc(2)], [null]].map(body => ({ body })))(
  'rejects every JSON-RPC array shape before constructing a server: $body', async ({ body }) => {
    const createServer = vi.spyOn(mcpFactory, 'createAccessFreeToolsMcpServer');
    const response = await mcp(body, address());
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ jsonrpc: '2.0', id: null, error: { code: -32600 } });
    expect(createServer).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  },
);

it('hands the parsed single MCP request to the SDK without reading its body twice', async () => {
  const raw = request(rpc(1), { accept: 'application/json, text/event-stream',
    'mcp-protocol-version': '2025-06-18', ...tokenHeaders });
  const json = vi.spyOn(raw, 'json');
  const response = await mcpPost({ clientAddress: address(), request: raw } as never);
  expect(response.status).toBe(200);
  expect(await response.json()).toHaveProperty('result');
  expect(json).toHaveBeenCalledOnce();
  expect(fetchMock).not.toHaveBeenCalled();
});

it.each([
  { headers: { 'content-type': 'text/plain' }, status: 415 },
  { headers: { accept: 'application/json' }, status: 406 },
] as { headers: Record<string, string>; status: number }[])(
  'preserves SDK header validation for single JSON requests: $status', async ({ headers, status }) => {
    const response = await mcp(rpc(1), address(), { ...tokenHeaders, ...headers });
    expect(response.status).toBe(status);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(fetchMock).not.toHaveBeenCalled();
  },
);

it('sanitizes a rejected incoming MCP body read without constructing a server', async () => {
  const createServer = vi.spyOn(mcpFactory, 'createAccessFreeToolsMcpServer');
  const raw = request(rpc(1), { accept: 'application/json, text/event-stream', ...tokenHeaders });
  vi.spyOn(raw, 'json').mockRejectedValue(new Error('private-body-read-sentinel'));
  const response = await mcpPost({ clientAddress: address(), request: raw } as never);
  expect(response.status).toBe(400);
  const result = await response.json();
  expect(result).toMatchObject({ jsonrpc: '2.0', id: null, error: { code: -32700 } });
  expect(JSON.stringify(result)).not.toContain('private-body-read-sentinel');
  expect(createServer).not.toHaveBeenCalled();
});

it('rounds Retry-After up to one second at the end of the shared window', async () => {
  vi.useFakeTimers();
  const clientAddress = address();
  for (let i = 0; i < 60; i++) expect((await mcp(rpc(i), clientAddress)).status).toBe(200);
  await vi.advanceTimersByTimeAsync(59_999);
  const response = await mcp(rpc(60), clientAddress);
  expect(response.status).toBe(429);
  expect(response.headers.get('retry-after')).toBe('1');
  await vi.advanceTimersByTimeAsync(1);
  expect((await mcp(rpc(61), clientAddress)).status).toBe(200);
});

it('sanitizes provider body and tool-argument parse failures', async () => {
  for (const body of [
    'private-provider-sentinel',
    JSON.stringify({ message: { tool_calls: [{ function: {
      name: 'aft_percentage_calculator', arguments: 'private-provider-sentinel',
    } }] } }),
  ]) {
    fetchMock.mockResolvedValue(new Response(body));
    const response = await ask();
    expect(response.status).toBe(503);
    const result = await response.json();
    expect(result.code).toBe('ASK_UNAVAILABLE');
    expect(JSON.stringify(result)).not.toContain('private-provider-sentinel');
  }
});

it('does not read late provider headers or create a late tool answer', async () => {
  vi.useFakeTimers();
  let resolve!: (response: Response) => void;
  fetchMock.mockImplementation(() => new Promise(done => { resolve = done; }));
  const task = ask();
  await vi.advanceTimersByTimeAsync(30_001);
  const response = await task;
  expect(response.status).toBe(504);
  const late = new Response('{}');
  const json = vi.spyOn(late, 'json');
  resolve(late);
  await vi.advanceTimersByTimeAsync(1);
  expect(json).not.toHaveBeenCalled();
  expect(vi.getTimerCount()).toBe(0);
  await late.body?.cancel();
});

it('settles once when body completion and caller cancellation happen in the same turn', async () => {
  vi.useFakeTimers();
  const controller = new AbortController();
  let resolve!: (value: string) => void;
  const work = new Promise<string>(done => { resolve = done; });
  const task = withRequestDeadline(() => work, 30_000, controller.signal);
  const settled = task.then(value => ({ value }), error => ({ name: (error as Error).name }));
  await vi.advanceTimersByTimeAsync(1);
  resolve('late value');
  controller.abort(new Error('private-caller-sentinel'));
  expect(await settled).toEqual({ name: 'AbortError' });
  expect(vi.getTimerCount()).toBe(0);
});

it('uses the installed Astro socket-close signal without treating request completion as disconnect', async () => {
  vi.useFakeTimers();
  fetchMock.mockImplementation(pending);
  // An unconnected Node socket exercises the real adapter without any network I/O.
  const socket = new Socket();
  const nodeRequest = Object.assign(new IncomingMessage(socket), {
    method: 'POST', url: '/api/v1/ask', headers: { host: 'example.test', ...tokenHeaders },
    body: JSON.stringify({ message: ambiguous }),
  });
  const adapted = createRequestFromNodeRequest(nodeRequest);
  try {
    const task = askPost({ request: adapted, clientAddress: address() } as never);
    await vi.advanceTimersByTimeAsync(1);
    expect(fetchMock).toHaveBeenCalledOnce();
    nodeRequest.emit('close');
    expect(adapted.signal.aborted).toBe(false);
    socket.emit('close');
    expect(adapted.signal.aborted).toBe(true);
    expect((await task).status).toBe(408);
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(socket.listenerCount('close')).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  } finally {
    getAbortControllerCleanup(nodeRequest)?.();
    socket.destroy();
  }
});

it('records that the upstream deadline does not cover an unfinished incoming JSON body', async () => {
  vi.useFakeTimers();
  const controller = new AbortController();
  let finish!: () => void;
  const body = new ReadableStream<Uint8Array>({
    start(stream) {
      finish = () => {
        stream.enqueue(new TextEncoder().encode(JSON.stringify({ message: ambiguous })));
        stream.close();
      };
    },
  });
  const init: RequestInit & { duplex: 'half' } = { method: 'POST', body, signal: controller.signal,
    duplex: 'half', headers: { 'content-type': 'application/json', ...tokenHeaders } };
  const raw = new Request('https://example.test/ask', init);
  let result: Response | undefined;
  const task = Promise.resolve(askPost({ clientAddress: address(), request: raw } as never)).then(value => { result = value; });
  try {
    await vi.advanceTimersByTimeAsync(35_001);
    controller.abort();
    await vi.advanceTimersByTimeAsync(1);
    expect(result).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  } finally {
    finish();
    await task;
  }
  expect(result?.status).toBe(408);
});

it.each(['synchronous', 'asynchronous'])(
  'aborts owned work after %s failure without changing the original error', async mode => {
    vi.useFakeTimers();
    const parent = new AbortController();
    const add = vi.spyOn(parent.signal, 'addEventListener');
    const remove = vi.spyOn(parent.signal, 'removeEventListener');
    const original = new Error('synthetic-original-failure');
    let owned: AbortSignal | undefined;
    const task = withRequestDeadline(signal => {
      owned = signal;
      if (mode === 'synchronous') throw original;
      return Promise.reject(original);
    }, 30_000, parent.signal);
    await expect(task).rejects.toBe(original);
    expect(owned?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
    expect(remove.mock.calls).toEqual(add.mock.calls.map(([type, listener]) => [type, listener]));
  },
);

it('does not abort successful work or retain its parent listener', async () => {
  vi.useFakeTimers();
  const parent = new AbortController();
  let owned: AbortSignal | undefined;
  expect(await withRequestDeadline(async signal => {
    owned = signal;
    return 'finished';
  }, 30_000, parent.signal)).toBe('finished');
  expect(vi.getTimerCount()).toBe(0);
  parent.abort();
  expect(owned?.aborted).toBe(false);
});

it('J1 loopback: closes the real fetch connection for an unfinished provider error body', async () => {
  let upstreamClosed = false;
  const sockets = new Set<Socket>();
  const server = createServer((incoming, outgoing) => {
    incoming.resume();
    outgoing.on('close', () => { upstreamClosed = true; });
    outgoing.writeHead(503, { 'content-type': 'application/json' });
    outgoing.flushHeaders();
    outgoing.write('{"private-provider-body-sentinel":');
  });
  server.on('connection', socket => {
    sockets.add(socket);
    socket.once('close', () => sockets.delete(socket));
  });
  try {
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const bound = server.address();
    if (!bound || typeof bound === 'string') throw new Error('Missing loopback test port');
    const loopback = `http://127.0.0.1:${bound.port}/synthetic-provider`;
    fetchMock.mockImplementation((_url, options) => nativeFetch(loopback, options));
    const response = await ask();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, code: 'ASK_UNAVAILABLE',
      message: 'The question router is unavailable. Try again shortly.' });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
    await vi.waitFor(() => expect(upstreamClosed).toBe(true), { timeout: 1500, interval: 10 });
  } finally {
    for (const socket of sockets) socket.destroy();
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
