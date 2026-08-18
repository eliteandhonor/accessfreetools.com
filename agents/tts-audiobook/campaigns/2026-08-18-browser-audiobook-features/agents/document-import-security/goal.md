# Goal

Let users turn local Markdown and EPUB documents into editable chapters without sending the original document anywhere.

## Outcomes

- Accept `.md`, `.markdown`, and valid EPUB files through explicit local file selection.
- Extract ordered, named, plain-text chapters.
- Show extracted chapters for review before any model download.
- Reject unsafe, malformed, encrypted, or oversized input with a clear local error.
- Forget raw file bytes after extraction and cancellation.

## Not In Scope

- PDF, DOCX, URLs, remote images, embedded media, CSS rendering, DRM bypass, cloud libraries, or storing recent documents.
