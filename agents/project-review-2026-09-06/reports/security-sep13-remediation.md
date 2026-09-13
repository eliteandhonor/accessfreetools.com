# September 13 Dependency Remediation

Owner: security; independent evaluator: release-judge; task SEC-04 approved locally.
S = `C:/Users/chamb/OneDrive/Desktop/accessfreetools-sep13-security`.
Branch `codex/security-sep13-remediation`, fresh origin/main
`b4fffbc40ac4896d9168512638da1ea26fd053c9`. Existing review, transcriber and
promotion checkouts are not part of this narrow release.

## Baseline And Scope

Fresh audit reports 11 findings: 5 moderate, 5 high, 1 critical. This is a
dependency finding, not proof of an exploited production vulnerability.
Receipt: `S/output/security-sep13/2026-09-13T03-42-39-660Z-audit-before/`.
Historical zero audits cannot clear the current release gate.

Exact patches: Astro 7.2.8, Nodemailer 9.1.1, Vitest 4.1.11, Hono 4.13.5,
js-yaml 4.3.2, Sharp 0.35.4, SVGO 4.1.0, nested adm-zip 0.6.1.
Node24, ONNX and model revisions remain unchanged. No broad audit fix or waiver.
The lock changes include required Astro compiler/Markdown and Sharp native
platform dependencies. Full build, image and application checks remain required.

Primary sources: [Astro advisory](https://github.com/advisories/GHSA-26w7-cxv4-gfx2),
[Sharp advisory](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c),
[adm-zip 0.6.1 release](https://github.com/cthackers/adm-zip/releases/tag/v0.6.1).
The September 11 adm-zip release is newer than the older advisory's no-fix note.

## Current Proof

- npm11.2.0 failed resolving optional peer sets (`edgesOut` null). Original
  lockfile remained intact. No peer bypass or lockfile deletion was used.
- Isolated `npx --yes --package=npm@11.19.1 npm install --package-lock-only
  --ignore-scripts` succeeded, audit zero. Global npm unchanged.
  Receipt `S/output/security-sep13/2026-09-13T03-48-43-779Z-lock-update-npm11/`.
- Normal existing npm11.2.0 `npm ci`, with lifecycle scripts enabled, succeeded;
  462 packages installed, audit zero. Receipt
  `S/output/security-sep13/2026-09-13T03-49-25-282Z-install/`.
- Focused dependency tests: 13 passed, including real directory-link extraction
  rejection without overwriting its sentinel, valid ZIP extraction, and a small
  owned AVIF round-trip with patched libheif. Receipt
  `S/output/security-sep13/2026-09-13T03-51-04-850Z-extraction-image-regressions/`.
- Full `npm run check` passed577tests/68files, both compilers, build, later
  layout/accessibility/schema/image/performance gates and audit0. Five inherited
  PNG/CSS soft warnings. Receipt
  `S/output/security-sep13/2026-09-13T03-51-16-349Z-full-check/`.
  Mobile SEO and110 browser smoke cases also pass. Independent local patch
  acceptance is recorded in security-sep13-patch-judge.md. Package/lock/test hashes and log hashes are
  captured in each receipt. No secret values or user media are recorded.

Real built Node runtime also passes: deterministic Ask43.2, tool API and MCP;
remote image403 without external fetches, local WebP200, server closed. Receipt
`S/output/security-sep13/2026-09-13T03-59-45-489Z-node-runtime/`.

Commit `18ebd554703667decfea3ae16301029467721693` contains only package.json,
package-lock.json, regression test and one maintenance note. PR56:
https://github.com/eliteandhonor/accessfreetools.com/pull/56
Linux quality is pending; main/deployment remain unchanged. Hostinger access
is healthy via OAuth MCP and the existing owner token, Node24/app.js/dist,
latest previous build completed September6. Missing credentials in a clean
worktree were resolved by reading the existing owner configuration only into
the command environment; no credential files or settings were changed.

Next: Linux quality, narrow release/live verification, then update the
transcriber dependencies before completing its remaining browser gates.

## Released Checkpoint

PR56 passed Linux Node24 quality in5m1s, run34737155156. Main fast-forwarded
to reviewed commit18ebd554703667decfea3ae16301029467721693, no force push.
PR records merged2026-09-13T04:13:23Z. Hostinger automatically started Git
build01a098f8-55b0-7152-8db4-7d4afe6c3ef4 at04:13:26Z and completed04:14:44Z
with Node24, app.js and dist. No second deployment, DNS or billing write.

Live Ask/API/MCP pass:34tools, parser result43.2,4MCP tools. Receipt
`S/output/security-sep13/2026-09-13T04-15-20-120Z-live-ask/`.
Production sitemap:663OK,4expectedlegacy redirects,0hard failures,0gateway
recoveries; receipt `S/output/security-sep13/2026-09-13T04-15-55-234Z-production-sitemap/`.
Homepage, Ask, Kawaii and TTS return200 with oneH1 and canonical; three sampled
client assets exactly match local bytes. Receipt
`S/output/security-sep13/2026-09-13T04-17-40-875Z-live-assets/`.
Build logs report zero vulnerabilities and completed output. They do not
contain an exact Git SHA, and public asset equality is not a server-source
attestation. RJ02 broader provenance gate remains open.

No new public routes, content, models, indexation changes, discovery submission
or purchases. S is clean. T and R remain separate unpublished product work.

## Unpublished Branch Refresh

T package pins and regression test now match the reviewed security versions;
its Mediabunny1.55.5, model revisions and transcriber scripts remain intact.
Fresh lock and lifecycle-enabled ci pass with audit0. Fullcheck1181tests/85files
passes with32selectedsourcehashesunchanged and native subtitle decoder enabled.
Receipt `T/output/browser-transcriber-pilot/integration/2026-09-13T04-13-23.618Z/report.json`;
log SHA256 `7e4b346b200691f61543d5d4d5ab6bdd818da85faeb9ad92a422b2135620f496`.
Six existing soft PNG/CSS/ASR-worker warnings remain. The four current Chrome/Edge
hour MP3/MP4 cases now pass; see transcriber-hour-matrix-2026-09-13.md. Local preview4359
was not listening, so it was restarted hidden on127.0.0.1 with the updated
built Node app (PID24376); page200/noindexfollow confirmed.

R received the same targeted dependency/test update, preserving its parse5
dependency and verified-check/build scripts. Fresh ci and full check pass:
2,503 tests in 108 files, both compilers, build and later gates, audit0.
Receipt `R/output/security-sep13/2026-09-13T04-24-41-757Z-review-full-check/`;
stdout SHA256 `81b4bafac04d4a95527f65f2db0e247b6720d52ffba172878c37e7c9615adc49`.
Five inherited soft asset warnings remain. The accessibility report explicitly
retains 55 unresolved manual checks; it does not claim conformance. The dirty
source receipt is correctly unverified. Passing development checks do not
authorize a wholesale R release. A separate exact-file correctness candidate
is being validated under the release-scope judge's recommendation.
