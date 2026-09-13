import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';

// Bounded offline rejudge. The earlier judge file retains its historical assertions.
const root = process.env.TRANSCRIBER_JUDGE_ROOT
  ?? 'C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber';
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const { classifyTranscriberRequest, installResourceProof, parseSubtitleCues, summarizeSubtitleProof } = await import(
  pathToFileURL(resolve(root, 'scripts/lib/transcriber-browser-proof.mjs')).href
);
const source = read('scripts/transcriber-browser-compatibility.mjs');
const origin = 'http://127.0.0.1:4321';
const marker = 'tr03-private-sentinel';
const model = 'https://huggingface.co/onnx-community/whisper-tiny.en_timestamped/resolve/aeaa13760958b03fac5062f457d317d3319c3168/config.json';
const classify = (request) => classifyTranscriberRequest(request, {
  origin, started: true, sentinels: [marker], staticPaths: new Set(['/_astro/app.js']),
});

test('header and base64url counterexamples now rejected; only listed local paths allowed', () => {
  assert.equal(classify({ url: model, method: 'GET', headers: { 'X-Private': marker } }), 'blocked-private-data');
  assert.equal(classify({ url: `${origin}/collect/${Buffer.from(marker).toString('base64url')}`, method: 'GET' }), 'blocked-private-data');
  assert.equal(classify({ url: `${origin}/collect/unknown`, method: 'GET' }), 'blocked-path');
  assert.equal(classify({ url: `${origin}/_astro/app.js`, method: 'GET' }), 'local');
  assert.equal(classify({ url: model, method: 'GET', headers: { range: 'bytes=0-0' } }), 'model');
});

test('all recorded successful baseline model URLs remain allowed', () => {
  const report = JSON.parse(read('output/browser-transcriber-pilot/latest.json'));
  assert.equal(report.evidence.modelRequestsAfterStart.length, 18);
  for (const url of report.evidence.modelRequestsAfterStart) assert.equal(classify({ url, method: 'GET' }), 'model');
});

test('all three original malformed-SRT counterexamples now fail', () => {
  for (const srt of [
    '00:00:00,000 --> 00:00:01,000',
    '1\n00:00:00,000 --> 00:00:01,000\ntext\n\n2\n00:00:02,000 --> broken\ntext',
    '1\n-00:00:00,000 --> 00:00:01,000\ntext',
  ]) assert.equal(summarizeSubtitleProof(srt, 5.5).valid, false);
});

const parityStart = source.indexOf('    const srtCues = parseSubtitleCues(exportText.srt);');
const parityEnd = source.indexOf('    report.checks.noOverflow =', parityStart);
assert.ok(parityStart >= 0 && parityEnd > parityStart, 'locate actual export acceptance block');
const accept = (exportText, transcriptValues, fixtureName = 'short', duration = 5.544) => {
  const report = {
    exports: Object.values(exportText).map((text) => ({ bytes: Buffer.byteLength(text) })),
    subtitles: summarizeSubtitleProof(exportText.srt, duration), checks: {},
  };
  vm.runInNewContext(source.slice(parityStart, parityEnd), { exportText, transcriptValues, fixtureName, report, parseSubtitleCues });
  return report;
};
const baseline = Object.fromEntries(['txt', 'srt', 'vtt'].map((kind) => [kind,
  read(`output/browser-transcriber-pilot/2026-09-06T05-15-36-319Z/af_bella.${kind}`),
]));
const ui = baseline.txt.slice(0, -1).split('\n\n');

test('actual export acceptance block accepts all three saved successful outputs', () => {
  assert.equal(accept(baseline, ui).checks.validExports, true);
});

test('actual parity rejects malformed VTT, changed VTT times/text, TXT and UI text', () => {
  for (const changed of [
    { ...baseline, vtt: 'not a subtitle' },
    { ...baseline, vtt: baseline.vtt.replace('00:00:05.000', '00:00:04.000') },
    { ...baseline, vtt: `${baseline.vtt.trim()} changed\n` },
    { ...baseline, txt: `${baseline.txt}changed` },
  ]) assert.equal(accept(changed, ui).checks.validExports, false);
  assert.equal(accept(baseline, ['changed']).checks.validExports, false);
});

test('duplicate terminate no longer hides a distinct live worker', () => {
  const target = { Worker: class { terminate() {} }, URL: { createObjectURL() { return 'blob:judge'; }, revokeObjectURL() {} } };
  installResourceProof(target);
  const first = new target.Worker();
  const second = new target.Worker();
  first.terminate();
  first.terminate();
  assert.equal(target.__transcriberProof.liveWorkers.size, 1);
  assert.equal(target.__transcriberProof.workersTerminated, 1);
  second.terminate();
  assert.equal(target.__transcriberProof.liveWorkers.size, 0);
  assert.equal(target.__transcriberProof.workersTerminated, 2);
});

test('actual mutation predicates reject extra unknown categories and extra marker requests', () => {
  const start = source.indexOf("    report.checks.mutationsDetected =");
  const end = source.indexOf('\n  } else {', start);
  assert.ok(start >= 0 && end > start);
  const check = (requests) => {
    const report = { requests, checks: {} };
    vm.runInNewContext(source.slice(start, end), { report });
    return Object.values(report.checks).every(Boolean);
  };
  assert.equal(check({ local: 17, 'blocked-private-data': 7, 'blocked-environment': 1 }), true);
  assert.equal(check({ 'blocked-private-data': 7, 'blocked-origin': 1 }), false);
  assert.equal(check({ 'blocked-private-data': 7, 'blocked-path': 1 }), false);
  assert.equal(check({ 'blocked-private-data': 8 }), false);
});

test('hour heuristic rejects old one-second counterexample, but a single broad cue still passes', () => {
  const hour = (end) => {
    const text = 'synthetic voice';
    return accept({ txt: `${text}\n`, srt: `1\n00:00:00,000 --> ${end},000\n${text}\n`,
      vtt: `WEBVTT\n\n00:00:00.000 --> ${end}.000\n${text}\n` }, [text], 'hour-mp3', 3600);
  };
  assert.equal(hour('00:00:01').checks.hourSpeechCoverage, false);
  const broad = hour('01:00:00');
  assert.equal(broad.checks.validExports, true);
  assert.equal(broad.checks.hourSpeechCoverage, true);
  assert.equal(broad.speechCoverage.matchedIntervals, 120);
});
