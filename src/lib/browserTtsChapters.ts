import { MAX_TTS_TEXT_CHARACTERS, sanitizeMp3Filename } from './browserTtsInput';

export const MAX_BROWSER_TTS_CHAPTERS = 100;
export const MAX_BROWSER_TTS_CHAPTER_NAME_CHARACTERS = 120;

export interface BrowserTtsChapter {
  readonly contentVersion: number;
  readonly id: string;
  readonly name: string;
  readonly text: string;
  readonly voice?: string;
}

export interface BrowserTtsChapterDraft {
  name?: string;
  text: string;
  voice?: string;
}

export interface BrowserTtsChapterLimits {
  maxChapters: number;
  maxCharacters: number;
  maxNameCharacters: number;
}

export interface BrowserTtsChapterTotals {
  chapterCount: number;
  characterCount: number;
  remainingCharacters: number;
}

export interface BrowserTtsChapterMp3File {
  chapterId: string;
  filename: string;
}

export type BrowserTtsChapterIdSource = string | (() => string);

export type BrowserTtsChapterErrorCode =
  | 'character-limit'
  | 'chapter-limit'
  | 'duplicate-id'
  | 'invalid-id'
  | 'invalid-index'
  | 'invalid-limits'
  | 'invalid-name'
  | 'invalid-split'
  | 'invalid-voice'
  | 'missing-chapter';

export class BrowserTtsChapterError extends Error {
  readonly code: BrowserTtsChapterErrorCode;

  constructor(code: BrowserTtsChapterErrorCode, message: string) {
    super(message);
    this.name = 'BrowserTtsChapterError';
    this.code = code;
  }
}

export const DEFAULT_BROWSER_TTS_CHAPTER_LIMITS: Readonly<BrowserTtsChapterLimits> = Object.freeze({
  maxChapters: MAX_BROWSER_TTS_CHAPTERS,
  maxCharacters: MAX_TTS_TEXT_CHARACTERS,
  maxNameCharacters: MAX_BROWSER_TTS_CHAPTER_NAME_CHARACTERS,
});

function resolveLimits(overrides: Partial<BrowserTtsChapterLimits> = {}): BrowserTtsChapterLimits {
  const limits = { ...DEFAULT_BROWSER_TTS_CHAPTER_LIMITS, ...overrides };
  const boundedValues: Array<[number, number, string]> = [
    [limits.maxChapters, MAX_BROWSER_TTS_CHAPTERS, 'maxChapters'],
    [limits.maxCharacters, MAX_TTS_TEXT_CHARACTERS, 'maxCharacters'],
    [limits.maxNameCharacters, MAX_BROWSER_TTS_CHAPTER_NAME_CHARACTERS, 'maxNameCharacters'],
  ];

  for (const [value, ceiling, name] of boundedValues) {
    if (!Number.isInteger(value) || value < 1 || value > ceiling) {
      throw new BrowserTtsChapterError('invalid-limits', `${name} must be an integer from 1 to ${ceiling}.`);
    }
  }

  return limits;
}

function resolveId(source: BrowserTtsChapterIdSource) {
  const id = typeof source === 'function' ? source() : source;
  if (typeof id !== 'string' || !id || id !== id.trim() || id.length > 128 || /[\u0000-\u001f\u007f]/.test(id)) {
    throw new BrowserTtsChapterError('invalid-id', 'Chapter IDs must be non-empty, trimmed strings of at most 128 characters.');
  }
  return id;
}

// Chapter names are single-line labels. Chapter text is never normalized here.
function normalizeName(value: string, fallback: string, maxCharacters: number) {
  const normalized = value.replace(/\s+/g, ' ').trim() || fallback;
  if (normalized.length > maxCharacters) {
    throw new BrowserTtsChapterError('invalid-name', `Chapter names must contain at most ${maxCharacters} characters.`);
  }
  return normalized;
}

function normalizeVoice(value: string) {
  const normalized = value.trim();
  if (!normalized || normalized.length > 128 || /[\u0000-\u001f\u007f]/.test(normalized)) {
    throw new BrowserTtsChapterError('invalid-voice', 'Choose a valid fixed voice for the chapter.');
  }
  return normalized;
}

function findChapterIndex(chapters: readonly BrowserTtsChapter[], chapterId: string) {
  const index = chapters.findIndex((chapter) => chapter.id === chapterId);
  if (index < 0) throw new BrowserTtsChapterError('missing-chapter', `Chapter ${chapterId} was not found.`);
  return index;
}

function replaceAt(
  chapters: readonly BrowserTtsChapter[],
  index: number,
  replacement: BrowserTtsChapter,
) {
  const next = chapters.slice();
  next[index] = replacement;
  return next;
}

export function assertBrowserTtsChapterCollection(
  chapters: readonly BrowserTtsChapter[],
  limitOverrides: Partial<BrowserTtsChapterLimits> = {},
): BrowserTtsChapterTotals {
  const limits = resolveLimits(limitOverrides);
  if (chapters.length > limits.maxChapters) {
    throw new BrowserTtsChapterError('chapter-limit', `Use no more than ${limits.maxChapters} chapters.`);
  }

  const ids = new Set<string>();
  let characterCount = 0;
  for (const chapter of chapters) {
    const id = resolveId(chapter.id);
    if (ids.has(id)) throw new BrowserTtsChapterError('duplicate-id', `Chapter ID ${id} is already in use.`);
    ids.add(id);

    if (typeof chapter.text !== 'string') {
      throw new TypeError('Chapter text must be a string.');
    }
    if (!Number.isInteger(chapter.contentVersion) || chapter.contentVersion < 0) {
      throw new TypeError('Chapter contentVersion must be a non-negative integer.');
    }
    normalizeName(chapter.name, 'Chapter', limits.maxNameCharacters);
    if (chapter.voice !== undefined) normalizeVoice(chapter.voice);
    characterCount += chapter.text.length;
  }

  if (characterCount > limits.maxCharacters) {
    throw new BrowserTtsChapterError(
      'character-limit',
      `The combined chapter text must contain no more than ${limits.maxCharacters.toLocaleString('en')} characters.`,
    );
  }

  return {
    chapterCount: chapters.length,
    characterCount,
    remainingCharacters: limits.maxCharacters - characterCount,
  };
}

export function createBrowserTtsChapter(
  draft: BrowserTtsChapterDraft,
  idSource: BrowserTtsChapterIdSource,
  ordinal = 1,
  limitOverrides: Partial<BrowserTtsChapterLimits> = {},
): BrowserTtsChapter {
  const limits = resolveLimits(limitOverrides);
  if (!Number.isInteger(ordinal) || ordinal < 1) {
    throw new BrowserTtsChapterError('invalid-index', 'Chapter ordinals start at 1.');
  }
  if (typeof draft.text !== 'string') throw new TypeError('Chapter text must be a string.');

  const chapter: BrowserTtsChapter = {
    contentVersion: 0,
    id: resolveId(idSource),
    name: normalizeName(draft.name ?? '', `Chapter ${ordinal}`, limits.maxNameCharacters),
    text: draft.text,
    ...(draft.voice === undefined ? {} : { voice: normalizeVoice(draft.voice) }),
  };
  assertBrowserTtsChapterCollection([chapter], limits);
  return chapter;
}

export function createBrowserTtsChapters(
  drafts: readonly BrowserTtsChapterDraft[],
  idFactory: () => string,
  limitOverrides: Partial<BrowserTtsChapterLimits> = {},
) {
  const limits = resolveLimits(limitOverrides);
  const chapters = drafts.map((draft, index) => createBrowserTtsChapter(draft, idFactory, index + 1, limits));
  assertBrowserTtsChapterCollection(chapters, limits);
  return chapters;
}

export function appendBrowserTtsChapter(
  chapters: readonly BrowserTtsChapter[],
  draft: BrowserTtsChapterDraft,
  idSource: BrowserTtsChapterIdSource,
  limitOverrides: Partial<BrowserTtsChapterLimits> = {},
) {
  const limits = resolveLimits(limitOverrides);
  assertBrowserTtsChapterCollection(chapters, limits);
  const next = [...chapters, createBrowserTtsChapter(draft, idSource, chapters.length + 1, limits)];
  assertBrowserTtsChapterCollection(next, limits);
  return next;
}

export interface SplitBrowserTtsChapterOptions {
  firstName?: string;
  secondName?: string;
}

/**
 * Splits at a UTF-16 string offset. The two returned text values concatenate to
 * the original exactly; no whitespace, newline, BOM, or punctuation is changed.
 */
export function splitBrowserTtsChapter(
  chapters: readonly BrowserTtsChapter[],
  chapterId: string,
  splitAt: number,
  newIdSource: BrowserTtsChapterIdSource,
  options: SplitBrowserTtsChapterOptions = {},
  limitOverrides: Partial<BrowserTtsChapterLimits> = {},
) {
  const limits = resolveLimits(limitOverrides);
  assertBrowserTtsChapterCollection(chapters, limits);
  if (chapters.length >= limits.maxChapters) {
    throw new BrowserTtsChapterError('chapter-limit', `Use no more than ${limits.maxChapters} chapters.`);
  }

  const index = findChapterIndex(chapters, chapterId);
  const chapter = chapters[index];
  if (!chapter || !Number.isInteger(splitAt) || splitAt <= 0 || splitAt >= chapter.text.length) {
    throw new BrowserTtsChapterError('invalid-split', 'Choose a split point inside the chapter text.');
  }

  const previousCodeUnit = chapter.text.charCodeAt(splitAt - 1);
  const nextCodeUnit = chapter.text.charCodeAt(splitAt);
  if (previousCodeUnit >= 0xd800 && previousCodeUnit <= 0xdbff && nextCodeUnit >= 0xdc00 && nextCodeUnit <= 0xdfff) {
    throw new BrowserTtsChapterError('invalid-split', 'A chapter cannot be split inside a Unicode character.');
  }

  const suffix = ' (Part 2)';
  const defaultSecondName = `${chapter.name.slice(0, Math.max(1, limits.maxNameCharacters - suffix.length)).trim()}${suffix}`;
  const first: BrowserTtsChapter = {
    ...chapter,
    contentVersion: chapter.contentVersion + 1,
    name: options.firstName === undefined
      ? chapter.name
      : normalizeName(options.firstName, chapter.name, limits.maxNameCharacters),
    text: chapter.text.slice(0, splitAt),
  };
  const second: BrowserTtsChapter = {
    contentVersion: 0,
    id: resolveId(newIdSource),
    name: normalizeName(options.secondName ?? '', defaultSecondName, limits.maxNameCharacters),
    text: chapter.text.slice(splitAt),
    ...(chapter.voice === undefined ? {} : { voice: chapter.voice }),
  };

  const next = [...chapters.slice(0, index), first, second, ...chapters.slice(index + 1)];
  assertBrowserTtsChapterCollection(next, limits);
  return next;
}

export function renameBrowserTtsChapter(
  chapters: readonly BrowserTtsChapter[],
  chapterId: string,
  name: string,
  limitOverrides: Partial<BrowserTtsChapterLimits> = {},
) {
  const limits = resolveLimits(limitOverrides);
  assertBrowserTtsChapterCollection(chapters, limits);
  const index = findChapterIndex(chapters, chapterId);
  const chapter = chapters[index];
  if (!chapter) throw new BrowserTtsChapterError('missing-chapter', `Chapter ${chapterId} was not found.`);
  const normalizedName = normalizeName(name, '', limits.maxNameCharacters);
  if (!normalizedName) throw new BrowserTtsChapterError('invalid-name', 'Enter a chapter name.');
  return replaceAt(chapters, index, { ...chapter, name: normalizedName });
}

export function editBrowserTtsChapterText(
  chapters: readonly BrowserTtsChapter[],
  chapterId: string,
  text: string,
  limitOverrides: Partial<BrowserTtsChapterLimits> = {},
) {
  if (typeof text !== 'string') throw new TypeError('Chapter text must be a string.');
  const limits = resolveLimits(limitOverrides);
  assertBrowserTtsChapterCollection(chapters, limits);
  const index = findChapterIndex(chapters, chapterId);
  const chapter = chapters[index];
  if (!chapter) throw new BrowserTtsChapterError('missing-chapter', `Chapter ${chapterId} was not found.`);
  if (chapter.text === text) return chapters.slice();

  const next = replaceAt(chapters, index, {
    ...chapter,
    contentVersion: chapter.contentVersion + 1,
    text,
  });
  assertBrowserTtsChapterCollection(next, limits);
  return next;
}

export function setBrowserTtsChapterVoice(
  chapters: readonly BrowserTtsChapter[],
  chapterId: string,
  voice: string,
  limitOverrides: Partial<BrowserTtsChapterLimits> = {},
) {
  const limits = resolveLimits(limitOverrides);
  assertBrowserTtsChapterCollection(chapters, limits);
  const index = findChapterIndex(chapters, chapterId);
  const chapter = chapters[index];
  if (!chapter) throw new BrowserTtsChapterError('missing-chapter', `Chapter ${chapterId} was not found.`);
  const normalizedVoice = normalizeVoice(voice);
  if (chapter.voice === normalizedVoice) return chapters.slice();

  return replaceAt(chapters, index, {
    ...chapter,
    contentVersion: chapter.contentVersion + 1,
    voice: normalizedVoice,
  });
}

export function setAllBrowserTtsChapterVoices(
  chapters: readonly BrowserTtsChapter[],
  voice: string,
  limitOverrides: Partial<BrowserTtsChapterLimits> = {},
) {
  const limits = resolveLimits(limitOverrides);
  assertBrowserTtsChapterCollection(chapters, limits);
  const normalizedVoice = normalizeVoice(voice);
  return chapters.map((chapter) => chapter.voice === normalizedVoice
    ? chapter
    : {
        ...chapter,
        contentVersion: chapter.contentVersion + 1,
        voice: normalizedVoice,
      });
}

export function deleteBrowserTtsChapter(
  chapters: readonly BrowserTtsChapter[],
  chapterId: string,
  limitOverrides: Partial<BrowserTtsChapterLimits> = {},
) {
  const limits = resolveLimits(limitOverrides);
  assertBrowserTtsChapterCollection(chapters, limits);
  const index = findChapterIndex(chapters, chapterId);
  const next = [...chapters.slice(0, index), ...chapters.slice(index + 1)];
  assertBrowserTtsChapterCollection(next, limits);
  return next;
}

export function moveBrowserTtsChapter(
  chapters: readonly BrowserTtsChapter[],
  chapterId: string,
  toIndex: number,
  limitOverrides: Partial<BrowserTtsChapterLimits> = {},
) {
  const limits = resolveLimits(limitOverrides);
  assertBrowserTtsChapterCollection(chapters, limits);
  if (!Number.isInteger(toIndex) || toIndex < 0 || toIndex >= chapters.length) {
    throw new BrowserTtsChapterError('invalid-index', 'The destination chapter position is out of range.');
  }

  const fromIndex = findChapterIndex(chapters, chapterId);
  const next = chapters.slice();
  const [chapter] = next.splice(fromIndex, 1);
  if (!chapter) throw new BrowserTtsChapterError('missing-chapter', `Chapter ${chapterId} was not found.`);
  next.splice(toIndex, 0, chapter);
  return next;
}

export function getBrowserTtsChapterTotals(
  chapters: readonly BrowserTtsChapter[],
  limitOverrides: Partial<BrowserTtsChapterLimits> = {},
) {
  return assertBrowserTtsChapterCollection(chapters, limitOverrides);
}

export function createBrowserTtsChapterMp3Files(
  chapters: readonly BrowserTtsChapter[],
  fallbackBase = 'chapter',
): BrowserTtsChapterMp3File[] {
  assertBrowserTtsChapterCollection(chapters);
  const width = Math.max(2, String(chapters.length).length);
  const used = new Set<string>();

  return chapters.map((chapter, index) => {
    const ordinal = String(index + 1).padStart(width, '0');
    const base = `${ordinal}-${chapter.name}`;
    let filename = sanitizeMp3Filename(base, `${fallbackBase}-${ordinal}`);
    let collision = 2;
    while (used.has(filename.toLocaleLowerCase('en-US'))) {
      filename = sanitizeMp3Filename(`${base}-${collision}`, `${fallbackBase}-${ordinal}-${collision}`);
      collision += 1;
    }
    used.add(filename.toLocaleLowerCase('en-US'));
    return { chapterId: chapter.id, filename };
  });
}
