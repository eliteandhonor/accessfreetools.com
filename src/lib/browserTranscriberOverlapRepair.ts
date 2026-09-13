import { compareTranscriptTimes, TRANSCRIBER_SAMPLE_RATE, WHISPER_CHUNK_SECONDS,
  WHISPER_STRIDE_SECONDS, type TranscriptSegment, type TranscriptionBlock } from './browserTranscriber';
import { buildWordAlignedSegments } from './browserTranscriberAlignment';
import { canReplaceWhisperHypotheses, hasFullWhisperCorroboration } from './browserTranscriberOverlapCoverage';

export interface RecognitionWindow {
  start: number;
  end: number;
  segments: readonly TranscriptSegment[];
}
export interface WhisperWindowOutput {
  text: string;
  chunks?: { text: string; timestamp: readonly (number | null)[] }[];
}
type Interval = Pick<TranscriptionBlock, 'start' | 'end'>;
const intersects = (left: Interval, right: Interval) => Math.min(left.end, right.end) > Math.max(left.start, right.start);
const touchesPoint = (caption: TranscriptSegment, span: Interval) => caption.words?.some(word =>
  word.start === word.end && (word.start === span.start || word.start === span.end));
const affected = (caption: TranscriptSegment, span: Interval) => intersects(caption, span) || touchesPoint(caption, span);
const aligned = (caption: TranscriptSegment) => !!caption.text.trim() && !!caption.words?.length &&
  caption.start === caption.words[0].start && caption.end === caption.words.at(-1)!.end &&
  !buildWordAlignedSegments(caption.words.map(word => ({ text: word.text, timestamp: [word.start, word.end] })),
    { start: 0, end: caption.end }, caption.text)[0]?.overlapNeedsReview;

export async function repairWhisperOverlaps(
  audio: Float32Array, block: Interval, segments: readonly TranscriptSegment[],
  windows: readonly RecognitionWindow[], recognize: (audio: Float32Array) => Promise<WhisperWindowOutput>,
  onProgress?: (progress: number) => void,
): Promise<TranscriptSegment[]> {
  const raw = windows.flatMap(window => window.segments);
  const conflicts = segments.filter((caption, index) => segments.some((other, otherIndex) =>
    index !== otherIndex && intersects(caption, other)));
  const regions: Interval[] = [];
  for (const caption of conflicts.sort(compareTranscriptTimes)) {
    const span = { start: caption.start - WHISPER_STRIDE_SECONDS, end: caption.end + WHISPER_STRIDE_SECONDS };
    // A context crop must include whole intersecting hypotheses, not cut a word
    // out of an already recognized caption. Unknown/oversized regions stay open.
    let changed: boolean;
    do {
      changed = false;
      for (const item of [...segments, ...raw]) {
        if (!affected(item, span)) continue;
        if (item.start < span.start) { span.start = item.start; changed = true; }
        if (item.end > span.end) { span.end = item.end; changed = true; }
      }
    } while (changed);
    const previous = regions.at(-1);
    if (previous && span.start <= previous.end) {
      previous.start = Math.min(previous.start, span.start);
      previous.end = Math.max(previous.end, span.end);
    } else regions.push(span);
  }
  let current = [...segments];
  const rate = TRANSCRIBER_SAMPLE_RATE;
  for (const [index, region] of regions.entries()) {
    if (index >= windows.length || region.start < block.start || region.end > block.end) continue;
    const from = Math.floor((region.start - block.start) * rate);
    const to = Math.ceil((region.end - block.start) * rate);
    if (from < 0 || to > audio.length || to <= from || to - from > WHISPER_CHUNK_SECONDS * rate) continue;
    const extendedTo = Math.min(audio.length, from + WHISPER_CHUNK_SECONDS * rate);
    // One longer context is allowed after an aligned but uncorroborated retry.
    // Each attempt is checked against raw originals, never the rejected retry.
    for (const end of extendedTo > to ? [to, extendedTo] : [to]) {
      const source = { start: block.start + from / rate, end: block.start + end / rate };
      const selected = current.filter(caption => affected(caption, source));
      const contributors = windows.filter(window => window.segments.some(caption => affected(caption, source)));
      const originals = contributors.map(window => window.segments.filter(caption => affected(caption, source)));
      if (originals.length < 2 || ![...selected, ...originals.flat()].every(caption =>
        caption.start >= source.start && caption.end <= source.end && aligned(caption))) break;
      let output: WhisperWindowOutput;
      try { output = await recognize(audio.subarray(from, end)); }
      catch (error) {
        if (error && typeof error === 'object' && 'name' in error &&
            (error.name === 'AbortError' || error.name === 'TimeoutError')) throw error;
        break;
      }
      const replacement = buildWordAlignedSegments(output.chunks ?? [], source, output.text.trim());
      const outside = current.filter(caption => !affected(caption, source));
      const retry = [...replacement].sort(compareTranscriptTimes);
      const usable = (candidate: readonly TranscriptSegment[]) => candidate.length > 0 &&
        candidate.every((caption, itemIndex) => aligned(caption) && !caption.overlapNeedsReview &&
          caption.end > caption.start && (!itemIndex || caption.start >= candidate[itemIndex - 1].end) &&
          outside.every(other => !intersects(caption, other)));
      // Prefer one complete retry or corroborated original; do not combine times.
      const accepted = [retry, ...originals].find(candidate => usable(candidate) &&
        (candidate === retry || hasFullWhisperCorroboration(candidate, retry)) &&
        canReplaceWhisperHypotheses(originals, candidate, contributors));
      if (accepted) {
        current = [...outside, ...accepted].sort(compareTranscriptTimes);
        break;
      }
      if (!usable(retry)) break;
    }
    onProgress?.((index + 1) / regions.length);
  }
  return current;
}
