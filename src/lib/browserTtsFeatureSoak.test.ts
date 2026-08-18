import { BlobReader, ZipReader } from '@zip.js/zip.js';
import { describe, expect, it } from 'vitest';

import { createBrowserTtsChapterZip } from './browserTtsArchive';
import { BrowserTtsChapterQueue } from './browserTtsChapterQueue';
import {
  createBrowserTtsChapterMp3Files,
  createBrowserTtsChapters,
} from './browserTtsChapters';

describe('browser TTS bounded feature soak', () => {
  it('queues and packages 100 chapters at the 10,000-character ceiling with one active generator', async () => {
    let id = 0;
    let activeGenerators = 0;
    let peakGenerators = 0;
    const chapters = createBrowserTtsChapters(
      Array.from({ length: 100 }, (_, index) => ({
        name: `Chapter ${String(index + 1).padStart(3, '0')}`,
        text: String(index + 1).padStart(3, '0').repeat(33).padEnd(100, '.'),
      })),
      () => `soak-${++id}`,
    );
    const queue = new BrowserTtsChapterQueue(chapters, async (chapter, context) => {
      activeGenerators += 1;
      peakGenerators = Math.max(peakGenerators, activeGenerators);
      context.onProgress(0.5);
      await Promise.resolve();
      context.onProgress(1);
      activeGenerators -= 1;
      return new Uint8Array([0x49, 0x44, 0x33, chapter.text.length]).buffer;
    });

    const state = await queue.run();
    expect(state.status).toBe('completed');
    expect(state.completedCount).toBe(100);
    expect(state.progress).toBe(1);
    expect(peakGenerators).toBe(1);
    expect(chapters.reduce((total, chapter) => total + chapter.text.length, 0)).toBe(10_000);

    const filenames = new Map(
      createBrowserTtsChapterMp3Files(chapters).map((file) => [file.chapterId, file.filename]),
    );
    const zip = await createBrowserTtsChapterZip(state.items.map((item) => {
      if (!item.result) throw new Error(`Missing soak audio for ${item.chapterId}.`);
      const filename = filenames.get(item.chapterId);
      if (!filename) throw new Error(`Missing soak filename for ${item.chapterId}.`);
      return { audio: item.result, filename };
    }));
    const reader = new ZipReader(new BlobReader(zip), { useWebWorkers: false });
    const entries = await reader.getEntries();
    expect(entries).toHaveLength(100);
    expect(entries.every((entry) => !entry.directory && entry.filename.endsWith('.mp3'))).toBe(true);
    expect(entries[0]?.filename).toMatch(/^001-/);
    expect(entries[99]?.filename).toMatch(/^100-/);
    await reader.close();
  });
});
