# Browser TTS Agent Rules

This workspace coordinates product work for the browser-only Text to Speech Audiobook Generator. It is private engineering documentation, not public copy.

## Required Reading

- `../../docs/tts-audiobook-pilot.md`
- `../../docs/brand-code.md`
- `../../docs/analytics-dashboard.md`
- `../../docs/google-search-central-notes.md`
- `../../AGENTS.md`

## Product Boundary

- All text, TXT, Markdown, EPUB, chapter, and generated-audio processing stays in the visitor's browser.
- No account, server storage, hosted inference, paid API, VPS, purchase, or original-document upload is allowed.
- Local storage may contain bounded validated voice IDs only. It must never contain text, chapter content, filenames, document titles, or audio.
- Keep one speech model worker loaded at a time. Chapter generation is sequential and cancelable.
- Keep 128 kbps MP3 as the output format. ZIP is only a local package of separate MP3 chapter files.
- Do not raise the current 10,000-character aggregate limit until a measured browser-memory and runtime task proves a higher bounded limit is safe.
- Do not change the current `noindex,follow` beta policy or sitemap membership without a separate Release & Proof Judge decision.

## Status And Approval

Allowed task states are `planned`, `in_progress`, `evidence_ready`, `approved`, and `blocked`.

- Feature owners may move their own work through `evidence_ready`.
- Only the Release & Proof Judge may set `approved`.
- A worklog is append-only. Corrections are new dated entries, not rewrites of earlier entries.
- Source code, screenshots, reports, and commands must be named before a completion claim.
- Missing browser, privacy, accessibility, or memory evidence means `not enough data`, not a pass.

## Campaign

The active campaign is `campaigns/2026-08-18-browser-audiobook-features/`. Its `campaign.json` is the machine-readable source of truth; the task board is the human view.
