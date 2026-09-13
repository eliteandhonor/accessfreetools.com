# TTS Readiness And Revision Follow-up

September 6, 2026. Local work only. BR-04 remains blocked; no production,
indexability or completed-inference approval is claimed.

## Actual Cold Attempt

An isolated installed Chrome 152.0.7977.83 used the current built TTS page with
one synthetic English sentence and Bella. It did not use the account browser.
The five-minute probe ended at 300,537 ms while model.onnx was still loading,
with rounded UI progress at 2%. No MP3 was generated. This is an incomplete
bounded attempt, not evidence of an application timeout, stalled transfer or
the cause of slow loading. The browser and local server were closed.

Raw proof: `output/tts-audiobook-pilot/real-chrome-smoke/2026-09-06T12-28-18.744Z/`.
Its [independent review](tts-real-chrome-smoke-judge.md) records privacy,
instrumentation, build-provenance and visual limits. The QA CSP blocked an
AdGuard eval; no protection was disabled and no causal link to loading speed
was established. The original source and report remain historical evidence.

## Concrete Defect Fixed

The trace exposed one mutable initial `resolve/main/tokenizer_config.json`
request. Installed Transformers.js calls its tokenizer existence helper without
the supplied revision. This is a metadata/existence check, not the selected
tokenizer contents. The contents and weights already received the pinned option.

The dedicated Kokoro worker now sets the library's remote path template to its
existing pinned revision before loading. It does not change the model, voices,
timeouts, Supertonic worker, dependency versions, inputs or output format. No
node_modules edits or global page-runtime overrides were made.

The regression uses real AutoTokenizer/hub code with local JSON responses and
an intentionally stopped weights constructor. The original worker fails the
pin assertion; the fixed worker passes. The [independent judge](tts-revision-boundary-judge.md)
approves this scoped source correction only, with explicit cache and runtime
limits. The test does not claim model inference.

## Verification

- RED: one failing regression, saved under `output/tts-audiobook-pilot/revision-boundary/red.json`.
- Focused: 59 tests across four files pass; independent regression: 1/1 pass.
- Full `npm run check`: 2,425 tests across 104 files, both TypeScript checks,
  build and later gates pass, with zero dependency findings.
- Full-check report: `output/tts-audiobook-pilot/revision-integration/2026-09-06T12-38-21.487Z/`.
  It binds 2,138 source/public/config files with no drift and records 2,400
  freshly built files for the subsequent browser check.
- Rebuilt Chrome metadata-only check passes: the initial probe and tokenizer
  contents use revision `1939ad2a8e416c0acfeecc08a694d14ef25f2231`, with no
  mutable requests and no pre-Generate model requests. ONNX requests are
  intentionally aborted before transfer, so this is not inference or latency
  evidence. Source and build manifests are unchanged; browser/server closed.
- Metadata proof: `output/tts-audiobook-pilot/pinned-metadata-browser/2026-09-06T12-42-55.209Z/report.json`.

| Current Artifact | SHA-256 |
| --- | --- |
| Kokoro worker | `81910a6968ffcb0f6144b74cccf87becc65bed5edbced1caac5215ff2724279d` |
| Regression test | `b2f048d046d18850298871ce5f119c45952c01a089e7aa66ea785bbb2289aa3b` |
| Full-check log | `238b655d35368dc66b9f91b7550a70d02fcd4a2c07d35ebbf3f594e44e3294c6` |
| Rebuilt metadata report | `916946467c501ecab81eabad3b0483600e0428ef111a0054905fdcf04dc542e6` |

## Remaining Gates

Real cold/warm completed speech, long text, chapters, memory recovery, physical
devices and seven stable beta days remain unproven. Keep noindex and BR-04's
existing acceptance rules. Do not rerun long model downloads without a useful
change in test conditions or a specifically bounded new measurement.

This correction exists only in the dirty review worktree. It is not included
in the clean security-only commit b4fffbc4, which remains unpushed and undeployed.
The original promotion checkout remains unchanged. Pending owner decisions on
deployment, admin-token storage and internal transcriber alignment are separate
from this local fix; no approval is inferred from an automatic continuation.
