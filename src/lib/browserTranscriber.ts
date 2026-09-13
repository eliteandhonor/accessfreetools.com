import { mergeAlignedTranscriptSegments } from './browserTranscriberAlignment';

export const MAX_TRANSCRIBER_BYTES = 250 * 1024 * 1024;
export const MAX_TRANSCRIBER_DURATION_SECONDS = 60 * 60;
export const TRANSCRIPTION_BLOCK_SECONDS = 5 * 60;
export const TRANSCRIPTION_BLOCK_OVERLAP_SECONDS = 5;
export const WHISPER_CHUNK_SECONDS = 30;
export const WHISPER_STRIDE_SECONDS = 5;
export const TRANSCRIBER_SAMPLE_RATE = 16_000;

const SUPPORTED_EXTENSIONS = new Set([
  'aac',
  'flac',
  'm4a',
  'mkv',
  'mov',
  'mp3',
  'mp4',
  'ogg',
  'opus',
  'wav',
  'webm',
]);

const WINDOWS_RESERVED_FILENAMES = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i;

export interface TranscriptionBlock {
  index: number;
  start: number;
  end: number;
}

export interface TranscriptWord {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
  overlapNeedsReview?: boolean;
  words?: TranscriptWord[];
}

export function compareTranscriptTimes(left: TranscriptSegment, right: TranscriptSegment): number {
  return left.start - right.start || left.end - right.end;
}

export interface MediaCandidate {
  name: string;
  size: number;
  type: string;
}

export type MediaCandidateValidation =
  | { ok: true }
  | {
      ok: false;
      code: 'empty_file' | 'file_too_large' | 'unsupported_file';
      message: string;
    };

export function createWhisperGenerationOptions(
  model: 'english' | 'multilingual',
  language: string,
) {
  const options: {
    chunk_length_s: number;
    force_full_sequences: boolean;
    language?: string;
    return_timestamps: 'word';
    stride_length_s: number;
    task?: 'transcribe';
  } = {
    chunk_length_s: WHISPER_CHUNK_SECONDS,
    force_full_sequences: false,
    return_timestamps: 'word',
    stride_length_s: WHISPER_STRIDE_SECONDS,
  };

  if (model === 'multilingual') {
    options.task = 'transcribe';
    if (language !== 'auto') options.language = language;
  }

  return options;
}

export function buildTranscriptionBlocks(
  durationSeconds: number,
  blockSeconds = TRANSCRIPTION_BLOCK_SECONDS,
  overlapSeconds = TRANSCRIPTION_BLOCK_OVERLAP_SECONDS,
): TranscriptionBlock[] {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return [];
  if (blockSeconds <= 0 || overlapSeconds < 0 || overlapSeconds >= blockSeconds) {
    throw new RangeError('Block length must be positive and greater than its overlap.');
  }

  const blocks: TranscriptionBlock[] = [];
  const step = blockSeconds - overlapSeconds;
  let start = 0;

  while (start < durationSeconds) {
    const end = Math.min(durationSeconds, start + blockSeconds);
    blocks.push({ index: blocks.length, start, end });
    if (end >= durationSeconds) break;
    start += step;
  }

  return blocks;
}

export function downmixToMono(interleaved: Float32Array, channels: number): Float32Array {
  if (!Number.isInteger(channels) || channels < 1) {
    throw new RangeError('Audio channel count must be a positive integer.');
  }
  if (interleaved.length % channels !== 0) {
    throw new RangeError('Interleaved audio length must be divisible by its channel count.');
  }
  if (channels === 1) return interleaved.slice();

  const mono = new Float32Array(interleaved.length / channels);
  for (let frame = 0; frame < mono.length; frame += 1) {
    let sum = 0;
    const offset = frame * channels;
    for (let channel = 0; channel < channels; channel += 1) {
      sum += interleaved[offset + channel] ?? 0;
    }
    mono[frame] = sum / channels;
  }
  return mono;
}

export function resampleLinear(
  input: Float32Array,
  sourceRate: number,
  targetRate = TRANSCRIBER_SAMPLE_RATE,
): Float32Array {
  if (!Number.isFinite(sourceRate) || sourceRate <= 0 || !Number.isFinite(targetRate) || targetRate <= 0) {
    throw new RangeError('Audio sample rates must be positive numbers.');
  }
  if (input.length === 0) return new Float32Array();
  if (sourceRate === targetRate) return input.slice();

  const outputLength = Math.max(1, Math.round((input.length * targetRate) / sourceRate));
  const output = new Float32Array(outputLength);
  const ratio = sourceRate / targetRate;

  for (let index = 0; index < outputLength; index += 1) {
    const sourcePosition = Math.min(input.length - 1, index * ratio);
    const lowerIndex = Math.floor(sourcePosition);
    const upperIndex = Math.min(input.length - 1, lowerIndex + 1);
    const fraction = sourcePosition - lowerIndex;
    output[index] = (input[lowerIndex] ?? 0) * (1 - fraction) + (input[upperIndex] ?? 0) * fraction;
  }

  return output;
}

export function createTranscriptionResampler(
  block: Pick<TranscriptionBlock, 'start' | 'end'>,
  targetRate = TRANSCRIBER_SAMPLE_RATE,
) {
  if (!Number.isFinite(targetRate) || targetRate <= 0 || !Number.isFinite(block.start) ||
      !Number.isFinite(block.end) || block.end <= block.start) {
    throw new RangeError('Audio block and sample rate must define a finite positive interval.');
  }
  // One absolute output grid, one block allocation, and one retained source sample.
  // Linear interpolation is not an anti-aliasing filter.
  const firstSample = Math.round(block.start * targetRate);
  const output = new Float32Array(Math.round(block.end * targetRate) - firstSample);
  let cursor = 0;
  let finished = false;
  let origin = 0;
  let frames = 0;
  let rate = 0;
  let tail: { end: number; value: number } | undefined;
  const before = (time: number) => Math.min(output.length, Math.ceil(time * targetRate - 1e-7) - firstSample);
  const timeAtCursor = () => (firstSample + cursor) / targetRate;

  function flushTail() {
    if (!tail) return;
    const end = before(tail.end);
    while (cursor < end) output[cursor++] = tail.value;
  }

  return {
    push(input: Float32Array, sourceRate: number, timestamp: number) {
      if (finished) throw new Error('Cannot push audio after finish.');
      if (!Number.isFinite(sourceRate) || sourceRate <= 0 || !Number.isFinite(timestamp)) {
        throw new RangeError('Audio sample rate and timestamp must be finite, with a positive rate.');
      }
      if (!input.length) return;
      if (tail && timestamp + input.length / sourceRate <= tail.end + 1e-10) return;

      // Decoder timestamps may be rounded to microseconds. Anchor consecutive packets
      // to the original frame count so timestamp quantization cannot accumulate drift.
      const contiguous = tail && rate === sourceRate && Math.abs(timestamp - tail.end) <= 1.1e-6;
      if (!contiguous) {
        flushTail();
        origin = timestamp;
        frames = 0;
      }
      rate = sourceRate;
      const start = origin + frames / rate;
      if (contiguous && tail) {
        const end = before(start);
        while (cursor < end) {
          const fraction = Math.max(0, Math.min(1, (timeAtCursor() - origin) * rate - frames + 1));
          output[cursor++] = tail.value * (1 - fraction) + input[0] * fraction;
        }
      }
      cursor = Math.max(cursor, 0, before(start));
      const lastTime = origin + (frames + input.length - 1) / rate;
      const end = Math.min(output.length, Math.floor(lastTime * targetRate + 1e-7) + 1 - firstSample);
      while (cursor < end) {
        let position = (timeAtCursor() - origin) * rate - frames;
        const nearest = Math.round(position);
        if (Math.abs(position - nearest) < 1e-6) position = nearest;
        position = Math.max(0, Math.min(input.length - 1, position));
        const lower = Math.floor(position);
        const fraction = position - lower;
        output[cursor++] = input[lower] * (1 - fraction) + input[Math.min(lower + 1, input.length - 1)] * fraction;
      }
      frames += input.length;
      tail = { end: origin + frames / rate, value: input[input.length - 1] };
    },
    finish() {
      if (!finished) flushTail();
      finished = true;
      return output;
    },
  };
}

function boundaryTokens(value: string) {
  // Character tokens for unspaced CJK; word tokens elsewhere. Every normalized
  // token retains its original UTF-16 offset, including around punctuation.
  const pattern = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]|(?:(?![\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])[\p{L}\p{N}\p{M}])+/gu;
  return Array.from(value.matchAll(pattern), (match) => ({
    text: match[0].normalize('NFC').toLowerCase(),
    start: match.index,
  }));
}

function sourceOverlaps(left: TranscriptSegment, right: TranscriptSegment) {
  return Math.min(left.end, right.end) > Math.max(left.start, right.start);
}

function repeatedBoundaryCounts(completed: readonly TranscriptSegment[], incoming: readonly TranscriptSegment[]) {
  const timedTokens = (segments: readonly TranscriptSegment[]) => segments.flatMap((segment) =>
    boundaryTokens(segment.text).map((token) => ({ ...token, segment })));
  const previousWords = timedTokens(completed.filter((segment) => incoming.some((next) => sourceOverlaps(segment, next))));
  const nextWords = timedTokens(incoming);
  const maximum = Math.min(previousWords.length, nextWords.length);
  const counts = new Map<TranscriptSegment, number>();
  let matchedLength = 0;

  for (let overlap = maximum; overlap > 0; overlap -= 1) {
    const matched = previousWords.slice(-overlap).every((token, index) =>
      token.text === nextWords[index].text && sourceOverlaps(token.segment, nextWords[index].segment));
    if (!matched) continue;
    // Repeated phrases can fit more than one alignment inside coarse ASR spans.
    // Without word timing, choosing even the shortest match can delete speech.
    if (matchedLength) return {
      counts,
      uncertain: new Set(nextWords.slice(0, matchedLength).map(({ segment }) => segment)),
    };
    matchedLength = overlap;
  }
  for (const { segment } of nextWords.slice(0, matchedLength)) counts.set(segment, (counts.get(segment) ?? 0) + 1);
  return { counts, uncertain: new Set<TranscriptSegment>() };
}

function normalizedText(value: string): string {
  return boundaryTokens(value).map((token) => token.text).join(' ');
}

export function mergeTranscriptSegments(
  completed: readonly TranscriptSegment[],
  incoming: readonly TranscriptSegment[],
): TranscriptSegment[] {
  const result = completed
    .filter((segment) => Number.isFinite(segment.start) && Number.isFinite(segment.end) && segment.text.trim())
    .map((segment) => ({
      start: Math.max(0, segment.start),
      end: Math.max(Math.max(0, segment.start), segment.end),
      text: segment.text.trim(),
      ...(segment.words ? { words: segment.words.map(word => ({ ...word })) } : {}),
      ...(segment.overlapNeedsReview ? { overlapNeedsReview: true } : {}),
    }));

  // Only completed (previous-block) audio can be a duplicate source. Never use
  // newly appended ASR segments as deduplication evidence for their neighbours.
  const priorBlock = [...result];
  const sortedIncoming = incoming
    .filter((segment) => Number.isFinite(segment.start) && Number.isFinite(segment.end) && segment.text.trim())
    .slice().sort(compareTranscriptTimes);
  const alignedResult = mergeAlignedTranscriptSegments(priorBlock, sortedIncoming);
  if (alignedResult) return alignedResult;
  const boundary = repeatedBoundaryCounts(priorBlock, sortedIncoming);
  for (const candidate of sortedIncoming) {
    let text = candidate.text.trim();

    const overlapping = priorBlock.filter((segment) => sourceOverlaps(segment, candidate));
    const normalized = normalizedText(text);
    const uncertain = !!candidate.overlapNeedsReview || boundary.uncertain.has(candidate);
    const duplicate = normalized && overlapping.some((segment) => normalizedText(segment.text) === normalized &&
      (!uncertain || (segment.start === candidate.start && segment.end === candidate.end)));
    if (duplicate) continue;

    const previous = result.at(-1);
    const count = uncertain ? 0 : boundary.counts.get(candidate) ?? 0;
    if (count) {
      const tokens = boundaryTokens(candidate.text);
      text = count === tokens.length ? '' : candidate.text.slice(tokens[count].start).trim();
    }
    if (!text) continue;

    const start = Math.max(0, candidate.start, uncertain ? 0 : previous?.end ?? 0);
    const end = Math.max(start + 0.001, candidate.end);
    result.push({ start, end, text, ...(uncertain ? { overlapNeedsReview: true } : {}) });
  }

  return result;
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

function formatCueTime(seconds: number, decimalSeparator: ',' | '.'): string {
  const millisecondsTotal = Math.max(0, Math.round(seconds * 1000));
  const hours = Math.floor(millisecondsTotal / 3_600_000);
  const minutes = Math.floor((millisecondsTotal % 3_600_000) / 60_000);
  const wholeSeconds = Math.floor((millisecondsTotal % 60_000) / 1000);
  const milliseconds = millisecondsTotal % 1000;
  return `${pad(hours)}:${pad(minutes)}:${pad(wholeSeconds)}${decimalSeparator}${pad(milliseconds, 3)}`;
}

function safeSrtLine(line: string): string {
  const neutral = '<font></font>';
  const continuationStart = '<font ';
  const continuationEnd = '></font>';
  const encoder = new TextEncoder();
  let encoded = neutral;
  let bytes = neutral.length;
  const append = (atom: string) => {
    const width = encoder.encode(atom).length;
    // FFmpeg consumes this LF inside the supported font start tag. The 1000-byte
    // physical-line margin is not an input cap; reserve both marker halves.
    if (bytes + width + continuationStart.length > 1000) {
      encoded += `${continuationStart}\n${continuationEnd}`;
      bytes = continuationEnd.length;
    }
    encoded += atom;
    bytes += width;
  };
  // Each Unicode code point and its literal-markup guard stay in one atom.
  for (const character of line) append(/[<&]/.test(character) ? `${character}${neutral}` : character);
  if (!line || /\s$/.test(line)) append('<b></b>');
  return encoded;
}

function safeCueText(text: string, format: 'srt' | 'vtt'): string {
  const normalized = text.replace(/\r\n?/g, '\n');
  if (format === 'srt') {
    // SubRip readers such as FFmpeg do not decode HTML entities. Neutral tags
    // separate literal markup/entities and protect indentation/cue-like lines.
    // Empty bold tags also prevent trailing blank lines/spaces being trimmed.
    return normalized.split('\n').map(safeSrtLine).join('\n');
  }
  // Empty physical lines end cues. Empty supported tags keep those lines inside
  // the cue without adding visible characters; user markup is always literal.
  return normalized
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .split('\n').map((line) => line.trim() ? line : `<c></c>${line}`).join('\n');
}

export function createTranscriptDownloads(segments: readonly TranscriptSegment[]): {
  txt: string;
  srt: string;
  vtt: string;
} {
  const ordered = [...segments].sort(compareTranscriptTimes);
  const usable = ordered.filter((segment) => segment.text.trim());
  const txt = `${ordered.map((segment) => segment.text).join('\n\n')}\n`;
  const srt = `${usable
    .map(
      (segment, index) =>
        `${index + 1}\n${formatCueTime(segment.start, ',')} --> ${formatCueTime(segment.end, ',')}\n${safeCueText(segment.text, 'srt')}`,
    )
    .join('\n\n')}\n`;
  const vttBody = usable
    .map(
      (segment) =>
        `${formatCueTime(segment.start, '.')} --> ${formatCueTime(segment.end, '.')}\n${safeCueText(segment.text, 'vtt')}`,
    )
    .join('\n\n');
  const vtt = `WEBVTT\n\n${vttBody}${vttBody ? '\n' : ''}`;
  return { txt, srt, vtt };
}

export function sanitizeTranscriptFilename(value: string, extension: 'txt' | 'srt' | 'vtt'): string {
  const withoutKnownExtension = value.trim().replace(/\.(?:txt|srt|vtt)$/i, '');
  let base = withoutKnownExtension
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
    .replace(/[. ]+$/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, 120)
    .trim();
  if (!base || WINDOWS_RESERVED_FILENAMES.test(base)) base = 'transcript';
  return `${base}.${extension}`;
}

export function validateMediaCandidate(candidate: MediaCandidate): MediaCandidateValidation {
  if (!Number.isFinite(candidate.size) || candidate.size <= 0) {
    return { ok: false, code: 'empty_file', message: 'Choose a media file that contains data.' };
  }
  if (candidate.size > MAX_TRANSCRIBER_BYTES) {
    return {
      ok: false,
      code: 'file_too_large',
      message: 'This file is larger than the 250 MB browser limit.',
    };
  }

  const extension = candidate.name.split('.').pop()?.toLocaleLowerCase() ?? '';
  const mediaMime = /^(?:audio|video)\//i.test(candidate.type);
  if (!SUPPORTED_EXTENSIONS.has(extension) && !mediaMime) {
    return {
      ok: false,
      code: 'unsupported_file',
      message: 'Choose an MP3, WAV, M4A, AAC, FLAC, OGG, Opus, MP4, MOV, WebM, or MKV file.',
    };
  }

  return { ok: true };
}
