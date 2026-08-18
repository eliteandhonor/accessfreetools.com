# Task Board

Only the Release & Proof Judge may mark a row `approved`. Evidence paths are expected outputs, not proof that already exists.

| ID | Priority | Owner | Feature | Status | Depends On | Completion Evidence |
|---|---|---|---|---|---|---|
| VP-01 | P1 | Voice Preference Agent | Favorites and recent voices | approved | - | Versioned store tests and corruption/storage-failure proof |
| VP-02 | P1 | Voice Preference Agent | Favorites and recent voices | approved | VP-01 | Grouped selector UI, keyboard/axe proof, selected-file-only trace |
| AE-01 | P1 | Audio Estimate Agent | Duration and file size | approved | - | Pure estimator tests for words, scripts, speed, and 128 kbps size |
| AE-02 | P1 | Audio Estimate Agent | Duration and file size | approved | AE-01 | Pre-download UI and zero-model-request browser trace |
| DI-01 | P0 | Document Import & Security Agent | EPUB and Markdown import | approved | - | Parser threat model, limits, fixtures, and dependency decision |
| DI-02 | P1 | Document Import & Security Agent | Markdown import | approved | DI-01, CB-01 | Structured Markdown parser tests and chapter extraction proof |
| DI-03 | P1 | Document Import & Security Agent | EPUB import | approved | DI-01, CB-01 | Spine-order extraction and hostile-archive rejection proof |
| CB-01 | P0 | Chapter Workflow Agent | Chapter builder | approved | - | Pure chapter model/editor tests |
| CB-02 | P1 | Chapter Workflow Agent | Chapter builder | approved | CB-01 | Sequential generation, cancel, retry, and one-worker proof |
| CB-03 | P1 | Chapter Workflow Agent | Chapter ZIP | approved | CB-02 | Local ZIP, filename, order, cleanup, and download proof |
| CB-04 | P1 | Chapter Workflow Agent | Chapter limits | approved | CB-03, DI-02, DI-03 | Current-limit soak and evidence-backed limit decision |
| PX-01 | P1 | Product Accessibility & Privacy Agent | Integrated UX/privacy | approved | VP-02, AE-02, CB-01, DI-02, DI-03 | Responsive, keyboard, axe, Clarity, and network-sentinel proof |
| PX-02 | P1 | Product Accessibility & Privacy Agent | Integrated runtime | approved | CB-04, PX-01 | Cross-browser generation/import/ZIP matrix and cleanup proof |
| RJ-01 | P0 | Release & Proof Judge | Final evidence audit | approved | VP-02, AE-02, CB-04, PX-02 | Fresh commands and independent evidence audit |
| RJ-02 | P0 | Release & Proof Judge | Beta release decision | approved | RJ-01 | Explicit release/index decision with rollback conditions |

## Campaign Completion Rule

The campaign completed on August 18, 2026. The Release & Proof Judge approved all fifteen rows after final-command, local-browser, privacy, deployment, and live-production verification. The TTS tool and guide remain a deliberate `noindex,follow` beta outside XML sitemaps.
