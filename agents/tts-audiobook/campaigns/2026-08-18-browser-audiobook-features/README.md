# Browser Audiobook Feature Campaign

This campaign turns four owner-requested improvements into bounded, testable agent goals:

1. Favorites and recent voices stored locally.
2. Audio duration and MP3 size estimates before model download.
3. Named, reorderable chapters with sequential MP3 generation and a local ZIP download.
4. Browser-only Markdown and EPUB import into the chapter builder.

The campaign creates goals and proof gates. It does not claim the features are implemented. Start with `campaign.json`, then read the assigned agent's five files.

## Command

```powershell
npm run agents:tts-feature-campaign:verify
```

The command validates agent ownership, task dependencies, required evidence, feature coverage, approval authority, documentation, and privacy invariants. It writes ignored reports under `output/agent-campaigns/tts-feature-campaign/`.

## Current State

- Campaign setup: ready for deterministic verification.
- Feature implementation: not started.
- Feature tasks approved: 0.
- Production behavior: unchanged.
- Index policy: unchanged.
