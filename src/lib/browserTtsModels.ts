export type BrowserTtsModelId = 'kokoro-82m' | 'supertonic-3';

export interface BrowserTtsLanguage {
  label: string;
  value: string;
}

export interface BrowserTtsVoice {
  description: string;
  group: string;
  label: string;
  language?: string;
  value: string;
}

export interface BrowserTtsVoiceGroup {
  label: string;
  voices: readonly BrowserTtsVoice[];
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
  { value: 'F1', label: 'F1', group: 'Female voices', description: 'Calm and steady. Suits guided instructions and professional narration.' },
  { value: 'F2', label: 'F2', group: 'Female voices', description: 'Bright and playful. Suits lively and youth-focused narration.' },
  { value: 'F3', label: 'F3', group: 'Female voices', description: 'Clear announcer style. Suits documentaries and formal narration.' },
  { value: 'F4', label: 'F4', group: 'Female voices', description: 'Crisp and confident. Suits training and product explainers.' },
  { value: 'F5', label: 'F5', group: 'Female voices', description: 'Kind and gentle. Suits audiobooks and supportive narration.' },
  { value: 'M1', label: 'M1', group: 'Male voices', description: 'Lively and upbeat. Suits explainers and casual narration.' },
  { value: 'M2', label: 'M2', group: 'Male voices', description: 'Deep and composed. Suits documentaries and formal guidance.' },
  { value: 'M3', label: 'M3', group: 'Male voices', description: 'Polished and authoritative. Suits business and high-trust narration.' },
  { value: 'M4', label: 'M4', group: 'Male voices', description: 'Soft and friendly. Suits education and onboarding.' },
  { value: 'M5', label: 'M5', group: 'Male voices', description: 'Warm storyteller. Suits audiobooks and reflective narration.' },
];

const kokoroLanguages: readonly BrowserTtsLanguage[] = [
  { value: 'en-us', label: 'English (United States)' },
  { value: 'en-gb', label: 'English (United Kingdom)' },
];

const kokoroVoices: readonly BrowserTtsVoice[] = [
  { value: 'af_heart', label: 'Heart', language: 'en-us', group: 'United States, female', description: 'American English, female voice.' },
  { value: 'af_alloy', label: 'Alloy', language: 'en-us', group: 'United States, female', description: 'American English, female voice.' },
  { value: 'af_aoede', label: 'Aoede', language: 'en-us', group: 'United States, female', description: 'American English, female voice.' },
  { value: 'af_bella', label: 'Bella', language: 'en-us', group: 'United States, female', description: 'American English, female voice.' },
  { value: 'af_jessica', label: 'Jessica', language: 'en-us', group: 'United States, female', description: 'American English, female voice.' },
  { value: 'af_kore', label: 'Kore', language: 'en-us', group: 'United States, female', description: 'American English, female voice.' },
  { value: 'af_nicole', label: 'Nicole', language: 'en-us', group: 'United States, female', description: 'American English, female voice.' },
  { value: 'af_nova', label: 'Nova', language: 'en-us', group: 'United States, female', description: 'American English, female voice.' },
  { value: 'af_river', label: 'River', language: 'en-us', group: 'United States, female', description: 'American English, female voice.' },
  { value: 'af_sarah', label: 'Sarah', language: 'en-us', group: 'United States, female', description: 'American English, female voice.' },
  { value: 'af_sky', label: 'Sky', language: 'en-us', group: 'United States, female', description: 'American English, female voice.' },
  { value: 'am_adam', label: 'Adam', language: 'en-us', group: 'United States, male', description: 'American English, male voice.' },
  { value: 'am_echo', label: 'Echo', language: 'en-us', group: 'United States, male', description: 'American English, male voice.' },
  { value: 'am_eric', label: 'Eric', language: 'en-us', group: 'United States, male', description: 'American English, male voice.' },
  { value: 'am_fenrir', label: 'Fenrir', language: 'en-us', group: 'United States, male', description: 'American English, male voice.' },
  { value: 'am_liam', label: 'Liam', language: 'en-us', group: 'United States, male', description: 'American English, male voice.' },
  { value: 'am_michael', label: 'Michael', language: 'en-us', group: 'United States, male', description: 'American English, male voice.' },
  { value: 'am_onyx', label: 'Onyx', language: 'en-us', group: 'United States, male', description: 'American English, male voice.' },
  { value: 'am_puck', label: 'Puck', language: 'en-us', group: 'United States, male', description: 'American English, male voice.' },
  { value: 'am_santa', label: 'Santa', language: 'en-us', group: 'United States, male', description: 'American English, male voice.' },
  { value: 'bf_alice', label: 'Alice', language: 'en-gb', group: 'United Kingdom, female', description: 'British English, female voice.' },
  { value: 'bf_emma', label: 'Emma', language: 'en-gb', group: 'United Kingdom, female', description: 'British English, female voice.' },
  { value: 'bf_isabella', label: 'Isabella', language: 'en-gb', group: 'United Kingdom, female', description: 'British English, female voice.' },
  { value: 'bf_lily', label: 'Lily', language: 'en-gb', group: 'United Kingdom, female', description: 'British English, female voice.' },
  { value: 'bm_daniel', label: 'Daniel', language: 'en-gb', group: 'United Kingdom, male', description: 'British English, male voice.' },
  { value: 'bm_fable', label: 'Fable', language: 'en-gb', group: 'United Kingdom, male', description: 'British English, male voice.' },
  { value: 'bm_george', label: 'George', language: 'en-gb', group: 'United Kingdom, male', description: 'British English, male voice.' },
  { value: 'bm_lewis', label: 'Lewis', language: 'en-gb', group: 'United Kingdom, male', description: 'British English, male voice.' },
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
    description: 'Full-precision WebGPU speech for US and UK English, with 28 fixed voices.',
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

export function getBrowserTtsVoice(modelId: BrowserTtsModelId, value: string) {
  return browserTtsModels[modelId].voices.find((voice) => voice.value === value);
}

export function getBrowserTtsVoiceSampleUrl(modelId: BrowserTtsModelId, value: string) {
  const voice = getBrowserTtsVoice(modelId, value);
  if (!voice) return '';
  return `/audio/tts-voice-samples/${modelId}/${voice.value.toLowerCase()}.mp3`;
}

export function getBrowserTtsVoiceGroups(modelId: BrowserTtsModelId, language: string): BrowserTtsVoiceGroup[] {
  const groups = new Map<string, BrowserTtsVoice[]>();
  for (const voice of getBrowserTtsVoices(modelId, language)) {
    const voices = groups.get(voice.group) ?? [];
    voices.push(voice);
    groups.set(voice.group, voices);
  }
  return [...groups].map(([label, voices]) => ({ label, voices }));
}

export function getAllBrowserTtsVoiceGroups(modelId: BrowserTtsModelId): BrowserTtsVoiceGroup[] {
  const groups = new Map<string, BrowserTtsVoice[]>();
  for (const voice of browserTtsModels[modelId].voices) {
    const voices = groups.get(voice.group) ?? [];
    voices.push(voice);
    groups.set(voice.group, voices);
  }
  return [...groups].map(([label, voices]) => ({ label, voices }));
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
