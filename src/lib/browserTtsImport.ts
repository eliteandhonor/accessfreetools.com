export const BROWSER_TTS_IMPORT_LIMITS = Object.freeze({
  aggregateCharacters: 10_000,
  archiveEntries: 256,
  archiveExpandedBytes: 16 * 1024 * 1024,
  archiveFileBytes: 8 * 1024 * 1024,
  archiveSingleEntryBytes: 2 * 1024 * 1024,
  chapterCharacters: 10_000,
  chapters: 100,
  compressionRatio: 100,
  compressionRatioMinimumBytes: 64 * 1024,
  markdownFileBytes: 64 * 1024,
  markupEntryBytes: 512 * 1024,
});

export type BrowserTtsImportFormat = 'epub' | 'markdown';

export type BrowserTtsImportErrorCode =
  | 'aggregate-too-large'
  | 'archive-entry-too-large'
  | 'archive-too-large'
  | 'binary-input'
  | 'chapter-too-large'
  | 'drm-or-encryption'
  | 'empty-document'
  | 'invalid-archive'
  | 'invalid-document'
  | 'invalid-file-type'
  | 'invalid-path'
  | 'malformed-text'
  | 'remote-resource'
  | 'scripted-content'
  | 'too-many-archive-entries'
  | 'too-many-chapters'
  | 'zip-bomb';

export interface BrowserTtsImportFileMetadata {
  name: string;
  size: number;
  type: string;
}

export interface ImportedTtsChapter {
  characterCount: number;
  id: string;
  order: number;
  text: string;
  title: string;
}

export interface BrowserTtsImportResult {
  chapters: ImportedTtsChapter[];
  format: BrowserTtsImportFormat;
  totalCharacters: number;
}

export interface ImportedTtsChapterDraft {
  text: string;
  title?: string;
}

export interface BrowserTtsArchiveEntryMetadata {
  compressedSize: number;
  directory: boolean;
  encrypted: boolean;
  filename: string;
  symlink: boolean;
  uncompressedSize: number;
}

export class BrowserTtsImportError extends Error {
  readonly code: BrowserTtsImportErrorCode;

  constructor(code: BrowserTtsImportErrorCode, message: string) {
    super(message);
    this.name = 'BrowserTtsImportError';
    this.code = code;
  }
}

function fail(code: BrowserTtsImportErrorCode, message: string): never {
  throw new BrowserTtsImportError(code, message);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en').format(value);
}

function maxFileBytes(format: BrowserTtsImportFormat) {
  return format === 'markdown'
    ? BROWSER_TTS_IMPORT_LIMITS.markdownFileBytes
    : BROWSER_TTS_IMPORT_LIMITS.archiveFileBytes;
}

export function validateBrowserTtsImportMetadata(
  file: BrowserTtsImportFileMetadata,
  format: BrowserTtsImportFormat,
) {
  const expectedExtensions = format === 'markdown' ? ['.md', '.markdown'] : ['.epub'];
  const lowerName = file.name.toLowerCase();
  if (!expectedExtensions.some((extension) => lowerName.endsWith(extension))) {
    fail('invalid-file-type', format === 'markdown' ? 'Choose a Markdown .md or .markdown file.' : 'Choose an .epub file.');
  }

  if (!Number.isSafeInteger(file.size) || file.size < 0) {
    fail('invalid-document', 'The selected document size is not valid.');
  }

  if (file.size === 0) fail('empty-document', 'The selected document is empty.');

  const limit = maxFileBytes(format);
  if (file.size > limit) {
    const label = format === 'markdown' ? 'Markdown' : 'EPUB';
    fail('archive-too-large', `${label} files must be no larger than ${formatNumber(limit / 1024)} KB.`);
  }

  const mimeType = file.type.toLowerCase();
  if (format === 'markdown' && mimeType && !['text/markdown', 'text/plain', 'text/x-markdown'].includes(mimeType)) {
    fail('invalid-file-type', 'Choose a plain Markdown file, not another file type.');
  }
  if (format === 'epub' && mimeType && !['application/epub+zip', 'application/octet-stream', 'application/zip'].includes(mimeType)) {
    fail('invalid-file-type', 'Choose an EPUB file, not another file type.');
  }
}

export function validateBrowserTtsImportFile(
  file: BrowserTtsImportFileMetadata,
  bytes: Uint8Array,
  format: BrowserTtsImportFormat,
) {
  validateBrowserTtsImportMetadata(file, format);
  if (file.size !== bytes.byteLength) {
    fail('invalid-document', 'The selected file size does not match the bytes read by the browser.');
  }
}

export function decodeBrowserTtsUtf8(bytes: Uint8Array, label: string) {
  let value: string;
  try {
    value = new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^\uFEFF/, '');
  } catch {
    fail('malformed-text', `${label} is not valid UTF-8 text.`);
  }

  if (value.includes('\0')) fail('binary-input', `${label} contains binary data.`);

  let suspiciousControls = 0;
  for (const character of value) {
    const code = character.codePointAt(0) ?? 0;
    if ((code < 0x20 && code !== 0x09 && code !== 0x0a && code !== 0x0d) || code === 0x7f) suspiciousControls += 1;
  }
  if (suspiciousControls > Math.max(2, Math.floor(value.length * 0.01))) {
    fail('binary-input', `${label} contains too many binary control characters.`);
  }

  return value.replace(/\r\n?/g, '\n');
}

export function normalizeImportedPlainText(value: string) {
  return value
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .replace(/[\t\f\v ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeChapterTitle(value: string | undefined, order: number) {
  const normalized = normalizeImportedPlainText(value ?? '').replace(/\n+/g, ' ').slice(0, 120).trim();
  return normalized || `Chapter ${order + 1}`;
}

export function createBrowserTtsImportResult(
  format: BrowserTtsImportFormat,
  drafts: readonly ImportedTtsChapterDraft[],
): BrowserTtsImportResult {
  const normalizedDrafts = drafts
    .map((draft) => ({
      text: normalizeImportedPlainText(draft.text),
      title: draft.title,
    }))
    .filter((draft) => draft.text.length > 0);

  if (normalizedDrafts.length === 0) fail('empty-document', 'The document does not contain readable chapter text.');
  if (normalizedDrafts.length > BROWSER_TTS_IMPORT_LIMITS.chapters) {
    fail('too-many-chapters', `The document contains more than ${BROWSER_TTS_IMPORT_LIMITS.chapters} chapters.`);
  }

  let totalCharacters = 0;
  const chapters = normalizedDrafts.map((draft, order): ImportedTtsChapter => {
    if (draft.text.length > BROWSER_TTS_IMPORT_LIMITS.chapterCharacters) {
      fail(
        'chapter-too-large',
        `Chapter ${order + 1} contains more than ${formatNumber(BROWSER_TTS_IMPORT_LIMITS.chapterCharacters)} characters.`,
      );
    }
    totalCharacters += draft.text.length;
    if (totalCharacters > BROWSER_TTS_IMPORT_LIMITS.aggregateCharacters) {
      fail(
        'aggregate-too-large',
        `Imported chapter text contains more than ${formatNumber(BROWSER_TTS_IMPORT_LIMITS.aggregateCharacters)} characters.`,
      );
    }
    return {
      characterCount: draft.text.length,
      id: `import-${format}-${String(order + 1).padStart(3, '0')}`,
      order,
      text: draft.text,
      title: normalizeChapterTitle(draft.title, order),
    };
  });

  return { chapters, format, totalCharacters };
}

function decodeSafePath(value: string) {
  if (/%2f|%5c/i.test(value)) fail('invalid-path', 'Archive paths cannot contain encoded path separators.');
  try {
    return decodeURIComponent(value);
  } catch {
    fail('invalid-path', 'An archive path contains invalid percent encoding.');
  }
}

export function assertSafeArchivePath(value: string, directory = false) {
  const candidate = directory && value.endsWith('/') ? value.slice(0, -1) : value;
  const decoded = decodeSafePath(candidate).normalize('NFC');
  if (!decoded || /[\u0000-\u001f\u007f]/.test(decoded) || decoded.includes('\\')) {
    fail('invalid-path', 'The archive contains an unsafe path.');
  }
  if (decoded.startsWith('/') || decoded.startsWith('//') || /^[a-z]:\//i.test(decoded) || /^[a-z][a-z0-9+.-]*:/i.test(decoded)) {
    fail('invalid-path', 'The archive contains an absolute path.');
  }
  const segments = decoded.split('/');
  if (segments.some((segment) => !segment || segment === '.' || segment === '..')) {
    fail('invalid-path', 'The archive contains a path that could escape its document folder.');
  }
  return decoded;
}

export function assertLocalDocumentReference(value: string, context: string) {
  const candidate = value.trim();
  if (!candidate) return candidate;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(candidate)) {
    fail('remote-resource', `${context} contains a remote or embedded resource reference.`);
  }
  if (candidate.startsWith('/') || /^[a-z]:\//i.test(candidate)) {
    fail('invalid-path', `${context} contains an absolute resource path.`);
  }
  if (/[\u0000-\u001f\u007f]/.test(candidate) || candidate.includes('\\')) {
    fail('invalid-path', `${context} contains an unsafe resource path.`);
  }
  return candidate;
}

export function resolveArchiveReference(basePath: string, reference: string, context: string) {
  const localReference = assertLocalDocumentReference(reference, context);
  const withoutFragment = localReference.split('#', 1)[0]?.split('?', 1)[0] ?? '';
  if (!withoutFragment) fail('invalid-path', `${context} does not name a document entry.`);
  const decodedReference = decodeSafePath(withoutFragment);
  const baseSegments = assertSafeArchivePath(basePath).split('/');
  baseSegments.pop();
  const referenceSegments = decodedReference.split('/');
  if (referenceSegments.some((segment) => !segment || segment === '.' || segment === '..')) {
    fail('invalid-path', `${context} contains a traversal path.`);
  }
  return assertSafeArchivePath([...baseSegments, ...referenceSegments].join('/'));
}

const NESTED_ARCHIVE_EXTENSION = /\.(?:7z|epub|gz|jar|rar|tar|tgz|xz|zip)$/i;

export function validateBrowserTtsArchiveEntries(entries: readonly BrowserTtsArchiveEntryMetadata[]) {
  if (entries.length > BROWSER_TTS_IMPORT_LIMITS.archiveEntries) {
    fail('too-many-archive-entries', `The EPUB contains more than ${BROWSER_TTS_IMPORT_LIMITS.archiveEntries} archive entries.`);
  }

  const seenPaths = new Set<string>();
  const seenFoldedPaths = new Set<string>();
  let expandedBytes = 0;
  for (const entry of entries) {
    const safePath = assertSafeArchivePath(entry.filename, entry.directory);
    const foldedPath = safePath.toLocaleLowerCase('en-US');
    if (seenPaths.has(safePath) || seenFoldedPaths.has(foldedPath)) {
      fail('invalid-archive', 'The EPUB contains duplicate or ambiguous archive paths.');
    }
    seenPaths.add(safePath);
    seenFoldedPaths.add(foldedPath);

    if (entry.encrypted) fail('drm-or-encryption', 'Encrypted or DRM-protected EPUB files are not supported.');
    if (entry.symlink) fail('invalid-path', 'EPUB symbolic links are not supported.');
    if (!Number.isSafeInteger(entry.compressedSize) || !Number.isSafeInteger(entry.uncompressedSize)
      || entry.compressedSize < 0 || entry.uncompressedSize < 0) {
      fail('invalid-archive', 'The EPUB contains invalid archive size metadata.');
    }
    if (!entry.directory && NESTED_ARCHIVE_EXTENSION.test(safePath)) {
      fail('invalid-archive', 'Nested archives are not supported inside EPUB files.');
    }
    if (entry.uncompressedSize > BROWSER_TTS_IMPORT_LIMITS.archiveSingleEntryBytes) {
      fail('archive-entry-too-large', 'An EPUB archive entry is larger than the allowed extraction limit.');
    }

    expandedBytes += entry.uncompressedSize;
    if (expandedBytes > BROWSER_TTS_IMPORT_LIMITS.archiveExpandedBytes) {
      fail('zip-bomb', 'The EPUB would expand beyond the browser extraction limit.');
    }

    if (entry.uncompressedSize >= BROWSER_TTS_IMPORT_LIMITS.compressionRatioMinimumBytes) {
      if (entry.compressedSize === 0 || entry.uncompressedSize / entry.compressedSize > BROWSER_TTS_IMPORT_LIMITS.compressionRatio) {
        fail('zip-bomb', 'The EPUB contains a suspiciously compressed archive entry.');
      }
    }
  }

  return { expandedBytes };
}

export function assertBoundedMarkupBytes(bytes: Uint8Array, label: string) {
  if (bytes.byteLength > BROWSER_TTS_IMPORT_LIMITS.markupEntryBytes) {
    fail('archive-entry-too-large', `${label} is larger than the allowed markup limit.`);
  }
}

export function asBrowserTtsImportError(error: unknown, fallbackMessage: string) {
  if (error instanceof BrowserTtsImportError) return error;
  return new BrowserTtsImportError('invalid-document', fallbackMessage);
}
