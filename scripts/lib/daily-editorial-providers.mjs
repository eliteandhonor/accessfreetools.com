// Provider contracts checked against official documentation on 2026-10-08.
// There are no retries here: a sent request with an unknown outcome may be billed.
const MAX_RESPONSE_BYTES = 512_000;
const MAX_REQUEST_BYTES = 56_000;
const DEFAULT_TIMEOUT_MS = 30_000;
const SOURCE_HOSTS = new Set(['github.com', 'raw.githubusercontent.com', 'api.github.com']);
const UNSAFE_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

export class EditorialProviderError extends Error {
  constructor(code, { status, sent = false, outcome = 'not-sent', usage } = {}) {
    super(`Editorial provider request failed: ${code}.`);
    this.name = 'EditorialProviderError';
    this.code = code;
    this.sent = sent;
    this.outcome = outcome;
    if (Number.isInteger(status)) this.status = status;
    if (usage) this.usage = usage;
  }
}

function fail(code, details) { throw new EditorialProviderError(code, details); }
function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    [Object.prototype, null].includes(Object.getPrototypeOf(value));
}
function integer(value, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) {
  return Number.isSafeInteger(value) && value >= minimum && value <= maximum;
}
function probability(value) { return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1; }
function byteLength(value) { return Buffer.byteLength(value, 'utf8'); }
function sameKeys(record, keys) {
  return isRecord(record) && Object.keys(record).length === keys.length && keys.every((key) => Object.hasOwn(record, key));
}
function jsonData(value, depth = 0) {
  if (depth > 16) return false;
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every((item) => jsonData(item, depth + 1));
  return isRecord(value) && Object.entries(value).every(([key, item]) => !UNSAFE_KEYS.has(key) && jsonData(item, depth + 1));
}
function structuredText(value) {
  return (typeof value === 'string' && value.trim().length > 0) ||
    ((isRecord(value) || Array.isArray(value)) && jsonData(value) && Object.keys(value).length > 0);
}
function credential(value) {
  if (typeof value !== 'string' || !value.trim() || /[\r\n]/u.test(value) || value.length > 4096) fail('CREDENTIAL_REQUIRED');
  return value;
}

function publicHttpsUrl(value) {
  if (typeof value !== 'string' || value.length > 4096 || /[\u0000-\u0020\\]/u.test(value)) fail('URL_NOT_ALLOWED');
  let url;
  try { url = new URL(value); } catch { fail('URL_NOT_ALLOWED'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.hash) fail('URL_NOT_ALLOWED');
  // Exact host allowlists below also reject IP literals and private DNS names.
  if (/^(?:localhost|.*\.localhost|.*\.local|.*\.internal)$/iu.test(url.hostname) ||
    url.hostname.includes(':') || /^\d+(?:\.\d+){3}$/u.test(url.hostname)) fail('URL_NOT_ALLOWED');
  return url;
}

function sourceUrl(value, allowedSourceUrls = []) {
  const url = publicHttpsUrl(value);
  if (!Array.isArray(allowedSourceUrls) || allowedSourceUrls.length > 20) fail('URL_NOT_ALLOWED');
  const extra = allowedSourceUrls.map((item) => publicHttpsUrl(item).href);
  if (!SOURCE_HOSTS.has(url.hostname) && !extra.includes(url.href)) fail('URL_NOT_ALLOWED');
  if (SOURCE_HOSTS.has(url.hostname) && url.pathname.split('/').filter(Boolean).length < 2) fail('URL_NOT_ALLOWED');
  return url.href;
}

async function readBounded(response, maximum, signal) {
  const declaredLength = response.headers.get('content-length');
  if (declaredLength && (!/^\d+$/u.test(declaredLength) || Number(declaredLength) > maximum)) {
    await response.body?.cancel().catch(() => {});
    fail('RESPONSE_TOO_LARGE', { sent: true, outcome: 'unknown' });
  }
  if (!response.body || typeof response.body.getReader !== 'function') fail('INVALID_RESPONSE', { sent: true, outcome: 'unknown' });
  const reader = response.body.getReader();
  const cancelOnAbort = () => { void reader.cancel().catch(() => {}); };
  signal.addEventListener('abort', cancelOnAbort, { once: true });
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      if (signal.aborted) fail('REQUEST_TIMEOUT', { sent: true, outcome: 'unknown' });
      const chunk = await reader.read();
      if (chunk.done) break;
      if (!(chunk.value instanceof Uint8Array)) fail('INVALID_RESPONSE', { sent: true, outcome: 'unknown' });
      length += chunk.value.byteLength;
      if (length > maximum) fail('RESPONSE_TOO_LARGE', { sent: true, outcome: 'unknown' });
      chunks.push(chunk.value);
    }
    if (length === 0) fail('INVALID_RESPONSE', { sent: true, outcome: 'unknown' });
    const bytes = Buffer.concat(chunks, length);
    let text;
    try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { fail('INVALID_RESPONSE', { sent: true, outcome: 'unknown' }); }
    try { return JSON.parse(text); } catch { fail('INVALID_RESPONSE', { sent: true, outcome: 'unknown' }); }
  } finally {
    signal.removeEventListener('abort', cancelOnAbort);
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

async function requestJson(url, init, { fetchImpl = globalThis.fetch, timeoutMs = DEFAULT_TIMEOUT_MS,
  maxResponseBytes = MAX_RESPONSE_BYTES } = {}) {
  if (typeof fetchImpl !== 'function' || !integer(timeoutMs, 1, 120_000) ||
    !integer(maxResponseBytes, 128, MAX_RESPONSE_BYTES)) fail('INVALID_REQUEST');
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new EditorialProviderError('REQUEST_TIMEOUT', { sent: true, outcome: 'unknown' }));
    }, timeoutMs);
  });
  const work = (async () => {
    const response = await fetchImpl(url, { ...init, redirect: 'error', signal: controller.signal });
    if (!response || !integer(response.status, 100, 599) || !response.headers?.get) fail('INVALID_RESPONSE', { sent: true, outcome: 'unknown' });
    if (response.redirected || (response.status >= 300 && response.status < 400)) fail('REDIRECT_REJECTED', { sent: true, outcome: 'unknown' });
    if (response.status < 200 || response.status >= 300) {
      await response.body?.cancel().catch(() => {});
      // Never include a provider's response body, URL, key, or exception text.
      fail('HTTP_ERROR', { status: response.status, sent: true, outcome: 'rejected' });
    }
    if (!/^application\/json(?:\s*;|$)/iu.test(response.headers.get('content-type') || '')) {
      await response.body?.cancel().catch(() => {});
      fail('INVALID_RESPONSE', { sent: true, outcome: 'unknown' });
    }
    return readBounded(response, maxResponseBytes, controller.signal);
  })();
  try { return await Promise.race([work, timeout]); }
  catch (error) {
    if (error instanceof EditorialProviderError) throw error;
    fail(controller.signal.aborted ? 'REQUEST_TIMEOUT' : 'REQUEST_FAILED', { sent: true, outcome: 'unknown' });
  } finally { clearTimeout(timer); }
}

function responseFail(code = 'INVALID_RESPONSE', usage) { fail(code, { sent: true, outcome: 'unknown', usage }); }
function jsonBody(value) {
  if (!jsonData(value)) fail('INVALID_REQUEST');
  const serialized = JSON.stringify(value);
  if (byteLength(serialized) > MAX_REQUEST_BYTES) fail('REQUEST_TOO_LARGE');
  return serialized;
}

/** Only public repository discovery and source-reading endpoints, never account or action endpoints. */
export async function githubJson(path, { fetchImpl, token, timeoutMs, maxResponseBytes } = {}) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//') || /[\\\u0000-\u0020]/u.test(path)) fail('URL_NOT_ALLOWED');
  const url = publicHttpsUrl(`https://api.github.com${path}`);
  if (url.hostname !== 'api.github.com' || !(/^\/search\/repositories$/u.test(url.pathname) ||
    /^\/repos\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/(?:readme|license|releases(?:\/(?:latest|\d+))?|commits(?:\/[A-Za-z0-9_.-]+)?|contents(?:\/[A-Za-z0-9_.\/-]+)?))?$/u.test(url.pathname))) fail('URL_NOT_ALLOWED');
  const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'AccessFreeTools-editorial' };
  if (token !== undefined) headers.Authorization = `Bearer ${credential(token)}`;
  const data = await requestJson(url.href, { method: 'GET', headers }, { fetchImpl, timeoutMs, maxResponseBytes });
  if ((!isRecord(data) && !Array.isArray(data)) || !jsonData(data)) responseFail();
  if (url.pathname === '/search/repositories' && (!Array.isArray(data.items) || !integer(data.total_count) ||
    typeof data.incomplete_results !== 'boolean')) responseFail();
  if (data.private === true || data.incomplete_results === true ||
    (Array.isArray(data.items) && data.items.some((item) => item?.private === true))) responseFail('SOURCE_UNAVAILABLE');
  return { data, usage: {} };
}

/** Search is deliberately absent: Jina Search has no documented per-call billing ceiling. */
export async function jinaRead(url, { key, fetchImpl, tokenBudget = 10_000, allowedSourceUrls = [], timeoutMs, maxResponseBytes } = {}) {
  const target = sourceUrl(url, allowedSourceUrls);
  if (!integer(tokenBudget, 500, 10_000)) fail('INVALID_REQUEST');
  const headers = { Authorization: `Bearer ${credential(key)}`, Accept: 'application/json',
    'X-Token-Budget': String(tokenBudget), 'X-Retain-Images': 'none', 'X-Respond-With': 'markdown' };
  const response = await requestJson(`https://r.jina.ai/${target}`, { method: 'GET', headers }, { fetchImpl, timeoutMs, maxResponseBytes });
  if (!isRecord(response) || response.code !== 200 || response.status !== 20000 || !isRecord(response.data)) responseFail();
  const document = response.data;
  const tokens = document.usage?.tokens;
  if (!integer(tokens, 1) || !isRecord(document.usage)) responseFail();
  const usage = { tokens };
  if (tokens > tokenBudget) responseFail('PROVIDER_BUDGET_EXCEEDED', usage);
  if ((document.truncated !== undefined && document.truncated !== false) || document.warning || response.warning) responseFail('SOURCE_INCOMPLETE', usage);
  const text = document.content ?? document.text;
  if (typeof text !== 'string' || !text.trim() ||
    (document.content !== undefined && document.text !== undefined && document.content !== document.text)) responseFail('SOURCE_INCOMPLETE', usage);
  let returnedUrl;
  try { returnedUrl = sourceUrl(document.url, allowedSourceUrls); } catch { responseFail('SOURCE_URL_CHANGED', usage); }
  if (returnedUrl !== target) responseFail('SOURCE_URL_CHANGED', usage);
  return { data: { text, url: returnedUrl, truncated: false }, usage };
}

export async function ollamaChat(messages, { key, model = 'gpt-oss:120b', fetchImpl, maxOutputTokens = 3000,
  timeoutMs, maxResponseBytes } = {}) {
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 12 ||
    messages.some((message) => !sameKeys(message, ['role', 'content']) ||
      !['system', 'user', 'assistant'].includes(message.role) || typeof message.content !== 'string' || !message.content.trim()) ||
    typeof model !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:/-]{0,100}$/u.test(model) || !integer(maxOutputTokens, 1, 4000)) fail('INVALID_REQUEST');
  // Cloud does not support `format`/JSON-schema enforcement. The caller prompts
  // for JSON, and this adapter parses it locally without repair or another call.
  const body = jsonBody({ model, messages, stream: false, options: { temperature: 0.2, num_predict: maxOutputTokens } });
  const response = await requestJson('https://ollama.com/api/chat', { method: 'POST',
    headers: { Authorization: `Bearer ${credential(key)}`, 'Content-Type': 'application/json', Accept: 'application/json' }, body },
  { fetchImpl, timeoutMs, maxResponseBytes });
  if (!isRecord(response) || response.model !== model || response.done !== true || response.done_reason !== 'stop' ||
    !isRecord(response.message) || response.message.role !== 'assistant' || typeof response.message.content !== 'string' ||
    response.message.tool_calls?.length || !integer(response.prompt_eval_count, 1) || !integer(response.eval_count, 1)) responseFail();
  const usage = { inputTokens: response.prompt_eval_count, outputTokens: response.eval_count };
  if (response.eval_count > maxOutputTokens) responseFail('PROVIDER_BUDGET_EXCEEDED', usage);
  let data;
  try { data = JSON.parse(response.message.content); } catch { responseFail('INVALID_GENERATED_JSON', usage); }
  if (!isRecord(data) || !jsonData(data)) responseFail('INVALID_GENERATED_JSON', usage);
  return { data, usage };
}

function validateQuestions(questions) {
  if (!isRecord(questions) || Object.keys(questions).length < 1 || Object.keys(questions).length > 64) fail('INVALID_REQUEST');
  for (const [id, question] of Object.entries(questions)) {
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/u.test(id) || UNSAFE_KEYS.has(id) || !isRecord(question) ||
      !structuredText(question.instructions) || !['choice', 'score', 'noul'].includes(question.type) ||
      Object.keys(question).some((key) => !['type', 'instructions', 'criteria'].includes(key))) fail('INVALID_REQUEST');
    if (question.type === 'choice') {
      if (!isRecord(question.criteria) || Object.keys(question.criteria).length < 2 || Object.keys(question.criteria).length > 255 ||
        Object.entries(question.criteria).some(([option, rubric]) => !option || option.length > 120 || UNSAFE_KEYS.has(option) ||
          (rubric !== null && !structuredText(rubric)))) fail('INVALID_REQUEST');
    } else if (question.type === 'score') {
      if (!Array.isArray(question.criteria) || question.criteria.length < 2 || question.criteria.length > 10 ||
        !question.criteria.every(structuredText)) fail('INVALID_REQUEST');
    } else if (question.criteria !== undefined && (!sameKeys(question.criteria, ['true', 'false']) ||
      !structuredText(question.criteria.true) || !structuredText(question.criteria.false))) fail('INVALID_REQUEST');
  }
}

function validateDistribution(distribution, keys) {
  if (!sameKeys(distribution, keys) || !Object.values(distribution).every(probability) ||
    Math.abs(Object.values(distribution).reduce((total, value) => total + value, 0) - 1) > 0.0001) responseFail();
}

export async function typesafeEvaluate(state, questions, { key, fetchImpl, model = 'jev-1.13.0', timeoutMs, maxResponseBytes } = {}) {
  if (!structuredText(state) || model !== 'jev-1.13.0') fail('INVALID_REQUEST');
  validateQuestions(questions);
  // UTF-8 byte limits are deliberately smaller than the documented 64k total /
  // 32k state-plus-longest-question context. They are local bounds, not billing.
  for (const question of Object.values(questions)) {
    if (byteLength(JSON.stringify({ state, question })) > 28_000) fail('REQUEST_TOO_LARGE');
  }
  const body = jsonBody({ state, model, questions });
  const response = await requestJson('https://api.typesafe.ai/v1/systemone', { method: 'POST',
    headers: { Authorization: `Bearer ${credential(key)}`, 'Content-Type': 'application/json', Accept: 'application/json' }, body },
  { fetchImpl, timeoutMs, maxResponseBytes });
  if (!isRecord(response) || response.model !== model || !sameKeys(response.answers, Object.keys(questions)) ||
    !integer(response.usage?.input_tokens, 1, 64_000) || !integer(response.usage?.output_tokens)) responseFail();
  const usage = { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens };
  for (const [id, question] of Object.entries(questions)) {
    const answer = response.answers[id];
    if (!isRecord(answer) || answer.type !== question.type) responseFail();
    if (question.type === 'noul') {
      if (!sameKeys(answer, ['type', 'noul']) || !probability(answer.noul)) responseFail();
    } else if (question.type === 'choice') {
      if (!sameKeys(answer, ['type', 'choice', 'probabilities', 'confidence']) || !probability(answer.confidence) ||
        typeof answer.choice !== 'string' || !Object.hasOwn(question.criteria, answer.choice)) responseFail();
      validateDistribution(answer.probabilities, Object.keys(question.criteria));
      if (answer.probabilities[answer.choice] < Math.max(...Object.values(answer.probabilities)) - 0.0001) responseFail();
      const count = Object.keys(question.criteria).length;
      const confidence = (Math.max(...Object.values(answer.probabilities)) - 1 / count) / (1 - 1 / count);
      // Official examples round probability/confidence fields independently.
      if (Math.abs(confidence - answer.confidence) > 0.02) responseFail();
    } else {
      const keys = question.criteria.map((_, index) => String(index));
      if (!sameKeys(answer, ['type', 'score', 'legend', 'probabilities', 'confidence']) || !probability(answer.confidence) ||
        !sameKeys(answer.legend, keys) || !Object.values(answer.legend).every((value) => typeof value === 'string') ||
        typeof answer.score !== 'number' || !Number.isFinite(answer.score) || answer.score < 0 || answer.score > keys.length - 1) responseFail();
      validateDistribution(answer.probabilities, keys);
      const weighted = keys.reduce((total, index) => total + Number(index) * answer.probabilities[index], 0);
      if (Math.abs(weighted - answer.score) > 0.001) responseFail();
      const mostLikely = keys.reduce((best, index) => answer.probabilities[index] > answer.probabilities[best] ? index : best, keys[0]);
      const distance = keys.reduce((total, index) => total + answer.probabilities[index] * Math.abs(Number(index) - Number(mostLikely)), 0);
      const uniformDistance = keys.reduce((total, index) => total + Math.abs(Number(index) - (keys.length - 1) / 2), 0) / keys.length;
      if (Math.abs(Math.max(0, 1 - distance / uniformDistance) - answer.confidence) > 0.02) responseFail();
    }
  }
  return { data: { model: response.model, answers: response.answers }, usage };
}

/** Preserve the entire checked source or leave it unassessed; never omit qualifiers. */
export function completeSentenceContext(text, quote, bounds = 4000) {
  const maxBytes = typeof bounds === 'number' ? bounds : bounds?.maxBytes ?? 4000;
  const maxChars = typeof bounds === 'object' ? bounds?.maxChars : undefined;
  if (typeof text !== 'string' || typeof quote !== 'string' || !quote.trim() || byteLength(text) > 1_000_000 ||
    !integer(maxBytes, 1, 56_000) || (maxChars !== undefined && !integer(maxChars, 1, 56_000))) return null;
  const start = text.indexOf(quote);
  if (start < 0 || text.indexOf(quote, start + 1) >= 0) return null;
  if (byteLength(text) > maxBytes || (maxChars !== undefined && text.length > maxChars)) return null;
  const paragraphs = text.split(/\r?\n[\t ]*\r?\n+/u);
  const paragraph = paragraphs.find((part) => part.includes(quote))?.trim();
  if (!paragraph || paragraph.includes('```') || paragraph.includes('~~~') ||
    !/[.!?]["'\u201d\u2019)\]]*$/u.test(paragraph)) return null;
  // A paragraph can be qualified or contradicted anywhere else in this same
  // document. We cannot identify a safely irrelevant remainder mechanically.
  // Return exact complete text, including adjacent paragraphs and headings.
  return text;
}
