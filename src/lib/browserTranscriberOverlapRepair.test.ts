import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TranscriptSegment } from './browserTranscriber';
import { repairWhisperOverlaps } from './browserTranscriberOverlapRepair';

const coverage = vi.hoisted(() => ({ accepted: true }));
vi.mock('./browserTranscriberOverlapCoverage', () => ({ canReplaceWhisperHypotheses: () => coverage.accepted,
  hasFullWhisperCorroboration: () => false }));
const rate = 16_000;
const caption = (text: string, start: number, end: number): TranscriptSegment =>
  ({ text, start, end, words: [{ text, start, end }] });
const left = caption('Original.', 25, 27);
const right = caption('Alternative.', 25.1, 27.1);
const merged = [caption('Earlier.', 1, 2), left, { ...right, overlapNeedsReview: true }, caption('Later.', 45, 46)];
const windows = [{ start: 0, end: 30, segments: merged.slice(0, 2) },
  { start: 25, end: 55, segments: [right, merged[3]] }];
const reply = { text: 'Alternative.', chunks: [{ text: 'Alternative.', timestamp: [5.1, 7.1] }] };
beforeEach(() => { coverage.accepted = true; });

describe('bounded provisional overlap repair orchestration', () => {
  it('re-recognizes real contextual PCM and replaces only the provisional covered region', async () => {
    const audio = Float32Array.from({ length: 60 * rate }, (_, i) => i);
    const original = structuredClone(merged);
    const progress: number[] = [];
    const recognize = vi.fn(async (_audio: Float32Array) => reply);
    const result = await repairWhisperOverlaps(audio, { start: 0, end: 60 }, merged, windows, recognize,
      value => progress.push(value));
    expect(recognize).toHaveBeenCalledTimes(1);
    const slice = recognize.mock.calls[0][0] as Float32Array;
    expect(slice[0]).toBe(20 * rate);
    expect(slice.at(-1)).toBe(Math.ceil(32.1 * rate) - 1);
    expect(result.map(item => item.text)).toEqual(['Earlier.', 'Alternative.', 'Later.']);
    expect(result[1]).toEqual(caption('Alternative.', 25.1, 27.1));
    expect(result[0]).toBe(merged[0]);
    expect(result[2]).toBe(merged[3]);
    expect(merged).toEqual(original);
    expect(audio[20 * rate]).toBe(20 * rate);
    expect(progress).toEqual([1]);
  });
  it('keeps originals when ordered-word coverage is not proven', async () => {
    coverage.accepted = false;
    const result = await repairWhisperOverlaps(new Float32Array(60 * rate), { start: 0, end: 60 },
      merged, windows, async () => reply);
    expect(result).toEqual(merged);
  });
  it('makes at most two attempts and bounds the second by the available PCM', async () => {
    coverage.accepted = false;
    const recognize = vi.fn(async (_audio: Float32Array) => reply);
    const input = merged.slice(0, 3);
    const sources = windows.map(window => ({ ...window, segments: window.segments.filter(item => item.start < 40) }));
    const result = await repairWhisperOverlaps(new Float32Array(40 * rate), { start: 0, end: 40 }, input, sources, recognize);
    expect(result).toEqual(input);
    expect(recognize.mock.calls.map(([chunk]) => chunk.length)).toEqual([
      Math.ceil(32.1 * rate) - 20 * rate, 20 * rate,
    ]);
  });
  it('does not repeat a context that already uses the full 30-second window', async () => {
    coverage.accepted = false;
    const first = caption('First.', 20, 40);
    const second = caption('Second.', 21, 39);
    const recognize = vi.fn(async () => ({ text: 'Second.', chunks: [{ text: 'Second.', timestamp: [6, 24] }] }));
    const input = [first, second];
    expect(await repairWhisperOverlaps(new Float32Array(60 * rate), { start: 0, end: 60 }, input,
      [{ start: 15, end: 45, segments: [first] }, { start: 20, end: 50, segments: [second] }], recognize)).toEqual(input);
    expect(recognize).toHaveBeenCalledTimes(1);
  });
  it('does not extend through a partially captured source caption', async () => {
    coverage.accepted = false;
    const extra = caption('Do not crop.', 49, 52);
    const input = [...merged, extra];
    const sources = [...windows, { start: 45, end: 60, segments: [extra] }];
    const recognize = vi.fn(async () => reply);
    expect(await repairWhisperOverlaps(new Float32Array(60 * rate), { start: 0, end: 60 }, input,
      sources, recognize)).toEqual(input);
    expect(recognize).toHaveBeenCalledTimes(1);
  });
  it.each(['AbortError', 'TimeoutError'])('propagates %s from the second context without further attempts', async name => {
    coverage.accepted = false;
    const error = new DOMException('Synthetic', name);
    const recognize = vi.fn().mockResolvedValueOnce(reply).mockRejectedValueOnce(error);
    const progress = vi.fn();
    await expect(repairWhisperOverlaps(new Float32Array(60 * rate), { start: 0, end: 60 }, merged,
      windows, recognize, progress)).rejects.toBe(error);
    expect(recognize).toHaveBeenCalledTimes(2);
    expect(progress).not.toHaveBeenCalled();
  });
  it.each([
    { text: '', chunks: [] }, { text: 'Unknown.', chunks: [] },
    { text: 'Unknown.', chunks: [{ text: 'Unknown.', timestamp: [1, null] }] },
    { text: 'Unknown.', chunks: [{ text: 'Unknown.', timestamp: [1, 1] }] },
    { text: 'Unknown.', chunks: [{ text: 'Unknown.', timestamp: [-1, 20] }] },
    { text: ' ', chunks: [{ text: ' ', timestamp: [1, 2] }] },
  ])('retains originals for empty or unaligned retry output: %j', async output => {
    const recognize = vi.fn(async () => output);
    const result = await repairWhisperOverlaps(new Float32Array(60 * rate), { start: 0, end: 60 },
      merged, windows, recognize);
    expect(result).toEqual(merged);
    expect(recognize).toHaveBeenCalledTimes(1);
  });
  it('does not retry mere touching cues or a single uncertain caption', async () => {
    const recognize = vi.fn();
    const input = [caption('One.', 25, 27), caption('Two.', 27, 29), { start: 31, end: 35, text: 'Unknown.', overlapNeedsReview: true }];
    expect(await repairWhisperOverlaps(new Float32Array(60 * rate), { start: 0, end: 60 },
      input, [], recognize)).toEqual(input);
    expect(recognize).not.toHaveBeenCalled();
  });
  it.each([{ start: 23, end: 60 }, { start: 0, end: 30 }])('does not invent context outside the block: %j', async block => {
    const recognize = vi.fn();
    expect(await repairWhisperOverlaps(new Float32Array((block.end - block.start) * rate), block,
      merged, windows, recognize)).toEqual(merged);
    expect(recognize).not.toHaveBeenCalled();
  });
  it('rejects oversized closure and unknown original alignment before inference', async () => {
    for (const extra of [caption('Long.', 6, 55), { start: 23, end: 28, text: 'Unknown.', overlapNeedsReview: true }]) {
      const input = [...merged, extra];
      const recognize = vi.fn();
      expect(await repairWhisperOverlaps(new Float32Array(60 * rate), { start: 0, end: 60 }, input,
        [...windows, { start: 0, end: 60, segments: [extra] }], recognize)).toEqual(input);
      expect(recognize).not.toHaveBeenCalled();
    }
  });
  it.each(['AbortError', 'TimeoutError'])('propagates %s with no second recognition or completed progress', async name => {
    const error = new DOMException('Synthetic', name);
    const recognize = vi.fn(async () => { throw error; });
    const progress = vi.fn();
    await expect(repairWhisperOverlaps(new Float32Array(60 * rate), { start: 0, end: 60 },
      merged, windows, recognize, progress)).rejects.toBe(error);
    expect(recognize).toHaveBeenCalledTimes(1);
    expect(progress).not.toHaveBeenCalled();
  });
  it('keeps originals after an ordinary optional retry failure', async () => {
    const recognize = vi.fn(async () => { throw new Error('Synthetic failure'); });
    expect(await repairWhisperOverlaps(new Float32Array(60 * rate), { start: 0, end: 60 }, merged, windows,
      recognize)).toEqual(merged);
    expect(recognize).toHaveBeenCalledTimes(1);
  });
  it('keeps the completed outside sequence stable across two separated repair regions', async () => {
    const moreLeft = caption('Second original.', 65, 67);
    const moreRight = caption('Second alternative.', 65.1, 67.1);
    const input = [...merged, moreLeft, { ...moreRight, overlapNeedsReview: true }];
    const recognize = vi.fn(async (_audio: Float32Array) => reply);
    const result = await repairWhisperOverlaps(new Float32Array(100 * rate), { start: 0, end: 100 }, input,
      [...windows, { start: 40, end: 70, segments: [moreLeft] }, { start: 65, end: 95, segments: [moreRight] }], recognize);
    expect(recognize).toHaveBeenCalledTimes(2);
    expect(result.map(item => item.start)).toEqual([1, 25.1, 45, 65.1]);
    expect(result[0]).toBe(input[0]);
    expect(result[2]).toBe(input[3]);
  });
  it('uses a nonzero backing-array offset and fractional block origin without changing samples', async () => {
    const origin = 100.125;
    const shift = (item: TranscriptSegment) => ({ ...item, start: item.start + origin, end: item.end + origin,
      words: item.words?.map(word => ({ ...word, start: word.start + origin, end: word.end + origin })) });
    const backing = Float32Array.from({ length: 60 * rate + 7 }, (_, i) => i);
    const audio = backing.subarray(7);
    const recognize = vi.fn(async (_audio: Float32Array) => reply);
    const result = await repairWhisperOverlaps(audio, { start: origin, end: origin + 60 }, merged.map(shift),
      windows.map(window => ({ start: window.start + origin, end: window.end + origin, segments: window.segments.map(shift) })), recognize);
    expect(recognize).toHaveBeenCalledTimes(1);
    expect(recognize.mock.calls[0][0][0]).toBe(20 * rate + 7);
    expect(result[1].start).toBeCloseTo(origin + 25.1, 8);
    expect(result[1].end).toBeCloseTo(origin + 27.1, 8);
    expect(backing[20 * rate + 7]).toBe(20 * rate + 7);
  });
  it.each(['right', 'left', 'point'] as const)('refuses newly intersected captions after sample rounding: %s', async edge => {
    const a = caption('Original.', edge === 'left' ? 21.06 : 25, 27);
    const b = caption('Alternative.', edge === 'left' ? 21.16 : 25.1, 27.06);
    const neighbor = edge === 'left' ? caption('Before.', 14, 16.06)
      : edge === 'right' ? caption('After.', 32.06, 34)
      : { ...caption('Point tail.', 32.0600625, 34), words: [
        { text: 'Point', start: 32.0600625, end: 32.0600625 }, { text: ' tail.', start: 33, end: 34 }] };
    const input = [a, b, neighbor];
    const recognize = vi.fn(async (_audio: Float32Array) => reply);
    const result = await repairWhisperOverlaps(new Float32Array(60 * rate), { start: 0, end: 60 }, input,
      [{ start: 0, end: 30, segments: [a, ...(edge === 'left' ? [neighbor] : [])] },
        { start: 20, end: 55, segments: [b, ...(edge !== 'left' ? [neighbor] : [])] }], recognize);
    expect(recognize).not.toHaveBeenCalled();
    expect(result).toEqual(input);
    expect(result[2]).toBe(neighbor);
  });
});
