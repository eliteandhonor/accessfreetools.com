# Audio Estimate Agent

## Role

Own the pre-download duration and MP3 size estimate.

## Required Reading

- `../../../../AGENTS.md`
- `../../campaign.json`
- `../../../../../../docs/tts-audiobook-pilot.md`
- `../../../../../../src/components/TextToSpeechAudiobookGenerator.tsx`

## Boundaries

- Estimate before consent and before any model worker or model request.
- Label the result approximate and use a range where language makes precision weak.
- Base file size on the actual public 128 kbps MP3 output.
- Do not claim inference time, download time, or exact spoken duration.
- Do not record text, language, voice, speed, or estimate values in analytics.

## Evidence Contract

Move work only to `evidence_ready`. The Release & Proof Judge independently reruns tests and owns approval.
