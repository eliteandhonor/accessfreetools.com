export type BrowserTtsModelId = 'kokoro-82m' | 'supertonic-3';

export interface BrowserTtsLanguage {
  label: string;
  value: string;
}

export interface BrowserTtsVoice {
  label: string;
  language?: string;
  value: string;
}

export interface BrowserTtsModelDefinition {
  backendNote: string;
  defaultLanguage: string;
  defaultVoice: string;
  description: string;
  downloadMegabytes: number;
  fallbackDownloadMegabytes?: number;
  id: BrowserTtsModelId;
  languages: readonly BrowserTtsLanguage[];
  licenseLabel: string;
  licenseUrl: string;
  modelRevision: string;
  name: string;
  recommendation: string;
  voices: readonly BrowserTtsVoice[];
}

export const SUPERTONIC_MODEL_REVISION = '3cadd1ee6394adea1bd021217a0e650ede09a323';
export const KOKORO_MODEL_REVISION = '1939ad2a8e416c0acfeecc08a694d14ef25f2231';

export interface KokoroRuntimePlan {
  backend: 'wasm' | 'webgpu';
  downloadMegabytes: number;
  dtype: 'fp32' | 'q8';
  qualityLabel: string;
}

const supertonicLanguages: readonly BrowserTtsLanguage[] = [
  { value: 'na', label: 'Language not specified, best effort' },
  { value: 'ar', label: 'Arabic' },
  { value: 'bg', label: 'Bulgarian' },
  { value: 'hr', label: 'Croatian' },
  { value: 'cs', label: 'Czech' },
  { value: 'da', label: 'Danish' },
  { value: 'nl', label: 'Dutch' },
  { value: 'en', label: 'English' },
  { value: 'et', label: 'Estonian' },
  { value: 'fi', label: 'Finnish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'el', label: 'Greek' },
  { value: 'hi', label: 'Hindi' },
  { value: 'hu', label: 'Hungarian' },
  { value: 'id', label: 'Indonesian' },
  { value: 'it', label: 'Italian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'lv', label: 'Latvian' },
  { value: 'lt', label: 'Lithuanian' },
  { value: 'pl', label: 'Polish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ro', label: 'Romanian' },
  { value: 'ru', label: 'Russian' },
  { value: 'sk', label: 'Slovak' },
  { value: 'sl', label: 'Slovenian' },
  { value: 'es', label: 'Spanish' },
  { value: 'sv', label: 'Swedish' },
  { value: 'tr', label: 'Turkish' },
  { value: 'uk', label: 'Ukrainian' },
  { value: 'vi', label: 'Vietnamese' },
];

const supertonicVoices: readonly BrowserTtsVoice[] = [
  'F1', 'F2', 'F3', 'F4', 'F5', 'M1', 'M2', 'M3', 'M4', 'M5',
].map((value) => ({ value, label: value }));

const kokoroLanguages: readonly BrowserTtsLanguage[] = [
  { value: 'en-us', label: 'English (United States)' },
  { value: 'en-gb', label: 'English (United Kingdom)' },
];

const kokoroVoices: readonly BrowserTtsVoice[] = [
  { value: 'af_heart', label: 'Heart', language: 'en-us' },
  { value: 'af_bella', label: 'Bella', language: 'en-us' },
  { value: 'af_nicole', label: 'Nicole', language: 'en-us' },
  { value: 'am_michael', label: 'Michael', language: 'en-us' },
  { value: 'am_fenrir', label: 'Fenrir', language: 'en-us' },
  { value: 'am_puck', label: 'Puck', language: 'en-us' },
  { value: 'bf_emma', label: 'Emma', language: 'en-gb' },
  { value: 'bf_isabella', label: 'Isabella', language: 'en-gb' },
  { value: 'bm_george', label: 'George', language: 'en-gb' },
  { value: 'bm_fable', label: 'Fable', language: 'en-gb' },
];

export const browserTtsModels: Readonly<Record<BrowserTtsModelId, BrowserTtsModelDefinition>> = {
  'supertonic-3': {
    id: 'supertonic-3',
    name: 'Supertonic 3',
    recommendation: 'Recommended for multilingual text',
    description: '31 named languages, a best-effort option, and 10 fixed voices.',
    downloadMegabytes: 398,
    backendNote: 'WebGPU preferred, WebAssembly fallback',
    defaultLanguage: 'en',
    defaultVoice: 'F1',
    languages: supertonicLanguages,
    voices: supertonicVoices,
    modelRevision: SUPERTONIC_MODEL_REVISION,
    licenseLabel: 'OpenRAIL-M model terms',
    licenseUrl: 'https://huggingface.co/Supertone/supertonic-3/blob/main/LICENSE',
  },
  'kokoro-82m': {
    id: 'kokoro-82m',
    name: 'Kokoro 82M HQ',
    recommendation: 'Natural English with a compact fallback',
    description: 'Full-precision WebGPU speech for US and UK English, with 10 fixed voices.',
    downloadMegabytes: 326,
    fallbackDownloadMegabytes: 92,
    backendNote: 'Full-precision WebGPU, q8 WebAssembly fallback',
    defaultLanguage: 'en-us',
    defaultVoice: 'af_bella',
    languages: kokoroLanguages,
    voices: kokoroVoices,
    modelRevision: KOKORO_MODEL_REVISION,
    licenseLabel: 'Apache-2.0 model terms',
    licenseUrl: 'https://huggingface.co/hexgrad/Kokoro-82M/blob/main/LICENSE',
  },
};

export function getBrowserTtsModel(modelId: BrowserTtsModelId) {
  return browserTtsModels[modelId];
}

export function getBrowserTtsVoices(modelId: BrowserTtsModelId, language: string) {
  return browserTtsModels[modelId].voices.filter((voice) => !voice.language || voice.language === language);
}

export function getBrowserTtsDownloadNote(modelId: BrowserTtsModelId) {
  const model = getBrowserTtsModel(modelId);
  if (!model.fallbackDownloadMegabytes) return `about ${model.downloadMegabytes} MB on first use`;
  return `about ${model.downloadMegabytes} MB for full quality or ${model.fallbackDownloadMegabytes} MB in compatibility mode`;
}

export function selectKokoroRuntimePlan(webGpuAvailable: boolean, forceWasm = false): KokoroRuntimePlan {
  if (webGpuAvailable && !forceWasm) {
    return {
      backend: 'webgpu',
      downloadMegabytes: 326,
      dtype: 'fp32',
      qualityLabel: 'full precision',
    };
  }
  return {
    backend: 'wasm',
    downloadMegabytes: 92,
    dtype: 'q8',
    qualityLabel: 'compatibility',
  };
}
