# EV-04 Analytics Coverage Implementation

Date: 2026-09-06. Branch: `codex/gpt6-review-implementation`.
Source HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`.
Worktree: `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review`.
Status: bounded local implementation verified; independent approval and durable production continuity remain pending. No campaign/task/worklog state was edited.

## Scope And Decisions

Read repository AGENTS, campaign AGENTS, evidence tasks EV-04/EV-05, `docs/analytics-dashboard.md`, and the privacy-security report PS-04, PS-05, PS-H1. Also inspected the analytics API, selected-tool aggregation, production collector, direct usage-notes consumer, and the indexing/marketing consumer boundary. The latter files remain with their assigned owner.

High-confidence source/fixture findings: the 16 MiB tail can omit persisted events before 25 MiB rotation; 120,000-event reads can omit older visitor history; URL normalization previously occurred after private-route checks. These can produce incomplete totals or private-dashboard traffic. No claim is made that production reached any limit or suffered a measured incident.

The minimal selected fix keeps bounded tails and reports their limitations. It does not implement an unbounded scan, an invented exact-lifetime aggregate, or a new destructive retention policy.

## Exact Changes

| File / location | Behavior |
| --- | --- |
| `src/lib/siteAnalytics.ts:69` | Adds coverage status/reasons, requested and observed dates, read counts/limits, retained-only allTime scope, observed-only visitor classification, unknown deployment continuity, and comparisonsAllowed=false. |
| `src/lib/siteAnalytics.ts:155` | Normalizes relative/absolute/protocol-relative paths, removes query/hash information, decodes bounded encoded variants, resolves dot/separator variants, and excludes admin/API/MCP/private-analytics route segments. Public similarly named routes remain countable. |
| `src/lib/siteAnalytics.ts:351` | Keeps the 16 MiB per-file bound; records actual read length, omissions, short reads, descriptor changes and errors. Correctly drops an incomplete leading line. |
| `src/lib/siteAnalytics.ts:514` | Retains at most 120,000 events from at most 32 files. Parses tails backwards without a newline-array allocation, flags damaged/unread history, excludes historical private-path records, and compares file listings/metadata before and after reads to detect concurrent writes/rotation. |
| `src/lib/siteAnalytics.ts:634` | Requested summaries exclude future records. Observed first/last dates are separate from requested dates. Fully read retained files still do not prove collection continuity or lifetime history. |
| `src/components/BaseLayout.astro:199` | Only the first-party tracker's route exclusion changed. Clarity loader, its settings, ads, and the existing Clarity custom-event dispatch code were not edited. |
| `src/pages/admin/analytics.astro:44` | Adds visible partial/unknown coverage, reasons and observed/requested dates; labels visitor classifications as first/earlier seen in this read. The legacy dashboard uses this same page. |
| `scripts/lib/production-analytics-report.mjs:14` | Preserves coverage through identifier stripping; missing legacy metadata becomes unknown without treating fetch time as the observation date. |
| `scripts/lib/usage-data-asset-report.mjs:44` | Exact downstream analytics consumer preserves coverage/dates/reasons and blocks editorial readiness when coverage/continuity is unverified, even above count thresholds. Draft wording distinguishes requests and retained observations from full-period totals. |
| `docs/analytics-dashboard.md:118` | Documents the existing archive-mtime retention policy, indefinite small-active-log possibility, limits, compatibility fields and outstanding production gate. |

Added tests/helpers: `tests/analytics/coverage.test.ts`, `tests/analytics/privatePaths.test.ts`, `tests/analytics/dashboardCoverage.test.ts`, `tests/analytics/browserCoverage.mjs`. Extended `scripts/lib/production-analytics-report.test.mjs` and `scripts/lib/usage-data-asset-report.test.mjs`. This report is the only campaign file authored.

## Executed Evidence

TDD red, before implementation:

```powershell
npm.cmd test -- tests/analytics/coverage.test.ts tests/analytics/privatePaths.test.ts scripts/lib/production-analytics-report.test.mjs
```

Result: 63 failed / 13 passed. Failures reproduced missing coverage metadata and private-route counting. The dashboard/usage-consumer red run subsequently reproduced 5 failures / 2 passes with:

```powershell
npm.cmd test -- tests/analytics/dashboardCoverage.test.ts scripts/lib/usage-data-asset-report.test.mjs
```

Final focused regression command:

```powershell
npm.cmd test -- tests/analytics/coverage.test.ts tests/analytics/privatePaths.test.ts tests/analytics/dashboardCoverage.test.ts tests/analytics/siteAnalytics.test.ts src/lib/siteAnalytics.test.ts src/lib/aftToolAnalytics.test.ts tests/api/analyticsEvents.test.ts scripts/lib/production-analytics-report.test.mjs scripts/lib/usage-data-asset-report.test.mjs
```

Result: **9 files / 101 tests passed**, exit 0, Vitest 4.1.10, Node 24.20.0. Final run at 15:30:59 local, 3.69 seconds. Coverage includes exactly 16 MiB, 16 MiB+1, 25 MiB active/archive, 120,000/120,001 events, unread archives, 32-file bound, empty logs, malformed records, I/O failures/short reads, both pre-open and open-descriptor rotation, returning visitors across omitted/full history, old active records, archive-mtime expiry, future records, ingestion and historical private-route exclusion, and public-count preservation without owner configuration.

```powershell
node tests/analytics/browserCoverage.mjs
```

Result: exit 0. Isolated headless Chrome 152.0.7977.83 rendered the actual dashboard markup/inline code with existing CSS at 1440x1000 and 390x844 for partial, unknown and legacy synthetic responses. Six renders: no horizontal overflow, adjacent-section overlap or page errors. Eight actual tracker routes exercised page views and custom actions, with private routes producing no beacons and the public route producing both events. All network requests were fulfilled/aborted locally, and beacons were stubbed; no production endpoint was contacted. Mobile screenshot visually inspected.

Synthetic screenshots: `output/project-review-followup/EV-04/dashboard-{partial,unknown,legacy}-{1440,390}.png`. The fixture renders source sections rather than a built Astro deployment; this is not full-page SSR/release proof.

Focused TypeScript API check (`node --input-type=module -e`, `ts.createProgram`) covered `src/lib/siteAnalytics.ts` and the three new TypeScript test files with `noEmit`, `strict`, ES2022, ESNext/Bundler resolution, Node types and `skipLibCheck`: **0 diagnostics**, exit 0.

Direct `transform` checks on both modified Astro files using the installed `@astrojs/compiler-rs` returned **[] diagnostics**, exit 0. An initial attempt using the old `@astrojs/compiler` package name failed with ERR_MODULE_NOT_FOUND; inspection of the installed Astro 7 package identified compiler-rs. No installation was attempted. Scoped `git diff --check` passed; Git emitted only its existing LF-to-CRLF conversion notices.

## Retention And Safety

No retention constants or destructive policy were changed. The active file rotates by size before an append when it is already >=25 MiB. Existing pruning deletes archive-name files whose modification age is over 90 days, on rotation and report reads. It does not expire events in the active file by timestamp. Small active logs and recent archives can retain old events; tests prove this in synthetic storage only.

Every event-log test used a unique OS-temp fixture directory, a process-local directory override, disabled real config discovery, and a guarded event-file open. Cleanup checks the resolved fixture path before recursive removal. No real logs were read, modified or deleted. No new production continuity assertion was added.

All pre-existing and concurrent dirty work was preserved. No indexing/marketing/aft files, package/lock files, campaign manifests, shared worklogs or task lists were edited. No install, build, full check, live analytics command, submission, publication, deployment, spending or commit occurred.

Inspect-only provenance hygiene: the loopback service inspected both changed Markdown documents, with 0 suspicious findings and 0 Layer A hits across 2 supported files, 0 unsupported/skipped/errored files. No cleaning, disclosure removal or prose rewrite was performed. A prose-only rewrite is a separate optional review, not evidence of human authorship; statistical/media watermark detection is outside this inspection.

## Remaining Gate And Handoff

Owner/release reviewer: before period comparisons or public usage claims, attach dated proof of the actual durable production storage location, stable visitor salt/configuration, retention/rotation history and aggregate survival across deployments for the exact requested interval. Observation endpoints alone do not establish absence of gaps. Missing history stays unknown; full interval/lifetime totals are not asserted by this patch. Private-route production deployment and independent release review remain unperformed.

Integration owner: indexing/marketing consumers in `scripts/lib/agent-tools-report.mjs`, and the EV-05 game/pilot decision consumers, were inspected or identified but not edited. They must consume `summary.coverage`, preserve reasons/dates, and respect unknown/partial continuity before making interval comparisons or readiness claims. The production aggregate and direct usage-notes lane now expose/block this correctly; this report does not claim those separately owned consumers are closed.

Acceptance achieved locally: all required size/event/private-path boundaries either count their retained observations correctly with explicit scope or expose partial/unknown reasons and dates; client/server exclusions work without owner-IP settings; dashboard/production report propagation and usage-notes blocking pass. Acceptance still pending: authorized production continuity evidence and independent release approval. PS-H1 event-age deletion remains an owner policy decision, not an implementation silently added here.
