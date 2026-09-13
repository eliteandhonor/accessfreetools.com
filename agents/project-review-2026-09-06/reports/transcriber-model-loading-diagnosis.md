# Model Loading Diagnosis And Recovery Advice

September 6, 2026. Bounded diagnostic and recovery-message correction in the
unpublished transcriber checkout. Model pins, deadlines, privacy, overlap logic,
indexability, deployment and task requirements remain unchanged.

## What The Failure Actually Shows

The saved real Chrome run at 10:22:32-10:32:34 UTC has a larger decoder byte count
at every one of its nineteen 30-second observations. Its final count is
12,826,755 of 30,729,881 decoder bytes; the 10,097,112-byte encoder completed.
The lifecycle source has a 120-second idle limit and a separate 600-second
absolute load deadline. The continuing progress and elapsed time identify the
absolute deadline, not a no-progress stall, as this run's terminal condition.

The decoder averaged about 21.5 KB/s through the last periodic sample. This is
an observation from that run, not a current network-speed test or a performance
claim about users' devices. No cause for the slow transfer is established.
A shorter recording does not change the selected model's download size.

Original proof remains byte-identical in T:
`output/browser-transcriber-pilot/actual-no-interception/2026-09-06T10-22-32.420Z/report.json`.
SHA-256: `19dfb857a905ab4a9c54ed7629c2830ef90babd2cb0b3cb178292a957904c80a`.
No further ten-minute inference attempt was repeated without changed conditions.

## Separate CSP Warning

Two short real Chrome152.0.7977.83 page-only probes used the current built page,
the same restrictive diagnostic CSP and fresh isolated contexts. No recording
was selected and no model request occurred. Both returned200, preserved noindex,
had no page errors, and closed their browsers and loopback servers.

The detailed probe at 12:06:29-12:06:34 UTC records a `script-src` rejection of
`eval`, sourced from `local.adguard.org` at line15/column83749. It occurs before
the locator checks. This identifies the warning reproduced now; it does not
prove the source of the older anonymized warning or prove AdGuard caused the
slow transfer. No protection, proxy, certificate, CSP allowance or extension
was disabled or weakened. The user's logged-in Chrome account was untouched.

T evidence:
`output/browser-transcriber-pilot/model-gate-diagnosis/2026-09-06T12-06-29.379Z/report.json`.
Its helper hash is `e46fa4609686f3a65816066ae1881e6d98e4f9b8deccf9c248fc54c89da835c5`.
The preceding probe has less detailed attribution under `2026-09-06T12-05-44.204Z`.
An initial helper property-access typo failed before browser/server startup and
was corrected before these successful probes; it was not a product failure.

## Bounded Product Correction

The model-load timeout previously advised trying a shorter recording. That
cannot reduce these model files. Only that phase's recovery text now says:

> Check your connection and retry. Shortening the recording does not reduce the model download.

The timeout reason, elapsed time, retained-section notice, error type, idle and
absolute limits, worker cleanup, retry behavior and other phases are unchanged.
This corrects guidance, not download throughput or the cold-load acceptance gap.

Existing unit assertions cover both model idle and absolute timeouts. The
existing mounted React test checks the visible guidance and absence of the
incorrect shorter-recording recommendation. RED:67/70 pass, three fail;
GREEN:70/70 pass, none pending. The RED run also emits asynchronous handled-
rejection warnings; those remain a failed-test diagnostic, not a browser bug.
Results: T `output/browser-transcriber-pilot/model-gate-diagnosis/timeout-help-{red,green}.json`.

| Frozen Changed File | SHA-256 |
| --- | --- |
| `src/lib/browserTranscriberLifecycle.ts` | 462369fbe194164e92483f3fed568c9ff8883125557db3ab10a401511b89e179 |
| `src/lib/browserTranscriberLifecycle.tr02.test.ts` | b5f1cfd38fa57e393cc794077d2c68651a76ce4849ea5928273c464c0d4c2843 |
| `src/lib/browserTranscriber.tr02.test.ts` | 3a3731f6bf01cf6167dc83569398c4c254efabd0d7403da9e8e0e4b8f4687109 |

The local remove-ai-marks service inspected only the93-character public advice:
zero Layer A findings. Its statistical detectors are unavailable and the text
is too short for calibrated stylometry. No cleaning, rewrite or authorship claim.

## Remaining Gates

Independent review and the current-source full check are recorded separately.
TR-01's four exact-alignment failures remain. The ten-minute cold-load failure,
real-hour/browser/privacy/beta proof, owner policy choices and authorized live
release are not solved by better error text. No model, timeout or acceptance
contract is relaxed, and there is no claim that the transcriber is ready to ship.

## Final Verification

The [independent amendment](transcriber-model-loading-judge.md) locally approves
the exact three-file message correction after a fresh70/70 pass, reverse-diff
comparison to its previous freeze, zero source drift and complete owned-process
cleanup. It preserves TR-02's local acceptance and its open TR-01 dependency.

Parent full check completed at12:13:21.562UTC, exit0: **746 tests in76files**,
both TypeScript lanes, build and all later checks, **zero vulnerabilities**.
All2347capturedfiles remain unchanged with no additions. Evidence in T:
`output/browser-transcriber-pilot/model-gate-diagnosis/full-check/`.

- Log SHA-256: `3ed81d48f6bf2870266f6300ec3b8095daf8b5220ff47db7ba0701ab3ea7d7ff`.
- Source manifest SHA-256: `46423585bde4988fa01cc442c4e8d3f933e7bb95f3219535061815aa8b443e3a`.

The full check does not contain or override the four retained independent TR-01
failures. No deployment, public action, model transfer, policy waiver or whole-
goal approval occurred. Required command sessions and independent tests finished.

Final read-only release-source refresh: `git fetch origin main` exits0 and
confirms origin/main remains90d6dcab, the parent of clean local security commit
b4fffbc4. Automatic Git maintenance prints the already-known permission warnings
for legacy worktree metadata; no manual deletion or cleanup was attempted.
The original promotion checkout retains the same dirty-file list. No push ran.
