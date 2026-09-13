import { describe, expect, it } from 'vitest';

import {
  BROWSER_TTS_IMPORT_LIMITS,
  BrowserTtsImportError,
  assertLocalDocumentReference,
  assertSafeArchivePath,
  createBrowserTtsImportResult,
  decodeBrowserTtsUtf8,
  resolveArchiveReference,
  validateBrowserTtsArchiveEntries,
  validateBrowserTtsImportFile,
  validateBrowserTtsImportMetadata,
  type BrowserTtsArchiveEntryMetadata,
  type BrowserTtsImportErrorCode,
} from './browserTtsImport';

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

function archiveEntry(overrides: Partial<BrowserTtsArchiveEntryMetadata> = {}): BrowserTtsArchiveEntryMetadata {
  return {
    compressedSize: 100,
    directory: false,
    encrypted: false,
    filename: 'OPS/chapter.xhtml',
    symlink: false,
    uncompressedSize: 200,
    ...overrides,
  };
}

describe('browser TTS import contract', () => {
  it('preflights the unchanged Markdown and EPUB ceilings without bytes', () => {
    expect(BROWSER_TTS_IMPORT_LIMITS.markdownFileBytes).toBe(65_536);
    expect(BROWSER_TTS_IMPORT_LIMITS.archiveFileBytes).toBe(8_388_608);
    for (const [format, name, type, size] of [
      ['markdown', 'book.md', 'text/markdown', 65_536],
      ['markdown', 'book.MARKDOWN', '', 65_536],
      ['epub', 'book.epub', 'application/epub+zip', 8_388_608],
      ['epub', 'book.EPUB', 'application/octet-stream', 8_388_608],
      ['epub', 'book.epub', 'application/zip', 8_388_608],
    ] as const) {
      expect(() => validateBrowserTtsImportMetadata({ name, type, size }, format)).not.toThrow();
      expectImportError(() => validateBrowserTtsImportMetadata({ name, type, size: size + 1 }, format), 'archive-too-large');
    }
  });

  it('requires explicit matching file bytes, extensions, MIME types, and size limits', () => {
    const markdown = new TextEncoder().encode('# Local document');
    expect(() => validateBrowserTtsImportFile(
      { name: 'book.md', size: markdown.byteLength, type: 'text/markdown' },
      markdown,
      'markdown',
    )).not.toThrow();

    expectImportError(
      () => validateBrowserTtsImportFile({ name: 'book.txt', size: markdown.byteLength, type: 'text/plain' }, markdown, 'markdown'),
      'invalid-file-type',
    );
    expectImportError(
      () => validateBrowserTtsImportFile({ name: 'book.md', size: markdown.byteLength + 1, type: 'text/markdown' }, markdown, 'markdown'),
      'invalid-document',
    );
    expectImportError(
      () => validateBrowserTtsImportFile(
        { name: 'book.md', size: BROWSER_TTS_IMPORT_LIMITS.markdownFileBytes + 1, type: 'text/markdown' },
        new Uint8Array(BROWSER_TTS_IMPORT_LIMITS.markdownFileBytes + 1),
        'markdown',
      ),
      'archive-too-large',
    );
  });

  it('decodes UTF-8 without accepting binary or malformed input', () => {
    expect(decodeBrowserTtsUtf8(new TextEncoder().encode('\uFEFFHello\r\nworld'), 'Markdown')).toBe('Hello\nworld');
    expectImportError(() => decodeBrowserTtsUtf8(Uint8Array.of(0xff, 0xfe), 'Markdown'), 'malformed-text');
    expectImportError(() => decodeBrowserTtsUtf8(new TextEncoder().encode('a\0b'), 'Markdown'), 'binary-input');
    expectImportError(
      () => decodeBrowserTtsUtf8(new TextEncoder().encode(`a${String.fromCharCode(1, 2, 3)}b`), 'Markdown'),
      'binary-input',
    );
  });

  it('returns a deterministic parser-independent chapter contract', () => {
    const result = createBrowserTtsImportResult('markdown', [
      { title: '  Opening  ', text: ' First line.\r\n\r\n Second line. ' },
      { text: 'Another chapter.' },
    ]);

    expect(result).toEqual({
      chapters: [
        {
          characterCount: 25,
          id: 'import-markdown-001',
          order: 0,
          text: 'First line.\n\nSecond line.',
          title: 'Opening',
        },
        {
          characterCount: 16,
          id: 'import-markdown-002',
          order: 1,
          text: 'Another chapter.',
          title: 'Chapter 2',
        },
      ],
      format: 'markdown',
      totalCharacters: 41,
    });

    expectImportError(
      () => createBrowserTtsImportResult('markdown', [{ text: 'x'.repeat(BROWSER_TTS_IMPORT_LIMITS.chapterCharacters + 1) }]),
      'chapter-too-large',
    );
    expectImportError(
      () => createBrowserTtsImportResult('markdown', [{ text: 'a'.repeat(6_000) }, { text: 'b'.repeat(6_000) }]),
      'aggregate-too-large',
    );
    expectImportError(
      () => createBrowserTtsImportResult(
        'markdown',
        Array.from({ length: BROWSER_TTS_IMPORT_LIMITS.chapters + 1 }, () => ({ text: 'x' })),
      ),
      'too-many-chapters',
    );
  });

  it('rejects unsafe archive paths and non-local resource references', () => {
    expect(assertSafeArchivePath('OPS/Text/chapter.xhtml')).toBe('OPS/Text/chapter.xhtml');
    expect(resolveArchiveReference('OPS/package.opf', 'Text/chapter.xhtml#part', 'manifest item')).toBe('OPS/Text/chapter.xhtml');

    for (const path of ['../chapter.xhtml', '/chapter.xhtml', 'C:/chapter.xhtml', 'OPS\\chapter.xhtml', 'OPS/%2e%2e/chapter.xhtml']) {
      expectImportError(() => assertSafeArchivePath(path), 'invalid-path');
    }
    expectImportError(() => assertLocalDocumentReference('https://example.com/chapter.xhtml', 'chapter'), 'remote-resource');
    expectImportError(() => assertLocalDocumentReference('data:text/plain,hello', 'chapter'), 'remote-resource');
    expectImportError(() => assertLocalDocumentReference('blob:https://example.com/id', 'chapter'), 'remote-resource');
    expectImportError(() => assertLocalDocumentReference('/absolute/chapter.xhtml', 'chapter'), 'invalid-path');
  });

  it('rejects encrypted, linked, nested, ambiguous, and oversized archive metadata before extraction', () => {
    expect(validateBrowserTtsArchiveEntries([archiveEntry()])).toEqual({ expandedBytes: 200 });
    expectImportError(() => validateBrowserTtsArchiveEntries([archiveEntry({ encrypted: true })]), 'drm-or-encryption');
    expectImportError(() => validateBrowserTtsArchiveEntries([archiveEntry({ symlink: true })]), 'invalid-path');
    expectImportError(() => validateBrowserTtsArchiveEntries([archiveEntry({ filename: 'OPS/nested.zip' })]), 'invalid-archive');
    expectImportError(
      () => validateBrowserTtsArchiveEntries([archiveEntry(), archiveEntry({ filename: 'ops/CHAPTER.xhtml' })]),
      'invalid-archive',
    );
    expectImportError(
      () => validateBrowserTtsArchiveEntries([archiveEntry({ uncompressedSize: BROWSER_TTS_IMPORT_LIMITS.archiveSingleEntryBytes + 1 })]),
      'archive-entry-too-large',
    );
  });

  it('catches entry-count, expanded-byte, and compression-ratio zip bombs with metadata-only fixtures', () => {
    expectImportError(
      () => validateBrowserTtsArchiveEntries(
        Array.from({ length: BROWSER_TTS_IMPORT_LIMITS.archiveEntries + 1 }, (_, index) => archiveEntry({
          filename: `OPS/item-${index}.xhtml`,
        })),
      ),
      'too-many-archive-entries',
    );

    expectImportError(
      () => validateBrowserTtsArchiveEntries(
        Array.from({ length: 9 }, (_, index) => archiveEntry({
          compressedSize: 100_000,
          filename: `OPS/item-${index}.bin`,
          uncompressedSize: 2_000_000,
        })),
      ),
      'zip-bomb',
    );

    expectImportError(
      () => validateBrowserTtsArchiveEntries([archiveEntry({
        compressedSize: 600,
        uncompressedSize: BROWSER_TTS_IMPORT_LIMITS.compressionRatioMinimumBytes,
      })]),
      'zip-bomb',
    );
  });
});
