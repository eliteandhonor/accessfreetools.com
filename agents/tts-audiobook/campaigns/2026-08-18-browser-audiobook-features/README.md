# Browser Audiobook Feature Campaign

This campaign turns four owner-requested improvements into bounded, testable agent goals:

1. Favorites and recent voices stored locally.
2. Audio duration and MP3 size estimates before model download.
3. Named, reorderable chapters with sequential MP3 generation and a local ZIP download.
4. Browser-only Markdown and EPUB import into the chapter builder.

The campaign records goals, implementation evidence, and the final release decision. Start with `campaign.json`, then read the assigned agent's five files and `completion-audit.md`.

## Command

```powershell
npm run agents:tts-feature-campaign:verify
```

The command validates agent ownership, task dependencies, required evidence, feature coverage, approval authority, documentation, and privacy invariants. It writes ignored reports under `output/agent-campaigns/tts-feature-campaign/`.

## Current State

- Campaign state: approved by the Release & Proof Judge on August 18, 2026.
- Feature implementation: deployed from commit `77c33cb6`.
- Feature tasks approved: 15 of 15.
- Production behavior: two chapter MP3s generated successfully and exposed separate MP3 plus ZIP controls on Astro 7 and Node 24.
- Index policy: intentionally unchanged at `noindex,follow`; both beta pages remain outside XML sitemaps.
