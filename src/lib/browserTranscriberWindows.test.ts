import { describe, expect, it, vi } from 'vitest';
import { planWhisperWindows, selectWhisperCheckpointEnd, transcribeWhisperWindows } from './browserTranscriberWindows';
import { buildTranscriptionBlocks } from './browserTranscriber';

const rate = 16_000;
const output = (words: { text: string; timestamp: [number, number] }[]) => ({
  text: words.map(word => word.text).join(''), chunks: words,
});

describe('quiet checkpoint ownership inside the existing block overlap', () => {
  it('assigns the following phrase to the next block without changing PCM', () => {
    const audio = new Float32Array(325 * rate).fill(0.25);
    audio.fill(0, 295.2 * rate, 295.8 * rate);
    const before = audio.slice();
    expect(selectWhisperCheckpointEnd(audio, 300 * rate)).toBe(295.7 * rate);
    expect(audio.every((sample, index) => sample === before[index])).toBe(true);
  });

  it.each([0, 0.25])('keeps the nominal checkpoint for uniform amplitude %s', amplitude => {
    expect(selectWhisperCheckpointEnd(new Float32Array(325 * rate).fill(amplitude), 300 * rate)).toBe(300 * rate);
  });

  it('never moves the final checkpoint or reads beyond a short EOF lookahead', () => {
    const audio = new Float32Array(300 * rate).fill(0.25);
    audio.fill(0, 296 * rate, 297 * rate);
    expect(selectWhisperCheckpointEnd(audio, audio.length)).toBe(audio.length);
    expect(selectWhisperCheckpointEnd(new Float32Array(300 * rate + 1), 300 * rate)).toBe(300 * rate);
  });

  it.each([NaN, Infinity, -Infinity])('does not trust a nonfinite pause sample %s', value => {
    const audio = new Float32Array(325 * rate).fill(0.25);
    audio.fill(0, 298.9 * rate, 299.1 * rate);
    expect(selectWhisperCheckpointEnd(audio, 300 * rate)).toBe(299 * rate);
    audio[299 * rate] = value;
    expect(selectWhisperCheckpointEnd(audio, 300 * rate)).toBe(300 * rate);
  });

  it('cannot defer samples earlier than the following block can decode', () => {
    for (const nominal of [7, 300, 305]) {
      const audio = new Float32Array((nominal + 25) * rate).fill(0.25);
      audio.fill(0, (nominal - 7) * rate, (nominal - 5.2) * rate);
      expect(selectWhisperCheckpointEnd(audio, nominal * rate)).toBe(nominal * rate);
      audio.fill(0, (nominal - 5) * rate, (nominal - 4.5) * rate);
      const cut = selectWhisperCheckpointEnd(audio, nominal * rate);
      expect(Number.isSafeInteger(cut)).toBe(true);
      expect(cut).toBeGreaterThanOrEqual((nominal - 5) * rate);
      expect(cut).toBeLessThan(nominal * rate);
    }
  });

  it.each([-1, 1.5, NaN, Infinity, 16001])('rejects an invalid checkpoint sample %s', end => {
    expect(() => selectWhisperCheckpointEnd(new Float32Array(rate), end)).toThrow(RangeError);
  });

  it('respects buffer-view offsets and does not read neighboring data', () => {
    const backing = new Float32Array(46 * rate).fill(NaN);
    const audio = backing.subarray(71, 71 + 45 * rate).fill(0.25);
    audio.fill(0, 15.2 * rate, 15.8 * rate);
    expect(selectWhisperCheckpointEnd(audio, 20 * rate)).toBe(15.7 * rate);
    expect(backing[70]).toBeNaN();
    expect(backing[71 + audio.length]).toBeNaN();
  });

  it('leaves every consecutively deferred source interval covered by the unchanged next block', () => {
    const duration = 610;
    const blocks = buildTranscriptionBlocks(duration);
    const before = structuredClone(blocks);
    for (const [index, block] of blocks.entries()) {
      const sourceEnd = Math.min(duration, block.end + 25);
      const audio = new Float32Array((sourceEnd - block.start) * rate).fill(0.25);
      const nominal = (block.end - block.start) * rate;
      audio.fill(0, nominal - 3 * rate, nominal - 2 * rate);
      const cut = block.start + selectWhisperCheckpointEnd(audio, nominal) / rate;
      if (index < blocks.length - 1) {
        expect(cut).toBeLessThan(block.end);
        expect(cut).toBeGreaterThanOrEqual(blocks[index + 1].start);
        expect(block.end).toBeLessThanOrEqual(blocks[index + 1].end);
      } else expect(cut).toBe(duration);
    }
    expect(blocks).toEqual(before);
  });

  it('defers a whole caption starting exactly at the selected cut', async () => {
    const audio = new Float32Array(45 * rate).fill(0.25);
    audio.fill(0, 15.2 * rate, 15.8 * rate);
    const recognize = vi.fn().mockResolvedValueOnce(output([
      { text: 'Next.', timestamp: [15.7, 17] },
    ])).mockResolvedValueOnce(output([]));
    expect(await transcribeWhisperWindows(audio, { start: 100, end: 145 }, recognize, undefined, 120)).toEqual([]);
  });

  it('defers only whole following captions and keeps crossing or uncertain captions intact', async () => {
    const audio = new Float32Array(45 * rate).fill(0.25);
    audio.fill(0, 15.2 * rate, 15.8 * rate);
    const recognize = vi.fn().mockResolvedValueOnce(output([
      { text: 'Crossing.', timestamp: [14, 16] },
      { text: ' Next section.', timestamp: [17, 19] },
    ])).mockResolvedValueOnce(output([]));
    const result = await transcribeWhisperWindows(audio, { start: 100, end: 145 }, recognize, undefined, 120);
    expect(result.map(({ start, end, text }) => ({ start, end, text }))).toEqual([
      { start: 114, end: 116, text: 'Crossing.' },
    ]);
    expect(recognize).toHaveBeenCalledTimes(2);
    const uncertain = await transcribeWhisperWindows(audio, { start: 100, end: 145 },
      vi.fn().mockResolvedValueOnce({ text: 'Keep uncertain words.', chunks: [] }).mockResolvedValueOnce(output([])),
      undefined, 120);
    expect(uncertain).toEqual([{ start: 100, end: 130, text: 'Keep uncertain words.', overlapNeedsReview: true }]);
  });
});

describe('quiet source window boundaries', () => {
  it('ends before a clipped utterance when an earlier quiet cut exists', () => {
    const audio = new Float32Array(60 * rate).fill(0.25);
    audio.fill(0, 28 * rate, 29 * rate);
    const windows = planWhisperWindows(audio);
    expect(windows[0]).toEqual({ start: 0, end: 28.9 * rate });
    expect(windows[1].start).toBe(23.9 * rate);
  });

  it.each([0, 0.25, 0.0002])('retains normal boundaries for uniform amplitude %s', amplitude => {
    expect(planWhisperWindows(new Float32Array(60 * rate).fill(amplitude))).toEqual([
      { start: 0, end: 30 * rate }, { start: 25 * rate, end: 55 * rate },
      { start: 50 * rate, end: 60 * rate },
    ]);
  });

  it.each([30, 55])('keeps the nominal cut when %s-second quiet context extends beyond EOF', seconds => {
    const windows = planWhisperWindows(new Float32Array(seconds * rate + 1));
    expect(windows.at(-2)!.end).toBe(seconds * rate);
    expect(windows.at(-1)).toEqual({ start: (seconds - 5) * rate, end: seconds * rate + 1 });
  });

  it('does not cut on a brief zero crossing or search earlier than twenty seconds', () => {
    const audio = new Float32Array(40 * rate).fill(0.2);
    audio.fill(0, 29 * rate, 29 * rate + 100);
    audio.fill(0, 18 * rate, 19 * rate);
    expect(planWhisperWindows(audio)[0]).toEqual({ start: 0, end: 30 * rate });
  });

  it.each([NaN, Infinity, -Infinity])('does not classify a nonfinite sample as quiet: %s', value => {
    const audio = new Float32Array(40 * rate).fill(0.2);
    audio.fill(0, 28.9 * rate, 29.1 * rate);
    expect(planWhisperWindows(audio)[0].end).toBe(29 * rate);
    // Every possible cut in this short gap must inspect this sample.
    audio[29 * rate] = value;
    const first = planWhisperWindows(audio)[0];
    expect(first.end).toBe(30 * rate);
  });

  it('covers every sample, keeps five seconds of overlap, and bounds progress', () => {
    const audio = new Float32Array(325 * rate + 13).fill(0.2);
    for (let start = 19; start < 320; start += 23) audio.fill(0, start * rate, (start + 1) * rate);
    const windows = planWhisperWindows(audio);
    expect(windows[0].start).toBe(0);
    expect(windows.at(-1)!.end).toBe(audio.length);
    for (const [index, window] of windows.entries()) {
      expect(Number.isSafeInteger(window.start) && Number.isSafeInteger(window.end)).toBe(true);
      expect(window.end - window.start).toBeGreaterThan(0);
      expect(window.end - window.start).toBeLessThanOrEqual(30 * rate);
      if (index < windows.length - 1) expect(window.end - window.start).toBeGreaterThanOrEqual(20 * rate);
      if (index) {
        expect(windows[index - 1].end - window.start).toBe(5 * rate);
        expect(window.start).toBeGreaterThan(windows[index - 1].start);
      }
    }
    expect(windows.length).toBeLessThanOrEqual(Math.ceil(audio.length / (15 * rate)));
  });

  it('preserves short tails and the view without reading outside its buffer slice', () => {
    const backing = new Float32Array(61 * rate).fill(NaN);
    const audio = backing.subarray(123, 123 + 60 * rate);
    audio.fill(0.25);
    audio.fill(0, 28 * rate, 29 * rate);
    const before = audio.slice();
    expect(planWhisperWindows(audio)).toEqual(planWhisperWindows(before));
    expect(audio).toEqual(before);
    expect(backing[122]).toBeNaN();
    expect(planWhisperWindows(new Float32Array(17))).toEqual([{ start: 0, end: 17 }]);
    expect(planWhisperWindows(new Float32Array())).toEqual([]);
  });

  it('feeds original PCM views and derives word times from the chosen source starts', async () => {
    const backing = new Float32Array(41 * rate);
    const audio = backing.subarray(111, 111 + 40 * rate).fill(0.2);
    audio.fill(0, 28 * rate, 29 * rate);
    const spans: number[][] = [];
    const result = await transcribeWhisperWindows(audio, { start: 295, end: 335 }, async chunk => {
      expect(chunk.buffer).toBe(audio.buffer);
      const start = (chunk.byteOffset - audio.byteOffset) / 4;
      spans.push([start, start + chunk.length]);
      return output([{ text: 'Retained.', timestamp: [1, 2] }]);
    });
    expect(spans).toEqual([[0, 28.9 * rate], [23.9 * rate, 40 * rate]]);
    expect(result.map(segment => [segment.start, segment.end])).toEqual([[296, 297], [319.9, 320.9]]);
  });
});

describe('source-timed Whisper windows', () => {
  it.each([undefined, null, 'invalid', 1])('retains uncertain results when lexical chunks have invalid timing: %s', async timestamp => {
    const recognize = vi.fn(async () => ({ text: '.', chunks: [{ text: 'I', timestamp }] } as never));
    const result = await transcribeWhisperWindows(new Float32Array(10 * rate), { start: 0, end: 10 }, recognize);
    expect(recognize).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ start: 0, end: 10, text: '.', overlapNeedsReview: true }]);
  });

  it('omits a whole sentence-mark result without removing neighboring speech or retrying', async () => {
    const recognize = vi.fn().mockResolvedValueOnce({ text: '.', chunks: [{ text: '.', timestamp: null }] })
      .mockResolvedValueOnce(output([{ text: 'I.', timestamp: [1, 2] }]));
    const result = await transcribeWhisperWindows(new Float32Array(40 * rate), { start: 0, end: 40 }, recognize);
    expect(recognize).toHaveBeenCalledTimes(2);
    expect(result.map(segment => [segment.start, segment.end, segment.text])).toEqual([[26, 27, 'I.']]);
  });

  it.each([
    { text: [' Keep', ' this', ' word.'], point: 29.98 },
    { text: [' Keep', ' this', ' word.'], point: 29.8 },
    { text: ['\u4fdd\u7559', '\u8fd9\u4e9b', '\u8bcd\u3002'], point: 29.98 },
    { text: ['\u4fdd\u7559', '\u8fd9\u4e9b', '\u8bcd\u3002'], point: 29.8 },
  ])('retains source evidence when an agreeing retry stretches a neighbor: %j', async ({ text, point }) => {
    let calls = 0;
    const times = [
      [[26, 27], [29.64, point], [point, point]],
      [[1, 2], [4.64, 15], [15, 16]],
      [[5, 6], [8.64, 19], [19, 20]],
      [[5, 6], [8.64, 19], [19, 20]],
    ];
    const result = await transcribeWhisperWindows(new Float32Array(55 * rate), { start: 0, end: 55 }, async () => {
      const timestamps = times[calls++];
      return output(timestamps.map(([start, end], index) => ({ text: text[index], timestamp: [start, end] })));
    });
    expect(calls).toBe(4);
    expect(result).toHaveLength(2);
    expect(result[0].words!.at(-1)).toMatchObject({ text: text[2], start: point, end: point });
    expect(result[1].words!.at(-1)).toMatchObject({ text: text[2], start: 40, end: 41 });
    expect(result[1].overlapNeedsReview).toBe(true);
  });
  it('uses bounded lookahead but publishes the whole logical block, including crossing captions', async () => {
    const audio = Float32Array.from({ length: 325 * rate }, (_, index) => index);
    const calls: number[] = [];
    const result = await transcribeWhisperWindows(audio, { start: 0, end: 325 }, async chunk => {
      calls.push(chunk.length);
      if (chunk[0] === 275 * rate) return output([
        { text: 'Yes.', timestamp: [21, 22] },
        { text: ' Keep this whole.', timestamp: [24, 29] },
      ]);
      if (chunk[0] === 300 * rate) return output([{ text: 'Context only.', timestamp: [10, 11] }]);
      return output([]);
    }, undefined, 300);
    expect(calls).toEqual([...Array(12).fill(30 * rate), 25 * rate]);
    expect(result.map(({ start, end, text }) => ({ start, end, text }))).toEqual([
      { start: 296, end: 297, text: 'Yes.' },
      { start: 299, end: 304, text: 'Keep this whole.' },
    ]);
  });
  it('retains uncertain owned text whole rather than dropping it at the ownership boundary', async () => {
    const result = await transcribeWhisperWindows(new Float32Array(30 * rate), { start: 275, end: 305 },
      async () => ({ text: 'Uncertain but retained.', chunks: [] }), undefined, 300);
    expect(result).toEqual([{ start: 275, end: 305, text: 'Uncertain but retained.', overlapNeedsReview: true }]);
  });
  it.each([NaN, Infinity, 0, -1, 10, 61])('rejects invalid ownership end %s before inference', async end => {
    const recognize = vi.fn();
    await expect(transcribeWhisperWindows(new Float32Array(60 * rate), { start: 0, end: 60 }, recognize,
      undefined, end)).rejects.toThrow();
    expect(recognize).not.toHaveBeenCalled();
  });
  it('recognizes at most 30 seconds with five seconds of source overlap', async () => {
    const audio = Float32Array.from({ length: 60 * rate }, (_, index) => index);
    const calls: [number, number][] = [];
    const progress: number[] = [];
    await transcribeWhisperWindows(audio, { start: 295, end: 355 }, async chunk => {
      calls.push([chunk[0], chunk.length]);
      return { text: '', chunks: [] };
    }, value => progress.push(value));
    expect(calls).toEqual([[0, 30 * rate], [25 * rate, 30 * rate], [50 * rate, 10 * rate]]);
    expect(progress).toEqual([0.3, 0.6, 0.9, 1]);
    expect(audio[50 * rate]).toBe(50 * rate);
  });
  it('retains separate repeated speech and deduplicates only the actual overlap', async () => {
    const replies = [
      output([{ text: 'Yes.', timestamp: [1, 2] }, { text: ' Yes.', timestamp: [26, 27] }]),
      output([{ text: 'Yes.', timestamp: [1, 2] }, { text: ' Yes.', timestamp: [6, 7] }]),
    ];
    const result = await transcribeWhisperWindows(new Float32Array(40 * rate), { start: 100, end: 140 },
      async () => replies.shift()!);
    expect(result.map(segment => segment.text)).toEqual(['Yes.', 'Yes.', 'Yes.']);
    expect(result.map(segment => [segment.start, segment.end])).toEqual([[101, 102], [126, 127], [131, 132]]);
  });
  it('never sends a five-minute block to lexical cross-window stitching', async () => {
    const recognize = vi.fn(async (_chunk: Float32Array) => output([{ text: 'Hello.', timestamp: [1, 2] }]));
    const result = await transcribeWhisperWindows(new Float32Array(300 * rate), { start: 0, end: 300 }, recognize);
    expect(recognize).toHaveBeenCalledTimes(12);
    expect(recognize.mock.calls.map(([chunk]) => chunk.length / rate)).toEqual([...Array(11).fill(30), 25]);
    expect(result).toHaveLength(12);
    expect(result.map(segment => segment.start)).toEqual(Array.from({ length: 12 }, (_, index) => index * 25 + 1));
  });
  it('bounds uncertain text to its recognition window, not all five minutes', async () => {
    const result = await transcribeWhisperWindows(new Float32Array(31 * rate), { start: 100, end: 131 },
      async () => ({ text: 'Uncertain.', chunks: [] }));
    expect(result.map(segment => [segment.start, segment.end])).toEqual([[100, 130], [125, 131]]);
    expect(result.every(segment => segment.overlapNeedsReview)).toBe(true);
  });
  it('does not continue recognition after a failure', async () => {
    const recognize = vi.fn(async () => { throw new Error('synthetic failure'); });
    await expect(transcribeWhisperWindows(new Float32Array(60 * rate), { start: 0, end: 60 }, recognize))
      .rejects.toThrow('synthetic failure');
    expect(recognize).toHaveBeenCalledTimes(1);
  });
  it.each([{ start: 0, end: 0 }, { start: -1, end: 1 }, { start: 0, end: Infinity },
    { start: 0, end: 100 }])('rejects inconsistent source bounds before inference: %j', async block => {
    const recognize = vi.fn();
    await expect(transcribeWhisperWindows(new Float32Array(rate), block, recognize)).rejects.toThrow();
    expect(recognize).not.toHaveBeenCalled();
  });
});
