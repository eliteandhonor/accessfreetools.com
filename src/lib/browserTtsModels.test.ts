import { describe, expect, it } from 'vitest';

import {
  browserTtsModels,
  getBrowserTtsVoices,
  KOKORO_MODEL_REVISION,
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

  it('keeps Supertonic multilingual and Kokoro browser support English-only', () => {
    const supertonic = browserTtsModels['supertonic-3'];
    const kokoro = browserTtsModels['kokoro-82m'];

    expect(supertonic.languages).toHaveLength(32);
    expect(supertonic.languages.filter((language) => language.value !== 'na')).toHaveLength(31);
    expect(supertonic.voices).toHaveLength(10);
    expect(kokoro.languages.map((language) => language.value)).toEqual(['en-us', 'en-gb']);
    expect(kokoro.voices).toHaveLength(10);
    expect(getBrowserTtsVoices('kokoro-82m', 'en-us')).toHaveLength(6);
    expect(getBrowserTtsVoices('kokoro-82m', 'en-gb')).toHaveLength(4);
  });
});
