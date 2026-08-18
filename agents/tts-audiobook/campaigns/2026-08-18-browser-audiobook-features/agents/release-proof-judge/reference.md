# Reference

## Required Final Commands

```powershell
npm run agents:tts-feature-campaign:verify
npm run tts:browser-check
npm run tts:voice-check
npm run typecheck
npm run typecheck:ts6
npm test
npm run build
npm audit --audit-level=moderate
npm run check
```

## Required Browser Proof

- Installed Chrome and Edge complete local import, chapter edit/reorder, one-worker generation, individual MP3 download, and ZIP download.
- Network sentinel finds no unique canary text, title, filename, archive bytes, or audio in URLs, request bodies, logs, analytics, or Clarity.
- Desktop, tablet, and 390px layouts pass overflow and interaction checks.
- Axe, keyboard-only, status announcements, reduced motion, cancellation, retry, and navigation cleanup pass.
- MP3 and ZIP contents are independently inspected.

## Release Rules

- Keep the feature beta noindexed until the full feature release is live-stable and separately approved for indexability.
- Deploy only on Astro 7 and Node 24.
- Roll back on privacy leakage, OOM, stuck worker, invalid archive/audio, hard accessibility failure, broken sitemap, or regression to the existing generator.
- Search Console and IndexNow are out of scope until a separate indexability gate passes.
