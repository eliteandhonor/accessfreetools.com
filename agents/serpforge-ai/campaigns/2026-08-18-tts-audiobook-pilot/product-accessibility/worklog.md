# Product And Accessibility Worklog

- 2026-08-18: Added deterministic paste, TXT, and EPUB parsing with focused Vitest coverage.
- 2026-08-18: Added a responsive React workbench with explicit server disclosure, fixed voice controls, queue status, refresh recovery, cancel, download, and immediate delete controls.
- 2026-08-18: Kept synthesis disabled when the private API and Turnstile configuration are absent.
- 2026-08-18: Visually checked the exact tool and guide at 1440x1000 and 390x844. Both had zero document-level horizontal overflow, visible H1 content, and the expected `noindex,follow` metadata.
- 2026-08-18: Axe reported zero automatic WCAG A/AA violations after valid group roles were added to labeled UI containers. Live queue, recovery, cancellation, and download behavior still require the private canary.
- 2026-08-18: Owner rejected the server workflow. The earlier API, queue, refresh-recovery, MP3, and Turnstile entries are superseded.
- 2026-08-18: Replaced the workbench with local TXT/EPUB parsing, explicit approximately 398 MB model consent, a dedicated browser worker, one selected chapter per run, stop/unload, local preview, and WAV download.
- 2026-08-18: Fresh visual and accessibility gates passed 27 page/viewport pairs, including the TTS route at narrow mobile sizes. Chrome generated, previewed, and downloaded the local WAV without autoplay; the page retained visible status messaging and no document-level horizontal overflow.
- 2026-08-18: Removed TXT/EPUB upload, parsing, chapter selection, quality controls, and the separate load step. The new flow is paste text, choose voice settings, Generate MP3, preview, and Download MP3; fresh visual and interaction proof is required.
- 2026-08-18: Fresh desktop and mobile checks found no overlap or horizontal overflow. The final browser run automatically loaded the model from `Generate MP3`, exposed a playable result, and downloaded `text-to-speech-f1.mp3`.
