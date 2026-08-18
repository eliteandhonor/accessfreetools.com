import {
  XmlDocumentType,
  XmlElement,
  XmlProcessingInstruction,
  XmlText,
  parseXml,
  type XmlDocument,
  type XmlNode,
} from '@rgrove/parse-xml';
import {
  Uint8ArrayReader,
  ZipReader,
  type Entry,
  type FileEntry,
} from '@zip.js/zip.js';

import {
  BROWSER_TTS_IMPORT_LIMITS,
  BrowserTtsImportError,
  assertBoundedMarkupBytes,
  assertLocalDocumentReference,
  assertSafeArchivePath,
  asBrowserTtsImportError,
  createBrowserTtsImportResult,
  decodeBrowserTtsUtf8,
  normalizeImportedPlainText,
  resolveArchiveReference,
  validateBrowserTtsArchiveEntries,
  validateBrowserTtsImportFile,
  type BrowserTtsImportFileMetadata,
  type BrowserTtsImportResult,
  type ImportedTtsChapterDraft,
} from './browserTtsImport';

interface ExtractionState {
  extractedBytes: number;
}

interface ManifestItem {
  href: string;
  id: string;
  mediaType: string;
  path: string;
  properties: string[];
}

const EPUB_MIMETYPE = 'application/epub+zip';
const DANGEROUS_XHTML_ELEMENTS = new Set([
  'applet',
  'base',
  'embed',
  'form',
  'frame',
  'frameset',
  'iframe',
  'input',
  'object',
  'script',
  'style',
  'template',
]);
const SKIPPED_TEXT_ELEMENTS = new Set(['head', 'math', 'nav', 'noscript', 'svg']);
const BLOCK_TEXT_ELEMENTS = new Set([
  'address', 'article', 'aside', 'blockquote', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure', 'footer',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'li', 'main', 'ol', 'p', 'pre', 'section', 'table', 'td',
  'th', 'tr', 'ul',
]);
const RESOURCE_ATTRIBUTES = new Set(['action', 'formaction', 'href', 'poster', 'src', 'xlink:href']);

function localName(value: string) {
  return value.toLowerCase().split(':').at(-1) ?? value.toLowerCase();
}

function elementChildren(element: XmlElement, name?: string) {
  return element.children.filter((child): child is XmlElement => {
    if (!(child instanceof XmlElement)) return false;
    return !name || localName(child.name) === name;
  });
}

function descendants(element: XmlElement, name: string): XmlElement[] {
  const matches: XmlElement[] = [];
  for (const child of elementChildren(element)) {
    if (localName(child.name) === name) matches.push(child);
    matches.push(...descendants(child, name));
  }
  return matches;
}

function attribute(element: XmlElement, name: string) {
  const entry = Object.entries(element.attributes).find(([attributeName]) => localName(attributeName) === name);
  return entry?.[1]?.trim() ?? '';
}

function parseEpubXml(bytes: Uint8Array, label: string): XmlDocument {
  assertBoundedMarkupBytes(bytes, label);
  const value = decodeBrowserTtsUtf8(bytes, label);
  let document: XmlDocument;
  try {
    document = parseXml(value, { preserveCdata: true, preserveDocumentType: true });
  } catch {
    throw new BrowserTtsImportError('invalid-document', `${label} is malformed XML.`);
  }

  if (document.children.some((child) => child instanceof XmlDocumentType || child instanceof XmlProcessingInstruction)) {
    throw new BrowserTtsImportError('scripted-content', `${label} contains a document type or processing instruction.`);
  }
  if (!document.root) throw new BrowserTtsImportError('invalid-document', `${label} has no root element.`);
  return document;
}

async function readMarkupEntry(entry: FileEntry, label: string, state: ExtractionState) {
  if (entry.uncompressedSize > BROWSER_TTS_IMPORT_LIMITS.markupEntryBytes) {
    throw new BrowserTtsImportError('archive-entry-too-large', `${label} is larger than the allowed markup limit.`);
  }

  const buffer = await entry.arrayBuffer({
    checkAmbiguity: true,
    checkCrc32: true,
    checkOverlappingEntry: true,
    strictness: 'strict',
    useWebWorkers: false,
  });
  const bytes = new Uint8Array(buffer);
  if (bytes.byteLength !== entry.uncompressedSize) {
    throw new BrowserTtsImportError('invalid-archive', `${label} does not match its declared archive size.`);
  }
  state.extractedBytes += bytes.byteLength;
  if (state.extractedBytes > BROWSER_TTS_IMPORT_LIMITS.archiveExpandedBytes) {
    throw new BrowserTtsImportError('zip-bomb', 'The EPUB extraction exceeded its browser memory limit.');
  }
  assertBoundedMarkupBytes(bytes, label);
  return bytes;
}

function requireFile(entries: ReadonlyMap<string, Entry>, path: string, label: string): FileEntry {
  const entry = entries.get(path);
  if (!entry || entry.directory) throw new BrowserTtsImportError('invalid-document', `${label} is missing from the EPUB.`);
  return entry;
}

function containerPackagePath(document: XmlDocument) {
  const root = document.root;
  if (!root || localName(root.name) !== 'container') {
    throw new BrowserTtsImportError('invalid-document', 'EPUB container.xml has an invalid root element.');
  }
  const rootfiles = descendants(root, 'rootfile');
  if (rootfiles.length !== 1) {
    throw new BrowserTtsImportError('invalid-document', 'EPUB container.xml must name exactly one package document.');
  }
  const path = attribute(rootfiles[0]!, 'full-path');
  if (!path) throw new BrowserTtsImportError('invalid-document', 'EPUB container.xml does not name a package document.');
  const mediaType = attribute(rootfiles[0]!, 'media-type');
  if (mediaType && mediaType !== 'application/oebps-package+xml') {
    throw new BrowserTtsImportError('invalid-document', 'EPUB container.xml names an unsupported package type.');
  }
  return assertSafeArchivePath(path);
}

function parseManifest(packageRoot: XmlElement, packagePath: string, entries: ReadonlyMap<string, Entry>) {
  const manifests = elementChildren(packageRoot, 'manifest');
  if (manifests.length !== 1) throw new BrowserTtsImportError('invalid-document', 'The EPUB package must contain one manifest.');

  const manifest = new Map<string, ManifestItem>();
  for (const itemElement of elementChildren(manifests[0]!, 'item')) {
    const id = attribute(itemElement, 'id');
    const href = attribute(itemElement, 'href');
    const mediaType = attribute(itemElement, 'media-type');
    if (!id || !href || !mediaType || manifest.has(id)) {
      throw new BrowserTtsImportError('invalid-document', 'The EPUB manifest contains a missing or duplicate item field.');
    }
    const path = resolveArchiveReference(packagePath, href, `EPUB manifest item ${id}`);
    if (!entries.has(path)) throw new BrowserTtsImportError('invalid-document', `EPUB manifest item ${id} is missing from the archive.`);
    const properties = attribute(itemElement, 'properties').split(/\s+/).filter(Boolean);
    if (properties.includes('scripted')) {
      throw new BrowserTtsImportError('scripted-content', 'Scripted EPUB manifest items are not supported.');
    }
    manifest.set(id, { href, id, mediaType, path, properties });
  }
  if (manifest.size === 0) throw new BrowserTtsImportError('invalid-document', 'The EPUB manifest is empty.');
  return manifest;
}

function parseSpine(packageRoot: XmlElement, manifest: ReadonlyMap<string, ManifestItem>) {
  const spines = elementChildren(packageRoot, 'spine');
  if (spines.length !== 1) throw new BrowserTtsImportError('invalid-document', 'The EPUB package must contain one reading spine.');

  const items: ManifestItem[] = [];
  const seenPaths = new Set<string>();
  for (const itemref of elementChildren(spines[0]!, 'itemref')) {
    if (attribute(itemref, 'linear').toLowerCase() === 'no') continue;
    const idref = attribute(itemref, 'idref');
    const item = manifest.get(idref);
    if (!idref || !item) throw new BrowserTtsImportError('invalid-document', 'The EPUB spine references a missing manifest item.');
    if (item.mediaType !== 'application/xhtml+xml') {
      throw new BrowserTtsImportError('invalid-document', 'The EPUB spine contains a non-XHTML document.');
    }
    if (seenPaths.has(item.path)) throw new BrowserTtsImportError('invalid-document', 'The EPUB spine repeats a chapter document.');
    seenPaths.add(item.path);
    items.push(item);
  }

  if (items.length === 0) throw new BrowserTtsImportError('empty-document', 'The EPUB reading spine is empty.');
  if (items.length > BROWSER_TTS_IMPORT_LIMITS.chapters) {
    throw new BrowserTtsImportError('too-many-chapters', `The EPUB contains more than ${BROWSER_TTS_IMPORT_LIMITS.chapters} chapters.`);
  }
  return items;
}

function validateXhtmlElement(element: XmlElement) {
  const name = localName(element.name);
  if (DANGEROUS_XHTML_ELEMENTS.has(name)) {
    throw new BrowserTtsImportError('scripted-content', `EPUB chapter content contains unsupported <${name}> markup.`);
  }

  for (const [rawName, rawValue] of Object.entries(element.attributes)) {
    const name = localName(rawName);
    if (name.startsWith('on')) {
      throw new BrowserTtsImportError('scripted-content', 'EPUB chapter content contains an event handler.');
    }
    if (name === 'srcset') {
      throw new BrowserTtsImportError('remote-resource', 'EPUB chapter content contains an unsupported resource set.');
    }
    if (RESOURCE_ATTRIBUTES.has(name)) assertLocalDocumentReference(rawValue, `EPUB ${name} attribute`);
    if (name === 'style' && /(?:@import|url\s*\()/i.test(rawValue)) {
      throw new BrowserTtsImportError('remote-resource', 'EPUB chapter content contains a CSS resource reference.');
    }
    if (name === 'http-equiv' && rawValue.trim().toLowerCase() === 'refresh') {
      throw new BrowserTtsImportError('scripted-content', 'EPUB chapter content contains an automatic redirect.');
    }
  }

  for (const child of elementChildren(element)) validateXhtmlElement(child);
}

function findFirstElement(element: XmlElement, names: ReadonlySet<string>): XmlElement | undefined {
  for (const child of elementChildren(element)) {
    if (names.has(localName(child.name))) return child;
    const nested = findFirstElement(child, names);
    if (nested) return nested;
  }
  return undefined;
}

function collectXhtmlText(node: XmlNode, output: string[], excludedNode?: XmlElement) {
  if (node === excludedNode) return;
  if (node instanceof XmlText) {
    output.push(node.text);
    return;
  }
  if (!(node instanceof XmlElement)) return;

  const name = localName(node.name);
  if (SKIPPED_TEXT_ELEMENTS.has(name)) return;
  if (name === 'br') {
    output.push('\n');
    return;
  }
  if (BLOCK_TEXT_ELEMENTS.has(name)) output.push('\n');
  if (name === 'img') {
    const alt = attribute(node, 'alt');
    if (alt) output.push(alt);
  }
  for (const child of node.children) collectXhtmlText(child, output, excludedNode);
  if (BLOCK_TEXT_ELEMENTS.has(name)) output.push('\n');
}

function fallbackChapterTitle(path: string) {
  const filename = path.split('/').at(-1) ?? 'Chapter';
  return filename.replace(/\.(?:xhtml|html)$/i, '').replace(/[-_]+/g, ' ').trim() || 'Chapter';
}

function xhtmlChapter(document: XmlDocument, path: string): ImportedTtsChapterDraft {
  const root = document.root;
  if (!root || localName(root.name) !== 'html') {
    throw new BrowserTtsImportError('invalid-document', `EPUB spine item ${path} is not an XHTML document.`);
  }
  validateXhtmlElement(root);

  const bodies = descendants(root, 'body');
  if (bodies.length !== 1) throw new BrowserTtsImportError('invalid-document', `EPUB spine item ${path} must contain one body.`);

  const heading = findFirstElement(bodies[0]!, new Set(['h1', 'h2', 'h3']));
  const headTitle = findFirstElement(root, new Set(['title']));
  const title = normalizeImportedPlainText(heading?.text ?? headTitle?.text ?? fallbackChapterTitle(path));
  const output: string[] = [];
  collectXhtmlText(bodies[0]!, output, heading);
  return { text: output.join(''), title };
}

function archiveEntryMap(entries: readonly Entry[]) {
  return new Map(entries.filter((entry) => !entry.directory).map((entry) => [entry.filename, entry]));
}

export async function importBrowserTtsEpub(
  file: BrowserTtsImportFileMetadata,
  bytes: Uint8Array,
): Promise<BrowserTtsImportResult> {
  validateBrowserTtsImportFile(file, bytes, 'epub');
  const reader = new ZipReader(new Uint8ArrayReader(bytes), {
    checkAmbiguity: true,
    filenameValidation: 'strict',
    maxAppendedDataSize: 0,
    strictness: 'strict',
    useWebWorkers: false,
  });

  try {
    const entries = await reader.getEntries({
      checkAmbiguity: true,
      filenameValidation: 'strict',
      maxAppendedDataSize: 0,
      strictness: 'strict',
    });
    validateBrowserTtsArchiveEntries(entries.map((entry) => ({
      compressedSize: entry.compressedSize,
      directory: entry.directory,
      encrypted: entry.encrypted,
      filename: entry.filename,
      symlink: entry.symlink,
      uncompressedSize: entry.uncompressedSize,
    })));

    if (entries[0]?.filename !== 'mimetype' || entries[0].directory || entries[0].compressionMethod !== 0) {
      throw new BrowserTtsImportError('invalid-document', 'The EPUB mimetype entry must be first and uncompressed.');
    }

    const entryMap = archiveEntryMap(entries);
    for (const drmPath of ['META-INF/encryption.xml', 'META-INF/rights.xml', 'META-INF/license.lcpl']) {
      if (entryMap.has(drmPath)) throw new BrowserTtsImportError('drm-or-encryption', 'Encrypted or DRM-protected EPUB files are not supported.');
    }

    const state: ExtractionState = { extractedBytes: 0 };
    const mimetypeBytes = await readMarkupEntry(requireFile(entryMap, 'mimetype', 'The EPUB mimetype entry'), 'The EPUB mimetype entry', state);
    if (decodeBrowserTtsUtf8(mimetypeBytes, 'The EPUB mimetype entry').trim() !== EPUB_MIMETYPE) {
      throw new BrowserTtsImportError('invalid-document', 'The archive is not a valid EPUB file.');
    }

    const containerBytes = await readMarkupEntry(
      requireFile(entryMap, 'META-INF/container.xml', 'EPUB container.xml'),
      'EPUB container.xml',
      state,
    );
    const packagePath = containerPackagePath(parseEpubXml(containerBytes, 'EPUB container.xml'));
    const packageBytes = await readMarkupEntry(requireFile(entryMap, packagePath, 'The EPUB package document'), 'The EPUB package document', state);
    const packageDocument = parseEpubXml(packageBytes, 'The EPUB package document');
    const packageRoot = packageDocument.root;
    if (!packageRoot || localName(packageRoot.name) !== 'package') {
      throw new BrowserTtsImportError('invalid-document', 'The EPUB package document has an invalid root element.');
    }

    const manifest = parseManifest(packageRoot, packagePath, entryMap);
    const spine = parseSpine(packageRoot, manifest);
    const chapters: ImportedTtsChapterDraft[] = [];
    for (const item of spine) {
      const chapterBytes = await readMarkupEntry(requireFile(entryMap, item.path, `EPUB spine item ${item.id}`), `EPUB spine item ${item.id}`, state);
      chapters.push(xhtmlChapter(parseEpubXml(chapterBytes, `EPUB spine item ${item.id}`), item.path));
    }

    return createBrowserTtsImportResult('epub', chapters);
  } catch (error) {
    throw asBrowserTtsImportError(error, 'The EPUB file is malformed or unsafe.');
  } finally {
    await reader.close().catch(() => undefined);
  }
}
