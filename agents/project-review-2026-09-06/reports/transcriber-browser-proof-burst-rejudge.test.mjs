import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';

// Final bounded check only. Earlier characterization tests remain historical.
const root = process.env.TRANSCRIBER_JUDGE_ROOT
  ?? 'C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber';
const { matchSyntheticSpeech } = await import(
  pathToFileURL(resolve(root, 'scripts/lib/transcriber-browser-proof.mjs')).href
);
const source = readFileSync(resolve(root, 'scripts/transcriber-browser-compatibility.mjs'), 'utf8');
const start = source.indexOf("    if (fixtureName.startsWith('hour-') && srtCues) {");
const end = source.indexOf('    report.checks.noOverflow =', start);
assert.ok(start >= 0 && end > start, 'locate actual hour acceptance block');
const gate = (cues) => {
  const report = { checks: {}, subtitles: { lastEnd: cues.at(-1)?.end ?? 0 } };
  vm.runInNewContext(source.slice(start, end), {
    report, fixtureName: 'hour-mp4', srtCues: cues, matchSyntheticSpeech,
  });
  return report;
};

test('single one-hour cue is rejected by matcher and actual runner gate', () => {
  const cues = [{ start: 0, end: 3600, text: 'synthetic voice' }];
  assert.equal(matchSyntheticSpeech(cues, 120), 0);
  assert.equal(gate(cues).speechCoverage.matchedIntervals, 0);
  assert.equal(gate(cues).checks.hourSpeechCoverage, false);
});

test('one nearby cue cannot be reused for separate bursts, even if its reference is duplicated', () => {
  const cue = { start: 60, end: 75, text: 'synthetic voice' };
  assert.equal(matchSyntheticSpeech([cue], 120), 1);
  assert.equal(matchSyntheticSpeech(Array(120).fill(cue), 120), 1);
  assert.equal(gate([cue]).checks.hourSpeechCoverage, false);
});

test('120 distinct nearby cues of at most 15 seconds pass matcher and actual runner gate', () => {
  const cues = Array.from({ length: 120 }, (_, index) => {
    const start = index * 30 + (index % 2 ? 8 : 0);
    return { start, end: start + (index % 2 ? 15 : 5), text: 'synthetic voice' };
  });
  assert.equal(matchSyntheticSpeech(cues, 120), 120);
  assert.equal(gate(cues).speechCoverage.matchedIntervals, 120);
  assert.equal(gate(cues).checks.hourSpeechCoverage, true);
});

test('duration/proximity boundaries do not admit overlong or distant cues', () => {
  assert.equal(matchSyntheticSpeech([{ start: 0, end: 15, text: 'voice' }], 120), 1);
  assert.equal(matchSyntheticSpeech([{ start: 0, end: 15.001, text: 'voice' }], 120), 0);
  assert.equal(matchSyntheticSpeech([{ start: 8.001, end: 10, text: 'voice' }], 120), 0);
  assert.equal(matchSyntheticSpeech([{ start: 0, end: 0.499, text: 'voice' }], 120), 0);
  assert.equal(matchSyntheticSpeech([{ start: 0, end: 5, text: 'different marker' }], 120), 0);
});
