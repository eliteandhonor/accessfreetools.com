import { describe, expect, it } from 'vitest';
import { createTranscriptDownloads, mergeTranscriptSegments } from './browserTranscriber';

describe('CJ-TR01-01 loss-averse repeated overlap', () => {
  for (const [name, word, separator] of [
    ['English', 'Yes.', ' '], ['spaced CJK', '\u662f\u7684\u3002', ' '], ['unspaced CJK', '\u662f\u7684\u3002', ''],
  ]) for (const suffix of ['', ' Continue.']) {
    it(`keeps uncertain tokens and their original span: ${name}, ${suffix ? 'prefix' : 'exact'}`, () => {
      const completed = [{ start: 293, end: 299, text: `${word}${separator}${word}` }];
      const incoming = { start: 298, end: suffix ? 306 : 304, text: `${word}${separator}${word}${suffix}` };
      const result = mergeTranscriptSegments(completed, [incoming]);
      // Segment-only timing cannot locate which repeated occurrence is shared.
      // Retain both captions for review instead of claiming an invented alignment.
      expect(result).toEqual([...completed, { ...incoming, overlapNeedsReview: true }]);
      expect(result.map(segment => segment.text).join(' ').split(word).length - 1).toBe(4);
      expect(completed).toEqual([{ start: 293, end: 299, text: `${word}${separator}${word}` }]);
      expect(mergeTranscriptSegments(result, [{ start: 310, end: 311, text: word }]).slice(0, 2)).toEqual(result);
    });
  }

  it.each(['Yes.', '\u662f\u7684\u3002'])('deduplicates one explicitly timed shared utterance and keeps later %s', word => {
    const completed = [{ start: 293, end: 294, text: word }, { start: 298, end: 299, text: word }];
    const later = { start: 303, end: 304, text: word };
    expect(mergeTranscriptSegments(completed, [completed[1], later])).toEqual([...completed, later]);
  });

  it('same-interval repeated captions still collapse exactly once', () => {
    const shared = { start: 296, end: 299, text: 'Yes. Yes.' };
    const later = { start: 303, end: 304, text: 'Yes.' };
    expect(mergeTranscriptSegments([shared], [shared, later])).toEqual([shared, later]);
  });
});

describe('CJ-TR02-01 format-specific literal serialization', () => {
  it('does not put WebVTT arrow or ampersand entities into the SRT reader path', () => {
    const result = createTranscriptDownloads([{ start: 0, end: 1, text: 'A & B --> C' }]);
    expect(result.srt).not.toContain('&amp;');
    expect(result.srt).not.toContain('&gt;');
    expect(result.srt).toContain('--> C');
    expect(result.vtt).toContain('A &amp; B --&gt; C');
    expect(result.txt).toBe('A & B --> C\n');
  });
});
