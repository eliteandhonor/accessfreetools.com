# Delivery Plan

## Phase 1: Independent Foundations

- Voice Preference Agent defines and tests a versioned, bounded local preference store.
- Audio Estimate Agent creates pure estimate logic that runs before any model request.
- Chapter Workflow Agent defines the shared chapter data model and editor operations.
- Document Import & Security Agent defines the untrusted-document parser contract and limits.

These four tasks may proceed in parallel because they do not share runtime state.

## Phase 2: Feature Surfaces

- Add favorites, recent voices, and filtering without expanding the current model bundle.
- Add a clearly labeled estimate range before model loading.
- Add browser-only Markdown and EPUB adapters that emit the shared chapter model.
- Add named chapter editing, reordering, and validation.

## Phase 3: Generation And Packaging

- Generate chapters sequentially with the existing one-worker policy.
- Support cancellation, retry of one failed chapter, and recovery without losing completed local results.
- Package successfully generated chapter MP3 files into one local ZIP with sanitized, stable filenames.
- Benchmark the complete flow at the current 10,000-character aggregate limit before considering any increase.

## Phase 4: Integration And Proof

- Product Accessibility & Privacy Agent verifies mobile layout, keyboard use, status announcements, Clarity masking, network privacy, object-URL cleanup, and bounded storage.
- Release & Proof Judge reruns the complete evidence set, rejects unsupported claims, and records either `approved`, `blocked`, or `not enough data`.
- Indexability remains a separate decision after the existing beta and the expanded feature release are both proven.

## Deliberate Deferrals

- Accounts, cloud sync, server storage, hosted inference, paid speech APIs, and VPS infrastructure.
- PDF, DOCX, URL import, microphone input, voice cloning, custom voices, and uploaded voice files.
- M4B, one merged audiobook file, autoplay, public sharing links, and background generation after the tab closes.
- A larger character limit until a measured browser benchmark supports it.
