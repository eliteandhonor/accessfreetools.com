# Worklog

Append dated gate, result, evidence path, and approval or blocker. Do not rewrite prior entries.

- 2026-07-29: Campaign initialized with REL-01 blocked on dependency and full-check proof.
- 2026-07-29: Security worktree commit `725fb610` upgraded Astro integrations, MCP SDK, React patches, Playwright, and targeted vulnerable transitive packages without audit waivers.
- 2026-07-29: The security worktree passed TypeScript 7 and 6, 401 tests, Astro 7 on Node 24 build, all site/image/accessibility/security gates, and `npm audit --audit-level=moderate` with zero vulnerabilities.
- 2026-07-29: Added a cross-platform manifest comparison test so CRLF checkout differences do not create a false stale-art failure. No manifest or artwork was changed.
- 2026-07-29: SEC-01 remains `evidence_ready` until the dependency commit is integrated into the recovery branch and the combined full gate passes.
- 2026-07-29: Integrated security commit `725fb610` into the recovery branch. Combined `npm run check` passed 45 test files and 430 tests, Astro 7 on Node 24 build, metadata, visual, accessibility, structured-data, performance, AI-asset, art, gallery, secret, and dependency gates.
- 2026-07-29: `npm audit --audit-level=moderate` reports zero vulnerabilities. Local sitemap proof contains 655 canonical public URLs with no HTML sitemap leak; indexing protection reports zero high issues and zero warnings.
- 2026-07-29: Production sitemap check passed 659 live URLs with zero hard failures before release. Existing soft asset-size warnings remain non-blocking.
- 2026-07-29: Verified the original `codex/bluesky-medium-promotion-july18` checkout still contains exactly its two modified editorial data files and three untracked Browser AI article assets. No dirty file entered this release.
- 2026-07-29: Approved EV-01 through EV-03, IDX-01, IDX-02, CTR-01, MKT-01, WRT-01, and SEC-01. REL-01 is evidence-ready pending commit, push, and deployment proof.
- 2026-07-29: Pushed recovery commit `12bbde40` and live-check hardening commit `bb08ab8f` to the recovery branch and fast-forwarded `main` without force-pushing.
- 2026-07-29: Hostinger deployment `019fad09-3752-7238-b655-e244c1b6785e` completed with Astro 7, Node 24, `dist`, and `app.js`. The deployment log reports zero dependency vulnerabilities.
- 2026-07-29: The final combined local gate passed 46 test files and 435 tests plus both TypeScript checks, build, site, visual, accessibility, structured-data, performance, AI-asset, artwork, gallery, secret, and dependency gates.
- 2026-07-29: External Chrome loaded the Percentage Calculator, Ask page, and Download Time Calculator with their real H1s and controls. An independent external web fetch also loaded the homepage and Percentage Calculator.
- 2026-07-29: Regional command-line checks from the Sydney route received repeated Hostinger CDN 504 responses after a Node restart and cache purge, despite the healthy deployment record and external browser proof. The production checker now retries bounded 502/503/504 responses, rejects same-URL redirects, and fetches sitemap documents sequentially.
- 2026-07-29: REL-01 and OPS-01 remain blocked until a fresh regional production-sitemap and Ask audit pass. No rollback was performed because the failure is isolated to the Hostinger CDN path and the prior code contains known dependency vulnerabilities.
