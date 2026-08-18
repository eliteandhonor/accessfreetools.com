import { BlobReader, TextWriter, ZipReader } from '@zip.js/zip.js';
import { describe, expect, it } from 'vitest';

import {
  createBrowserTtsChapterZip,
  sanitizeBrowserTtsZipFilename,
} from './browserTtsArchive';

describe('browser TTS chapter ZIP', () => {
  it('packages ordered, separate MP3 entries without source text', async () => {
    const first = new TextEncoder().encode('first audio bytes').buffer;
    const second = new TextEncoder().encode('second audio bytes').buffer;
    const zip = await createBrowserTtsChapterZip([
      { audio: first, filename: '01-Opening.mp3' },
      { audio: second, filename: '02-Finish.mp3' },
    ]);
    const reader = new ZipReader(new BlobReader(zip), { useWebWorkers: false });
    const entries = await reader.getEntries();
    expect(entries.map((entry) => entry.filename)).toEqual(['01-Opening.mp3', '02-Finish.mp3']);
    const firstEntry = entries[0];
    const secondEntry = entries[1];
    if (!firstEntry || firstEntry.directory || !secondEntry || secondEntry.directory) throw new Error('Expected two ZIP file entries.');
    expect(await firstEntry.getData(new TextWriter())).toBe('first audio bytes');
    expect(await secondEntry.getData(new TextWriter())).toBe('second audio bytes');
    await reader.close();
  });

  it('refuses empty, duplicate, traversal, non-MP3, and oversized sets', async () => {
    const audio = new Uint8Array([1, 2, 3]).buffer;
    await expect(createBrowserTtsChapterZip([])).rejects.toThrow(/at least one/i);
    await expect(createBrowserTtsChapterZip([
      { audio, filename: '01-Intro.mp3' },
      { audio, filename: '01-intro.mp3' },
    ])).rejects.toThrow(/unique/i);
    await expect(createBrowserTtsChapterZip([{ audio, filename: '../escape.mp3' }])).rejects.toThrow(/unsafe/i);
    await expect(createBrowserTtsChapterZip([{ audio, filename: 'chapter.wav' }])).rejects.toThrow(/must be an MP3/i);
    await expect(createBrowserTtsChapterZip([
      { audio: new ArrayBuffer(64 * 1024 * 1024 + 1), filename: 'large.mp3' },
    ])).rejects.toThrow(/too large/i);
  });

  it('creates a portable ZIP filename', () => {
    expect(sanitizeBrowserTtsZipFilename(' My: Book?.zip ')).toBe('My- Book.zip');
    expect(sanitizeBrowserTtsZipFilename('')).toBe('audiobook-chapters.zip');
  });
});
