# TTS Audiobook Pilot Task Board

Allowed statuses: `planned`, `in_progress`, `evidence_ready`, `approved`, `blocked`.

| ID | Owner | Priority | Task | Evidence path or command | Status | Approval gate | Completion rule |
|---|---|---:|---|---|---|---|---|
| TTS-001 | Infrastructure | P0 | Prove the tool uses the existing Hostinger site only | `npm run tts:browser-check`; `output/tts-audiobook-pilot/2026-08-18-browser-proof.md` | evidence_ready | Release Judge | No purchase, separate host, upload API, or owner-PC dependency exists; unrelated routes load no TTS model code |
| TTS-002 | Model/Audio | P0 | Pin and verify the official browser model path | worker source, model revision report, `output/tts-audiobook-pilot/2026-08-18-browser-proof.md` | evidence_ready | Release Judge | Source and model pins match; WebGPU or WASM generates non-empty WAV in a supported browser |
| TTS-003 | Product/Accessibility | P1 | Finish local parser and accessible browser UI | 472-test suite, 27 accessibility page/viewport pairs, Playwright screenshots | evidence_ready | Release Judge | TXT/EPUB, model consent, stop/unload, WAV download, mobile, keyboard, and masking pass |
| TTS-004 | Security/Privacy | P0 | Validate no-upload privacy and supply chain | zero-vulnerability npm audit, browser network proof, pinned source/license review | evidence_ready | Release Judge | No input text leaves the browser; no high/critical findings; only pinned model assets are requested |
| TTS-005 | SEO/Content | P1 | Complete research, guide, artwork, and workbench evidence | `output/seo-agents/text-to-speech-audiobook-generator/` | evidence_ready | Release Judge | Sources and demand are honest; both lanes pass without overriding prelaunch noindex |
| TTS-006 | Release Judge | P0 | Deploy a noindex browser beta on the current site | Node 24 deploy proof and live route verification | planned | TTS-001 through TTS-005 | Existing Hostinger build is healthy and the live tool generates and downloads WAV without server inference |
| TTS-007 | Release Judge | P1 | Review seven days of browser beta evidence | dated compatibility, error, and usage report | blocked | TTS-006 | Supported-device behavior is understood and no main-site or privacy regression is present |
| TTS-008 | Release Judge | P1 | Decide whether to authorize indexing | live proof bundle and dated judge decision | blocked | TTS-007 | Honest demand, reliable supported-browser generation, and all SEO/release gates pass |

## Current Blockers

- OpenSEO was configured but unavailable at its local endpoint. DataForSEO fallback spent USD 0.036 on three exact phrases and returned no useful variants before the minute limit. Demand remains `not enough data`.
- The browser model is about 398 MB. A real Chrome/WebGPU run generated a 6.5-second WAV in 3.1 seconds, but production-browser reliability and low-memory-device behavior must still be measured before indexing.
- Browser support must be stated honestly: WebGPU is preferred, WebAssembly is the fallback, and older or low-memory devices may not complete synthesis.
