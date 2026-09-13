/// <reference lib="webworker" />

import { ALL_FORMATS, AudioSampleSink, BlobSource, Input, type InputAudioTrack } from 'mediabunny';

import {
  MAX_TRANSCRIBER_DURATION_SECONDS,
  TRANSCRIBER_SAMPLE_RATE,
  createTranscriptionResampler,
  downmixToMono,
} from '../lib/browserTranscriber';
import type {
  InspectedMedia,
  TranscriberMediaWorkerEvent,
  TranscriberMediaWorkerRequest,
} from '../lib/browserTranscriberWorkerTypes';

const worker = self as DedicatedWorkerGlobalScope;
let input: Input<BlobSource> | null = null;
let audioTracks: InputAudioTrack[] = [];

function send(message: TranscriberMediaWorkerEvent, transfer: Transferable[] = []) {
  worker.postMessage(message, transfer);
}

function disposeInput() {
  input?.dispose();
  input = null;
  audioTracks = [];
}

function safeMediaError(error: unknown, stage: 'decode' | 'inspect'): string {
  if (!(error instanceof Error)) return `The browser could not ${stage} this media file.`;
  if (/longer than the 60-minute|does not contain an audio track|duration could not be read/i.test(error.message)) {
    return error.message;
  }
  if (/AudioDecoder|decode|codec|unsupported/i.test(error.message)) {
    return 'This browser cannot decode the selected audio track. Convert the file to MP3 or WAV and try again.';
  }
  if (/format|recogniz/i.test(error.message)) {
    return 'The file container is damaged or not supported. Try MP3, WAV, M4A, MP4, MOV, WebM, or MKV.';
  }
  return stage === 'inspect'
    ? 'The browser could not read this media file.'
    : 'The browser stopped while decoding this part of the recording.';
}

async function inspect(file: File, sendReply: typeof send) {
  disposeInput();
  input = new Input({ formats: ALL_FORMATS, source: new BlobSource(file) });
  const [format, tracks] = await Promise.all([input.getFormat(), input.getAudioTracks()]);
  audioTracks = tracks;
  if (tracks.length === 0) throw new Error('This file does not contain an audio track.');

  const duration = await input.computeDuration(tracks);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('The audio duration could not be read.');
  if (duration > MAX_TRANSCRIBER_DURATION_SECONDS + 0.05) {
    throw new Error('This recording is longer than the 60-minute browser limit.');
  }

  const inspectedTracks = await Promise.all(
    tracks.map(async (track) => ({
      canDecode: await track.canDecode(),
      channels: await track.getNumberOfChannels(),
      codec: String((await track.getCodecParameterString()) ?? (await track.getInternalCodecId()) ?? 'Unknown codec'),
      id: track.id,
      language: await track.getLanguageCode(),
      name: (await track.getName()) ?? `Audio track ${track.number}`,
      number: track.number,
      sampleRate: await track.getSampleRate(),
    })),
  );

  const media: InspectedMedia = {
    duration,
    format: format.name,
    nativeAudioDecoderAvailable: typeof AudioDecoder !== 'undefined',
    tracks: inspectedTracks,
  };
  sendReply({ type: 'inspected', media });
}

async function decode(
  request: Extract<TranscriberMediaWorkerRequest, { type: 'decode' }>,
  sendReply: typeof send,
) {
  if (!input) throw new Error('Choose and inspect a file before decoding it.');
  const track = audioTracks.find((candidate) => candidate.number === request.trackNumber);
  if (!track) throw new Error('The selected audio track is no longer available.');
  if (!(await track.canDecode())) throw new Error('This audio codec is unsupported by this browser.');

  const sink = new AudioSampleSink(track);
  const resampler = createTranscriptionResampler(request.block);
  let hasAudio = false;
  const blockDuration = Math.max(0.001, request.block.end - request.block.start);
  let latestTimestamp = request.block.start;

  for await (const sample of sink.samples(request.block.start, request.block.end)) {
    try {
      const sampleStart = sample.timestamp;
      const sampleEnd = sample.timestamp + sample.numberOfFrames / sample.sampleRate;
      const clippedStart = Math.max(request.block.start, sampleStart);
      const clippedEnd = Math.min(request.block.end, sampleEnd);
      if (clippedEnd <= clippedStart) continue;

      // Retain interpolation neighbours around the block limits; the resampler
      // clips on the absolute output grid, not on rounded packet-local lengths.
      const frameOffset = Math.max(0, Math.floor((clippedStart - sampleStart) * sample.sampleRate) - 1);
      const availableFrames = Math.max(0, sample.numberOfFrames - frameOffset);
      const frameCount = Math.min(
        availableFrames,
        Math.max(0, Math.ceil((clippedEnd - sampleStart) * sample.sampleRate) + 1 - frameOffset),
      );
      if (frameCount === 0) continue;

      const interleaved = new Float32Array(frameCount * sample.numberOfChannels);
      sample.copyTo(interleaved, { format: 'f32', frameCount, frameOffset, planeIndex: 0 });
      const mono = downmixToMono(interleaved, sample.numberOfChannels);
      resampler.push(mono, sample.sampleRate, sampleStart + frameOffset / sample.sampleRate);
      hasAudio = true;
      latestTimestamp = Math.max(latestTimestamp, clippedEnd);
      sendReply({
        type: 'decode-progress',
        blockIndex: request.block.index,
        progress: Math.min(1, Math.max(0, (latestTimestamp - request.block.start) / blockDuration)),
      });
    } finally {
      sample.close();
    }
  }

  if (!hasAudio) throw new Error('No decodable audio was found in this part of the recording.');
  const output = resampler.finish();
  const audioBuffer = output.buffer as ArrayBuffer;
  sendReply(
    {
      type: 'decoded',
      blockIndex: request.block.index,
      audio: audioBuffer,
      sampleRate: TRANSCRIBER_SAMPLE_RATE,
    },
    [audioBuffer],
  );
}

worker.addEventListener('message', async (event: MessageEvent<TranscriberMediaWorkerRequest>) => {
  const request = event.data;
  const sendReply: typeof send = (message, transfer) => send(
    request.requestId === undefined ? message : { ...message, requestId: request.requestId }, transfer,
  );
  try {
    if (request.type === 'inspect') {
      await inspect(request.file, sendReply);
      return;
    }
    if (request.type === 'decode') {
      await decode(request, sendReply);
      return;
    }
    disposeInput();
    sendReply({ type: 'reset' });
  } catch (error) {
    const stage = request.type === 'decode' ? 'decode' : 'inspect';
    sendReply({ type: 'error', stage, message: safeMediaError(error, stage) });
  }
});

worker.addEventListener('close', disposeInput);
