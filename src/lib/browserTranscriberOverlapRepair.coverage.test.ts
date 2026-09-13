import { describe, expect, it, vi } from 'vitest';
import type { TranscriptSegment, TranscriptWord } from './browserTranscriber';
import { repairWhisperOverlaps } from './browserTranscriberOverlapRepair';

const caption = (words: TranscriptWord[]): TranscriptSegment => ({ start: words[0].start,
  end: words.at(-1)!.end, words, text: words.map(word => word.text).join(' ').trim() });
const phrase = (times: number[][]) => {
  const words = times.map(([start, end], index) => ({ text: [' Keep', ' this', ' word.'][index], start, end }));
  return { ...caption(words), text: words.map(word => word.text).join('').trim() };
};
function fixture(late = false) {
  const early = phrase([[26, 27], [29.64, 29.98], [29.98, 29.98]]);
  const full = phrase([[26, 27], [29.64, 30], late ? [40, 41] : [30.02, 31]]);
  const retry = phrase([[26, 27], [29.64, 30.04], late ? [40, 41] : [30.16, 32]]);
  const outside = phrase([[5, 6], [6, 7], [7, 8]]);
  const windows = [{ start: 0, end: 30, segments: [early] },
    { start: 1, end: 31, segments: [outside] }, { start: 25, end: 55, segments: [full] }];
  const merged = [outside, early, { ...full, overlapNeedsReview: true }];
  const recognize = vi.fn(async () => ({ text: retry.text,
    chunks: retry.words!.map(word => ({ text: word.text, timestamp: [word.start - 21, word.end - 21] })) }));
  return { early, full, retry, outside, windows, merged, recognize };
}

describe('real coverage validator with provisional repair', () => {
  it.each([false, true])('requires newly included source words in an otherwise valid second retry: included=%s', async included => {
    const early = phrase([[26, 27], [29.58, 29.98], [29.98, 29.98]]);
    const full = phrase([[26.1, 27], [29.58, 29.96], [29.96, 30]]);
    const short = phrase([[26.02, 27], [29.58, 30.02], [30.02, 33]]);
    const longer = phrase([[26.04, 27], [29.58, 29.96], [29.96, 31]]);
    const extra = phrase([[49, 49.2], [49.2, 49.4], [49.4, 49.6]]);
    const windows = [{ start: 0, end: 30, segments: [early] },
      { start: 25, end: 55, segments: [full, extra] }];
    const input = [early, { ...full, overlapNeedsReview: true }, extra];
    const before = structuredClone({ input, windows });
    const audio = new Float32Array(60 * 16000);
    const recognize = vi.fn(async (chunk: Float32Array) => {
      const captions = recognize.mock.calls.length === 1 ? [short] : included ? [longer, extra] : [longer];
      const start = (chunk.byteOffset - audio.byteOffset) / audio.BYTES_PER_ELEMENT / 16000;
      return { text: captions.map(item => item.text).join(' '),
        chunks: captions.flatMap(item => item.words!.map(word => ({ text: word.text,
          timestamp: [word.start - start, word.end - start] }))) };
    });
    const progress = vi.fn();
    const result = await repairWhisperOverlaps(audio, { start: 0, end: 60 }, input, windows, recognize, progress);
    expect(recognize).toHaveBeenCalledTimes(2);
    expect(recognize.mock.calls.map(([chunk]) => chunk.length)).toEqual([14 * 16000, 30 * 16000]);
    expect(result).toEqual(included ? [longer, extra] : input);
    expect({ input, windows }).toEqual(before);
    expect(progress.mock.calls).toEqual([[1]]);
  });
  it('retains new source words captured by the longer context instead of dropping an outside caption', async () => {
    const f = fixture(true);
    const extra = phrase([[49, 49.2], [49.2, 49.4], [49.4, 49.6]]);
    const input = [...f.merged, extra];
    const sources = [...f.windows, { start: 45, end: 60, segments: [extra] }];
    const second = phrase([[26, 27], [29.64, 30], [30.02, 31]]);
    f.recognize.mockImplementationOnce(async () => ({ text: f.retry.text,
      chunks: f.retry.words!.map(word => ({ text: word.text, timestamp: [word.start - 21, word.end - 21] })) }))
      .mockImplementationOnce(async () => ({ text: second.text,
        chunks: second.words!.map(word => ({ text: word.text, timestamp: [word.start - 21, word.end - 21] })) }));
    const result = await repairWhisperOverlaps(new Float32Array(60 * 16000), { start: 0, end: 60 },
      input, sources, f.recognize);
    expect(f.recognize).toHaveBeenCalledTimes(2);
    expect(result).toEqual(input);
    expect(result.at(-1)).toBe(extra);
  });
  it('uses one longer PCM context only when the first valid retry cannot corroborate every word', async () => {
    const early = phrase([[26, 27], [29.58, 29.98], [29.98, 29.98]]);
    const full = phrase([[26.1, 27], [29.58, 29.96], [29.96, 30]]);
    const short = phrase([[26.02, 27], [29.58, 30.02], [30.02, 33]]);
    const longer = phrase([[26.04, 27], [29.58, 29.96], [29.96, 31]]);
    const windows = [{ start: 0, end: 30, segments: [early] }, { start: 25, end: 55, segments: [full] }];
    const before = structuredClone(windows);
    const audio = Float32Array.from({ length: 60 * 16000 }, (_, index) => index);
    const recognize = vi.fn(async (_chunk: Float32Array) => {
      const chosen = recognize.mock.calls.length === 1 ? short : longer;
      return { text: chosen.text, chunks: chosen.words!.map(word => ({ text: word.text,
        timestamp: [word.start - 21, word.end - 21] })) };
    });
    const result = await repairWhisperOverlaps(audio, { start: 0, end: 60 },
      [early, { ...full, overlapNeedsReview: true }], windows, recognize);
    expect(recognize).toHaveBeenCalledTimes(2);
    expect(recognize.mock.calls.map(([chunk]) => [chunk[0], chunk.length])).toEqual([
      [21 * 16000, 14 * 16000], [21 * 16000, 30 * 16000],
    ]);
    expect(result).toEqual([longer]);
    expect(windows).toEqual(before);
  });
  it('retains one whole positively corroborated original when the retry gap is wider than one frame', async () => {
    const f = fixture();
    const before = structuredClone(f.windows);
    const result = await repairWhisperOverlaps(new Float32Array(60 * 16000), { start: 0, end: 60 },
      f.merged, f.windows, f.recognize);
    expect(f.recognize).toHaveBeenCalledTimes(1);
    expect(result).toEqual([f.outside, f.full]);
    expect(result[0]).toBe(f.outside);
    expect(result[1]).toBe(f.full);
    expect(f.windows).toEqual(before);
  });
  it('rejects same-cardinality agreement about a later separate occurrence', async () => {
    const f = fixture(true);
    expect(await repairWhisperOverlaps(new Float32Array(60 * 16000), { start: 0, end: 60 },
      f.merged, f.windows, f.recognize)).toEqual(f.merged);
    expect(f.recognize).toHaveBeenCalledTimes(2);
  });
  it('rejects a stretched predecessor through the real candidate fallback path', async () => {
    const f = fixture(true);
    f.full.words![1].end = 40;
    f.full.words![2].start = 40.02;
    f.retry.words![1].end = 40.04;
    f.retry.words![2].start = 40.16;
    expect(await repairWhisperOverlaps(new Float32Array(60 * 16000), { start: 0, end: 60 },
      f.merged, f.windows, f.recognize)).toEqual(f.merged);
    expect(f.recognize).toHaveBeenCalledTimes(2);
  });
  it('cannot use a cropped nonfinal raw caption as terminal-window provenance', async () => {
    const f = fixture();
    f.windows[0].segments.push(phrase([[29.98, 29.98], [29.98, 29.98], [29.98, 29.99]]));
    expect(await repairWhisperOverlaps(new Float32Array(60 * 16000), { start: 0, end: 60 },
      f.merged, f.windows, f.recognize)).toEqual(f.merged);
  });
  it('does not accept an original candidate if the retry drops an anchored word', async () => {
    const f = fixture();
    const fewer = f.retry.words!.slice(1);
    f.recognize.mockImplementation(async () => ({ text: fewer.map(word => word.text).join('').trim(),
      chunks: fewer.map(word => ({ text: word.text, timestamp: [word.start - 21, word.end - 21] })) }));
    expect(await repairWhisperOverlaps(new Float32Array(60 * 16000), { start: 0, end: 60 },
      f.merged, f.windows, f.recognize)).toEqual(f.merged);
  });
});
