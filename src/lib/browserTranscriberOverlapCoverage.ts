import { TRANSCRIBER_SAMPLE_RATE, WHISPER_CHUNK_SECONDS, type TranscriptSegment, type TranscriptWord } from './browserTranscriber';

type EvidenceWord = TranscriptWord & { key: string };
type SourceWindow = { start: number; end: number; segments: readonly TranscriptSegment[] };
// Keep lexical equivalence identical to browserTranscriberAlignment.
const normalized = (text: string) => text.normalize('NFC').toLowerCase().replace(/[\u2018\u2019]/g, "'")
  .replace(/^[^\p{L}\p{N}\p{M}]+|[^\p{L}\p{N}\p{M}]+$/gu, '').replace(/\s+/g, ' ');
const overlaps = (a: TranscriptWord, b: TranscriptWord) => Math.min(a.end, b.end) > Math.max(a.start, b.start);
const corroborates = (a: EvidenceWord, b: EvidenceWord) => a.key === b.key && overlaps(a, b);

function evidence(segments: readonly TranscriptSegment[], allowFinalPointPunctuation = false): EvidenceWord[] | undefined {
  const result: EvidenceWord[] = [];
  for (const [segmentIndex, segment] of segments.entries()) {
    if (segment.overlapNeedsReview || !segment.words?.length ||
        segment.words.map(word => word.text).join('').trim() !== segment.text.trim() ||
        segment.start !== segment.words[0].start || segment.end !== segment.words.at(-1)!.end ||
        !segment.words.some(word => word.end > word.start)) return undefined;
    for (const [wordIndex, word] of segment.words.entries()) {
      if (!Number.isFinite(word.start) || !Number.isFinite(word.end) || word.start < 0 ||
          word.end < word.start || (result.length && word.start < result.at(-1)!.end)) return undefined;
      const key = normalized(word.text);
      // A retry can emit a final standalone sentence mark at a point. Keep it
      // in the returned caption, but do not mistake it for an added spoken word.
      if (!key && allowFinalPointPunctuation && segmentIndex === segments.length - 1 &&
          wordIndex === segment.words.length - 1 && word.start === word.end &&
          /^[.!?\u3002\uff01\uff1f]+$/.test(word.text.trim())) continue;
      if (!key) return undefined;
      result.push({ ...word, key });
    }
  }
  return result.length ? result : undefined;
}

function terminalFramePoint(segments: readonly TranscriptSegment[], source?: SourceWindow): boolean {
  const last = segments.at(-1);
  const word = last?.words?.at(-1);
  // Pinned Transformers.js 4.2.0 aligns a full 30-second window to 1,500
  // encoder frames at 20 ms each. The last available frame is 29.98 seconds.
  // Require the actual final raw caption, not a similarly timed subset/copy.
  return !!source && Number.isFinite(source.start) && source.start >= 0 &&
    source.end - source.start === WHISPER_CHUNK_SECONDS && last === source.segments.at(-1) &&
    !!word && word.start === word.end && word.end === source.start + WHISPER_CHUNK_SECONDS - 0.02;
}

function sampleIndex(time: number): number | undefined {
  const exact = time * TRANSCRIBER_SAMPLE_RATE;
  const rounded = Math.round(exact);
  // Allow floating-point representation error, not a fractional-sample grace.
  return Number.isSafeInteger(rounded) &&
    Math.abs(exact - rounded) <= Number.EPSILON * Math.max(1, Math.abs(exact)) * 4 ? rounded : undefined;
}

function coversAt(original: readonly EvidenceWord[], next: readonly EvidenceWord[], offset: number,
  censoredEnd?: number): boolean {
  const anchor = (index: number) => index >= 0 && index < original.length &&
    corroborates(original[index], next[offset + index]);
  let substitutions = 0;
  for (const [index, word] of original.entries()) {
    const target = next[offset + index];
    if (word.start === word.end) {
      // A final-frame point is censored timing, not positive duration. Two
      // preceding anchors and a complete, same-length second hypothesis must
      // place it in the same lexical slot; no later repetition may be consumed.
      const onset = sampleIndex(target.start);
      const precedingEnd = index > 0 ? sampleIndex(next[offset + index - 1].end) : undefined;
      const boundary = censoredEnd === undefined ? undefined : sampleIndex(censoredEnd);
      if (boundary !== undefined && onset !== undefined && precedingEnd !== undefined &&
          onset <= boundary + 0.02 * TRANSCRIBER_SAMPLE_RATE &&
          onset - precedingEnd <= 0.02 * TRANSCRIBER_SAMPLE_RATE &&
          offset === 0 && original.length === next.length && index === original.length - 1 &&
          index >= 2 && word.key === target.key && anchor(index - 1) && anchor(index - 2) &&
          target.end > target.start && word.start >= next[index - 1].start && word.start <= next[index - 1].end) continue;
      // A point is not duplicate evidence. Its unique lexical slot must also
      // contain the point and have an adjacent positive anchor. A stretched
      // neighbor alone cannot place the occurrence at another time.
      if (word.key !== target.key || target.end <= target.start ||
          word.start < target.start || word.start > target.end || ![-1, 1].some(direction => {
        const adjacent = index + direction;
        if (!anchor(adjacent)) return false;
        const neighbor = next[offset + adjacent];
        return neighbor.end >= target.start && target.end >= neighbor.start;
      })) return false;
    } else {
      if (!overlaps(word, target)) return false;
      if (word.key !== target.key &&
          (++substitutions > 1 || !anchor(index - 1) || !anchor(index + 1))) return false;
    }
  }
  return true;
}

export function hasFullWhisperCorroboration(
  candidate: readonly TranscriptSegment[], retry: readonly TranscriptSegment[],
): boolean {
  const first = evidence(candidate, true);
  const second = evidence(retry, true);
  return !!first && !!second && first.length === second.length &&
    first.every((word, index) => corroborates(word, second[index]));
}

export function canReplaceWhisperHypotheses(
  originals: readonly (readonly TranscriptSegment[])[],
  replacement: readonly TranscriptSegment[],
  sourceWindows: readonly SourceWindow[] = [],
): boolean {
  const next = evidence(replacement, true);
  const sources = originals.map(segments => evidence(segments));
  if (!next || !sources.length || sources.some(words => !words)) return false;
  // Every retry word needs positive corroboration from one complete hypothesis;
  // pieces from competing candidates cannot manufacture a new reference.
  if (!sources.some(words => words!.length === next.length &&
      words!.every((word, index) => corroborates(word, next[index])))) return false;
  return sources.every((words, sourceIndex) => {
    let matches = 0;
    for (let offset = 0; offset + words!.length <= next.length; offset += 1) {
      const source = sourceWindows[sourceIndex];
      if (coversAt(words!, next, offset, terminalFramePoint(originals[sourceIndex], source) ? source.end : undefined) &&
          ++matches > 1) return false;
    }
    return matches === 1;
  });
}
