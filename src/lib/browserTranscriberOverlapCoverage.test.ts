import { describe, expect, it } from 'vitest';
import type { TranscriptSegment, TranscriptWord } from './browserTranscriber';
import { canReplaceWhisperHypotheses } from './browserTranscriberOverlapCoverage';

const word = (text: string, start: number, end: number): TranscriptWord => ({ text, start, end });
const caption = (words: TranscriptWord[]): TranscriptSegment => ({
  start: words[0].start, end: words.at(-1)!.end,
  text: words.map(item => item.text).join('').trim(), words,
});
const sentence = (texts: string[], start = 1): TranscriptSegment =>
  caption(texts.map((text, index) => word(text, start + index, start + index + 1)));
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    Object.values(value).forEach(freeze);
  }
  return value;
}
function check(originals: TranscriptSegment[][], replacement: TranscriptSegment[]): boolean {
  const before = structuredClone({ originals, replacement });
  const result = canReplaceWhisperHypotheses(freeze(originals), freeze(replacement));
  expect({ originals, replacement }).toEqual(before);
  return result;
}

// Numeric shape only; these words are synthetic, not a recorded transcript.
function boundaryFixture() {
  const text = [' These', ' small', ' checks', ' protect', ' words.',
    ' Please', ' do', ' keep', ' this', ' color', ' while', ' we', ' finish', ' now.'];
  const early = [[150.72, 151.12], [151.12, 151.5], [151.5, 151.78], [151.78, 152.1], [152.1, 152.62],
    [152.84, 153.02], [153.02, 153.16], [153.16, 153.34], [153.34, 153.72], [153.72, 154],
    [154.1, 154.38], [154.38, 154.66], [154.66, 154.98], [154.98, 154.98]];
  const complete = [[150.82, 151.12], [151.12, 151.5], [151.5, 151.78], [151.78, 152.1], [152.1, 152.6],
    [152.8, 153.04], [153.04, 153.18], [153.18, 153.36], [153.36, 153.82], [153.82, 154.12],
    [154.12, 154.38], [154.38, 154.64], [154.64, 155], [155.06, 156.36]];
  const retry = [[150.78, 151.12], [151.12, 151.48], [151.48, 151.78], [151.78, 152.1], [152.1, 152.58],
    [152.86, 153.04], [153.04, 153.16], [153.16, 153.36], [153.36, 153.8], [153.8, 154.12],
    [154.12, 154.46], [154.46, 154.66], [154.66, 154.98], [154.98, 157.06]];
  const make = (times: number[][], alternative = false) => {
    const words = times.map(([start, end], index) =>
      word(alternative && index === 9 ? ' colour' : text[index], start, end));
    return [caption(words.slice(0, 5)), caption(words.slice(5))];
  };
  return { originals: [make(early, true), make(complete)], replacement: make(retry) };
}

describe('bounded Whisper hypothesis replacement coverage', () => {
  it('rejects an unproven point even when a stretched neighbor touches the target', () => {
    const { originals, replacement } = boundaryFixture();
    replacement[1].words!.at(-2)!.end = 155.12;
    replacement[1].words!.at(-1)!.start = 155.12;
    expect(check(originals, replacement)).toBe(false);
  });
  it.each([2, 2.5, 3])('accepts an anchored ordinary point inside or at the target endpoints: %s', point => {
    const full = caption([word(' Keep', 1, 2), word(' this', 2, 3), word(' safe.', 3, 4)]);
    const partial = caption([word(' Keep', 1, 2), word(' this', point, point), word(' safe.', 3, 4)]);
    expect(check([[partial], [full]], [structuredClone(full)])).toBe(true);
  });
  it.each([29.8, 29.98])('rejects a zero-gap stretched predecessor with and without source provenance: %s', point => {
    const early = caption([word(' Keep', 26, 27), word(' this', 29.64, point), word(' word.', point, point)]);
    const later = caption([word(' Keep', 26, 27), word(' this', 29.64, 40), word(' word.', 40, 41)]);
    expect(check([[early], [later]], [structuredClone(later)])).toBe(false);
    expect(canReplaceWhisperHypotheses([[early], [later]], [later],
      [{ start: 0, end: 30, segments: [early] }, { start: 25, end: 55, segments: [later] }])).toBe(false);
  });
  it('rejects a zero-gap stretched successor instead of substituting an earlier occurrence', () => {
    const original = caption([word(' Keep', 40, 40), word(' this', 40, 41), word(' safe.', 41, 42)]);
    const earlier = caption([word(' Keep', 26, 27), word(' this', 27, 41), word(' safe.', 41, 42)]);
    expect(check([[original], [earlier]], [structuredClone(earlier)])).toBe(false);
  });
  it('uses full-window final-frame provenance only for a corroborated terminal lexical slot', () => {
    const { originals, replacement } = boundaryFixture();
    const retry = replacement[1].words!;
    retry[retry.length - 2].end = 155;
    retry[retry.length - 1].start = 155.02;
    const windows = [{ start: 125, end: 155, segments: originals[0] },
      { start: 150, end: 180, segments: originals[1] }];
    expect(check(originals, replacement)).toBe(false);
    const before = structuredClone({ originals, replacement, windows });
    expect(canReplaceWhisperHypotheses(freeze(originals), freeze(replacement), freeze(windows))).toBe(true);
    expect({ originals, replacement, windows }).toEqual(before);
  });
  it.each([0, 319, 320, 321, 320.25])('bounds the censored onset to the actual source end: %s samples', samples => {
    const early = caption([word(' Keep', 26, 27), word(' this', 29.64, 29.98), word(' word.', 29.98, 29.98)]);
    const complete = caption([word(' Keep', 26, 27), word(' this', 29.64, 30),
      word(' word.', 30 + samples / 16000, 31)]);
    expect(canReplaceWhisperHypotheses([[early], [complete]], [complete],
      [{ start: 0, end: 30, segments: [early] }])).toBe(samples <= 320);
  });
  it('rejects a stretched agreeing predecessor instead of moving the censored occurrence into later speech', () => {
    const early = caption([word(' Keep', 26, 27), word(' this', 29.64, 29.98), word(' word.', 29.98, 29.98)]);
    const complete = caption([word(' Keep', 26, 27), word(' this', 29.64, 40), word(' word.', 40.02, 41)]);
    expect(canReplaceWhisperHypotheses([[early], [complete]], [complete],
      [{ start: 0, end: 30, segments: [early] }])).toBe(false);
  });
  it.each([0.04, 0.12, 1, 10])('rejects censored-tail correspondence across a %s second retry gap', gap => {
    const { originals, replacement } = boundaryFixture();
    for (const candidate of [originals[1], replacement]) {
      const words = candidate.at(-1)!.words!;
      const last = words.at(-1)!;
      last.start = replacement.at(-1)!.words!.at(-2)!.end + gap;
      last.end = last.start + 1;
      candidate.at(-1)!.end = last.end;
    }
    expect(canReplaceWhisperHypotheses(originals, replacement,
      [{ start: 125, end: 155, segments: originals[0] }])).toBe(false);
  });
  it.each(['absent', 'short', 'offset', 'later-word', 'detached'] as const)(
    'does not infer final-frame censoring from %s provenance', shape => {
      const { originals, replacement } = boundaryFixture();
      replacement[1].words!.at(-1)!.start += 0.12;
      const source = { start: 125, end: 155, segments: originals[0] };
      if (shape === 'short') source.start = 140;
      if (shape === 'offset') { source.start += 0.02; source.end += 0.02; }
      if (shape === 'later-word') source.segments = [...source.segments, caption([word(' Later.', 155, 156)])];
      if (shape === 'detached') source.segments = structuredClone(source.segments);
      expect(canReplaceWhisperHypotheses(originals, replacement, shape === 'absent' ? [] : [source])).toBe(false);
    });
  it('does not let censored-point provenance consume a later separate occurrence or a short unanchored word', () => {
    const { originals, replacement } = boundaryFixture();
    replacement[1].words!.at(-1)!.start += 0.12;
    const windows = [{ start: 125, end: 155, segments: originals[0] }];
    const later = caption([word(' now.', 170, 171)]);
    expect(canReplaceWhisperHypotheses(originals, [...replacement, later], windows)).toBe(false);
    const point = caption([word(' Wait.', 154, 154.8), word(' now.', 154.98, 154.98)]);
    const complete = caption([word(' Wait.', 154, 155.1), word(' now.', 156, 157)]);
    expect(canReplaceWhisperHypotheses([[point], [complete]], [complete],
      [{ start: 125, end: 155, segments: [point] }])).toBe(false);
  });
  it('corroborates the complete 14-word candidate, anchored substitution and truncated point tail', () => {
    const { originals, replacement } = boundaryFixture();
    expect(check(originals, replacement)).toBe(true);
  });
  it.each([' .', '!', '?', '\u3002', '\uff01', '\uff1f'])('preserves a retry-only terminal point punctuation token: %s', punctuation => {
    const { originals, replacement } = boundaryFixture();
    replacement[1] = caption([...replacement[1].words!, word(punctuation, 158, 158)]);
    expect(check(originals, replacement)).toBe(true);
    expect(replacement[1].words!.at(-1)!.text).toBe(punctuation);
  });
  it.each([' +', ' -', "'", ' /', ' ', '\u266a'])('does not exempt non-sentence punctuation or symbols: %s', text => {
    const { originals, replacement } = boundaryFixture();
    replacement[1] = caption([...replacement[1].words!, word(text, 158, 158)]);
    expect(check(originals, replacement)).toBe(false);
  });
  it('does not exempt original, interior, or positive-duration punctuation', () => {
    const { originals, replacement } = boundaryFixture();
    const punctuated = [...replacement.slice(0, 1), caption([...replacement[1].words!, word('.', 158, 158)])];
    expect(check([...originals, punctuated], replacement)).toBe(false);
    expect(check(originals, [caption([...replacement[0].words!, word('.', 152.7, 152.7)]), replacement[1]])).toBe(false);
    expect(check(originals, [replacement[0], caption([...replacement[1].words!, word('.', 158, 159)])])).toBe(false);
    expect(check(originals, [caption([word('.', 158, 158)])])).toBe(false);
  });
  it('does not mistake a reused punctuation object for the final token at an earlier position', () => {
    const first = word(' Keep', 1, 2);
    const last = word(' this.', 2, 2.5);
    const point = word('.', 3, 3);
    expect(check([[caption([first, last])]], [caption([first, point, last, point])])).toBe(false);
  });
  it.each([NaN, Infinity, -1, 149])('rejects invalid terminal point timing %s', value => {
    const { originals, replacement } = boundaryFixture();
    replacement[1] = caption([...replacement[1].words!, word('.', value, value)]);
    expect(check(originals, replacement)).toBe(false);
  });
  it('allows whole contiguous source subsequences without deleting or reordering occurrences', () => {
    const full = sentence([' One', ' two', ' three', ' four.']);
    expect(check([[full], [caption(full.words!.slice(1, 3))]], [structuredClone(full)])).toBe(true);
  });
  it('does not require the same sentence grouping', () => {
    const full = sentence([' One.', ' Two.']);
    expect(check([[full]], full.words!.map(item => caption([item])))).toBe(true);
  });
  it('rejects a short valid retry even when its envelope spans all original words', () => {
    const { originals } = boundaryFixture();
    expect(check(originals, [caption([word(' Fine.', 150.78, 157.06)])])).toBe(false);
  });
  it.each([0, 6, 13])('rejects dropped stable word at ordinal %i', index => {
    const { originals, replacement } = boundaryFixture();
    const fewer = replacement.flatMap(item => item.words!).filter((_, offset) => offset !== index);
    expect(check([...originals, [caption(fewer)]], [caption(fewer)])).toBe(false);
  });
  it('rejects dropped negation even when another original corroborates the shorter retry', () => {
    const full = sentence([' Do', ' not', ' leave.']);
    const shorter = caption([full.words![0], full.words![2]]);
    expect(check([[full], [shorter]], [structuredClone(shorter)])).toBe(false);
  });
  it.each([0, 2])('rejects unanchored substitution at sequence boundary %i', index => {
    const first = sentence([' Keep', ' these', ' words.']);
    const changed = structuredClone(first.words!);
    changed[index].text = ' different';
    const next = caption(changed);
    expect(check([[first], [next]], [structuredClone(next)])).toBe(false);
  });
  it('allows one internal substitution with positive matching anchors on both sides', () => {
    expect(check([[sentence([' Keep', ' color', ' here.'])], [sentence([' Keep', ' colour', ' here.'])]],
      [sentence([' Keep', ' colour', ' here.'])])).toBe(true);
  });
  it('rejects a third lexical alternative rather than synthesizing a preferred hypothesis', () => {
    expect(check([[sentence([' Keep', ' color', ' here.'])], [sentence([' Keep', ' colour', ' here.'])]],
      [sentence([' Keep', ' paint', ' here.'])])).toBe(false);
  });
  it('rejects multiple substitutions instead of becoming a fuzzy aligner', () => {
    expect(check([[sentence([' A', ' red', ' and', ' blue', ' end.'])],
      [sentence([' A', ' green', ' and', ' gold', ' end.'])]],
    [sentence([' A', ' green', ' and', ' gold', ' end.'])])).toBe(false);
  });
  it.each([' Yes.', '\u662f\u7684\u3002'])('preserves three separate occurrences: %s', text => {
    const full = caption([word(text, 1, 2), word(text, 6, 7), word(text, 11, 12)]);
    expect(check([[full], [caption(full.words!.slice(1))]], [structuredClone(full)])).toBe(true);
  });
  it.each([' Yes.', '\u662f\u7684\u3002'])('rejects dropping a later repetition: %s', text => {
    const full = caption([word(text, 1, 2), word(text, 6, 7), word(text, 11, 12)]);
    const fewer = caption(full.words!.slice(0, 2));
    expect(check([[full], [fewer]], [structuredClone(fewer)])).toBe(false);
  });
  it.each([' Yes.', '\u662f\u7684\u3002'])('rejects multiple plausible repeated correspondences: %s', text => {
    const full = caption([word(text, 1, 2), word(text, 6, 7)]);
    expect(check([[full], [caption([word(text, 1, 7)])]], [structuredClone(full)])).toBe(false);
  });
  it('does not treat disjoint or merely touching word times as corroboration', () => {
    expect(check([[sentence([' Again.'], 1)]], [sentence([' Again.'], 2)])).toBe(false);
    expect(check([[sentence([' Again.'], 1)]], [sentence([' Again.'], 4)])).toBe(false);
  });
  it.each([['Well', "We'll"], ['re-sign', 'resign'], ['ice cream', 'icecream']])(
    'does not broaden lexical equivalence: %s / %s', (first, second) => {
      expect(check([[sentence([first])], [sentence([second])]], [sentence([second])])).toBe(false);
    });
  it('retains the existing case, curly-apostrophe, NFC and trailing-punctuation equivalence', () => {
    expect(check([[sentence([" We'll.", ' cafe\u0301.'])]],
      [sentence([' we\u2019ll,', ' caf\u00e9!'])])).toBe(true);
  });
  it('rejects CJK re-tokenization without inventing subword timing', () => {
    const split = sentence(['\u662f', '\u7684\u3002']);
    const joined = caption([word('\u662f\u7684\u3002', 1, 3)]);
    expect(check([[split], [joined]], [structuredClone(joined)])).toBe(false);
  });
  it('rejects unmatched point text and point tails separated from their positive counterpart', () => {
    const reference = sentence([' Go', ' now.']);
    expect(check([[reference], [caption([word(' Go', 1, 2), word(' later.', 2, 2)])]],
      [structuredClone(reference)])).toBe(false);
    expect(check([[reference], [caption([word(' Go', 1, 2), word(' now.', 20, 20)])]],
      [structuredClone(reference)])).toBe(false);
  });
  it('does not use points as the only corroboration for retry words', () => {
    const points = caption([word(' Go', 1, 2), word(' now.', 2, 2)]);
    expect(check([[points]], [sentence([' Go', ' now.'])])).toBe(false);
    expect(check([[sentence([' Go', ' now.'])]], [points])).toBe(false);
  });
  it.each(['empty', 'fallback', 'edited', 'point-only', 'empty-word', 'punctuation-only', 'cue-bounds',
    'NaN', 'infinite', 'negative', 'reversed', 'backwards', 'overlapping-captions'])('rejects invalid %s evidence on either side', kind => {
    const valid = [sentence([' Keep', ' these', ' words.'])];
    const invalid = structuredClone(valid);
    if (kind === 'empty') invalid.length = 0;
    else if (kind === 'fallback') invalid[0].overlapNeedsReview = true;
    else if (kind === 'edited') invalid[0].text = 'User edit.';
    else if (kind === 'cue-bounds') invalid[0].end += 1;
    else if (kind === 'overlapping-captions') invalid.push(structuredClone(invalid[0]));
    else {
      const words = invalid[0].words!;
      if (kind === 'point-only') words.forEach(item => { item.end = item.start; });
      if (kind === 'empty-word') words[1].text = '';
      if (kind === 'punctuation-only') words[1].text = ' ...';
      if (kind === 'NaN') words[1].start = NaN;
      if (kind === 'infinite') words[1].end = Infinity;
      if (kind === 'negative') words[0].start = -1;
      if (kind === 'reversed') words[1].end = words[1].start - 1;
      if (kind === 'backwards') words[1].start = 1;
      invalid[0] = caption(words);
    }
    expect(check([invalid, structuredClone(valid)], structuredClone(valid))).toBe(false);
    expect(check([structuredClone(valid)], invalid)).toBe(false);
  });
  it('rejects missing word evidence and absent original sequences', () => {
    const valid = sentence([' Keep.']);
    expect(check([[{ start: 1, end: 2, text: 'Keep.' }], [valid]], [structuredClone(valid)])).toBe(false);
    expect(check([], [valid])).toBe(false);
  });
});
