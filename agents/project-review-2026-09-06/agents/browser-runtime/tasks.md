# Assigned Tasks

See [campaign.json](../../campaign.json) for complete conditions and current task states. Evidence readiness is not deployment or beta-exit approval.

## BR-01: Bound JSON-to-CSV output before dense allocation

Priority: P1. Status: approved. Lane: main. Independent Release Judge: [exact task decision](../../reports/json-tts-task-acceptance.md).
Depends on: none.

Completion: Preflight max columns, cells, nesting and estimated output bytes; sparse50000-key input rejects before dense allocation. Safe irregular rows/BOM/delimiters/formula escaping still work; browser remains responsive. Do not execute a2.5billion-cell allocation.

Evidence command(s): `npm test; npm run test:smoke`.
Evidence output: `output/project-review-followup/BR-01/`.

## BR-02: Settle TTS failures and validate files before reading

Priority: P2. Status: approved. Lane: main. Independent Release Judge: [exact task decision](../../reports/json-tts-task-acceptance.md); earlier [batch-two evidence](../../reports/implementation-batch-two-acceptance.md) is retained.
Depends on: none.

Completion: Pending chapter promise rejects exactly once on pre-ready worker error; retry preserves earlier MP3s. Oversized/unsupported files call arrayBuffer zero times; cancellation/replacement cannot publish stale imports. Test real UI lifecycle, not just parser source strings.

Evidence command(s): `npm test; npm run tts:browser-check; npm run tts:feature-soak`.
Evidence output: `output/project-review-followup/BR-02/`.

September 6: the judge passes 106 focused tests and two actual built-page JSON
browser cases. TTS coverage executes the mounted component, import and queue
logic using simulated worker events, not real model inference. BR-04 and all
deployment gates remain separate; approving BR-02 does not exit the TTS beta.

## BR-03: Give OCR operation identity, cancellation and input bounds

Priority: P2. Status: approved. Lane: main. [Exact independent BR-03 acceptance](../../reports/ocr-task-acceptance.md) covers 73 distinct tests including mounted adversarial cases. SEC-02's local dependency is approved. Native recognition, real-device/resource and production proof remain outside this bounded decision.
Depends on: SEC-02.

Completion: Delayed imageA result never appears under imageB/languageB. Cancel/unmount terminates worker; corrupt/oversized pixel and byte inputs fail before dangerous allocation; language fixtures and retry pass.

Evidence command(s): `npm test; npm run test:smoke; npm run check:ai-assets`.
Evidence output: `output/project-review-followup/BR-03/`.

## BR-04: Verify Real TTS Model And Device Readiness Before Beta Exit

Priority: P2. Status: blocked. Depends on BR-02, SEC-01 and SEC-02.

Named real Chrome/Edge cold/warm Supertonic and Kokoro jobs cover 10000-character generation, chapter MP3/ZIP, repeated model switches, load failure, watchdog, cancel/retry, memory peak and recovery, and local-only network sentinels. Mock soak and source checks are not inference proof. Record Firefox/WebKit and actual Android/iOS/Safari as tested, fallback or unverified; do not infer devices from viewport emulation. Keep TTS noindex until its own compatibility plus seven stable beta-day gates and separate indexability judgment pass.

Commands: `npm run tts:browser-check; npm run tts:voice-check; npm run tts:feature-soak; npm run check`. Output: `output/project-review-followup/BR-04/`.

Gate: Real-model/browser readiness evidence is incomplete. BR-02, SEC-01 and
SEC-02 now have local task approvals, but those do not provide real-device,
inference, production or seven-day beta proof.

September 9: one real Chrome cold-short Kokoro WebGPU MP3 now passes after
QA-only runtime and embedded-encoder CSP corrections. The independent judge
accepts that exact scope. [Current receipt summary](../../reports/tts-cold-retry-2026-09-09.md).
Edge cold-short and warm Bella/Adam chapter MP3/ZIP checks now pass, as does
Chrome's synthetic 10,000-character Kokoro MP3. Chrome Supertonic F1/M1 short
and chapter MP3/ZIP checks pass, followed by Edge's synthetic 10,000-character
Supertonic MP3. Their [bounded follow-on judge](../../reports/tts-warm-chapters-judge-2026-09-09.md)
accepts all four receipts with historical harness-snapshot qualifications. This is
not the complete browser/model matrix, repeated switching, recovery, memory,
physical-device or beta proof. No task-state or public-release approval follows.
