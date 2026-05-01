# Self-hosted AI Assets

These files are intentionally committed so the first AI tools can load core model assets from `accessfreetools.com` instead of fetching every file from a third-party model host.

Current Phase 1 assets:

- `tesseract/worker.min.js`: browser worker from `tesseract.js`.
- `tesseract/core/`: browser OCR core files from `tesseract.js-core`.
- `tesseract/lang/*.traineddata.gz`: OCR language data for English, Spanish, French, German, Italian, and Portuguese from Project Naptha tessdata.
- `transformers/Xenova/mobilebert-uncased-mnli/`: quantized MobileBERT MNLI model files used by the Sentiment Analyzer and Tone Checker through Transformers.js.

Rules for future additions:

- Keep every individual file under GitHub's normal Git hard limit.
- Prefer quantized browser models.
- Add model assets only when a real tool uses them.
- Update the AI privacy wording and tests when a tool moves from third-party model downloads to self-hosted files.
