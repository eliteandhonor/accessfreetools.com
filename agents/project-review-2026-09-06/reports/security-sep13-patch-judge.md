# September 13 Dependency Patch Judge

## Verdict
- ACCEPT the exact local S dependency-remediation snapshot below. No concrete required source/test fix was found in this bounded independent review. This is not production, deployment, transcriber/TR03, or whole-goal approval.
- S = `C:/Users/chamb/OneDrive/Desktop/accessfreetools-sep13-security`; reviewed against HEAD `b4fffbc40ac4896d9168512638da1ea26fd053c9`. Scope: package.json, package-lock.json, scripts/lib/security-dependency-overrides.test.mjs, plus the subsequently added docs/security-dependencies-2026-09-13.md. Read-only supporting caller/configuration and saved harness/receipt inspection; no application changes by this judge.
- Baseline audit: 11 affected-package entries (5 moderate, 5 high, 1 critical), not eleven proven exploitable application paths. Current independently executed audit reports zero. Neither result demonstrates compromise or universal exploit absence.

## Immutable Source Binding
SHA256, unchanged at final inspection and matching the full-check before/after receipt:
- package.json: `62a9ed533acd39373d2355e7b8220bb517114e45aa7cc0aa53b7d89499a124d5`
- package-lock.json: `e5bd9fe9f77496b0ddd789935b9b5b4254d80aac15496f3552c4836ea77d095a`
- scripts/lib/security-dependency-overrides.test.mjs: `3ea3673c7be683861ec22950c7dd577efa81f54db1b19335450846c9092829d4`
- Docs-only addition, reviewed after fullcheck, not represented as covered by that earlier run: `e502eaf985e8cb3edd6e905f3dfdddfb73383aa636e043a08a277388f13dc6d5`.

## Exact Diff
- Exact targets: Astro 7.2.8, Nodemailer 9.1.1, Vitest 4.1.11; overrides Hono 4.13.5, js-yaml 4.3.2, Sharp 0.35.4, SVGO 4.1.0, and adm-zip 0.6.1 under unchanged ONNX Runtime Node 1.27.0. Node engine/scripts and Transformers 4.2.0 / ONNX Web 1.27.0 remain unchanged.
- Inspected package/test diff and complete structured lock-entry comparison: lock format 3, 583 to 577 entries including root, 88 changed entries including root. All 77 changed surviving non-root entries have npm registry URLs and integrity fields. Compiler/Satteri, Sharp/native codecs, Vitest and SVG parser dependency changes follow the selected upgrades; no unrelated direct dependency addition or peer-bypass configuration appears in the patch.
- Test changes are bounded: 11 pin/lock assertions and 2 native behavioral tests. Normal ZIP extraction succeeds; a pre-existing directory junction/symlink escape is rejected with its scratch sentinel unchanged. Sharp checks libheif >=1.23.2 and a generated 16x16 AVIF encode/decode roundtrip. Scratch cleanup checks containment and unlinks the junction before recursive removal.
- Documentation matches the local patch, test counts and deployment limitation. Resolver/global-npm history is parent-reported where not captured by receipts; no independent global-toolchain audit was performed.

## Verification
All receipt directories below are under `S/output/security-sep13/`. Saved command results were inspected, not rerun by this judge.
- Independent allowed execution in S: `npm.cmd test -- scripts/lib/security-dependency-overrides.test.mjs`, EXIT 0, 13/13 tests in 1 file, Vitest 4.1.11; `npm.cmd audit --audit-level=moderate --json`, EXIT 0, empty vulnerabilities and total 0. These terminal results are separate from parent receipts; no extra judge log files were created.
- `2026-09-13T03-48-43-779Z-lock-update-npm11/report.json`: isolated `npx.cmd --yes --package=npm@11.19.1 npm install --package-lock-only --ignore-scripts` succeeded and produced the reviewed lock. This is lock generation, not a lifecycle-enabled install; no force/legacy-peer-deps flag is present.
- `2026-09-13T03-49-25-282Z-install/report.json`: ordinary `npm.cmd ci`, Node 24.20.0, EXIT 0, 462 packages added / 463 audited / zero findings; package/lock match. Stdout/stderr hashes verified. The test file was subsequently strengthened, so this install receipt does not bind the final test file; the fullcheck does. npm 11.2.0/global unchanged is parent-reported, not independently version-probed.
- `2026-09-13T03-51-16-349Z-full-check/report.json`: `npm.cmd run check`, Node 24.20.0, EXIT 0; stdout confirms 577 tests / 68 files, completed build and zero audit findings. Five existing PNG/CSS soft warnings and a large-chunk warning remain nonfatal. These are S counts, not the separate transcriber worktree's historical counts.
- Fullcheck SHA256: report `690a734e8a85900e9ca256d52bf6c13e28885eb8f3254db834f1b2b8ac9e27cb`; stdout `9ce575a78c2c68471cf8c25bee8e191f61c19e56a56def2b618d3ddc62a6e42a`; stderr `bd6e1e39f0927fde6ebe1c578884ef0c3f5b874cce415158012741ac54cebd65`. Actual log hashes match receipt fields.
- `2026-09-13T03-54-39-129Z-mobile-seo/report.json`: EXIT 0, stdout says pass, empty stderr; stdout SHA256 `f75bcf24a80ea72a6fa2ac430ee192b36b4086538b63c78ab32c8872c360d380` verified. All three source hashes match before/after.
- `2026-09-13T03-56-09-175Z-browser-smoke/report.json` (direct child of security-sep13): EXIT 0, stdout confirms 110 passed, empty stderr; stdout SHA256 `2833be58d64f3fc600c9162c6140c83005b9218f09c6703be3e3c83af57574e7` verified. All three source hashes match before/after.
- `2026-09-13T03-59-45-489Z-node-runtime/report.json` and ignored `node-runtime.mjs`: saved pass uses the shared Hostinger server launcher with the real built entry. Harness asserts home 200 and imports the existing Ask/API/MCP checker, which verifies registry availability, deterministic 43.2 and parsed inputs, and MCP tools/list. Receipt records unauthorized remote image 403 / zero intercepted external fetches, local WebP 200 / 572 bytes, and server stopped. This is local runtime evidence, not a hosted/live check or packet-level egress audit.
- Runtime before/after/current hashes match: app.js `dd5c2fabf12759207b93a66c6cfe921225c59736189c930157d0c094ca525c1e`; dist/server/entry.mjs `531d4e193fd197a50d54f469ddac462410df08372aec2683c5c0e3555688ddff`. The receipt retains boolean Ask/API/MCP success, not the reported exact 34-registry/4-MCP counts; those counts remain parent-reported. This does not change the local patch verdict.

## Residual Bounds
- ZIP regression uses extractAllTo; ONNX install-utils.js:183 uses extractEntryTo with flattening. Normal lifecycle installation plus the regression is useful evidence, not an exact reproduction of every ONNX extraction/final-copy boundary.
- AVIF roundtrip/native version evidence is not a malicious AVIF exploit reproduction or proof of every decoder path. Runtime image proof covers unauthorized remote rejection and trusted local PNG-to-WebP, not an AVIF endpoint exploit fixture.
- Nodemailer src/pages/api/contact.ts:180-186 retains fixed server recipient/from and bounded user replyTo. No real SMTP or offline composer regression was executed in this bounded patch pass; generic fullcheck success is not mail-delivery proof.
- These are disclosed coverage limits, not newly demonstrated defects or required fixes for the exact local dependency patch. Broader exposure detail remains in the separate security-sep13-exposure-judge.md report; no expansion is required to conclude this verdict.
- Final S status contains only the three modified scoped files and the new documentation file. Judge-created artifacts are the two authorized reports in R. No source/test/campaign/Git writes, fullcheck, browser, inference, hosting, mail or deployment actions were performed by this judge; execution was limited to the authorized focused tests and audit.
