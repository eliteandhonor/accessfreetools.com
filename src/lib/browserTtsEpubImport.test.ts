import {
  TextReader,
  Uint8ArrayWriter,
  ZipWriter,
  type ZipWriterAddDataOptions,
} from '@zip.js/zip.js';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BrowserTtsImportError, type BrowserTtsImportErrorCode } from './browserTtsImport';
import { importBrowserTtsEpub } from './browserTtsEpubImport';

interface FixtureEntry {
  content: string;
  name: string;
  options?: ZipWriterAddDataOptions;
}

interface EpubFixtureOptions {
  chapterDocuments?: string[];
  container?: string;
  extraEntries?: FixtureEntry[];
  mimetype?: string;
  mimetypeOptions?: ZipWriterAddDataOptions;
  omitContainer?: boolean;
  opf?: string;
}

const DEFAULT_CONTAINER = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OPS/package.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

function xhtml(title: string, body: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>${title}</title></head>
  <body><h1>${title}</h1><p>${body}</p></body>
</html>`;
}

function defaultOpf(chapterCount: number) {
  const manifest = Array.from({ length: chapterCount }, (_, index) => (
    `<item id="chapter-${index + 1}" href="Text/chapter-${index + 1}.xhtml" media-type="application/xhtml+xml"/>`
  )).join('');
  const spine = Array.from({ length: chapterCount }, (_, index) => `<itemref idref="chapter-${index + 1}"/>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>Local Book</dc:title></metadata>
  <manifest>${manifest}</manifest>
  <spine>${spine}</spine>
</package>`;
}

async function makeEpub(options: EpubFixtureOptions = {}) {
  const chapterDocuments = options.chapterDocuments ?? [
    xhtml('First Chapter', 'A safe first paragraph.'),
    xhtml('Second Chapter', 'A safe second paragraph.'),
  ];
  const writer = new ZipWriter(new Uint8ArrayWriter(), { useWebWorkers: false });
  await writer.add('mimetype', new TextReader(options.mimetype ?? 'application/epub+zip'), {
    level: 0,
    ...(options.mimetypeOptions ?? {}),
  });
  if (!options.omitContainer) {
    await writer.add('META-INF/container.xml', new TextReader(options.container ?? DEFAULT_CONTAINER), { level: 0 });
  }
  await writer.add('OPS/package.opf', new TextReader(options.opf ?? defaultOpf(chapterDocuments.length)), { level: 0 });
  for (const [index, document] of chapterDocuments.entries()) {
    await writer.add(`OPS/Text/chapter-${index + 1}.xhtml`, new TextReader(document), { level: 0 });
  }
  for (const entry of options.extraEntries ?? []) {
    await writer.add(entry.name, new TextReader(entry.content), { level: 0, ...(entry.options ?? {}) });
  }
  return writer.close();
}

function epubFile(bytes: Uint8Array) {
  return { name: 'local-book.epub', size: bytes.byteLength, type: 'application/epub+zip' };
}

async function expectImportError(run: () => Promise<unknown>, code: BrowserTtsImportErrorCode) {
  try {
    await run();
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

describe('browser TTS EPUB import', () => {
  it('follows the package spine and returns named, ordered, text-only chapters', async () => {
    const bytes = await makeEpub();
    const result = await importBrowserTtsEpub(epubFile(bytes), bytes);

    expect(result.format).toBe('epub');
    expect(result.chapters.map((chapter) => chapter.title)).toEqual(['First Chapter', 'Second Chapter']);
    expect(result.chapters.map((chapter) => chapter.order)).toEqual([0, 1]);
    expect(result.chapters[0]?.text).toContain('A safe first paragraph.');
    expect(result.chapters[0]?.text).not.toContain('<p>');
    expect(result.totalCharacters).toBe(result.chapters.reduce((total, chapter) => total + chapter.characterCount, 0));
  });

  it('does not fetch local chapter resources or any remote URL', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network disabled'));
    const bytes = await makeEpub({
      chapterDocuments: [xhtml('Local', 'A local <a href="note.xhtml#part">note</a> and <img src="image.png" alt="diagram"/>.')],
      extraEntries: [
        { name: 'OPS/Text/note.xhtml', content: xhtml('Unused', 'Not in the spine.') },
        { name: 'OPS/Text/image.png', content: 'not-read-image-bytes' },
      ],
      opf: `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0">
  <manifest>
    <item id="chapter" href="Text/chapter-1.xhtml" media-type="application/xhtml+xml"/>
    <item id="note" href="Text/note.xhtml" media-type="application/xhtml+xml"/>
    <item id="image" href="Text/image.png" media-type="image/png"/>
  </manifest>
  <spine><itemref idref="chapter"/></spine>
</package>`,
    });

    const result = await importBrowserTtsEpub(epubFile(bytes), bytes);
    expect(result.chapters[0]?.text).toContain('diagram');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects scripts, event handlers, redirects, and remote or embedded resources', async () => {
    const hostileDocuments = [
      xhtml('Script', '<script>alert(1)</script>'),
      xhtml('Event', '<span onclick="steal()">Click</span>'),
      xhtml('Remote', '<a href="https://example.com">Remote</a>'),
      xhtml('Data', '<img src="data:image/png;base64,AA" alt="image"/>'),
      xhtml('Blob', '<a href="blob:https://example.com/id">Blob</a>'),
      xhtml('CSS', '<span style="background:url(https://example.com/a.png)">CSS</span>'),
    ];

    for (const document of hostileDocuments) {
      const bytes = await makeEpub({ chapterDocuments: [document] });
      await expectImportError(
        () => importBrowserTtsEpub(epubFile(bytes), bytes),
        document.includes('script') || document.includes('onclick') ? 'scripted-content' : 'remote-resource',
      );
    }
  });

  it('rejects DRM markers and encrypted entries before reading chapter data', async () => {
    const drm = await makeEpub({
      extraEntries: [{ name: 'META-INF/encryption.xml', content: '<encryption/>' }],
    });
    await expectImportError(() => importBrowserTtsEpub(epubFile(drm), drm), 'drm-or-encryption');

    const encrypted = await makeEpub({
      extraEntries: [{ name: 'OPS/secret.txt', content: 'secret', options: { password: 'local-test-password' } }],
    });
    await expectImportError(() => importBrowserTtsEpub(epubFile(encrypted), encrypted), 'drm-or-encryption');
  });

  it('rejects malformed container, package, and spine structures', async () => {
    const missingContainer = await makeEpub({ omitContainer: true });
    await expectImportError(() => importBrowserTtsEpub(epubFile(missingContainer), missingContainer), 'invalid-document');

    const malformedContainer = await makeEpub({ container: '<container><rootfiles></container>' });
    await expectImportError(() => importBrowserTtsEpub(epubFile(malformedContainer), malformedContainer), 'invalid-document');

    const brokenSpine = await makeEpub({
      opf: `<package><manifest><item id="one" href="Text/chapter-1.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="missing"/></spine></package>`,
      chapterDocuments: [xhtml('One', 'Body.')],
    });
    await expectImportError(() => importBrowserTtsEpub(epubFile(brokenSpine), brokenSpine), 'invalid-document');

    const brokenArchive = Uint8Array.of(0x50, 0x4b, 0x03, 0x04, 0x00);
    await expectImportError(() => importBrowserTtsEpub(epubFile(brokenArchive), brokenArchive), 'invalid-document');
  });

  it('rejects document types and more than 100 spine chapters using small fixtures', async () => {
    const doctype = await makeEpub({
      chapterDocuments: ['<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>Bad</title></head><body><p>Body.</p></body></html>'],
    });
    await expectImportError(() => importBrowserTtsEpub(epubFile(doctype), doctype), 'scripted-content');

    const smallChapters = Array.from({ length: 101 }, (_, index) => xhtml(`Part ${index + 1}`, `Text ${index + 1}.`));
    const tooMany = await makeEpub({ chapterDocuments: smallChapters });
    await expectImportError(() => importBrowserTtsEpub(epubFile(tooMany), tooMany), 'too-many-chapters');
  });
});
