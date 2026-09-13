import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';

// Characterization tests: passing reproductions are not approval of these gaps.
// No browsers, model loaders, network requests, or application mutations run here.
const root = process.env.TRANSCRIBER_JUDGE_ROOT
  ?? 'C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber';
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const { classifyTranscriberRequest, summarizeSubtitleProof } = await import(
  pathToFileURL(resolve(root, 'scripts/lib/transcriber-browser-proof.mjs')).href
);
const harness = read('scripts/transcriber-browser-compatibility.mjs');
const origin = 'http://127.0.0.1:4321';
const marker = 'tr03-private-sentinel';
const model = 'https://huggingface.co/onnx-community/whisper-tiny.en_timestamped/resolve/aeaa13760958b03fac5062f457d317d3319c3168/config.json';
const check = (request) => classifyTranscriberRequest(request, { origin, started: true, sentinels: [marker] });

test('all 18 recorded requests from the successful 05:16 smoke remain allowed', () => {
  const proof = JSON.parse(read('output/browser-transcriber-pilot/latest.json'));
  assert.equal(proof.generatedAt, '2026-09-06T05:16:05.826Z', 'smoke artifact was replaced; rejudge it');
  const requests = proof.evidence.modelRequestsAfterStart;
  assert.equal(requests.length, 18);
  for (const url of requests) assert.equal(check({ url, method: 'GET' }), 'model', url);
});

test('installed Transformers metadata uses GET Range, also allowed by helper', () => {
  const source = read('node_modules/@huggingface/transformers/src/utils/model_registry/get_file_metadata.js');
  assert.match(source, /headers\.set\('Range', 'bytes=0-0'\)/);
  assert.match(source, /env\.fetch\(urlOrPath, \{ method: 'GET', headers, cache: 'no-store' \}\)/);
  assert.equal(check({ url: model, method: 'GET', headers: { Range: 'bytes=0-0' } }), 'model');
});

test('installed Chromium network manager auto-continues redirect without a user route', () => {
  const source = read('node_modules/playwright-core/lib/coreBundle.js');
  const start = source.indexOf('      _onRequest(requestWillBeSentSessionInfo, requestWillBeSentEvent, requestPausedSessionInfo, requestPausedEvent) {');
  const end = source.indexOf('\n      _createResponse(', start);
  assert.ok(start >= 0 && end > start, 'installed method must be located exactly');
  const FakeManager = vm.runInNewContext(`(class { ${source.slice(start, end)} })`, {
    InterceptableRequest: class {
      constructor(options) { this.request = { options, setRawRequestHeaders() {} }; }
    },
    RouteImpl: class {},
    headersObjectToArray: () => [],
  });
  const manager = new FakeManager();
  const commands = [];
  const delivered = [];
  const session = { _sendMayFail: (...args) => commands.push(args) };
  manager._requestIdToRequest = new Map([['pinned', {}]]);
  manager._handleRequestRedirect = () => {};
  manager._userRequestInterceptionEnabled = true;
  manager._page = {
    browserContext: {},
    frameManager: { frame: () => ({}), requestStarted: (request, route) => delivered.push({ request, route }) },
  };
  const request = { url: `https://example.invalid/collect?value=${marker}`, method: 'GET', headers: {} };
  const event = { requestId: 'pinned', frameId: 'frame', request, redirectResponse: {}, initiator: { type: 'script' }, type: 'Fetch' };
  const paused = { requestId: 'interception', request };
  manager._onRequest({ session }, event, { session }, paused);
  assert.equal(commands[0][0], 'Fetch.continueRequest');
  assert.equal(delivered[0].route, undefined);
  assert.equal(check(request), 'blocked-private-data', 'classifier would block if invoked');
  commands.length = 0;
  manager._onRequest({ session }, { ...event, requestId: 'fresh', redirectResponse: undefined }, { session }, paused);
  assert.ok(delivered[1].route, 'nonredirect control receives a route');
  assert.equal(commands.length, 0);
});

test('private header on approved URL and encoded same-origin path escape classification', () => {
  assert.equal(check({ url: model, method: 'GET', headers: { 'X-Private': marker } }), 'model');
  const encoded = Buffer.from(marker).toString('base64url');
  assert.equal(check({ url: `${origin}/collect/${encoded}`, method: 'GET' }), 'local');
});

test('installed request interception enables wildcard Fetch and changes worker cache behavior', async () => {
  const source = read('node_modules/playwright-core/lib/coreBundle.js');
  const start = source.indexOf('      async _updateProtocolRequestInterceptionForSession(info, initial) {');
  const end = source.indexOf('\n      async setExtraHTTPHeaders(', start);
  assert.ok(start >= 0 && end > start);
  const Manager = vm.runInNewContext(`(class { ${source.slice(start, end)} })`);
  const manager = new Manager();
  manager._protocolRequestInterceptionEnabled = true;
  const calls = [];
  const session = { send: async (name, params) => { calls.push({ name, params }); } };
  await manager._updateProtocolRequestInterceptionForSession({ session }, true);
  assert.equal(calls[0].name, 'Network.setCacheDisabled');
  assert.equal(calls[0].params.cacheDisabled, true);
  assert.equal(calls[1].name, 'Fetch.enable');
  assert.equal(calls[1].params.patterns[0].urlPattern, '*');
  calls.length = 0;
  await manager._updateProtocolRequestInterceptionForSession({ session, workerFrame: {} }, true);
  assert.equal(calls.length, 1, 'worker session skips its own Fetch.enable, not cache disabling');
  assert.equal(calls[0].name, 'Network.setCacheDisabled');
  assert.equal(calls[0].params.cacheDisabled, true);
});

const validCue = '1\n00:00:00,000 --> 00:00:01,000\nsynthetic text\n';
for (const [label, srt] of [
  ['timestamp line without cue index or text', '00:00:00,000 --> 00:00:01,000'],
  ['malformed second cue silently omitted', `${validCue}\n2\n00:00:02,000 --> broken\nsynthetic text`],
  ['negative timestamp prefix ignored', '1\n-00:00:00,000 --> 00:00:01,000\nsynthetic text'],
]) {
  test(`subtitle false-pass: ${label}`, () => {
    assert.equal(summarizeSubtitleProof(srt, 5.5).valid, true);
  });
}

test('one second of subtitles passes for an hour-long fixture', () => {
  assert.equal(summarizeSubtitleProof(validCue, 3600).valid, true);
  assert.equal(summarizeSubtitleProof(validCue, 3600).lastEnd, 1);
});

test('real pass expression does not gate missing or excessive memory measurements', () => {
  const expression = harness.match(/report\.status = (Object\.values\(report\.checks\)[^;]+);/)[1];
  for (const memory of [[], [{ summedProcessWorkingSetBytes: 64 * 1024 ** 3 }]]) {
    const report = { checks: { nonemptyTranscript: true }, failures: [], memory, memorySampleFailures: 100 };
    assert.equal(vm.runInNewContext(expression, { report }), 'pass');
  }
});

test('actual instrumentation counts repeated terminate calls as separate worker releases', () => {
  const start = harness.indexOf('await context.addInitScript(() => {');
  const end = harness.indexOf('\n  });', start);
  assert.ok(start >= 0 && end > start);
  const body = harness.slice(start + 'await context.addInitScript(() => {'.length, end);
  const window = { Worker: class { terminate() { this.stopped = true; } } };
  vm.runInNewContext(body, { window, URL: { createObjectURL() {}, revokeObjectURL() {} } });
  const first = new window.Worker();
  const stillLive = new window.Worker();
  first.terminate();
  first.terminate();
  assert.equal(stillLive.stopped, undefined);
  assert.equal(window.__transcriberProof.workersCreated, window.__transcriberProof.workersTerminated);
  assert.equal(window.__transcriberProof.urls.size, 0);
});
