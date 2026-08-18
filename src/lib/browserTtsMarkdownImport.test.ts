import { afterEach, describe, expect, it, vi } from 'vitest';

import { BrowserTtsImportError, type BrowserTtsImportErrorCode } from './browserTtsImport';
import { importBrowserTtsMarkdown } from './browserTtsMarkdownImport';

function markdownFile(source: string, name = 'book.md') {
  const bytes = new TextEncoder().encode(source);
  return {
    bytes,
    metadata: { name, size: bytes.byteLength, type: 'text/markdown' },
  };
}

function expectImportError(run: () => unknown, code: BrowserTtsImportErrorCode) {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(BrowserTtsImportError);
    expect((error as BrowserTtsImportError).code).toBe(code);
    return;
  }
  throw new Error(`Expected ${code}`);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('browser TTS Markdown import', () => {
  it('turns structured Markdown into named, ordered, plain-text chapters', () => {
    const input = markdownFile(`---
title: Private local metadata
---
# My Book
## First Steps
Hello **reader**. See [the local note](notes.md).

- One item
- Two items

### Detail
Use \`inline code\` and keep unusual Unicode: Καλημέρα 世界.

## Last Step
Finish with a quoted thought:

> Nothing leaves this browser.
`);

    const result = importBrowserTtsMarkdown(input.metadata, input.bytes);

    expect(result.format).toBe('markdown');
    expect(result.chapters).toHaveLength(2);
    expect(result.chapters.map((chapter) => chapter.title)).toEqual(['First Steps', 'Last Step']);
    expect(result.chapters[0]?.text).toContain('Hello reader. See the local note.');
    expect(result.chapters[0]?.text).toContain('One item');
    expect(result.chapters[0]?.text).toContain('Detail');
    expect(result.chapters[0]?.text).toContain('Καλημέρα 世界');
    expect(result.chapters[0]?.text).not.toContain('Private local metadata');
    expect(result.chapters[1]?.text).toContain('Nothing leaves this browser.');
    expect(result.chapters.every((chapter, index) => chapter.order === index)).toBe(true);
  });

  it('creates one chapter when no chapter heading exists', () => {
    const input = markdownFile('A short paragraph with no heading.');
    const result = importBrowserTtsMarkdown(input.metadata, input.bytes);
    expect(result.chapters).toEqual([
      expect.objectContaining({ title: 'Introduction', text: 'A short paragraph with no heading.' }),
    ]);
  });

  it('rejects raw HTML instead of rendering or stripping it', () => {
    for (const source of [
      '# Unsafe\n<script>alert(1)</script>',
      '# Unsafe\n<div onclick="steal()">Click</div>',
      '# Unsafe\n<img src="https://example.com/pixel.png">',
    ]) {
      const input = markdownFile(source);
      expectImportError(() => importBrowserTtsMarkdown(input.metadata, input.bytes), 'scripted-content');
    }
  });

  it('rejects remote, data, blob, and scripted Markdown resource references', () => {
    for (const source of [
      '# Remote\n[site](https://example.com)',
      '# Data\n![image](data:image/png;base64,AA)',
      '# Blob\n[download](blob:https://example.com/id)',
      '# Script\n[action](javascript:alert(1))',
    ]) {
      const input = markdownFile(source);
      expectImportError(() => importBrowserTtsMarkdown(input.metadata, input.bytes), 'remote-resource');
    }
  });

  it('never fetches a document resource', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network disabled'));
    const input = markdownFile('# Local\nRead [the next note](next.md) without loading it.');
    const result = importBrowserTtsMarkdown(input.metadata, input.bytes);
    expect(result.chapters[0]?.text).toContain('the next note');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects binary, overlong, and excessive-chapter Markdown without truncation', () => {
    const binary = Uint8Array.of(0xff, 0xfe, 0x00);
    expectImportError(
      () => importBrowserTtsMarkdown({ name: 'book.md', size: binary.byteLength, type: 'text/markdown' }, binary),
      'malformed-text',
    );

    const overlong = markdownFile(`# Long\n${'x'.repeat(10_001)}`);
    expectImportError(() => importBrowserTtsMarkdown(overlong.metadata, overlong.bytes), 'chapter-too-large');

    const chapters = markdownFile(Array.from({ length: 101 }, (_, index) => `## Part ${index + 1}\nText ${index + 1}.`).join('\n\n'));
    expectImportError(() => importBrowserTtsMarkdown(chapters.metadata, chapters.bytes), 'too-many-chapters');
  });
});
