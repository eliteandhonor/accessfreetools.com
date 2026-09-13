import { mergeTranscriptSegments, TRANSCRIBER_SAMPLE_RATE,
  TRANSCRIPTION_BLOCK_OVERLAP_SECONDS, WHISPER_CHUNK_SECONDS, WHISPER_STRIDE_SECONDS, type TranscriptionBlock,
  type TranscriptSegment } from './browserTranscriber';
import { buildWordAlignedSegments } from './browserTranscriberAlignment';
import { repairWhisperOverlaps, type RecognitionWindow, type WhisperWindowOutput } from './browserTranscriberOverlapRepair';

const quietHalf = 0.1 * TRANSCRIBER_SAMPLE_RATE;
const quietStep = 0.02 * TRANSCRIBER_SAMPLE_RATE;

function quietAt(audio: Float32Array, center: number): boolean {
  if (center < quietHalf || center + quietHalf > audio.length) return false;
  for (let sample = center - quietHalf; sample < center + quietHalf; sample++) {
    if (!Number.isFinite(audio[sample]) || Math.abs(audio[sample]) > 0.0001) return false;
  }
  return true;
}

export function selectWhisperCheckpointEnd(audio: Float32Array, end: number): number {
  if (!Number.isSafeInteger(end) || end < 0 || end > audio.length) {
    throw new RangeError('Whisper checkpoint is outside its source audio.');
  }
  if (end === audio.length || end + quietHalf > audio.length) return end;
  // The next block starts at end minus the existing overlap. Deferring a
  // phrase inside that shared audio leaves no source gap or new inference.
  const minimum = Math.max(0, end - TRANSCRIPTION_BLOCK_OVERLAP_SECONDS * TRANSCRIBER_SAMPLE_RATE);
  for (let candidate = end; candidate >= minimum; candidate -= quietStep) {
    if (quietAt(audio, candidate)) return candidate;
  }
  return end;
}

export function planWhisperWindows(audio: Float32Array): { start: number; end: number }[] {
  const rate = TRANSCRIBER_SAMPLE_RATE;
  const maximum = WHISPER_CHUNK_SECONDS * rate;
  const overlap = WHISPER_STRIDE_SECONDS * rate;
  const minimum = 20 * rate;
  const windows: { start: number; end: number }[] = [];
  for (let start = 0; start < audio.length;) {
    let end = Math.min(audio.length, start + maximum);
    // Prefer a nearby quiet cut before recognition. This never filters audio:
    // every original sample remains covered, with exactly five seconds shared.
    if (end < audio.length && end + quietHalf <= audio.length) {
      for (let candidate = end; candidate >= start + minimum; candidate -= quietStep) {
        if (quietAt(audio, candidate)) { end = candidate; break; }
      }
    }
    windows.push({ start, end });
    if (end === audio.length) break;
    start = end - overlap;
  }
  return windows;
}

export async function transcribeWhisperWindows(
  audio: Float32Array,
  block: Pick<TranscriptionBlock, 'start' | 'end'>,
  recognize: (audio: Float32Array) => Promise<WhisperWindowOutput>,
  onProgress?: (progress: number) => void,
  ownedEnd = block.end,
): Promise<TranscriptSegment[]> {
  const rate = TRANSCRIBER_SAMPLE_RATE;
  if (!Number.isFinite(block.start) || block.start < 0 || !Number.isFinite(block.end) ||
      block.end <= block.start || audio.length === 0 ||
      !Number.isFinite(ownedEnd) || ownedEnd <= block.start || ownedEnd > block.end ||
      block.end - ownedEnd > WHISPER_CHUNK_SECONDS - WHISPER_STRIDE_SECONDS ||
      audio.length !== Math.round(block.end * rate) - Math.round(block.start * rate)) {
    throw new RangeError('Whisper audio does not match its source interval.');
  }
  const windows = planWhisperWindows(audio);
  const hypotheses: RecognitionWindow[] = [];
  let segments: TranscriptSegment[] = [];
  for (const [index, window] of windows.entries()) {
    const { start, end } = window;
    // Avoid upstream lexical stitching across separate utterances. Recognize
    // one window, then reconcile overlap using its absolute source word times.
    const result = await recognize(audio.subarray(start, end));
    const chunks = (result.chunks ?? []).filter(chunk => chunk.text.trim());
    const source = {
      start: block.start + start / rate,
      end: Math.min(block.end, block.start + end / rate),
    };
    const aligned = buildWordAlignedSegments(chunks, source, result.text.trim());
    hypotheses.push({ ...source, segments: aligned });
    segments = mergeTranscriptSegments(segments, aligned);
    onProgress?.((index + 1) / windows.length * 0.9);
  }
  const repaired = await repairWhisperOverlaps(audio, block, segments, hypotheses, recognize,
    progress => onProgress?.(0.9 + progress * 0.1));
  onProgress?.(1);
  // Lookahead supplies context before checkpoint publication. Keep every
  // owned caption whole, even when uncertain or crossing the logical end.
  const nominal = Math.round(ownedEnd * rate) - Math.round(block.start * rate);
  const selected = selectWhisperCheckpointEnd(audio, nominal);
  const checkpointEnd = selected === nominal ? ownedEnd : block.start + selected / rate;
  return repaired.filter(caption => caption.start < checkpointEnd);
}
