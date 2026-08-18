# Product And Accessibility Reference

- Component: `src/components/TextToSpeechAudiobookGenerator.tsx`
- Parser: `src/lib/ttsInput.ts`
- Limits: 10 MB input, 500,000 characters, 100 chapters.
- Input: paste, TXT, EPUB only.
- Synthesis limit: one selected chapter, up to 10,000 characters per run.
- Output: local audio preview and one WAV download.
- Worker and generated object URL are discarded on stop, replacement, or page close.
