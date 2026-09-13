import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildTranscriptionBlocks, createTranscriptionResampler, downmixToMono } from './browserTranscriber';

const targetRate = 16_000;

function packetized(input: Float32Array, rate: number, sizes: number[], start = 0, blockStart = start) {
  const resampler = createTranscriptionResampler({ start: blockStart, end: start + input.length / rate });
  let packet = 0;
  for (let frame = 0; frame < input.length;) {
    const end = Math.min(input.length, frame + sizes[packet++ % sizes.length]);
    resampler.push(input.subarray(frame, end), rate, start + frame / rate);
    frame = end;
  }
  return resampler.finish();
}

describe('transcriber timestamped streaming DSP', () => {
  it.each([44_100, 48_000])('is packet invariant for a tone and impulse at %i Hz, mono/stereo', (rate) => {
    const mono = Float32Array.from({ length: rate + 137 }, (_, i) =>
      i === 1023 ? 1 : 0.4 * Math.sin(2 * Math.PI * 440 * i / rate));
    const stereo = Float32Array.from({ length: mono.length * 2 }, (_, i) => mono[Math.floor(i / 2)]);
    const whole = packetized(mono, rate, [mono.length]);
    const split = packetized(downmixToMono(stereo, 2), rate, [1, 7, 1024, 4093, 311]);
    expect(split.length).toBe(Math.round(mono.length * targetRate / rate));
    expect(split.length).toBe(whole.length);
    let maxError = 0;
    for (let i = 0; i < whole.length; i++) maxError = Math.max(maxError, Math.abs(whole[i] - split[i]));
    expect(maxError).toBeLessThan(1e-6);
  });

  it('preserves leading silence, internal gaps and trailing silence without bridging the gap', () => {
    const resampler = createTranscriptionResampler({ start: 295, end: 295.01 });
    resampler.push(new Float32Array(32).fill(1), targetRate, 295.002);
    resampler.push(new Float32Array(32).fill(0.5), targetRate, 295.006);
    const output = resampler.finish();
    expect(Array.from(output)).toEqual([
      ...new Array(32).fill(0), ...new Array(32).fill(1), ...new Array(32).fill(0),
      ...new Array(32).fill(0.5), ...new Array(32).fill(0),
    ]);
  });

  it('uses first-arriving audio for duplicate/overlapping packets and retains their new suffix', () => {
    const resampler = createTranscriptionResampler({ start: 0, end: 8 / targetRate });
    resampler.push(new Float32Array([1, 2, 3, 4]), targetRate, 0);
    resampler.push(new Float32Array([9, 9]), targetRate, 0);
    resampler.push(new Float32Array([8, 8, 5, 6, 7, 8]), targetRate, 2 / targetRate);
    expect(Array.from(resampler.finish())).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('flushes the final fractional tail once and never borrows a sample across a gap', () => {
    const resampler = createTranscriptionResampler({ start: 0, end: 8 / targetRate });
    resampler.push(new Float32Array([0, 1]), 8_000, 0);
    resampler.push(new Float32Array([0.25]), 8_000, 6 / targetRate);
    const output = resampler.finish();
    expect(Array.from(output)).toEqual([0, 0.5, 1, 1, 0, 0, 0.25, 0.25]);
    expect(resampler.finish()).toBe(output);
    expect(() => resampler.push(new Float32Array([1]), 8_000, 0)).toThrow(/finish/i);
  });

  it('clips packets using the absolute block start without resetting interpolation phase', () => {
    const source = Float32Array.from({ length: 2000 }, (_, i) => i / 2000);
    const start = 295 + 0.37 / targetRate;
    const packetStart = 295 - 51 / 44_100;
    const whole = packetized(source, 44_100, [source.length], packetStart, start);
    const split = packetized(source, 44_100, [7, 113, 1024], packetStart, start);
    expect(split).toEqual(whole);
    const firstTime = Math.round(start * targetRate) / targetRate;
    expect(split[0]).toBeCloseTo((firstTime - packetStart) * 44_100 / 2000, 6);
  });

  it.each([44_100, 48_000])('keeps every synthetic 60-minute block marker within one sample at %i Hz', (rate) => {
    const blocks = buildTranscriptionBlocks(3600);
    let maximumMarkerError = 0;
    let maximumBoundaryError = 0;
    for (const block of blocks) {
      const resampler = createTranscriptionResampler(block);
      const firstFrame = Math.floor(block.start * rate) - 17;
      const lastFrame = Math.ceil(block.end * rate) + 17;
      const markerTimes = [block.start + 0.010037, block.end - 0.010021];
      const markerFrames = markerTimes.map((time) => Math.round(time * rate));
      const sizes = [1024, 997, 4093, 311];
      let packet = 0;
      for (let frame = firstFrame; frame < lastFrame;) {
        const end = Math.min(lastFrame, frame + sizes[packet++ % sizes.length]);
        const audio = new Float32Array(end - frame);
        for (const marker of markerFrames) {
          for (let offset = -4; offset <= 4; offset++) {
            const index = marker + offset - frame;
            if (index >= 0 && index < audio.length) audio[index] = 1 - Math.abs(offset) / 5;
          }
        }
        resampler.push(audio, rate, frame / rate);
        frame = end;
      }
      const output = resampler.finish();
      maximumBoundaryError = Math.max(maximumBoundaryError,
        Math.abs(output.length - (block.end - block.start) * targetRate));
      for (const marker of markerFrames) {
        const expected = Math.round((marker / rate - block.start) * targetRate);
        let peak = expected - 3;
        for (let i = expected - 3; i <= expected + 3; i++) if (output[i] > output[peak]) peak = i;
        expect(output[peak]).toBeGreaterThan(0.5);
        maximumMarkerError = Math.max(maximumMarkerError,
          Math.abs((block.start + peak / targetRate - marker / rate) * targetRate));
      }
    }
    expect(maximumMarkerError).toBeLessThanOrEqual(1);
    expect(maximumBoundaryError).toBeLessThanOrEqual(1);
    console.info(JSON.stringify({ fixture: 'synthetic-60min', rate, blocks: blocks.length,
      markers: blocks.length * 2, maximumMarkerError, maximumBoundaryError }));
  }, 30_000);

  it('does not accumulate microsecond timestamp quantization across 44100 Hz packets', () => {
    const rate = 44_100;
    const input = Float32Array.from({ length: rate * 3 }, (_, i) => 0.4 * Math.sin(i / 13));
    const exact = packetized(input, rate, [input.length]);
    const resampler = createTranscriptionResampler({ start: 0, end: input.length / rate });
    for (let i = 0; i < input.length; i += 1024) {
      resampler.push(input.subarray(i, i + 1024), rate, Math.round(i / rate * 1e6) / 1e6);
    }
    expect(resampler.finish()).toEqual(exact);
  });

  it('starts a new phase on a rate change without discarding its timestamp', () => {
    const resampler = createTranscriptionResampler({ start: 0, end: 8 / targetRate });
    resampler.push(new Float32Array([1, 1]), 8_000, 0);
    resampler.push(new Float32Array([0.25, 0.5, 0.75, 1]), targetRate, 4 / targetRate);
    expect(Array.from(resampler.finish())).toEqual([1, 1, 1, 1, 0.25, 0.5, 0.75, 1]);
  });
});

const mediaFixture = vi.hoisted(() => ({ packets: [] as {
  timestamp: number; duration: number; sampleRate: number; numberOfFrames: number; numberOfChannels: number;
  copyTo: (target: Float32Array, options: { frameOffset: number; frameCount: number }) => void;
  close: () => void;
}[] }));
vi.mock('mediabunny', () => {
  const track = {
    number: 1, canDecode: async () => true, getNumberOfChannels: async () => 1,
    getCodecParameterString: async () => 'fixture', getLanguageCode: async () => 'en',
    getName: async () => 'Synthetic', getSampleRate: async () => 44_100,
  };
  return {
    ALL_FORMATS: [], BlobSource: class {},
    Input: class {
      getFormat = async () => ({ name: 'fixture' });
      getAudioTracks = async () => [track];
      computeDuration = async () => 600;
      dispose() {}
    },
    AudioSampleSink: class { async *samples() { yield* mediaFixture.packets; } },
  };
});

describe('transcriber media worker (fake decoder, actual worker and DSP)', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

  it('positions decoded stereo packets and a flush tail against absolute block time', async () => {
    const events: { type: string; audio?: ArrayBuffer; sampleRate?: number }[] = [];
    let dispatch: (event: { data: unknown }) => Promise<void>;
    vi.stubGlobal('self', {
      postMessage: (event: typeof events[number]) => events.push(event),
      addEventListener: (type: string, listener: typeof dispatch) => { if (type === 'message') dispatch = listener; },
    });
    mediaFixture.packets = [295.002, 295.006].map((timestamp) => ({
      timestamp, duration: 0.002, sampleRate: 8_000, numberOfFrames: 16, numberOfChannels: 2,
      copyTo: (target, { frameCount }) => {
        for (let i = 0; i < frameCount; i++) { target[i * 2] = 0.5; target[i * 2 + 1] = 1; }
      },
      close: vi.fn(),
    }));
    await import('../workers/transcriber-media.worker');
    await dispatch!({ data: { type: 'inspect', file: {} } });
    await dispatch!({ data: { type: 'decode', trackNumber: 1, block: { index: 1, start: 295, end: 295.01 } } });
    expect(events.at(-1)).toMatchObject({ type: 'decoded', sampleRate: targetRate });
    expect(Array.from(new Float32Array(events.at(-1)!.audio!))).toEqual([
      ...new Array(32).fill(0), ...new Array(32).fill(0.75), ...new Array(32).fill(0),
      ...new Array(32).fill(0.75), ...new Array(32).fill(0),
    ]);
    expect(mediaFixture.packets.every((packet) => vi.mocked(packet.close).mock.calls.length === 1)).toBe(true);
  });

  it('keeps fractional block clipping invariant to decoder packetization', async () => {
    const events: { type: string; audio?: ArrayBuffer }[] = [];
    let dispatch: (event: { data: unknown }) => Promise<void>;
    vi.stubGlobal('self', {
      postMessage: (event: typeof events[number]) => events.push(event),
      addEventListener: (type: string, listener: typeof dispatch) => { if (type === 'message') dispatch = listener; },
    });
    await import('../workers/transcriber-media.worker');
    await dispatch!({ data: { type: 'inspect', file: {} } });
    const rate = 44_100;
    const input = Float32Array.from({ length: 2000 }, (_, i) => Math.sin(i / 13));
    const timestamp = 295 - 51 / rate;
    const block = { index: 1, start: 295 + 0.37 / targetRate, end: 295.04 };
    const outputs: Float32Array[] = [];
    for (const sizes of [[input.length], [1, 7, 113, 1024]]) {
      mediaFixture.packets = [];
      let packet = 0;
      for (let frame = 0; frame < input.length;) {
        const count = Math.min(input.length - frame, sizes[packet++ % sizes.length]);
        const data = input.slice(frame, frame + count);
        mediaFixture.packets.push({
          timestamp: timestamp + frame / rate, duration: count / rate, sampleRate: rate,
          numberOfFrames: count, numberOfChannels: 1,
          copyTo: (target, { frameOffset, frameCount }) => target.set(data.subarray(frameOffset, frameOffset + frameCount)),
          close: vi.fn(),
        });
        frame += count;
      }
      await dispatch!({ data: { type: 'decode', trackNumber: 1, block } });
      expect(events.at(-1)?.type).toBe('decoded');
      outputs.push(new Float32Array(events.at(-1)!.audio!));
    }
    expect(outputs[0].length).toBe(640);
    let maxError = 0;
    for (const output of outputs) {
      for (let i = 0; i < output.length; i++) {
        const position = ((Math.round(block.start * targetRate) + i) / targetRate - timestamp) * rate;
        const lower = Math.floor(position);
        const fraction = position - lower;
        const expected = input[lower] * (1 - fraction) + input[lower + 1] * fraction;
        maxError = Math.max(maxError, Math.abs(expected - output[i]));
      }
    }
    expect(maxError).toBeLessThan(1e-6);
  });
});
