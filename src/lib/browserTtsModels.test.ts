import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  browserTtsModels,
  getBrowserTtsVoice,
  getBrowserTtsVoiceGroups,
  getBrowserTtsVoiceSampleUrl,
  getBrowserTtsVoices,
  KOKORO_MODEL_REVISION,
  selectKokoroRuntimePlan,
  SUPERTONIC_MODEL_REVISION,
} from './browserTtsModels';

describe('browser TTS model registry', () => {
  it('keeps pinned defaults valid for both lazy-loaded models', () => {
    for (const model of Object.values(browserTtsModels)) {
      expect(model.languages.some((language) => language.value === model.defaultLanguage)).toBe(true);
      expect(getBrowserTtsVoices(model.id, model.defaultLanguage).some((voice) => voice.value === model.defaultVoice)).toBe(true);
      expect(model.downloadMegabytes).toBeGreaterThan(0);
      expect(model.modelRevision).toMatch(/^[a-f0-9]{40}$/);
    }

    expect(SUPERTONIC_MODEL_REVISION).toBe('3cadd1ee6394adea1bd021217a0e650ede09a323');
    expect(KOKORO_MODEL_REVISION).toBe('1939ad2a8e416c0acfeecc08a694d14ef25f2231');
  });

  it('keeps Supertonic multilingual and exposes the complete pinned Kokoro English library', () => {
    const supertonic = browserTtsModels['supertonic-3'];
    const kokoro = browserTtsModels['kokoro-82m'];

    expect(supertonic.languages).toHaveLength(32);
    expect(supertonic.languages.filter((language) => language.value !== 'na')).toHaveLength(31);
    expect(supertonic.voices).toHaveLength(10);
    expect(kokoro.languages.map((language) => language.value)).toEqual(['en-us', 'en-gb']);
    expect(kokoro.voices).toHaveLength(28);
    expect(kokoro.defaultVoice).toBe('af_bella');
    expect(getBrowserTtsVoices('kokoro-82m', 'en-us')).toHaveLength(20);
    expect(getBrowserTtsVoices('kokoro-82m', 'en-gb')).toHaveLength(8);
    expect(new Set(kokoro.voices.map((voice) => voice.value)).size).toBe(28);
    expect(getBrowserTtsVoice('kokoro-82m', 'af_bella')?.label).toBe('Bella');
    expect(getBrowserTtsVoiceGroups('kokoro-82m', 'en-us').map((group) => [group.label, group.voices.length])).toEqual([
      ['United States, female', 11],
      ['United States, male', 9],
    ]);
    expect(getBrowserTtsVoiceGroups('kokoro-82m', 'en-gb').map((group) => [group.label, group.voices.length])).toEqual([
      ['United Kingdom, female', 4],
      ['United Kingdom, male', 4],
    ]);
    expect(kokoro.voices.map((voice) => voice.value)).toEqual([
      'af_heart', 'af_alloy', 'af_aoede', 'af_bella', 'af_jessica', 'af_kore', 'af_nicole', 'af_nova', 'af_river', 'af_sarah', 'af_sky',
      'am_adam', 'am_echo', 'am_eric', 'am_fenrir', 'am_liam', 'am_michael', 'am_onyx', 'am_puck', 'am_santa',
      'bf_alice', 'bf_emma', 'bf_isabella', 'bf_lily',
      'bm_daniel', 'bm_fable', 'bm_george', 'bm_lewis',
    ]);
  });

  it('maps every fixed voice to a small, distinct static MP3 sample', () => {
    const hashes = new Set<string>();
    let totalBytes = 0;

    for (const model of Object.values(browserTtsModels)) {
      for (const voice of model.voices) {
        const url = getBrowserTtsVoiceSampleUrl(model.id, voice.value);
        expect(url).toBe(`/audio/tts-voice-samples/${model.id}/${voice.value.toLowerCase()}.mp3`);
        const audio = readFileSync(join(process.cwd(), 'public', ...url.split('/').filter(Boolean)));
        const hasMp3Header = audio.subarray(0, 3).toString('ascii') === 'ID3'
          || audio.subarray(0, 4_096).some((byte, index, bytes) => byte === 0xff && ((bytes[index + 1] ?? 0) & 0xe0) === 0xe0);
        expect(hasMp3Header).toBe(true);
        expect(audio.byteLength).toBeGreaterThan(32_000);
        expect(audio.byteLength).toBeLessThan(160_000);
        hashes.add(createHash('sha256').update(audio).digest('hex'));
        totalBytes += audio.byteLength;
      }
    }

    expect(hashes.size).toBe(38);
    expect(totalBytes).toBeLessThan(4_000_000);
    expect(getBrowserTtsVoiceSampleUrl('kokoro-82m', 'missing')).toBe('');
  });

  it('uses full-precision WebGPU with a bounded WebAssembly fallback', () => {
    expect(selectKokoroRuntimePlan(true)).toEqual({
      backend: 'webgpu',
      downloadMegabytes: 326,
      dtype: 'fp32',
      qualityLabel: 'full precision',
    });
    expect(selectKokoroRuntimePlan(false)).toMatchObject({ backend: 'wasm', dtype: 'q8' });
    expect(selectKokoroRuntimePlan(true, true)).toMatchObject({ backend: 'wasm', dtype: 'q8' });
  });
});
