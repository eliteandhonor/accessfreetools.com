import { unzipSync } from 'fflate';
import { XMLParser } from 'fast-xml-parser';

export const TTS_INPUT_LIMITS = {
  maxCharacters: 500_000,
  maxChapters: 100,
  maxCompressedBytes: 10 * 1024 * 1024,
  maxEntries: 1_000,
  maxSynthesisCharacters: 10_000,
  maxUncompressedBytes: 25 * 1024 * 1024,
} as const;

export interface TtsChapterInput {
  index: number;
  text: string;
}

export interface ParsedTtsInput {
  chapters: TtsChapterInput[];
  characterCount: number;
  sourceKind: 'epub' | 'paste' | 'txt';
}

interface ZipInspection {
  entries: number;
  uncompressedBytes: number;
}

const EOCD_SIGNATURE = 0x06054b50;
const CENTRAL_FILE_SIGNATURE = 0x02014b50;
const BLOCK_ELEMENTS = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'br',
  'div',
  'figcaption',
  'figure',
  'footer',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'td',
  'th',
  'tr',
  'ul',
]);
const SKIPPED_ELEMENTS = new Set(['head', 'noscript', 'script', 'style', 'svg']);

function dataView(bytes: Uint8Array) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

export function inspectZipCentralDirectory(bytes: Uint8Array): ZipInspection {
  if (bytes.byteLength < 22 || bytes.byteLength > TTS_INPUT_LIMITS.maxCompressedBytes) {
    throw new Error('EPUB files must be no larger than 10 MB.');
  }

  const view = dataView(bytes);
  const minimum = Math.max(0, bytes.byteLength - 65_557);
  let eocdOffset = -1;
  for (let offset = bytes.byteLength - 22; offset >= minimum; offset -= 1) {
    if (view.getUint32(offset, true) === EOCD_SIGNATURE) {
      eocdOffset = offset;
      break;
    }
  }
  if (eocdOffset < 0) throw new Error('This EPUB does not contain a valid ZIP directory.');

  const entries = view.getUint16(eocdOffset + 10, true);
  const centralSize = view.getUint32(eocdOffset + 12, true);
  const centralOffset = view.getUint32(eocdOffset + 16, true);
  if (entries < 1 || entries > TTS_INPUT_LIMITS.maxEntries) {
    throw new Error(`EPUB files can contain at most ${TTS_INPUT_LIMITS.maxEntries.toLocaleString()} entries.`);
  }
  if (centralOffset + centralSize > eocdOffset || centralOffset + centralSize > bytes.byteLength) {
    throw new Error('This EPUB has an invalid central directory.');
  }

  let offset = centralOffset;
  let uncompressedBytes = 0;
  for (let entry = 0; entry < entries; entry += 1) {
    if (offset + 46 > bytes.byteLength || view.getUint32(offset, true) !== CENTRAL_FILE_SIGNATURE) {
      throw new Error('This EPUB has a malformed file entry.');
    }
    uncompressedBytes += view.getUint32(offset + 24, true);
    if (uncompressedBytes > TTS_INPUT_LIMITS.maxUncompressedBytes) {
      throw new Error('This EPUB expands beyond the 25 MB safety limit.');
    }
    const fileNameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    offset += 46 + fileNameLength + extraLength + commentLength;
  }
  if (offset > centralOffset + centralSize) throw new Error('This EPUB central directory is inconsistent.');
  return { entries, uncompressedBytes };
}

function normalizeText(text: string) {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/[\t\f\v ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function createParsedInput(chapters: string[], sourceKind: ParsedTtsInput['sourceKind']): ParsedTtsInput {
  const normalized = chapters.map(normalizeText).filter(Boolean);
  if (normalized.length < 1) throw new Error('No readable chapter text was found.');
  if (normalized.length > TTS_INPUT_LIMITS.maxChapters) {
    throw new Error(`Audiobook projects can contain at most ${TTS_INPUT_LIMITS.maxChapters} chapters.`);
  }
  const characterCount = normalized.reduce((sum, chapter) => sum + chapter.length, 0);
  if (characterCount > TTS_INPUT_LIMITS.maxCharacters) {
    throw new Error(`Audiobook projects can contain at most ${TTS_INPUT_LIMITS.maxCharacters.toLocaleString()} characters.`);
  }
  return {
    chapters: normalized.map((text, index) => ({ index: index + 1, text })),
    characterCount,
    sourceKind,
  };
}

export function parsePastedText(text: string): ParsedTtsInput {
  return createParsedInput([text], 'paste');
}

export function parseTxtBytes(bytes: Uint8Array): ParsedTtsInput {
  if (bytes.byteLength > TTS_INPUT_LIMITS.maxCompressedBytes) throw new Error('TXT files must be no larger than 10 MB.');
  let encoding: 'utf-16be' | 'utf-16le' | 'utf-8' = 'utf-8';
  if (bytes[0] === 0xff && bytes[1] === 0xfe) encoding = 'utf-16le';
  if (bytes[0] === 0xfe && bytes[1] === 0xff) encoding = 'utf-16be';
  const text = new TextDecoder(encoding, { fatal: true }).decode(bytes);
  if (text.includes('\u0000')) throw new Error('This TXT file appears to contain binary data.');
  return createParsedInput([text.replace(/^\uFEFF/, '')], 'txt');
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function safeArchivePath(path: string) {
  const decoded = decodeURIComponent(path).replace(/\\/g, '/');
  if (/^(?:[a-z]+:|\/)/i.test(decoded)) throw new Error('EPUB contains an external or absolute file path.');
  const output: string[] = [];
  for (const segment of decoded.split('/')) {
    if (!segment || segment === '.') continue;
    if (segment === '..') {
      if (!output.length) throw new Error('EPUB contains an unsafe parent path.');
      output.pop();
    } else {
      output.push(segment);
    }
  }
  return output.join('/');
}

function resolveArchivePath(baseFile: string, relativePath: string) {
  const base = safeArchivePath(baseFile).split('/');
  base.pop();
  return safeArchivePath([...base, relativePath].join('/'));
}

function decodeArchiveText(entries: Record<string, Uint8Array>, path: string) {
  const safePath = safeArchivePath(path);
  const bytes = entries[safePath];
  if (!bytes) throw new Error(`EPUB is missing required file: ${safePath}`);
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function extractOrderedText(value: unknown, elementName = ''): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (!value) return '';
  if (Array.isArray(value)) return value.map((item) => extractOrderedText(item, elementName)).join('');
  if (typeof value !== 'object') return '';

  let output = '';
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (key === ':@') continue;
    if (key === '#text' || key === '#cdata') {
      output += String(child);
      continue;
    }
    const normalizedKey = key.toLowerCase().split(':').pop() ?? key.toLowerCase();
    if (SKIPPED_ELEMENTS.has(normalizedKey)) continue;
    const block = BLOCK_ELEMENTS.has(normalizedKey);
    if (block) output += '\n';
    output += extractOrderedText(child, normalizedKey);
    if (block) output += '\n';
  }
  return output;
}

export function parseEpubBytes(bytes: Uint8Array): ParsedTtsInput {
  inspectZipCentralDirectory(bytes);
  let entries: Record<string, Uint8Array>;
  try {
    entries = unzipSync(bytes);
  } catch (error) {
    throw new Error('This EPUB could not be decompressed safely.', { cause: error });
  }
  for (const path of Object.keys(entries)) safeArchivePath(path);

  const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  const orderedParser = new XMLParser({
    preserveOrder: true,
    ignoreAttributes: false,
    processEntities: true,
    htmlEntities: true,
    trimValues: false,
  });
  const container = xmlParser.parse(decodeArchiveText(entries, 'META-INF/container.xml')) as Record<string, any>;
  const rootfiles = asArray(container?.container?.rootfiles?.rootfile);
  const packagePath = rootfiles[0]?.['full-path'];
  if (typeof packagePath !== 'string') throw new Error('EPUB container does not name a package document.');

  const packageXml = xmlParser.parse(decodeArchiveText(entries, packagePath)) as Record<string, any>;
  const packageNode = packageXml?.package;
  const manifestItems = asArray(packageNode?.manifest?.item);
  const spineItems = asArray(packageNode?.spine?.itemref);
  const manifest = new Map<string, { href: string; mediaType: string }>();
  for (const item of manifestItems) {
    if (typeof item?.id === 'string' && typeof item?.href === 'string') {
      manifest.set(item.id, { href: item.href, mediaType: String(item['media-type'] ?? '') });
    }
  }

  const chapterPaths = spineItems
    .map((item) => manifest.get(String(item?.idref ?? '')))
    .filter((item): item is { href: string; mediaType: string } => Boolean(item))
    .filter((item) => /(?:xhtml|html)/i.test(item.mediaType))
    .map((item) => resolveArchivePath(packagePath, item.href));
  if (chapterPaths.length > TTS_INPUT_LIMITS.maxChapters) {
    throw new Error(`EPUB files can contain at most ${TTS_INPUT_LIMITS.maxChapters} readable spine chapters.`);
  }

  const chapters = chapterPaths.map((path) => {
    try {
      return extractOrderedText(orderedParser.parse(decodeArchiveText(entries, path)));
    } catch (error) {
      throw new Error(`EPUB chapter could not be parsed: ${path}`, { cause: error });
    }
  });
  return createParsedInput(chapters, 'epub');
}

export async function parseTtsFile(file: File): Promise<ParsedTtsInput> {
  if (file.size > TTS_INPUT_LIMITS.maxCompressedBytes) throw new Error('Files must be no larger than 10 MB.');
  const bytes = new Uint8Array(await file.arrayBuffer());
  const extension = file.name.toLowerCase().split('.').pop();
  if (extension === 'txt' || file.type.startsWith('text/')) return parseTxtBytes(bytes);
  if (extension === 'epub' || file.type === 'application/epub+zip') return parseEpubBytes(bytes);
  throw new Error('Choose a TXT or EPUB file. PDF and DOCX are not supported in this pilot.');
}
