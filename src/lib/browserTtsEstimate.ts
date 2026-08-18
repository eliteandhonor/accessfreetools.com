import { MAX_TTS_TEXT_CHARACTERS } from './browserTtsInput';

export const BROWSER_TTS_MIN_SPEED = 0.9;
export const BROWSER_TTS_MAX_SPEED = 1.5;
export const BROWSER_TTS_MP3_BITRATE_BPS = 128_000;

const MP3_BYTES_PER_SECOND = BROWSER_TTS_MP3_BITRATE_BPS / 8;
const WORDS_PER_MINUTE = { slow: 130, fast: 180 } as const;
const COMPACT_SCRIPT_CHARACTERS_PER_MINUTE = { slow: 220, fast: 360 } as const;

const WORD_SEGMENTER = new Intl.Segmenter('und', { granularity: 'word' });
const GRAPHEME_SEGMENTER = new Intl.Segmenter('und', { granularity: 'grapheme' });
const SPEAKABLE_CHARACTER = /[\p{L}\p{N}]/u;
const COMPACT_SCRIPT_CHARACTER = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Thai}\p{Script=Lao}\p{Script=Khmer}\p{Script=Myanmar}]/u;
const SENTENCE_BREAK_GROUP = /[.!?\u2026\u3002\uff01\uff1f\u061f\u06d4\u0964\u0965]+/gu;
const CLAUSE_BREAK_GROUP = /[,;:\uff0c\u3001\uff1b\uff1a\u060c\u061b\u05c3\u037e]+/gu;
const LINE_BREAK_GROUP = /(?:\r\n?|\n)+/g;

export interface BrowserTtsNumberRange {
  min: number;
  max: number;
}

export type BrowserTtsEstimateBasis = 'none' | 'word-delimited' | 'compact-script' | 'mixed';
export type BrowserTtsEstimateStatus = 'empty' | 'over-limit' | 'ready';

export interface BrowserTtsEstimateUnitCounts {
  words: number;
  compactScriptCharacters: number;
  sentenceBreaks: number;
  clauseBreaks: number;
  lineBreaks: number;
}

export interface BrowserTtsEstimate {
  status: BrowserTtsEstimateStatus;
  basis: BrowserTtsEstimateBasis;
  characterCount: number;
  characterLimit: number;
  speed: number;
  units: BrowserTtsEstimateUnitCounts;
  durationSeconds: BrowserTtsNumberRange | null;
  mp3Bytes: BrowserTtsNumberRange | null;
}

function emptyUnitCounts(): BrowserTtsEstimateUnitCounts {
  return {
    words: 0,
    compactScriptCharacters: 0,
    sentenceBreaks: 0,
    clauseBreaks: 0,
    lineBreaks: 0,
  };
}

function countGroups(value: string, pattern: RegExp) {
  return value.match(pattern)?.length ?? 0;
}

function countTextUnits(value: string): BrowserTtsEstimateUnitCounts {
  let compactScriptCharacters = 0;
  const wordDelimitedParts: string[] = [];

  for (const { segment } of GRAPHEME_SEGMENTER.segment(value)) {
    if (COMPACT_SCRIPT_CHARACTER.test(segment)) {
      compactScriptCharacters += 1;
      wordDelimitedParts.push(' ');
    } else {
      wordDelimitedParts.push(segment);
    }
  }

  let words = 0;
  for (const segment of WORD_SEGMENTER.segment(wordDelimitedParts.join(''))) {
    if (segment.isWordLike && SPEAKABLE_CHARACTER.test(segment.segment)) words += 1;
  }

  return {
    words,
    compactScriptCharacters,
    sentenceBreaks: countGroups(value, SENTENCE_BREAK_GROUP),
    clauseBreaks: countGroups(value, CLAUSE_BREAK_GROUP),
    lineBreaks: countGroups(value, LINE_BREAK_GROUP),
  };
}

function getEstimateBasis(units: BrowserTtsEstimateUnitCounts): BrowserTtsEstimateBasis {
  if (units.words > 0 && units.compactScriptCharacters > 0) return 'mixed';
  if (units.compactScriptCharacters > 0) return 'compact-script';
  if (units.words > 0) return 'word-delimited';
  return 'none';
}

function emptyRangeEstimate(
  status: Exclude<BrowserTtsEstimateStatus, 'ready'>,
  characterCount: number,
  speed: number,
  units: BrowserTtsEstimateUnitCounts,
): BrowserTtsEstimate {
  return {
    status,
    basis: getEstimateBasis(units),
    characterCount,
    characterLimit: MAX_TTS_TEXT_CHARACTERS,
    speed,
    units,
    durationSeconds: null,
    mp3Bytes: null,
  };
}

export function estimateBrowserTtsAudio(value: string, speed: number): BrowserTtsEstimate {
  if (!Number.isFinite(speed) || speed < BROWSER_TTS_MIN_SPEED || speed > BROWSER_TTS_MAX_SPEED) {
    throw new RangeError(`Speed must be between ${BROWSER_TTS_MIN_SPEED} and ${BROWSER_TTS_MAX_SPEED}.`);
  }

  const characterCount = value.length;
  if (characterCount > MAX_TTS_TEXT_CHARACTERS) {
    return emptyRangeEstimate('over-limit', characterCount, speed, emptyUnitCounts());
  }

  const units = countTextUnits(value);
  if (units.words === 0 && units.compactScriptCharacters === 0) {
    return emptyRangeEstimate('empty', characterCount, speed, units);
  }

  const shortestSpeechSeconds = (
    (units.words * 60) / WORDS_PER_MINUTE.fast
    + (units.compactScriptCharacters * 60) / COMPACT_SCRIPT_CHARACTERS_PER_MINUTE.fast
  );
  const longestSpeechSeconds = (
    (units.words * 60) / WORDS_PER_MINUTE.slow
    + (units.compactScriptCharacters * 60) / COMPACT_SCRIPT_CHARACTERS_PER_MINUTE.slow
  );
  const shortestPauseSeconds = (
    units.sentenceBreaks * 0.18
    + units.clauseBreaks * 0.08
    + units.lineBreaks * 0.12
  );
  const longestPauseSeconds = (
    units.sentenceBreaks * 0.55
    + units.clauseBreaks * 0.28
    + units.lineBreaks * 0.65
  );

  const durationSeconds = {
    min: Math.max(1, Math.floor((shortestSpeechSeconds + shortestPauseSeconds) / speed)),
    max: Math.max(1, Math.ceil((longestSpeechSeconds + longestPauseSeconds) / speed)),
  };
  durationSeconds.max = Math.max(durationSeconds.min, durationSeconds.max);

  return {
    status: 'ready',
    basis: getEstimateBasis(units),
    characterCount,
    characterLimit: MAX_TTS_TEXT_CHARACTERS,
    speed,
    units,
    durationSeconds,
    mp3Bytes: {
      min: durationSeconds.min * MP3_BYTES_PER_SECOND,
      max: durationSeconds.max * MP3_BYTES_PER_SECOND,
    },
  };
}
