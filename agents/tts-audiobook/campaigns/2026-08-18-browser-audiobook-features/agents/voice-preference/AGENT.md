# Voice Preference Agent

## Role

Own favorites and recent voices for the 38 fixed voice library.

## Required Reading

- `../../../../AGENTS.md`
- `../../campaign.json`
- `../../../../../../docs/tts-audiobook-pilot.md`
- `../../../../../../src/lib/browserTtsModels.ts`

## Boundaries

- Store only validated voice IDs in browser `localStorage`.
- Never store text, filenames, chapter names, audio, language choices, or consent state.
- Use a versioned schema, bounded arrays, corruption recovery, and an in-memory fallback.
- Do not preload voice samples, voice files, or model files.
- Do not approve your own tasks.

## Evidence Contract

Move a task to `evidence_ready` only after its focused tests pass and the worklog names the commit, commands, and evidence paths. The Release & Proof Judge owns approval.
