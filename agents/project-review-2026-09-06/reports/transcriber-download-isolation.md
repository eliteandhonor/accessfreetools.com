# Transcriber Download Isolation

September 6, 2026. Local diagnostic only, not TR-03 approval. The separate
`accessfreetools-browser-transcriber` checkout remains at HEAD `90d6dcab` plus
its preserved unpublished draft. No application source, model revision,
dependency, timeout, privacy setting, indexability or deployment changed.

## Controlled Chrome Comparison

The ignored runner `output/browser-transcriber-pilot/download-isolation.mjs`
serves one fixed diagnostic document and a dedicated worker on loopback. It
streams the same pinned English encoder and decoder in fresh Chrome contexts,
first without HTTP interception, then with `route.continue`. Both cases have
the same restrictive probe CSP, no application scripts, no media input, no
credentials, no recording and no persisted response body. No installed security
control, proxy or certificate setting was disabled. Service workers are blocked.

Pinned revision: `aeaa13760958b03fac5062f457d317d3319c3168`.
Expected encoder: 10,097,112 bytes. Expected decoder: 30,729,881 bytes.

| Chrome 152.0.7977.83 Probe | Encoder Bytes | Decoder Bytes | Outcome |
| --- | ---: | ---: | --- |
| No HTTP interception | 2,731,019 | 2,570,875 | Both HTTP 200; diagnostic abort at 90 seconds |
| Route continuation | 5,976,875 | 6,140,625 | Both HTTP 200; diagnostic abort at 90 seconds |

Neither case completed its download. The observed `ERR_ABORTED` values follow
the probe's deliberate 90-second deadline, not a product error or evidence of
unsupported Chrome. These runs cannot prove routing is harmless, identify a
network filter as the cause, or establish whole-hour transcription compatibility.
They do show that partial downloading also occurs without Playwright HTTP
interception. No raw signed redirect URLs or model bytes were saved.

Evidence in the transcriber checkout:
`output/browser-transcriber-pilot/download-isolation/2026-09-06T09-45-52.761Z/report.json`.
The report binds the runner hash and records both browsers and the loopback
server stopped. The full-page compatibility harness was not altered.

## Independent Transport Probe

A Node 24.20.0 streaming GET for the exact same pinned encoder also returned
HTTP 200 but reached only 8,116,725 bytes before its independent 90-second abort.
The command used native fetch with credentials omitted, read counts only,
cancelled its signal and exited with code 1. No file was cached or served to
the application. This is transport evidence, not browser support or inference
proof. Different concurrency and transport prevent a fair speed comparison.

## Current Gate

All 506 previously frozen transcriber source/built hashes still match:
`node output/browser-transcriber-pilot/capture-fixture-proof-source.mjs --download-progress --compare`.
Existing ten-minute application failures remain the stronger product evidence.
The shorter diagnostic deadline does not justify increasing that deadline or
declaring that the models cannot download on users' devices.

Keep both routes `noindex,follow`. Before another whole-hour run, obtain one
reliable short-fixture cold download and generation under the unchanged product
deadline. Keep cold and warm-cache proof separate. Remaining language, codec,
memory, cancellation, privacy and seven-day beta gates are unchanged. No VPS,
purchase, publication, discovery submission or server inference was used.
