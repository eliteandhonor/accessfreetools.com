# Reference

## Current Facts

- Only pasted text and local TXT import are public today.
- `prepareLocalTxtContent` rejects text over 10,000 characters without silent truncation.
- User text and filenames are excluded from analytics, logs, network requests, and Clarity.
- The current dependency tree does not include a browser EPUB or Markdown parser selected for this feature.

## Required Research Before Coding

- Compare maintained browser-capable structured parsers using primary repositories, package size, licenses, security history, and tree-shaking behavior.
- Prefer one bounded archive library that can support EPUB reading and local ZIP writing if it does not weaken isolation.
- Record the exact package versions and license decision in `docs/tts-browser-import-security.md`.

## Hostile Fixtures

- Path traversal and absolute paths.
- Excessive entries and declared or actual expanded size.
- Nested archives, encrypted entries, malformed central directory, and duplicate paths.
- EPUB scripts, event handlers, external URLs, data URLs, oversized markup, missing container/OPF, and broken spine references.
- Markdown raw HTML, links, images, code blocks, front matter, deep headings, unusual Unicode, and binary content.

## Proof To Collect

- Fixture-based unit tests, browser network trace, memory cleanup after cancel, and source-content redaction checks.
