import type { TranscriptionBlock, TranscriptSegment, TranscriptWord } from './browserTranscriber';

interface WordChunk { text: string; timestamp: readonly (number | null)[] }

function validWords(words: readonly TranscriptWord[]): boolean {
  return words.some(word => word.end > word.start) && words.every((word, index) =>
    word.text.length > 0 && Number.isFinite(word.start) && Number.isFinite(word.end) &&
    word.start >= 0 && word.end >= word.start && (!index || word.start >= words[index - 1].end));
}

export function buildWordAlignedSegments(
  chunks: readonly WordChunk[],
  block: Pick<TranscriptionBlock, 'start' | 'end'>,
  fallbackText: string,
): TranscriptSegment[] {
  if (chunks.some(chunk => !chunk || typeof chunk.text !== 'string')) {
    throw new TypeError('Whisper returned an invalid text chunk.');
  }
  const text = chunks.map(chunk => chunk.text).join('');
  // Whisper can emit sentence marks alone at a cut, not a spoken caption.
  // Check both representations and preserve operators and other symbols.
  const sentenceMarksOnly = (value: string) => /^[\s.!?\u061f\u2026\u3002\uff01\uff1f]*$/u.test(value);
  if (sentenceMarksOnly(text) && sentenceMarksOnly(fallbackText)) return [];
  const words = chunks.map(chunk => {
    const times = Array.isArray(chunk.timestamp) ? chunk.timestamp : [];
    return { text: chunk.text,
      start: typeof times[0] === 'number' ? block.start + times[0] : NaN,
      end: typeof times[1] === 'number' ? block.start + times[1] : NaN };
  });
  // Unknown alignment must retain speech without fabricating precise word times.
  if (!validWords(words) || words[0].start < block.start || words.at(-1)!.end > block.end ||
      text.trim() !== fallbackText.trim()) {
    const retained = fallbackText.trim() || text.trim();
    return retained ? [{ ...block, text: retained, overlapNeedsReview: true }] : [];
  }
  const breaks = new Set<number>();
  if (typeof Intl.Segmenter === 'function') {
    for (const sentence of new Intl.Segmenter(undefined, { granularity: 'sentence' }).segment(text)) {
      breaks.add(sentence.index + sentence.segment.trimEnd().length);
    }
  }
  breaks.add(text.trimEnd().length);
  const result: TranscriptSegment[] = [];
  let pending: TranscriptWord[] = [];
  let offset = 0;
  for (const word of words) {
    pending.push(word);
    offset += word.text.length;
    // Only split at an observed word boundary, never invent sub-word timestamps.
    if ((breaks.has(offset - (word.text.length - word.text.trimEnd().length)) || offset === text.length) &&
        pending.some(piece => piece.end > piece.start)) {
      result.push({ start: pending[0].start, end: pending.at(-1)!.end,
        text: pending.map(piece => piece.text).join('').trim(), words: pending });
      pending = [];
    }
  }
  // Whisper can anchor a word to a point. Preserve that anchor and attach a
  // point-only tail to the preceding caption rather than inventing a duration.
  if (pending.length) {
    const previous = result.at(-1)!;
    previous.words!.push(...pending);
    previous.text = previous.words!.map(piece => piece.text).join('').trim();
    previous.end = pending.at(-1)!.end;
  }
  return result;
}

function hasWordEvidence(segment: TranscriptSegment): segment is TranscriptSegment & { words: TranscriptWord[] } {
  return !!segment.words && validWords(segment.words) &&
    segment.words.map(word => word.text).join('').trim() === segment.text.trim();
}

const overlaps = (a: TranscriptWord, b: TranscriptWord) => Math.min(a.end, b.end) > Math.max(a.start, b.start);
const normalized = (text: string) => text.normalize('NFC').toLowerCase().replace(/[\u2018\u2019]/g, "'")
  .replace(/^[^\p{L}\p{N}\p{M}]+|[^\p{L}\p{N}\p{M}]+$/gu, '').replace(/\s+/g, ' ');
const aligned = (segment: TranscriptSegment): segment is TranscriptSegment & { words: TranscriptWord[] } =>
  !segment.overlapNeedsReview && hasWordEvidence(segment);

function copySegment(segment: TranscriptSegment): TranscriptSegment {
  const { words, ...caption } = segment;
  if (hasWordEvidence(segment)) return { ...caption, words: segment.words.map(word => ({ ...word })) };
  return { ...caption, ...(words ? { overlapNeedsReview: true } : {}) };
}

export function mergeAlignedTranscriptSegments(
  completed: readonly TranscriptSegment[], incoming: readonly TranscriptSegment[],
): TranscriptSegment[] | undefined {
  if (![...completed, ...incoming].some(segment => segment.words !== undefined || segment.overlapNeedsReview)) return undefined;
  const next: TranscriptWord[] = [];
  for (const segment of incoming) {
    if (!aligned(segment)) break;
    next.push(...segment.words);
  }
  // A gap in evidence is a boundary, not permission to use coarse timestamps.
  // Never stitch matches across unknown text or discard interior source words.
  let previous: TranscriptWord[] = [];
  for (const segment of completed) {
    if (aligned(segment)) previous.push(...segment.words);
    else previous = [];
  }
  const firstPossible = previous.findIndex(word => word.end > (next[0]?.start ?? Infinity));
  previous = firstPossible < 0 ? [] : previous.slice(firstPossible);
  if (completed.some(segment => !aligned(segment) && next.some(word => overlaps(segment, word)))) previous = [];
  let match = 0;
  let ambiguous = false;
  for (let count = Math.min(previous.length, next.length); count > 0; count -= 1) {
    if (!previous.slice(-count).every((word, index) => normalized(word.text) &&
        normalized(word.text) === normalized(next[index].text) && overlaps(word, next[index]))) continue;
    if (match) { ambiguous = true; break; }
    match = count;
  }
  // Keep the completed prefix stable for checkpoint/edit identity. Presentation
  // and downloads sort by source time without modifying these word timestamps.
  const result = completed.map(copySegment);
  let remaining = ambiguous ? 0 : match;
  for (const segment of incoming) {
    if (!aligned(segment)) {
      remaining = 0;
      result.push({ ...copySegment(segment), overlapNeedsReview: true });
      continue;
    }
    const words = segment.words.slice(remaining).map(word => ({ ...word }));
    remaining = Math.max(0, remaining - segment.words.length);
    if (!words.length) continue;
    if (!validWords(words)) {
      result.push({ ...copySegment(segment), overlapNeedsReview: true });
      continue;
    }
    const conflict = words.some(word => completed.some(prior => aligned(prior)
      ? prior.words.some(previousWord => overlaps(previousWord, word)) : overlaps(prior, word)));
    result.push({ start: words[0].start, end: words.at(-1)!.end,
      text: words.map(word => word.text).join('').trim(), words,
      ...(ambiguous || conflict ? { overlapNeedsReview: true } : {}),
    });
  }
  return result;
}
