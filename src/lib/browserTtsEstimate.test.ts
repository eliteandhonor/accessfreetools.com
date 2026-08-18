import { describe, expect, it } from 'vitest';

import {
  BROWSER_TTS_MP3_BITRATE_BPS,
  estimateBrowserTtsAudio,
} from './browserTtsEstimate';

describe('browser TTS audio estimator', () => {
  it('returns no estimate for empty, whitespace-only, or punctuation-only input', () => {
    for (const value of ['', ' \n\t ', '... !? ,;']) {
      const estimate = estimateBrowserTtsAudio(value, 1);
      expect(estimate.status).toBe('empty');
      expect(estimate.basis).toBe('none');
      expect(estimate.durationSeconds).toBeNull();
      expect(estimate.mp3Bytes).toBeNull();
    }
  });

  it('estimates Latin word-delimited text with an outward duration range', () => {
    const estimate = estimateBrowserTtsAudio(Array.from({ length: 130 }, () => 'word').join(' '), 1);

    expect(estimate).toMatchObject({
      status: 'ready',
      basis: 'word-delimited',
      units: { words: 130, compactScriptCharacters: 0 },
      durationSeconds: { min: 43, max: 60 },
      mp3Bytes: { min: 688_000, max: 960_000 },
    });
    expect(BROWSER_TTS_MP3_BITRATE_BPS).toBe(128_000);
  });

  it('uses compact-script graphemes for CJK and other no-space scripts', () => {
    const cjk = estimateBrowserTtsAudio('\u8fd9\u662f\u4e00\u4e2a\u6d4b\u8bd5\u3002', 1);
    const thai = estimateBrowserTtsAudio('\u0e19\u0e35\u0e48\u0e04\u0e37\u0e2d\u0e01\u0e32\u0e23\u0e17\u0e14\u0e2a\u0e2d\u0e1a', 1);

    expect(cjk).toMatchObject({
      status: 'ready',
      basis: 'compact-script',
      units: { words: 0, compactScriptCharacters: 6, sentenceBreaks: 1 },
    });
    expect(thai.status).toBe('ready');
    expect(thai.basis).toBe('compact-script');
    expect(thai.units.words).toBe(0);
    expect(thai.units.compactScriptCharacters).toBeGreaterThan(0);
  });

  it('handles RTL and mixed Unicode text without treating direction as a model claim', () => {
    const rtl = estimateBrowserTtsAudio('\u0647\u0630\u0627 \u0627\u062e\u062a\u0628\u0627\u0631 \u0639\u0631\u0628\u064a \u0648\u0627\u0636\u062d.', 1.05);
    const mixed = estimateBrowserTtsAudio('Read \u7b2c\u4e00\u7ae0 now.', 1.05);

    expect(rtl).toMatchObject({
      status: 'ready',
      basis: 'word-delimited',
      units: { words: 4, compactScriptCharacters: 0, sentenceBreaks: 1 },
    });
    expect(mixed).toMatchObject({
      status: 'ready',
      basis: 'mixed',
      units: { words: 2, compactScriptCharacters: 3 },
    });
  });

  it('widens the duration range for punctuation-heavy text', () => {
    const plain = estimateBrowserTtsAudio('one two three four', 1);
    const punctuated = estimateBrowserTtsAudio('one, two; three! four?', 1);

    expect(punctuated.units).toMatchObject({ sentenceBreaks: 2, clauseBreaks: 2 });
    expect(punctuated.durationSeconds!.max).toBeGreaterThan(plain.durationSeconds!.max);
    expect(punctuated.mp3Bytes!.max).toBeGreaterThan(plain.mp3Bytes!.max);
  });

  it('adjusts both ranges monotonically across the supported speed range', () => {
    const value = Array.from({ length: 260 }, () => 'word').join(' ');
    const slow = estimateBrowserTtsAudio(value, 0.9);
    const normal = estimateBrowserTtsAudio(value, 1);
    const fast = estimateBrowserTtsAudio(value, 1.5);

    expect(slow.durationSeconds!.min).toBeGreaterThan(normal.durationSeconds!.min);
    expect(normal.durationSeconds!.min).toBeGreaterThan(fast.durationSeconds!.min);
    expect(slow.durationSeconds!.max).toBeGreaterThan(normal.durationSeconds!.max);
    expect(normal.durationSeconds!.max).toBeGreaterThan(fast.durationSeconds!.max);
    expect(slow.mp3Bytes!.max).toBe(slow.durationSeconds!.max * 16_000);
  });

  it('accepts exactly 10,000 characters and refuses longer input without truncation', () => {
    const atLimit = estimateBrowserTtsAudio('\u5b57'.repeat(10_000), 1);
    const overLimit = estimateBrowserTtsAudio('\u5b57'.repeat(10_001), 1);

    expect(atLimit).toMatchObject({
      status: 'ready',
      characterCount: 10_000,
      characterLimit: 10_000,
      units: { compactScriptCharacters: 10_000 },
    });
    expect(overLimit).toMatchObject({
      status: 'over-limit',
      characterCount: 10_001,
      characterLimit: 10_000,
      durationSeconds: null,
      mp3Bytes: null,
    });
  });

  it('rejects non-finite and out-of-range speed values', () => {
    for (const speed of [Number.NaN, Number.POSITIVE_INFINITY, 0.89, 1.51]) {
      expect(() => estimateBrowserTtsAudio('A short test.', speed)).toThrow(RangeError);
    }
    expect(estimateBrowserTtsAudio('A short test.', 0.9).status).toBe('ready');
    expect(estimateBrowserTtsAudio('A short test.', 1.5).status).toBe('ready');
  });

  it('returns the same numeric result for repeated calls without external state', () => {
    const value = 'Deterministic estimates stay local. \u5b57';
    expect(estimateBrowserTtsAudio(value, 1.1)).toEqual(estimateBrowserTtsAudio(value, 1.1));
  });
});
