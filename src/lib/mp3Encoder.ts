import { createMp3Encoder } from 'wasm-media-encoders';

export const MP3_BITRATE_KBPS = 128;
export const MP3_SAMPLE_RATES = [24_000, 44_100] as const;

const ENCODE_CHUNK_SAMPLES = 1_152 * 64;

export async function encodePcmToMp3(
  samples: Float32Array | number[],
  sampleRate: number,
): Promise<ArrayBuffer> {
  if (!MP3_SAMPLE_RATES.includes(sampleRate as (typeof MP3_SAMPLE_RATES)[number])) {
    throw new Error(`MP3 encoding supports ${MP3_SAMPLE_RATES.join(' Hz or ')} Hz audio.`);
  }
  const outputSampleRate = sampleRate as (typeof MP3_SAMPLE_RATES)[number];

  const pcm = samples instanceof Float32Array ? samples : Float32Array.from(samples);
  if (pcm.length < 1) throw new Error('MP3 encoding requires non-empty audio.');

  const encoder = await createMp3Encoder();
  encoder.configure({
    bitrate: MP3_BITRATE_KBPS,
    channels: 1,
    outputSampleRate,
    sampleRate,
  });

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  const keepChunk = (chunk: Uint8Array) => {
    if (chunk.length < 1) return;
    const copy = chunk.slice();
    chunks.push(copy);
    totalBytes += copy.length;
  };

  for (let offset = 0; offset < pcm.length; offset += ENCODE_CHUNK_SAMPLES) {
    keepChunk(encoder.encode([pcm.subarray(offset, offset + ENCODE_CHUNK_SAMPLES)]));
  }
  keepChunk(encoder.finalize());

  if (totalBytes < 1) throw new Error('The MP3 encoder returned an empty file.');

  const output = new Uint8Array(totalBytes);
  let outputOffset = 0;
  for (const chunk of chunks) {
    output.set(chunk, outputOffset);
    outputOffset += chunk.length;
  }
  return output.buffer;
}
