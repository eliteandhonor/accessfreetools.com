# Browser TTS Document Import Security

Last reviewed: 2026-08-18

## Decision

Markdown and EPUB import must run entirely in the visitor's browser. The parser receives explicit file bytes from a browser file picker and returns ordered, named, plain-text chapters. It does not upload the original, fetch linked resources, render imported HTML, start a speech model, or store document content.

This parser layer is independent of the chapter editor. The chapter integration may adapt its output, but it must keep the limits and security checks in this document.

## Pinned Parsers

| Package | Version | Purpose | License | Primary source |
| --- | ---: | --- | --- | --- |
| `mdast-util-from-markdown` | `2.0.3` | CommonMark to mdast syntax tree | MIT | https://github.com/syntax-tree/mdast-util-from-markdown |
| `mdast-util-to-string` | `4.0.0` | Plain text from validated mdast nodes | MIT | https://github.com/syntax-tree/mdast-util-to-string |
| `micromark-extension-frontmatter` | `2.0.0` | Structured YAML/TOML front-matter recognition | MIT | https://github.com/micromark/micromark-extension-frontmatter |
| `mdast-util-frontmatter` | `2.0.1` | Front-matter mdast nodes that can be omitted safely | MIT | https://github.com/syntax-tree/mdast-util-frontmatter |
| `@rgrove/parse-xml` | `4.2.3` | Strict XML/XHTML object trees in browsers | ISC | https://github.com/rgrove/parse-xml |
| `@zip.js/zip.js` | `2.8.52` | Lazy ZIP metadata and bounded EPUB entry reads | BSD-3-Clause | https://github.com/gildas-lormeau/zip.js |

The versions were checked through the primary npm registry and repositories on 2026-08-18. All are exact production pins. `@rgrove/parse-xml` has no dependencies. zip.js exposes encrypted-entry, compressed-size, expanded-size, symlink, CRC, strict filename, and archive-ambiguity information before or during extraction. The integration must load the EPUB parser only after the user selects an EPUB so it does not increase unrelated page bundles.

## Limits

| Resource | Limit |
| --- | ---: |
| Markdown file bytes | 64 KB |
| EPUB file bytes | 8 MB |
| ZIP entries | 256 |
| One expanded ZIP entry | 2 MB |
| Total declared or actual expanded bytes | 16 MB |
| Container, OPF, or one XHTML entry | 512 KB |
| Compression ratio | 100:1 for entries of at least 64 KB |
| Chapters | 100 |
| One chapter | 10,000 characters |
| All imported chapters | 10,000 characters |

The aggregate character limit matches the current speech-generation limit. The parser rejects excess input. It never truncates it.

## Security Contract

The browser must treat filenames, MIME types, file bytes, ZIP headers, archive paths, XML, XHTML, and Markdown as attacker-controlled.

### Both formats

- Require the expected extension, accepted MIME type, explicit byte length, and exact match between selected-file size and bytes read.
- Decode with fatal UTF-8 handling. Reject null bytes, malformed UTF-8, and excessive binary control characters.
- Return normalized plain text only. Do not return HTML nodes or a renderable document fragment.
- Reject external schemes, protocol-relative URLs, `data:`, `blob:`, `file:`, and `javascript:` references.
- Never call `fetch`, create an image element, resolve a URL against the network, or send document data to analytics, Clarity, logs, storage, or a model host.
- Keep raw bytes and parser trees in function scope. The caller must release its `File`, `ArrayBuffer`, chapter text, and cancellation state when import is replaced or canceled.

### Markdown

- Parse CommonMark into mdast. Do not interpret Markdown with regular expressions or convert it to HTML.
- Recognize YAML and TOML front matter structurally, then omit it from narration.
- Reject every raw HTML node instead of sanitizing and rendering it.
- Validate link, image, and definition URLs. Local references contribute text only and are never opened.
- Use the document's H1/H2 structure for chapter names. Preserve lower headings, lists, quotes, code, and Unicode as plain text.

### EPUB

- Open ZIP data with strict archive parsing, strict filename validation, ambiguity checks, no appended data, CRC checks, overlapping-entry checks, and web workers disabled.
- Check entry count, paths, duplicate case-folded paths, encryption, symlinks, nested archives, compressed bytes, expanded bytes, and compression ratio before reading markup.
- Require the EPUB `mimetype` entry first, stored without compression, and equal to `application/epub+zip`.
- Reject `META-INF/encryption.xml`, `META-INF/rights.xml`, `META-INF/license.lcpl`, encrypted entries, and encrypted central directories. The feature does not bypass DRM.
- Require one valid `META-INF/container.xml`, one package document, one manifest, one linear spine, present manifest resources, and valid XHTML spine references.
- Reject XML document types and processing instructions. External DTDs and custom entity expansion are not accepted.
- Reject scripts, inline event handlers, forms, frames, objects, embeds, templates, automatic redirects, resource sets, remote URLs, data/blob URLs, and CSS `url()` or `@import` references.
- Walk XHTML as an XML object tree. Read body text and useful image alt text only. Never render imported XHTML.

## Module API For Integration

`src/lib/browserTtsImport.ts` exports:

- `BROWSER_TTS_IMPORT_LIMITS`
- `BrowserTtsImportError`
- `BrowserTtsImportErrorCode`
- `BrowserTtsImportFileMetadata`
- `BrowserTtsImportFormat`
- `BrowserTtsImportResult`
- `ImportedTtsChapter`
- `ImportedTtsChapterDraft`
- `validateBrowserTtsImportFile(file, bytes, format)`
- `decodeBrowserTtsUtf8(bytes, label)`
- `normalizeImportedPlainText(value)`
- `createBrowserTtsImportResult(format, drafts)`
- archive path, reference, metadata, and markup limit helpers used by the EPUB parser

Format entry points:

```ts
import { importBrowserTtsMarkdown } from './browserTtsMarkdownImport';
import { importBrowserTtsEpub } from './browserTtsEpubImport';

const markdown = importBrowserTtsMarkdown(fileMetadata, bytes);
const epub = await importBrowserTtsEpub(fileMetadata, bytes);
```

Both return:

```ts
interface BrowserTtsImportResult {
  format: 'markdown' | 'epub';
  chapters: Array<{
    id: string;
    title: string;
    text: string;
    order: number;
    characterCount: number;
  }>;
  totalCharacters: number;
}
```

IDs are deterministic within one import, such as `import-epub-001`. They are local handoff IDs, not persistent document identifiers.

## Verification

Focused tests cover friendly documents, Unicode, front matter, raw HTML, links and resources, malformed UTF-8, binary controls, oversized text, too many chapters, traversal metadata, duplicate paths, nested archives, encryption, DRM markers, declared expansion, compression ratio, malformed ZIP/container/OPF/spine data, scripts, event handlers, document types, remote resources, text-only output, and a fetch sentinel.

Run:

```powershell
npx vitest run --configLoader runner src/lib/browserTtsImport.test.ts src/lib/browserTtsMarkdownImport.test.ts src/lib/browserTtsEpubImport.test.ts
npm run typecheck
npm run typecheck:ts6
npm audit --audit-level=moderate
```

## Residual Risks And Integration Gates

- No UI, browser file picker, cancellation flow, memory soak, or real-browser network trace is part of this parser-only change. Those remain integration gates.
- Strict UTF-8 XML and rejection of DTDs, processing instructions, inline styles with resources, scripting, forms, and external links will reject some older or unusually authored EPUBs. The error must be shown as an unsupported document, not silently bypassed.
- The 8 MB file and 16 MB expanded limits will reject image-heavy books even when their text is short. Raising either limit requires measured browser memory evidence.
- The ZIP package is capable of features this tool does not expose, including encryption and archive writing. Keep imports scoped to reader APIs and lazy-load the EPUB module.
- Local linked resources may be named in a valid EPUB, but the parser never opens or renders them. Only spine XHTML is extracted.
- A unit-test fetch sentinel proves these functions do not initiate network requests. The product integration still needs a browser request sentinel proving document bytes, titles, chapter text, and filenames do not leave the page.
- Imported text remains sensitive while it is held in the active page. Integration must keep it Clarity-masked, out of analytics, out of local storage, and clear it on cancel, replacement, or page close.
