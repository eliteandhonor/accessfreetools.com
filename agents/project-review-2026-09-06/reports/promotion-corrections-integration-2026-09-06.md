# Promotion Corrections Integration

September 6, 2026. Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`, branch `codex/gpt6-review-implementation`, HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25` with preserved local changes. This report supplements, not replaces, the earlier 2,111-test integration.

## Corrections

The independent [initial rejudge](promotion-pr01-pr02-rejudge.md) found two defects. Missing Pinterest pagination metadata could be normalized to an end marker and wrongly satisfy completeness. Valid HTML-escaped article-source URLs could fail equality with their source ledger.

- The Pinterest parser now preserves unknown metadata as null. Both initial HTML and paginated JSON carry explicit `paginationComplete` evidence. Ambiguous feeds stay unknown. The scanner propagates that flag, refuses incomplete imports, and the channel consumer admits only consistent, explicitly completed board counts. Older reports without this evidence remain missing, not upgraded by a fresh wrapper.
- The editorial checker now uses parsed HTML attribute values through exact development dependency `parse5@7.3.0`, already present at that version in the lockfile. It decodes named and numeric entities once before the unchanged HTTPS/credential/destination checks. No article copy, source claim, owner approval or publication record was invented.

## Verification

All log and snapshot paths here are under `output/project-review-followup/integration/`.

| Evidence | Result |
| --- | --- |
| `promotion-rejudge-red.log` | 24 failed, 66 passed before fixes. Includes actual false-pass and escaped-link regressions plus assertions of the new completion field. |
| `promotion-rejudge-green.log` | 104 passed in three files. |
| `promotion-rejudge-focused.log` | 138 passed in seven files after additional unknown-feed and legacy-summary controls. |
| `promotion-parser-lock.log` | Lockfile-only, ignore-scripts update completed; audit found zero vulnerabilities. No broad dependency upgrade. |
| `check-promotion-corrections.log` | Full `npm run check` exit 0: both TypeScript lanes, **2,146 tests in 99 files**, build, links, site, editorial, visuals, accessibility, schema, performance, lazy assets, images, galleries, secrets and zero-vulnerability audit. |
| `source-snapshot-promotion-security-rejudge.json` | 121 source/test/config hashes, no drift after the full check and subsequent channel review. Same HEAD. |
| `four-channel-review-corrections.log` | Exit 1 intentionally: incomplete Pinterest proof. Other three channels pass their local command checks. |
| `marketing-orchestrator-corrections.log` | Exit 1 intentionally: retains incomplete Pinterest proof. Cached DataForSEO is labeled cached, not a fresh account check. |

The full run used process-local `VITEST_MAX_WORKERS=4` without changed assertions, timeouts or skipped tests. It includes 674 HTML pages, 1,984 JSON-LD blocks, seven articles at four viewports, 15 key-page views, 27 automated axe cases, 608 art entries, 609 image-sitemap entries and 12 gallery categories. Existing soft size warnings and 55 manual axe findings remain visible; passing automation is not complete accessibility conformance.

The independent [correction rejudge](promotion-pr02-correction-rejudge.md) additionally executes real entrypoint fixtures and checks the source snapshot. Its exact task decisions are authoritative. This integration report never grants publication or whole-campaign approval.

At 08:44:54 UTC the independent Release Judge reviewed terminal integration evidence and explicitly approved **PR-01 and PR-02 only**. The coordinator transcribed those decisions into the manifest and task board with `approvedBy=release-judge`. G7, publication, deployment and overall completion were explicitly excluded.

## Fresh Pinterest Evidence

The scan at `2026-09-06T08:42:15.337Z` fetched six boards and counted 313 Pins. It exposes zero app destinations and 313 missing-destination skips. Only **one** board supplied an explicit terminal marker; five remain unknown. Zero hard issues and process exit zero do not make that a complete proof report. The new code correctly returns `missing`.

The three earlier [Chrome Pin observations](pinterest-live-sample-2026-09-06.md) remain exact positive samples only. They do not establish the other 310 destination links, missing pagination, custom alt text or account-wide health. No Pin, story, queue row, account, consent setting or advertisement was changed.

## Remaining Work

The [transcriber follow-up](transcriber-download-fixture-followup.md) separately records a corrected one-hour MP3 fixture, 711 passing tests and failed Edge/Chrome model-download runs. No transcriber compatibility, privacy, beta or release approval follows from the main-site check.

Remaining security, operations, independent task judgements, real-device and durable-production evidence keep the overall objective open. No commit, push, deployment, indexing request, paid research, purchase, global-memory edit or public promotion occurred in this follow-up. The original dirty promotion checkout was not edited.
