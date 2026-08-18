import type { BrowserTtsModelId } from './browserTtsModels';

export type BrowserTtsBackend = 'wasm' | 'webgpu';

export type BrowserTtsWorkerRequest =
  | { forceWasm?: boolean; type: 'load' }
  | {
      type: 'generate';
      language: string;
      speed: number;
      steps: number;
      text: string;
      voice: string;
    };

export interface BrowserTtsWorkerEvent {
  audio?: ArrayBuffer;
  backend?: BrowserTtsBackend;
  bitrateKbps?: number;
  current?: number;
  durationSeconds?: number;
  dtype?: 'fp32' | 'q8';
  generationSeconds?: number;
  message?: string;
  modelId?: BrowserTtsModelId;
  revision?: string;
  sampleRate?: number;
  step?: number;
  total?: number;
  type: 'error' | 'generation-progress' | 'load-progress' | 'ready' | 'result' | 'voice-progress';
}
