import { describe, expect, it, vi } from 'vitest';
import {
  EditorialProviderError, completeSentenceContext, githubJson, jinaRead,
  ollamaChat, typesafeEvaluate,
} from './daily-editorial-providers.mjs';

const key = 'fixture-key-never-a-real-credential';
const source = 'https://github.com/fixture/project/blob/main/README.md';
const jsonResponse = (value, init = {}) => new Response(JSON.stringify(value), {
  ...init, headers: { 'content-type': 'application/json', ...init.headers },
});
const jinaEnvelope = (overrides = {}) => ({ code: 200, status: 20000, data: {
  title: 'Synthetic project', url: source, content: 'This project runs on Linux. Windows is unsupported.',
  usage: { tokens: 18 }, ...overrides,
} });
const messages = [{ role: 'system', content: 'Return only one JSON object.' }, { role: 'user', content: 'Use these synthetic facts.' }];
const chatEnvelope = (overrides = {}) => ({ model: 'gpt-oss:120b', done: true, done_reason: 'stop',
  message: { role: 'assistant', content: '{"title":"Synthetic draft"}' }, prompt_eval_count: 120, eval_count: 20, ...overrides });
const questions = {
  support: { type: 'choice', instructions: 'Does the supplied sentence support the claim?',
    criteria: { supports: 'The sentence directly supports it.', contradicts: 'The sentence contradicts it.', insufficient: 'The sentence leaves it unassessed.' } },
  clarity: { type: 'score', instructions: 'How clear is this text?', criteria: ['Confusing', 'Clear', 'Very clear'] },
  duplicate: { type: 'noul', instructions: 'Is this the same reader problem?', criteria: { true: 'Same problem.', false: 'Different problem.' } },
};
const typesafeEnvelope = () => ({ model: 'jev-1.13.0', answers: {
  support: { type: 'choice', choice: 'supports', probabilities: { supports: 0.96, contradicts: 0.02, insufficient: 0.02 }, confidence: 0.94 },
  clarity: { type: 'score', score: 1.8, legend: { 0: 'Confusing', 1: 'Clear', 2: 'Very clear' },
    probabilities: { 0: 0, 1: 0.2, 2: 0.8 }, confidence: 0.7 },
  duplicate: { type: 'noul', noul: 0.05 },
}, usage: { input_tokens: 400, output_tokens: 60 } });

async function safeFailure(action, code, details = {}) {
  let failure;
  try { await action(); } catch (error) { failure = error; }
  expect(failure).toBeInstanceOf(EditorialProviderError);
  expect(failure).toMatchObject({ code, ...details });
  expect(failure.message).not.toContain(key);
  return failure;
}

describe('daily editorial bounded provider HTTP', () => {
  it('sends only a public GitHub GET with fixed API headers and no environment lookup', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ full_name: 'fixture/project', private: false }));
    const result = await githubJson('/repos/fixture/project', { fetchImpl });
    expect(result).toEqual({ data: { full_name: 'fixture/project', private: false }, usage: {} });
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://api.github.com/repos/fixture/project');
    expect(init).toMatchObject({ method: 'GET', redirect: 'error', headers: { 'X-GitHub-Api-Version': '2022-11-28' } });
    expect(init.headers).not.toHaveProperty('Authorization');
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('allows repository discovery and immutable source reads without exposing account endpoints', async () => {
    for (const path of ['/search/repositories?q=license%3Amit', '/repos/fixture/project/readme',
      '/repos/fixture/project/license', '/repos/fixture/project/releases/latest', '/repos/fixture/project/commits/abc123',
      '/repos/fixture/project/contents/docs/index.md?ref=abc123']) {
      const fetchImpl = vi.fn(async () => jsonResponse(path.startsWith('/search/') ?
        { items: [], total_count: 0, incomplete_results: false } : { public: true }));
      await githubJson(path, { fetchImpl, token: key });
      expect(fetchImpl.mock.calls[0][1].headers.Authorization).toBe(`Bearer ${key}`);
    }
    for (const path of ['https://evil.example/repos/x/y', '//evil.example/x', '/user', '/repos/x/y/actions/secrets',
      '/repos/x/y/issues', '/repos/x/y\\user', '/repos/x/y\n']) {
      const fetchImpl = vi.fn();
      await safeFailure(() => githubJson(path, { fetchImpl, token: key }), 'URL_NOT_ALLOWED', { sent: false });
      expect(fetchImpl).not.toHaveBeenCalled();
    }
  });

  it.each([{ private: true }, { incomplete_results: true }, { items: [{ private: true }] }])('holds unavailable discovery %j', async (payload) => {
    await safeFailure(() => githubJson('/search/repositories?q=fixture', { fetchImpl: async () => jsonResponse({
      items: [], total_count: 0, incomplete_results: false, ...payload,
    }) }), 'SOURCE_UNAVAILABLE');
  });

  it('sanitizes HTTP error bodies and never retries an explicit failure', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ error: `Secret ${key}, private content.` }, { status: 429 }));
    const error = await safeFailure(() => jinaRead(source, { key, fetchImpl }), 'HTTP_ERROR', { status: 429, sent: true, outcome: 'rejected' });
    expect(error).not.toHaveProperty('cause');
    expect(error.message).not.toContain('private content');
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it('sanitizes transport errors and preserves a potentially billed unknown outcome', async () => {
    const fetchImpl = vi.fn(async () => { throw new Error(`Sensitive transport text ${key}`); });
    const error = await safeFailure(() => jinaRead(source, { key, fetchImpl }), 'REQUEST_FAILED', { sent: true, outcome: 'unknown' });
    expect(error.message).not.toContain('Sensitive');
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it('times out a stalled fetch, aborts it, and never retries it', async () => {
    const fetchImpl = vi.fn(() => new Promise(() => {}));
    await safeFailure(() => jinaRead(source, { key, fetchImpl, timeoutMs: 5 }), 'REQUEST_TIMEOUT', { sent: true, outcome: 'unknown' });
    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(fetchImpl.mock.calls[0][1].signal.aborted).toBe(true);
  });

  it('times out while receiving a stalled response body', async () => {
    const stream = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('{')); } });
    await safeFailure(() => jinaRead(source, { key, timeoutMs: 5,
      fetchImpl: async () => new Response(stream, { headers: { 'content-type': 'application/json' } }) }),
    'REQUEST_TIMEOUT', { outcome: 'unknown' });
  });

  it.each([
    ['redirect', () => new Response('', { status: 302, headers: { location: 'http://127.0.0.1/secret' } }), 'REDIRECT_REJECTED'],
    ['invalid JSON', () => new Response('{', { headers: { 'content-type': 'application/json' } }), 'INVALID_RESPONSE'],
    ['wrong content type', () => new Response('{}', { headers: { 'content-type': 'text/html' } }), 'INVALID_RESPONSE'],
    ['misleading content type', () => new Response('{}', { headers: { 'content-type': 'application/jsonx' } }), 'INVALID_RESPONSE'],
    ['oversized declared response', () => jsonResponse({}, { headers: { 'content-length': '600000' } }), 'RESPONSE_TOO_LARGE'],
    ['oversized streamed response', () => jsonResponse({ content: 'x'.repeat(1000) }), 'RESPONSE_TOO_LARGE'],
    ['empty body', () => new Response('', { headers: { 'content-type': 'application/json' } }), 'INVALID_RESPONSE'],
  ])('holds %s without logging content', async (_, response, code) => {
    await safeFailure(() => githubJson('/repos/fixture/project', { fetchImpl: async () => response(), maxResponseBytes: 512 }), code, { sent: true, outcome: 'unknown' });
  });

  it('rejects invalid credentials before any request and has no environment fallback', async () => {
    for (const supplied of [undefined, '', 'bad\r\nheader']) {
      const fetchImpl = vi.fn();
      await safeFailure(() => jinaRead(source, { key: supplied, fetchImpl }), 'CREDENTIAL_REQUIRED', { sent: false });
      expect(fetchImpl).not.toHaveBeenCalled();
    }
  });
});

describe('Jina Reader contract and source completeness', () => {
  it('normalizes the official envelope, retains exact evidence, and rejects rather than truncates over-budget content', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(jinaEnvelope()));
    expect(await jinaRead(source, { key, fetchImpl })).toEqual({
      data: { text: 'This project runs on Linux. Windows is unsupported.', url: source, truncated: false }, usage: { tokens: 18 },
    });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe(`https://r.jina.ai/${source}`);
    expect(init.headers).toMatchObject({ Authorization: `Bearer ${key}`, Accept: 'application/json', 'X-Token-Budget': '10000', 'X-Retain-Images': 'none' });
    expect(init.headers).not.toHaveProperty('X-Max-Tokens');
  });

  it('accepts the documented text envelope variant without changing source text', async () => {
    const response = jinaEnvelope({ content: undefined, text: 'A source sentence.\n' });
    expect((await jinaRead(source, { key, fetchImpl: async () => jsonResponse(response) })).data.text).toBe('A source sentence.\n');
  });

  it.each([
    ['truncated source', { truncated: true }, 'SOURCE_INCOMPLETE'],
    ['malformed truncation marker', { truncated: 'true' }, 'SOURCE_INCOMPLETE'],
    ['blocked source under HTTP 200', { warning: 'Target returned 403.' }, 'SOURCE_INCOMPLETE'],
    ['empty source', { content: '' }, 'SOURCE_INCOMPLETE'],
    ['ambiguous content', { text: 'Different source text.' }, 'SOURCE_INCOMPLETE'],
    ['over-budget usage', { usage: { tokens: 10001 } }, 'PROVIDER_BUDGET_EXCEEDED'],
    ['missing usage', { usage: {} }, 'INVALID_RESPONSE'],
    ['impossible zero input usage', { usage: { tokens: 0 } }, 'INVALID_RESPONSE'],
    ['wrong target', { url: 'https://github.com/fixture/different' }, 'SOURCE_URL_CHANGED'],
    ['malicious returned target', { url: 'https://github.com.evil.example/fixture/project' }, 'SOURCE_URL_CHANGED'],
  ])('holds %s', async (_, overrides, code) => {
    await safeFailure(() => jinaRead(source, { key, fetchImpl: async () => jsonResponse(jinaEnvelope(overrides)) }), code);
  });

  it.each(['http://github.com/x/y', 'https://user:password@github.com/x/y', 'https://github.com:8443/x/y',
    'https://github.com.evil.example/x/y', 'https://127.0.0.1/x/y', 'https://2130706433/x/y',
    'https://[::1]/x/y', 'https://metadata.google.internal/x/y', 'https://github.com/x/y#fragment', 'https://github.com/x/y\n'])('rejects malicious or unsupported URL %s', async (url) => {
    const fetchImpl = vi.fn();
    await safeFailure(() => jinaRead(url, { key, fetchImpl }), 'URL_NOT_ALLOWED', { sent: false });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('allows only an exact caller-owned documented source URL, never its whole domain', async () => {
    const url = 'https://docs.fixture.example/project/start';
    const fetchImpl = vi.fn(async () => jsonResponse(jinaEnvelope({ url })));
    await jinaRead(url, { key, fetchImpl, allowedSourceUrls: [url] });
    await safeFailure(() => jinaRead('https://docs.fixture.example/other', { key, fetchImpl, allowedSourceUrls: [url] }), 'URL_NOT_ALLOWED');
    expect(fetchImpl).toHaveBeenCalledOnce();
  });
});

describe('Ollama Cloud writing and review contract', () => {
  it('uses the official cloud endpoint, prompt JSON, usage and an output-token bound', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(chatEnvelope()));
    expect(await ollamaChat(messages, { key, fetchImpl })).toEqual({ data: { title: 'Synthetic draft' }, usage: { inputTokens: 120, outputTokens: 20 } });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://ollama.com/api/chat');
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({ model: 'gpt-oss:120b', stream: false, messages, options: { num_predict: 3000 } });
    expect(body).not.toHaveProperty('format');
    expect(body).not.toHaveProperty('tools');
  });

  it.each([
    ['unfinished completion', { done: false }, 'INVALID_RESPONSE'],
    ['length-stopped completion', { done_reason: 'length' }, 'INVALID_RESPONSE'],
    ['wrong model', { model: 'different' }, 'INVALID_RESPONSE'],
    ['missing usage', { eval_count: undefined }, 'INVALID_RESPONSE'],
    ['impossible zero input usage', { prompt_eval_count: 0 }, 'INVALID_RESPONSE'],
    ['over-budget output', { eval_count: 3001 }, 'PROVIDER_BUDGET_EXCEEDED'],
    ['malformed generated JSON', { message: { role: 'assistant', content: '```json\n{}\n```' } }, 'INVALID_GENERATED_JSON'],
    ['array output', { message: { role: 'assistant', content: '[]' } }, 'INVALID_GENERATED_JSON'],
    ['unexpected tool call', { message: { role: 'assistant', content: '{}', tool_calls: [{}] } }, 'INVALID_RESPONSE'],
  ])('holds %s without repair calls', async (_, overrides, code) => {
    const fetchImpl = vi.fn(async () => jsonResponse(chatEnvelope(overrides)));
    await safeFailure(() => ollamaChat(messages, { key, fetchImpl }), code);
    expect(fetchImpl).toHaveBeenCalledOnce();
  });
});

describe('TypeSafe System One typed decision contract', () => {
  it('accepts the rounded official Choice, Score and Noul response examples', async () => {
    const officialQuestions = {
      department: { type: 'choice', instructions: 'Which team should handle this?', criteria: {
        billing: 'Payments, invoicing, refunds', technical: 'Bugs, outages, integrations', sales: 'Pricing, upgrades, new accounts',
      } },
      frustration: { type: 'score', instructions: 'How frustrated is the customer?', criteria: ['Calm', 'Frustrated', 'Very angry'] },
      is_urgent: { type: 'noul', instructions: 'Does this convey urgency?' },
    };
    const officialResponse = { model: 'jev-1.13.0', answers: {
      department: { type: 'choice', choice: 'billing', probabilities: { billing: 0.88, technical: 0.12, sales: 0 }, confidence: 0.81 },
      frustration: { type: 'score', score: 1.05, legend: { 0: 'Calm', 1: 'Frustrated', 2: 'Very angry' },
        probabilities: { 0: 0, 1: 0.95, 2: 0.05 }, confidence: 0.92 },
      is_urgent: { type: 'noul', noul: 0.95 },
    }, usage: { input_tokens: 318, output_tokens: 34 } };
    expect((await typesafeEvaluate('Help! My payouts have been failing for 3 days.', officialQuestions, {
      key, fetchImpl: async () => jsonResponse(officialResponse),
    })).data.answers).toEqual(officialResponse.answers);
  });

  it('accepts and validates Choice, Score and Noul answers under the original question ids', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(typesafeEnvelope()));
    const result = await typesafeEvaluate({ sentence: 'A complete source sentence.' }, questions, { key, fetchImpl });
    expect(result).toEqual({ data: { model: 'jev-1.13.0', answers: typesafeEnvelope().answers }, usage: { inputTokens: 400, outputTokens: 60 } });
    expect(fetchImpl.mock.calls[0][0]).toBe('https://api.typesafe.ai/v1/systemone');
    expect(JSON.parse(fetchImpl.mock.calls[0][1].body)).toMatchObject({ model: 'jev-1.13.0', questions });
  });

  it.each([
    ['missing question answer', (response) => { delete response.answers.support; }],
    ['extra question answer', (response) => { response.answers.extra = { type: 'noul', noul: 1 }; }],
    ['type mismatch', (response) => { response.answers.duplicate.type = 'choice'; }],
    ['unknown choice', (response) => { response.answers.support.choice = 'invented'; }],
    ['non-winning choice', (response) => { response.answers.support.choice = 'contradicts'; }],
    ['missing choice probability', (response) => { delete response.answers.support.probabilities.insufficient; }],
    ['non-normalized distribution', (response) => { response.answers.support.probabilities.supports = 0.6; }],
    ['string confidence', (response) => { response.answers.support.confidence = '0.94'; }],
    ['inconsistent Choice confidence', (response) => { response.answers.support.confidence = 0.1; }],
    ['inconsistent Score confidence', (response) => { response.answers.clarity.confidence = 0.1; }],
    ['missing Score legend', (response) => { delete response.answers.clarity.legend; }],
    ['wrong Score expectation', (response) => { response.answers.clarity.score = 1; }],
    ['out-of-range Noul', (response) => { response.answers.duplicate.noul = 1.01; }],
    ['wrong resolved model', (response) => { response.model = 'jev-latest'; }],
    ['missing input usage', (response) => { delete response.usage.input_tokens; }],
  ])('holds %s', async (_, mutate) => {
    const response = typesafeEnvelope();
    mutate(response);
    await safeFailure(() => typesafeEvaluate('Source text.', questions, { key, fetchImpl: async () => jsonResponse(response) }), 'INVALID_RESPONSE');
  });

  it.each([
    ['one-level Score', { q: { type: 'score', instructions: 'Clarity?', criteria: ['Clear'] } }],
    ['unsupported primitive', { q: { type: 'generate', instructions: 'Write an article.' } }],
    ['missing Choice rubric', { q: { type: 'choice', instructions: 'Relation?' } }],
    ['contradictory Noul wire shape', { q: { type: 'noul', instructions: 'Duplicate?', criteria: { yes: 'Yes', no: 'No' } } }],
    ['empty map', {}],
  ])('rejects %s before paid inference', async (_, invalidQuestions) => {
    const fetchImpl = vi.fn();
    await safeFailure(() => typesafeEvaluate('Source text.', invalidQuestions, { key, fetchImpl }), 'INVALID_REQUEST', { sent: false });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('holds oversized state before inference instead of silently trimming it', async () => {
    const fetchImpl = vi.fn();
    await safeFailure(() => typesafeEvaluate('x'.repeat(28000), questions, { key, fetchImpl }), 'REQUEST_TOO_LARGE', { sent: false });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe('complete source evidence context', () => {
  it('preserves the entire bounded source, including paragraphs outside the quote', () => {
    const paragraph = 'The project can sync local folders to a server when you configure a supported remote. It does not include a hosted account.';
    const text = `Unrelated introduction.\n\n${paragraph}\n\nAnother paragraph.`;
    expect(completeSentenceContext(text, 'can sync local folders', 1000)).toBe(text);
    expect(completeSentenceContext(text, 'can sync local folders', 40)).toBeNull();
  });

  it.each([
    ['adjacent restriction', 'The project supports backups.\n\nOnly the paid edition supports backups.'],
    ['prior warning', 'The next sentence describes an experimental feature disabled in releases.\n\nThe project supports backups.'],
    ['qualifying heading', '# Paid edition features\n\nThe project supports backups.'],
    ['distant contradiction', 'The project supports backups.\n\nSetup information.\n\nThe released free edition cannot make backups.'],
  ])('retains %s instead of presenting selective evidence', (_, text) => {
    expect(completeSentenceContext(text, 'The project supports backups.', 4000)).toBe(text);
  });

  it('holds when the complete source exceeds the bound even though the quoted paragraph fits', () => {
    const text = `The project supports backups.\n\n${'Other source details. '.repeat(200)}\n\nThe released free edition cannot make backups.`;
    expect(completeSentenceContext(text, 'supports backups', 4000)).toBeNull();
    expect(completeSentenceContext(text, 'supports backups', { maxBytes: 8000, maxChars: 100 })).toBeNull();
  });

  it('holds a long sentence even when a short slice would sound supportive', () => {
    const text = `This tool supports sync only ${'under the documented condition, '.repeat(20)}and it does not support live backups.`;
    expect(completeSentenceContext(text, 'supports sync', { maxChars: 160 })).toBeNull();
    expect(completeSentenceContext(text, 'supports sync', 2000)).toBe(text);
  });

  it.each([
    ['missing quotation', 'The project works offline.', 'works online'],
    ['ambiguous quotation', 'Linux is supported.\n\nLinux is not supported.', 'Linux'],
    ['incomplete source fragment', 'The project supports Linux only when', 'supports Linux'],
    ['code block', '```\nexample();\n```\nUse this command.', 'example()'],
    ['cross-paragraph quotation', 'First sentence.\n\nSecond sentence.', 'sentence.\n\nSecond'],
  ])('returns unassessed for %s', (_, text, quote) => {
    expect(completeSentenceContext(text, quote, 4000)).toBeNull();
  });

  it('applies UTF-8 byte bounds to complete sentences without cutting multibyte text', () => {
    const text = 'This café helps naïve users.';
    expect(completeSentenceContext(text, 'café', text.length)).toBeNull();
    expect(completeSentenceContext(text, 'café', Buffer.byteLength(text))).toBe(text);
  });
});
