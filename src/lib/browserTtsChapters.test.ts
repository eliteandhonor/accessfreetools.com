import { describe, expect, it } from 'vitest';

import {
  BrowserTtsChapterError,
  appendBrowserTtsChapter,
  createBrowserTtsChapterMp3Files,
  createBrowserTtsChapters,
  deleteBrowserTtsChapter,
  editBrowserTtsChapterText,
  getBrowserTtsChapterTotals,
  moveBrowserTtsChapter,
  renameBrowserTtsChapter,
  splitBrowserTtsChapter,
} from './browserTtsChapters';

function deterministicIds(...ids: string[]) {
  let index = 0;
  return () => ids[index++] ?? `unexpected-${index}`;
}

describe('browser TTS chapter model', () => {
  it('creates named chapters with injected stable IDs and exact text', () => {
    const chapters = createBrowserTtsChapters(
      [
        { name: '  Opening   Scene ', text: '\uFEFFLine one\r\nLine two  ' },
        { text: 'Second chapter' },
      ],
      deterministicIds('chapter-a', 'chapter-b'),
    );

    expect(chapters).toEqual([
      {
        contentVersion: 0,
        id: 'chapter-a',
        name: 'Opening Scene',
        text: '\uFEFFLine one\r\nLine two  ',
      },
      {
        contentVersion: 0,
        id: 'chapter-b',
        name: 'Chapter 2',
        text: 'Second chapter',
      },
    ]);
    expect(getBrowserTtsChapterTotals(chapters).characterCount).toBe(
      '\uFEFFLine one\r\nLine two  '.length + 'Second chapter'.length,
    );
  });

  it('renames and edits immutably while versioning content changes only', () => {
    const original = createBrowserTtsChapters([{ name: 'One', text: 'alpha' }], () => 'one');
    const renamed = renameBrowserTtsChapter(original, 'one', '  New   name  ');
    const edited = editBrowserTtsChapterText(renamed, 'one', 'alpha\r\nbeta  ');

    expect(original[0]).toMatchObject({ contentVersion: 0, name: 'One', text: 'alpha' });
    expect(renamed[0]).toMatchObject({ contentVersion: 0, name: 'New name', text: 'alpha' });
    expect(edited[0]).toMatchObject({ contentVersion: 1, name: 'New name', text: 'alpha\r\nbeta  ' });
    expect(editBrowserTtsChapterText(edited, 'one', edited[0]?.text ?? '')[0]?.contentVersion).toBe(1);
  });

  it('splits text without normalization or loss', () => {
    const text = '\uFEFFIntro\r\n\r\n  Body with trailing space ';
    const original = createBrowserTtsChapters([{ name: 'Opening', text }], () => 'opening');
    const splitAt = text.indexOf('Body');
    const chapters = splitBrowserTtsChapter(original, 'opening', splitAt, () => 'body');

    expect(chapters.map((chapter) => chapter.id)).toEqual(['opening', 'body']);
    expect(chapters[0]).toMatchObject({ contentVersion: 1, name: 'Opening', text: text.slice(0, splitAt) });
    expect(chapters[1]).toMatchObject({ contentVersion: 0, name: 'Opening (Part 2)', text: text.slice(splitAt) });
    expect(chapters.map((chapter) => chapter.text).join('')).toBe(text);
    expect(original[0]?.text).toBe(text);
  });

  it('rejects invalid split positions and splitting inside a surrogate pair', () => {
    const text = 'A😀B';
    const chapters = createBrowserTtsChapters([{ text }], () => 'one');

    expect(() => splitBrowserTtsChapter(chapters, 'one', 0, 'two')).toThrowError(BrowserTtsChapterError);
    expect(() => splitBrowserTtsChapter(chapters, 'one', text.length, 'two')).toThrowError(BrowserTtsChapterError);
    expect(() => splitBrowserTtsChapter(chapters, 'one', 2, 'two')).toThrowError(/Unicode character/);
  });

  it('adds, deletes, and reorders chapters without mutating prior arrays', () => {
    const first = createBrowserTtsChapters(
      [
        { name: 'One', text: '1' },
        { name: 'Two', text: '22' },
      ],
      deterministicIds('one', 'two'),
    );
    const appended = appendBrowserTtsChapter(first, { name: 'Three', text: '333' }, 'three');
    const moved = moveBrowserTtsChapter(appended, 'three', 0);
    const deleted = deleteBrowserTtsChapter(moved, 'two');

    expect(first.map((chapter) => chapter.id)).toEqual(['one', 'two']);
    expect(appended.map((chapter) => chapter.id)).toEqual(['one', 'two', 'three']);
    expect(moved.map((chapter) => chapter.id)).toEqual(['three', 'one', 'two']);
    expect(deleted.map((chapter) => chapter.id)).toEqual(['three', 'one']);
    expect(getBrowserTtsChapterTotals(deleted)).toMatchObject({ chapterCount: 2, characterCount: 4 });
  });

  it('enforces aggregate character, chapter-count, ID, and name bounds without truncation', () => {
    const limits = { maxChapters: 2, maxCharacters: 10, maxNameCharacters: 12 };
    const chapters = createBrowserTtsChapters(
      [
        { name: 'One', text: '12345' },
        { name: 'Two', text: '67890' },
      ],
      deterministicIds('one', 'two'),
      limits,
    );

    expect(() => appendBrowserTtsChapter(chapters, { text: '' }, 'three', limits)).toThrowError(/no more than 2 chapters/i);
    expect(() => editBrowserTtsChapterText(chapters, 'one', '123456', limits)).toThrowError(/no more than 10 characters/i);
    expect(() => createBrowserTtsChapters([{ text: 'a' }, { text: 'b' }], () => 'same')).toThrowError(/already in use/i);
    expect(() => renameBrowserTtsChapter(chapters, 'one', '')).toThrowError(/Enter a chapter name/);
    expect(() => renameBrowserTtsChapter(chapters, 'one', 'This name is too long', limits)).toThrowError(/at most 12/);
  });

  it('creates ordered, unique, portable MP3 filenames', () => {
    const chapters = createBrowserTtsChapters(
      [
        { name: 'Intro: Why?', text: 'a' },
        { name: 'intro: why?', text: 'b' },
        { name: 'CON', text: 'c' },
        { name: 'A'.repeat(120), text: 'd' },
      ],
      deterministicIds('a', 'b', 'c', 'd'),
    );
    const files = createBrowserTtsChapterMp3Files(chapters);
    const lowerNames = files.map(({ filename }) => filename.toLowerCase());

    expect(files.map(({ chapterId }) => chapterId)).toEqual(['a', 'b', 'c', 'd']);
    expect(files[0]?.filename).toBe('01-Intro-Why.mp3');
    expect(new Set(lowerNames).size).toBe(files.length);
    expect(files.every(({ filename }) => filename.endsWith('.mp3'))).toBe(true);
    expect(files.every(({ filename }) => !/[<>:"/\\|?*\u0000-\u001f]/.test(filename))).toBe(true);
    expect(files.every(({ filename }) => filename.length <= 84)).toBe(true);
  });

  it('reports missing chapters and invalid destinations explicitly', () => {
    const chapters = createBrowserTtsChapters([{ text: 'one' }], () => 'one');
    expect(() => deleteBrowserTtsChapter(chapters, 'missing')).toThrowError(/was not found/);
    expect(() => moveBrowserTtsChapter(chapters, 'one', 1)).toThrowError(/out of range/);
  });
});
