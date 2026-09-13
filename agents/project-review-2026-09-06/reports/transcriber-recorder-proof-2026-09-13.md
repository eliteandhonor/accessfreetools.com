# September 13 Transcriber Recorder Proof

Scope: local specialist evidence, not TR-03 approval or production privacy proof.
T is `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`;
R is `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`.

## Result

Three cases pass using actual built T HTML, hydrated React, media worker and
Whisper worker with the owned 5.544-second Bella sample. The unchanged pinned
English model and ONNX WASM files are fulfilled from verified local bytes at
their original URLs. This is not cold model-download or general speech accuracy
evidence. Chrome version is 153.0.8010.36 on Windows.

| Case | Real Recorder Payloads | Private Marker Hits | Public Controls | Result |
| --- | --- | --- | --- | --- |
| Desktop, 1365x900 | 7 | 0/5 | 5/5 | Pass |
| Mobile viewport, 390x844 | 7 | 0/5 | 5/5 | Pass |
| Desktop with masks deliberately removed | 7 | 3/3 | 5/5 | Expected leak detection |

The 21 locally intercepted uploads contain 18 gzip and three final plaintext
payloads, with zero decode failures or SDK diagnostics. Both positive cases
prove decoded masked filename/source, progress and result nodes (11, 12 and 15
respectively) under the actual workspace. They scan alphabetic filenames,
synthetic progress text, an edited caption and an edited export filename.
Initial file inspection, replacement, real inference, transcript editing, Reset,
worker/object-URL release and context/browser closure all execute.

The negative control removes masks only in the ephemeral browser DOM before
recorder discovery. It requires exposure of both visible filenames and progress
text. It does not claim native input masking is defeated; result sections created
later by React keep their normal masks. Five private markers are required absent
in each positive case; only those three visible markers are required present in
the negative case. Public controls must occur in decoded DOM text, so an inactive
recorder cannot pass. No product mask or source file was changed.

## Provenance And Isolation

Runner: `T/output/browser-transcriber-pilot/recorder-check-2026-09-13.mjs`.
SHA256 `7f0cee09ac4ebdec0f3aa4c46a24295e631b1e64154db276e3a2c515a7eeeb7e`.
Final receipt:
`T/output/browser-transcriber-pilot/recorder-2026-09-13T05-12-30-141Z/report.json`.
SHA256 `1ffef2b9d02c91a0648442264f5f464d91bea1802c76015a15322b568a4e8d7b`.
Run interval: 05:12:30.141Z to 05:13:01.525Z. All 78 selected built/source/helper,
manifest/lock and harness hashes still match. No site build or dependency change.

The runner reuses R's independently reviewed `createRecorderProof` helper and
the official MIT `clarity-js`/`clarity-decode` 0.8.68 pair already acquired under
R's ignored SEC-02 SDK directory. It revalidates the pinned archive SHA512,
executable SHA256, package metadata and retained LICENSE/NOTICE hashes before
execution. No SDK download or installation occurs in this run. Exact official
source provenance remains in `clarity-real-recorder-proof.md`.

Every browser request is fulfilled from pinned model/static bytes or blocked.
The fake collector is `collector.clarity.invalid`; captured POST bodies are
decoded transiently and receive local empty responses. No route continues or
fetches upstream. Service workers and WebSockets are blocked. A loopback-only
unavailable proxy, disabled external DNS and background networking provide a
second boundary. No user session, real media, account tag, real analytics
collector, advertisement or recording replay is used. Public account tags and
first-party analytics requests are blocked, not treated as production proof.

Only counts, booleans, hashes, fixed test labels and source paths are saved.
No raw recorder body, decoded text, media, browser console, screenshot, HAR,
video or transcript is retained by this test. Existing owned audio is an input.
The five public alphabetic controls and private synthetic marker definitions are
test source, not visitor data. Native browser resources and the intentional user
preview at port4359 remain separate; all three contexts and this owned browser
close. This test starts no web server.

## Failed Setup And Remaining Gates

The first receipt at `recorder-2026-09-13T05-08-21-786Z/report.json` remains failed:
the harness selected nonexistent language value `en` instead of actual `english`.
The `.mp3` fixture suffix also invoked the SDK's unrelated sensitive-number mask,
preventing meaningful filename negative controls. The final harness uses accepted
MIME-identified alphabetic filenames and explicit recorder flushes after each
file. Application code, input limits, model behavior and privacy predicates were
not weakened. The intermediate 05:10 pass is retained; 05:12 is the final pass
after adding harness/package/helper source fingerprints.

Independent judge review is requested before any acceptance claim beyond these
observed cases. Production hosted tag/configuration/version, every private
surface/codec/language, all request encodings, other advertising code, real mobile
devices, native-memory accounting and seven stable beta days are not established.
The recorder starts after the built page hydrates; this is not pre-hydration
recording proof. The separate privacy-mutation and hour-matrix reports remain
necessary. No transcriber deployment, indexability change or public submission.
