# Operations And Release Review

Reviewed on 2026-09-06 against origin/main `90d6dcab0580a91ca66382f2414d95e8817469e5` in the isolated review worktree. This is a bounded cross-project review, not proof that every line or production feature is correct.

## Confirmed Findings

### OPS-1: The current release gate is blocked by dependency findings (P1)

`npm ci` succeeded on Node v24.20.0, but the complete `npm run check` exited 1 at its final security audit. `fast-uri@4.1.2` and `qs@6.15.3` have current advisories. npm counts three affected package nodes because `ajv` is affected through fast-uri: two high and one moderate. This is a confirmed dependency/release finding, not a demonstrated exploit of this site.

Evidence: `output/gpt6-project-review/full-check.log`, `output/gpt6-project-review/dependency-audit.json`, package.json overrides, and the specialist privacy/security report. The maintained advisories name patched versions [fast-uri 4.1.3](https://github.com/advisories/GHSA-5jgf-p345-68v8) and [qs 6.16.0](https://github.com/advisories/GHSA-x5fp-wj9c-mxmx). Do not use a broad audit fix or waive the gate.

Completion: narrow dependency updates, both compiler lanes, regression tests and full check pass with zero moderate-or-higher findings. A separate authorized deployment then needs live runtime and sitemap proof.

### OPS-2: Runtime health is not deployed-source proof (P2)

`scripts/lib/hostinger-build-status.mjs:32` summarizes the build UUID, state, Node version, entry file, output directory and dates but not a source revision. `scripts/hostinger-node-deploy.mjs:59` records deployment options, not the tested Git SHA. A completed build therefore does not establish that a reviewed SHA reached production.

Fresh read-only Hostinger evidence confirms a completed September 2 Git build on Node 24 with app.js and dist. Live Ask returned the deterministic result 43.2 for 18% of 240; the API advertised 34 runnable tools and MCP returned four methods. The production sitemap check reported 663 OK and zero hard failures. None of these observations proves an exact deployed SHA.

Task: bind release proof to the tested revision and verify a non-sensitive build identifier after deployment. Use existing deployment/report paths; do not add a new public API just for this. Test stale build IDs and mismatched revisions as failures. Preserve Node 24 and Astro 7.

### OPS-3: Automation instructions and worktree-local evidence need reconciliation (P2)

Read-only inventory of existing automation.toml files found the active editorial task still names OCR on August 26 and Writing Tells on September 23 as remaining work. Both routes already exist on current main. The SEO heartbeat still emphasizes July 29 and the elapsed August 12/26 windows. Daily tasks point at the dirty July 18 promotion checkout, not this clean current-main checkout.

This is a stale-instruction and evidence-location risk, not proof of a duplicate publication. Existing dedupe gates can prevent a duplicate. Do not create more overlapping schedules. Reconcile existing schedules through the automation tool after the relevant task is approved, preserving notification policy and pause states. Keep the active four-channel policy and never treat a past date as publishing approval.

There are multiple legitimate feature worktrees. The transcriber worktree is dirty and unpublished; it must not be reported as part of main or production. Fetch also emitted non-fatal stale-worktree-metadata permission warnings. Do not delete folders or prune worktrees without verifying ownership and protected evidence.

## Fresh Verification

- Both TypeScript lanes passed.
- 565 Vitest tests in 68 files passed.
- Build, internal links, site metadata, structured data, article quality, image QA and image sitemap checks passed.
- Article geometry: seven articles across four viewports passed.
- Key-page geometry: 15 page/viewport pairs passed.
- Automated accessibility: 27 page/viewport pairs passed.
- Browser functional/accessibility smoke: 110 tests passed using port 4398; preview cleanup completed.
- Lazy assets: 665 non-AI pages and nine AI initial loads requested no model assets before user action.
- Full check failed only at dependency audit; do not label the full gate passed.
- Live sitemap: 663 OK, four redirects among supplemental checks, zero hard failures.
- DataForSEO: initial September 6 checks returned an IP allowlist error. The owner corrected the address, and the 02:03:11 UTC environment check now reports healthy with a fresh US$10.92 balance. No paid research calls made. The earlier stale-live reporting behavior remains a valid regression case, not a current connection blocker.
- OpenSEO tools were not callable in this review session. Keyword/competitor conclusions remain unavailable.

## Measurement Limits

Fresh production aggregates returned 42 visitors, 68 page views and 244 tool actions in the requested 30-day range. The 90-day report had the same aggregate totals. The storage interval/continuity is not independently proven, so do not compare these with older larger counts as a traffic decline. Owner exclusion is configured, but this does not establish perfect exclusion for all historical browsers.

Four in a Row has zero measured starts in the available report. Its earliest review is September 7 and its threshold is 100 measured starts. Neither another game nor a Games category is justified. No local QA events were used as demand evidence.

Downloads currently contains August 26 as the newest matching GSC/Bing/CrawlScout files. Do not replace newer normalized September 2 artifacts with these older exports. The search specialist owns report reconciliation and metric-validity findings.

## Scope And Commands

Reviewed package scripts, CI quality workflow, deployment scripts, runtime-status summarizer, deployment/analytics docs, worktree state, automation configuration, and fresh reports. Ran npm ci, npm run check, npm audit --json, node scripts/run-playwright-smoke.mjs, npm run check:production-sitemap, npm run check:live-ask. Ran current-main read-only automation-env, Hostinger, production analytics, game report, aft status/indexing-gaps/proof-check and marketing commands with the original cwd to access local credentials; report provenance must retain that cwd distinction.

Not performed: deployment, rollback, purchases, ad clicks, public posting, Search Console requests, paid research, mobile-device certification, or an exhaustive external penetration test. Existing automation settings and product source are unchanged.

## Final Workspace Check

The primary checkout's final dirty source/file list matches the starting inventory. A browser MCP probe generated one 414-byte console diagnostic in that checkout; the coordinator copied it into ignored review output, verified matching SHA-256, and removed only that exact newly generated file. No pre-existing file was removed or reverted. The five reviewed transcriber file hashes still match the browser-products report. The review branch has no tracked product diff; its only authored files are this campaign.
