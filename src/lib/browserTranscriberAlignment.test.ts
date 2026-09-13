import { describe, expect, it } from 'vitest';
import { buildWordAlignedSegments } from './browserTranscriberAlignment';
import { createTranscriptDownloads, mergeTranscriptSegments, type TranscriptSegment } from './browserTranscriber';

const block = { start: 290, end: 300 };
const word = (text: string, start: number, end: number) => ({ text, start, end });
const aligned = (words: ReturnType<typeof word>[]): TranscriptSegment => ({
  start: words[0].start, end: words.at(-1)!.end,
  text: words.map(value => value.text).join('').trim(), words,
});

describe('Whisper word evidence to sentence captions', () => {
  it.each([undefined, null, 1])('does not allow uninspectable raw chunk text to authorize cleanup: %s', text => {
    expect(() => buildWordAlignedSegments([{ text, timestamp: [1, 2] }] as never, block, '.')).toThrow();
  });

  it.each(['.', ' !? ', '\u3002\uff01\uff1f', '\u2026', '\u061f'])('does not create a caption from punctuation-only recognition: %s', text => {
    expect(buildWordAlignedSegments([{ text, timestamp: [1, 2] }], block, text)).toEqual([]);
    expect(buildWordAlignedSegments([{ text, timestamp: [null, null] }], block, text)).toEqual([]);
    expect(buildWordAlignedSegments([], block, text)).toEqual([]);
    expect(buildWordAlignedSegments([{ text, timestamp: [1, 2] }], block, '')).toEqual([]);
  });

  it.each(['I', '7', '\u6211', '\u0644\u0627', '\u0301', '\u266a', '$', '\u{1f600}',
    '%', '/', '*', '#', '@', '_', '-', ':'])('preserves short lexical or symbolic recognition: %s', text => {
    expect(buildWordAlignedSegments([{ text, timestamp: [1, 2] }], block, text)[0].text).toBe(text);
    expect(buildWordAlignedSegments([], block, text)[0].text).toBe(text);
  });

  it.each([['.', 'Keep this.'], ['Keep this.', '.']])('never treats conflicting lexical evidence as punctuation-only: %s / %s', (text, fallback) => {
    expect(buildWordAlignedSegments([{ text, timestamp: [1, 2] }], block, fallback)).toHaveLength(1);
  });

  it('retains separately timestamped punctuation attached to recognized words', () => {
    const chunks = [{ text: ' Keep', timestamp: [1, 2] }, { text: '.', timestamp: [2, 2] }];
    expect(buildWordAlignedSegments(chunks, block, ' Keep.')).toEqual([
      aligned([word(' Keep', 291, 292), word('.', 292, 292)]),
    ]);
  });

  it('keeps natural sentences with internal word evidence and absolute source times', () => {
    const chunks = [{ text: ' Hello', timestamp: [1, 2] }, { text: ' world.', timestamp: [2, 3] },
      { text: ' Next', timestamp: [4, 5] }, { text: ' sentence.', timestamp: [5, 6] }];
    expect(buildWordAlignedSegments(chunks, block, ' Hello world. Next sentence.')).toEqual([
      aligned([word(' Hello', 291, 292), word(' world.', 292, 293)]),
      aligned([word(' Next', 294, 295), word(' sentence.', 295, 296)]),
    ]);
  });
  it('does not add spaces to unspaced CJK', () => {
    const chunks = [{ text: '\u662f', timestamp: [1, 1.3] }, { text: '\u7684\u3002', timestamp: [1.3, 2] },
      { text: '\u518d\u898b\u3002', timestamp: [3, 4] }];
    const result = buildWordAlignedSegments(chunks, block, '\u662f\u7684\u3002\u518d\u898b\u3002');
    expect(result.map(segment => segment.text)).toEqual(['\u662f\u7684\u3002', '\u518d\u898b\u3002']);
    expect(result.flatMap(segment => segment.words ?? []).map(piece => piece.text).join('')).toBe('\u662f\u7684\u3002\u518d\u898b\u3002');
  });
  it.each([[1, null], [8, 12], [NaN, 3], [2, 2], [4, 3]])('does not fabricate word evidence for %j', (start, end) => {
    const result = buildWordAlignedSegments([{ text: ' Uncertain.', timestamp: [start, end] }], block, ' Uncertain.');
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Uncertain.');
    expect(result[0].words).toBeUndefined();
    expect(result[0].overlapNeedsReview).toBe(true);
    expect(result[0].start).toBeGreaterThanOrEqual(block.start);
    expect(result[0].end).toBeLessThanOrEqual(block.end);
    expect(result[0].end).toBeGreaterThan(result[0].start);
  });
  it('retains text when word chunks are missing', () => {
    expect(buildWordAlignedSegments([], block, 'Fallback text.')).toEqual([
      { ...block, text: 'Fallback text.', overlapNeedsReview: true },
    ]);
  });
  it('retains observed word times when Whisper reports a zero-duration final word', () => {
    const chunks = [{ text: ' A', timestamp: [0.76, 1.04] },
      { text: ' voice', timestamp: [1.04, 5] }, { text: ' sample.', timestamp: [5, 5] }];
    expect(buildWordAlignedSegments(chunks, { start: 0, end: 5.544 }, 'A voice sample.')).toEqual([
      aligned([word(' A', 0.76, 1.04), word(' voice', 1.04, 5), word(' sample.', 5, 5)]),
    ]);
  });
  it('retains leading and interior point alignments without expanding their duration', () => {
    const chunks = [{ text: ' A', timestamp: [1, 1] }, { text: ' careful', timestamp: [1, 2] },
      { text: ' voice', timestamp: [2, 2] }, { text: ' check.', timestamp: [2, 3] }];
    expect(buildWordAlignedSegments(chunks, block, 'A careful voice check.')).toEqual([
      aligned([word(' A', 291, 291), word(' careful', 291, 292),
        word(' voice', 292, 292), word(' check.', 292, 293)]),
    ]);
  });
  it.each([true, false])('keeps point-only sentences attached to a positive caption: leading=%s', leading => {
    const chunks = leading
      ? [{ text: ' Yes.', timestamp: [1, 1] }, { text: ' Go.', timestamp: [1, 2] }]
      : [{ text: ' Go.', timestamp: [1, 2] }, { text: ' Yes.', timestamp: [2, 2] }];
    const result = buildWordAlignedSegments(chunks, block, chunks.map(chunk => chunk.text).join(''));
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe(leading ? 'Yes. Go.' : 'Go. Yes.');
    expect(result[0].start).toBe(291);
    expect(result[0].end).toBe(292);
    expect(result[0].words?.map(value => [value.start - 290, value.end - 290]))
      .toEqual(chunks.map(chunk => chunk.timestamp));
  });
  it('does not use point-only matches as evidence to delete boundary text', () => {
    const previous = aligned([word(' Go.', 1, 2), word(' Yes.', 2, 2)]);
    const next = aligned([word(' Yes.', 2, 2), word(' More.', 2, 3)]);
    expect(mergeTranscriptSegments([previous], [next]).map(segment => segment.text))
      .toEqual(['Go. Yes.', 'Yes. More.']);
  });
  it.each([false, true])('keeps positive support when dedupe would leave only points: separated=%s', separated => {
    const previous = aligned([word('Go', 1, 2)]);
    const incoming = aligned([word('Go', 1, 2), word(' now.', 2, 2),
      ...(separated ? [word(' Please.', 3, 3)] : [])]);
    const result = mergeTranscriptSegments([previous], [incoming]);
    expect(result[0]).toEqual(previous);
    expect(result[1]).toEqual({ ...incoming, overlapNeedsReview: true });
    expect(result[1].words?.some(piece => piece.end > piece.start)).toBe(true);
    const later = aligned([word(' Next.', 4, 5)]);
    expect(mergeTranscriptSegments(result, [later]).slice(0, 2)).toEqual(result);
    expect(createTranscriptDownloads(result).srt).not.toContain('00:00:02,000 --> 00:00:02,000');
  });
});

describe('source-aligned repeated speech at block boundaries', () => {
  it('an unrelated uncertain tail cannot discard nonoverlapping word evidence', () => {
    const previous = aligned([word('Try', 290, 291), word(' again.', 299, 300)]);
    const next = aligned([word('Again.', 295, 296)]);
    const tail = { start: 302, end: 303, text: 'Tail.', overlapNeedsReview: true };
    expect(mergeTranscriptSegments([previous], [next]).map(segment => segment.text)).toEqual(['Try again.', 'Again.']);
    const result = mergeTranscriptSegments([previous], [next, tail]);
    expect(result.map(segment => segment.text)).toEqual(['Try again.', 'Again.', 'Tail.']);
    expect(result[1].words).toEqual(next.words);
    expect(result[2].overlapNeedsReview).toBe(true);
  });
  it('an uncertain completed caption is not duplicate evidence', () => {
    const previous = { start: 290, end: 300, text: 'Again.', overlapNeedsReview: true };
    const result = mergeTranscriptSegments([previous], [aligned([word('Again.', 298, 299)])]);
    expect(result.map(segment => segment.text)).toEqual(['Again.', 'Again.']);
    expect(result[1].overlapNeedsReview).toBe(true);
  });
  it('malformed words never enable coarse deletion and are marked for review', () => {
    const previous = aligned([word('Again.', 290, 291)]);
    const next = { ...aligned([word('Again.', 294, 295)]), start: 290, end: 296 };
    const tail = aligned([word('Tail.', 302, NaN)]);
    tail.end = 303;
    const result = mergeTranscriptSegments([previous], [next, tail]);
    expect(result.map(segment => segment.text)).toEqual(['Again.', 'Again.', 'Tail.']);
    expect(result[2].overlapNeedsReview).toBe(true);
    expect(result[2].words).toBeUndefined();
  });
  it('flags conflicting hypotheses and orders export cues without shifting word timestamps', () => {
    const previous = aligned([word('Yes.', 298.58, 299.98)]);
    const next = aligned([word('Yeah.', 298.46, 301.26)]);
    const result = mergeTranscriptSegments([previous], [next]);
    expect(result[1].words).toEqual(next.words);
    expect(result[1].start).toBe(298.46);
    expect(result[1].overlapNeedsReview).toBe(true);
    const files = createTranscriptDownloads(result);
    expect(files.vtt.indexOf('00:04:58.460')).toBeLessThan(files.vtt.indexOf('00:04:58.580'));
    expect(files.srt.indexOf('00:04:58,460')).toBeLessThan(files.srt.indexOf('00:04:58,580'));
  });
  it.each([['Well', "We'll"], ['re-sign', 'resign'], ['ice cream', 'icecream']])('keeps different lexical hypotheses %s / %s', (oldText, newText) => {
    const result = mergeTranscriptSegments([aligned([word(oldText, 298, 299)])], [
      aligned([word(newText, 298.5, 299.5), word(' go.', 299.5, 300)]),
    ]);
    expect(result.map(segment => segment.text)).toEqual([oldText, `${newText} go.`]);
    expect(result[1].overlapNeedsReview).toBe(true);
  });
  it('matches equivalent curly apostrophes and trailing punctuation', () => {
    expect(mergeTranscriptSegments([aligned([word("We'll.", 298, 299)])], [
      aligned([word(' We\u2019ll,', 298.5, 299.5), word(' go.', 299.5, 300)]),
    ]).map(segment => segment.text)).toEqual(["We'll.", 'go.']);
  });
  it.each(['Yes.', '\u662f\u7684\u3002'])('keeps exactly three known utterances: %s', (text) => {
    const previous = aligned([word(text, 293.46, 296.26), word(` ${text}`, 298.58, 299.98)]);
    const next = aligned([word(text, 298.46, 301.26), word(` ${text}`, 303.58, 304.98)]);
    const original = structuredClone([previous, next]);
    const result = mergeTranscriptSegments([previous], [next]);
    expect(result).toEqual([previous, aligned([word(` ${text}`, 303.58, 304.98)])]);
    expect(result.map(segment => segment.text).join(' ').split(text)).toHaveLength(4);
    expect([previous, next]).toEqual(original);
  });
  it('does not remove a later identical phrase merely because coarse captions intersect', () => {
    const previous = aligned([word('Again.', 290, 291)]);
    const next = { ...aligned([word('Again.', 294, 295)]), start: 290, end: 296 };
    const result = mergeTranscriptSegments([previous], [next]);
    expect(result.map(segment => segment.text)).toEqual(['Again.', 'Again.']);
  });
  it('preserves a repeated phrase in the incoming source itself', () => {
    const result = mergeTranscriptSegments([], [aligned([word('Yes.', 1, 2), word(' Yes.', 3, 4)])]);
    expect(result[0].text).toBe('Yes. Yes.');
    expect(result[0].words).toHaveLength(2);
  });
  it('does not use edited caption text as alignment evidence', () => {
    const previous = { ...aligned([word('Yes.', 1, 2)]), text: 'Edited caption.' };
    const next = aligned([word('Yes.', 1, 2), word(' Yes.', 3, 4)]);
    expect(mergeTranscriptSegments([previous], [next]).map(segment => segment.text)).toEqual(['Edited caption.', 'Yes. Yes.']);
  });
});
