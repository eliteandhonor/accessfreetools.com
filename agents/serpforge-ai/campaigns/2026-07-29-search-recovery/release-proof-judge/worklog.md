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
