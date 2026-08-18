import { describe, expect, it } from 'vitest';

import {
  encodePcmToMp3,
  MP3_BITRATE_KBPS,
  MP3_SAMPLE_RATE,
} from './mp3Encoder';

describe('browser MP3 encoder', () => {
  it('encodes mono Float32 PCM into a non-empty MP3', async () => {
    const samples = new Float32Array(MP3_SAMPLE_RATE);
    for (let index = 0; index < samples.length; index += 1) {
      samples[index] = Math.sin((2 * Math.PI * 440 * index) / MP3_SAMPLE_RATE) * 0.2;
    }

    const encoded = new Uint8Array(await encodePcmToMp3(samples, MP3_SAMPLE_RATE));
    const hasId3Header = String.fromCharCode(...encoded.slice(0, 3)) === 'ID3';
    const hasFrameSync = encoded[0] === 0xff && (encoded[1] & 0xe0) === 0xe0;

    expect(MP3_BITRATE_KBPS).toBe(128);
    expect(encoded.byteLength).toBeGreaterThan(10_000);
    expect(hasId3Header || hasFrameSync).toBe(true);
  });

  it('rejects empty audio and unsupported sample rates', async () => {
    await expect(encodePcmToMp3(new Float32Array(), MP3_SAMPLE_RATE)).rejects.toThrow('non-empty');
    await expect(encodePcmToMp3(new Float32Array([0]), 48_000)).rejects.toThrow('44100 Hz');
  });
});
