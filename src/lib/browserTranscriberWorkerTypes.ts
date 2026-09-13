import type { TranscriptSegment, TranscriptionBlock } from './browserTranscriber';

export type TranscriberBackend = 'wasm' | 'webgpu';
export type TranscriberModelKind = 'english' | 'multilingual';

export interface InspectedAudioTrack {
  canDecode: boolean;
  channels: number | null;
  codec: string;
  id: number;
  language: string;
  name: string;
  number: number;
  sampleRate: number | null;
}

export interface InspectedMedia {
  duration: number;
  format: string;
  nativeAudioDecoderAvailable?: boolean;
  tracks: InspectedAudioTrack[];
}

export type TranscriberMediaWorkerRequest = { requestId?: number } & (
  | { type: 'inspect'; file: File }
  | { type: 'decode'; block: TranscriptionBlock; trackNumber: number }
  | { type: 'reset' });

export type TranscriberMediaWorkerEvent = { requestId?: number } & (
  | { type: 'inspected'; media: InspectedMedia }
  | { type: 'decode-progress'; blockIndex: number; progress: number }
  | { type: 'decoded'; blockIndex: number; audio: ArrayBuffer; sampleRate: number }
  | { type: 'reset' }
  | { type: 'error'; stage: 'decode' | 'inspect'; message: string });

export type TranscriberAsrWorkerRequest = { requestId?: number } & (
  | {
      type: 'load';
      backend: TranscriberBackend;
      model: TranscriberModelKind;
    }
  | {
      type: 'transcribe';
      audio: ArrayBuffer;
      block: TranscriptionBlock;
      sourceEnd?: number;
      language: string;
      model: TranscriberModelKind;
    }
  | { type: 'dispose' });

export type TranscriberAsrWorkerEvent = { requestId?: number } & (
  | {
      type: 'load-progress';
      current?: number;
      message: string;
      progress?: number;
      total?: number;
    }
  | {
      type: 'ready';
      backend: TranscriberBackend;
      model: TranscriberModelKind;
      revision: string;
    }
  | { type: 'transcription-progress'; progress: number }
  | { type: 'transcribed'; blockIndex: number; segments: TranscriptSegment[]; text: string }
  | { type: 'disposed' }
  | { type: 'error'; stage: 'load' | 'transcribe'; message: string; name?: 'AbortError' | 'TimeoutError' });
