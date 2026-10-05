import type { BlogPostDefinition } from './blogPosts';
import { aiTools } from './aiTools';
import { aiInstructionRepairs } from './aiInstructionRepairs';

interface GuideSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  links?: Array<{
    href: string;
    label: string;
  }>;
}

export interface AiGuideDefinition {
  slug: string;
  toolSlug: string;
  label: string;
  title: string;
  description: string;
  path: string;
  intro: string;
  quickStart: string[];
  sections: GuideSection[];
  sidecarText: string;
}

interface AiGuideDetail {
  title?: string;
  description?: string;
  summary: string;
  purpose: string;
  intro?: string;
  extraSections?: GuideSection[];
  enter: string[];
  read: string[];
  mistakes: string[];
  sources: Array<{
    href: string;
    label: string;
  }>;
}

const sourceLinks = {
  transformersJs: {
    href: 'https://huggingface.co/docs/transformers.js/',
    label: 'Hugging Face: Transformers.js browser inference',
  },
  transformersWebGpu: {
    href: 'https://github.com/huggingface/transformers.js/blob/main/packages/transformers/docs/source/guides/webgpu.md',
    label: 'Transformers.js: WebGPU browser guidance and limitations',
  },
  whisperModelCard: {
    href: 'https://github.com/openai/whisper/blob/main/model-card.md',
    label: 'OpenAI Whisper: model card, accuracy limits, and license',
  },
  whisperEnglishTimestamped: {
    href: 'https://huggingface.co/onnx-community/whisper-tiny.en_timestamped',
    label: 'ONNX Community: pinned timestamped Whisper Tiny English model',
  },
  whisperMultilingualTimestamped: {
    href: 'https://huggingface.co/onnx-community/whisper-tiny_timestamped',
    label: 'ONNX Community: pinned timestamped multilingual Whisper Tiny model',
  },
  mediabunny: {
    href: 'https://mediabunny.dev/guide/reading-media-files',
    label: 'Mediabunny: browser media reading and decoded audio samples',
  },
  tesseractJs: {
    href: 'https://github.com/naptha/tesseract.js',
    label: 'Tesseract.js: browser OCR library',
  },
  tesseractDocs: {
    href: 'https://tesseract-ocr.github.io/tessdoc/',
    label: 'Tesseract OCR documentation',
  },
  franc: {
    href: 'https://github.com/wooorm/franc',
    label: 'franc: language detection package',
  },
  fleschKincaid: {
    href: 'https://readabilityformulas.com/flesch-grade-level-results.php',
    label: 'Flesch-Kincaid grade level formula reference',
  },
  w3cReadingLevel: {
    href: 'https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html',
    label: 'W3C: understanding WCAG 2.2 reading level',
  },
  cdcPlainLanguage: {
    href: 'https://www.cdc.gov/health-literacy/php/develop-materials/plain-language.html',
    label: 'CDC: plain-language checklist and sentence guidance',
  },
  googleHelpfulContent: {
    href: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
    label: 'Google Search Central: helpful content guidance',
  },
  supertonic: {
    href: 'https://github.com/supertone-inc/supertonic',
    label: 'Supertonic: official model repository, language list, and archive notice',
  },
  supertonicVoices: {
    href: 'https://supertone-inc.github.io/supertonic-py/voices/',
    label: 'Supertonic: official built-in voice descriptions and use cases',
  },
  supertonicLicense: {
    href: 'https://huggingface.co/Supertone/supertonic-3/blob/main/LICENSE',
    label: 'Supertonic 3 model weights: OpenRAIL-M license terms',
  },
  kokoroBrowser: {
    href: 'https://github.com/hexgrad/kokoro/tree/dfb907a02bba8152ca444717ca5d78747ccb4bec/kokoro.js',
    label: 'Kokoro: official browser implementation and fixed English voices',
  },
  kokoroModel: {
    href: 'https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/tree/1939ad2a8e416c0acfeecc08a694d14ef25f2231/voices',
    label: 'Kokoro 82M: pinned ONNX model files and voice data',
  },
  kokoroLicense: {
    href: 'https://huggingface.co/hexgrad/Kokoro-82M/blob/main/LICENSE',
    label: 'Kokoro 82M model: Apache-2.0 license',
  },
  phonemizer: {
    href: 'https://github.com/xenova/phonemizer.js',
    label: 'Phonemizer.js: browser wrapper used for Kokoro English phonemes',
  },
  espeak: {
    href: 'https://github.com/espeak-ng/espeak-ng',
    label: 'eSpeak NG: speech synthesis and phoneme engine',
  },
  wasmMediaEncoders: {
    href: 'https://github.com/arseneyr/wasm-media-encoders',
    label: 'wasm-media-encoders: browser MP3 encoder',
  },
};

const guideDetails: Record<string, AiGuideDetail> = {
  'image-to-text-ocr-tool': {
    summary:
      'Learn how to copy text from screenshots and image files, improve image quality for OCR, and catch common copy mistakes.',
    purpose:
      'The Image to Text OCR Tool turns a clear image of typed or printed words into editable text in your browser. Image quality changes the result, so use it for sharp screenshots, labels, receipts, and simple document photos when you want a draft copy without uploading the image to Access Free Tools.',
    enter: [
      'Choose a sharp screenshot or photo with typed or printed text.',
      'Pick the language shown in the image.',
      'Press Read text and wait while the OCR files load in the browser.',
      'Before copying, compare names, totals, dates, and codes with the image.',
    ],
    read: [
      'Treat the result as a draft copy, not a certified transcript.',
      'If the image says INV-10018 or $42.50, check those exact characters before pasting.',
      'Columns, small text, blur, glare, and sideways photos can lower accuracy because OCR depends on image quality and careful cropping.',
      'If the output looks messy, crop closer, brighten the image, and run OCR again.',
    ],
    mistakes: [
      'Do not trust OCR for totals, serial numbers, passwords, private IDs, legal wording, medical records, or bank details without checking the original.',
      'Do not use a random image-to-text tool for sensitive files just because it is fast.',
      'Do not expect handwriting, cursive, decorative fonts, or low-light photos to work as cleanly as typed text.',
      'Do not ignore 0/O, 1/l/I, 5/S, and 8/B mistakes. Those are small errors that can break a form or code.',
    ],
    sources: [sourceLinks.tesseractJs, sourceLinks.tesseractDocs],
  },
  'sentiment-analyzer': {
    summary:
      'Learn how to use the browser sentiment analyzer, read confidence scores, and spot short-text or sarcasm limits.',
    purpose:
      'The Sentiment Analyzer checks whether a short piece of text reads more positive or negative. It is useful for drafts, reviews, comments, and examples where you want a quick emotional direction.',
    enter: [
      'Paste one focused sentence, review, or paragraph.',
      'Press Analyze sentiment so the browser can load the model and run it.',
      'Read the label and confidence score together.',
      'Check the text manually if it is sarcastic, mixed, or sensitive.',
    ],
    read: [
      'Positive or negative is the model prediction, not a human verdict.',
      'The confidence score shows how strongly the model chose that label.',
      'Mixed text can produce one label even when the message has both good and bad parts.',
    ],
    mistakes: [
      'Do not use sentiment as proof of intent.',
      'Do not trust it for sarcasm, jokes, slang, or private conflict decisions.',
      'Do not paste sensitive messages unless you are comfortable processing them in your own browser.',
    ],
    sources: [sourceLinks.transformersJs, sourceLinks.googleHelpfulContent],
  },
  'language-detector': {
    summary:
      'Learn how to use the browser language detector, why short samples fail, and how to read alternative language guesses.',
    purpose:
      'The Language Detector guesses the language of pasted text. It helps when you have a paragraph or sentence and want a quick clue before translation, sorting, or research.',
    intro:
      'Found a paragraph in an unfamiliar language? Paste the text to get a language name and code before choosing a translation language. A longer passage in one language is more useful than a name or greeting.',
    enter: [
      'Paste a sentence or paragraph into Text to detect. The tool requires at least 20 characters after trimming spaces at the ends.',
      'Press Detect language.',
      'Read the language name, Language code, and up to three ranked guesses in Alternatives.',
      'Use more text if the result is unknown or surprising.',
    ],
    read: [
      'The top result is the closest match among the supported languages. A three-letter code such as spa identifies Spanish.',
      'Alternatives are useful when related languages look similar.',
      'The values labelled distance are rounded relative match scores, not a confidence percentage or proof of accuracy. Different guesses can show the same rounded value.',
      'Unknown, with code und, means the detector did not identify a supported language. Add a longer passage of ordinary prose and check again.',
    ],
    mistakes: [
      'Do not use one word as proof of a language.',
      'Do not use language detection to guess identity or nationality.',
      'Do not trust mixed-language, romanized, or heavily abbreviated text without checking.',
      'The compact franc-min package covers a limited set of supported languages. An unsupported language can receive an incorrect supported-language guess.',
    ],
    extraSections: [
      {
        title: 'Worked example: the Spanish sample',
        paragraphs: [
          'Choose the Spanish sample or paste "Esta herramienta funciona en el navegador." and press Detect language. This 42-character sample returns Spanish with language code spa in the current detector.',
          'The Alternatives line also includes Portuguese (por) and Dutch (nld). Those are lower-ranked comparisons, not additional languages proven to be present in the sentence.',
          'Use Spanish as a starting point for a translation preview, then check that the translation makes sense. For an important document, ask a fluent reader or qualified translator.',
        ],
        links: [{ href: '/tools/language-detector/', label: 'Try the Spanish sample in the Language Detector' }],
      },
    ],
    sources: [sourceLinks.franc, sourceLinks.googleHelpfulContent],
  },
  'text-summarizer': {
    summary:
      'Learn how to use the browser text summarizer, keep inputs short enough, and check summaries against the original.',
    purpose:
      'The Text Summarizer turns a passage into a shorter draft summary in the browser. It is useful for notes, article sections, and quick previews when you still plan to check the original.',
    enter: [
      'Paste a paragraph or short section with enough detail to summarize.',
      'Keep the input under the tool limit so it stays browser friendly.',
      'Press Summarize text and wait for the browser model or fallback.',
      'Compare the summary with the original before using it.',
    ],
    read: [
      'The summary is a draft of the main idea.',
      'It may skip details, exceptions, numbers, quotes, and source context.',
      'A fallback summary is extractive, so it may reuse original sentences.',
    ],
    mistakes: [
      'Do not publish a summary without checking the source text.',
      'Do not summarize medical, legal, finance, or tax details as final advice.',
      'Do not paste text you do not have permission to process or reuse.',
    ],
    sources: [sourceLinks.transformersJs, sourceLinks.googleHelpfulContent],
  },
  'keyword-extractor': {
    summary:
      'Learn how to use the browser keyword extractor on real drafts, read phrase counts, and avoid treating repeated words as search-volume data.',
    purpose:
      'The Keyword Extractor finds repeated topic words and short phrases in pasted text. It is useful for 80 to 1,500 word blog drafts, class notes, product copy, meeting notes, and support replies when you want to see what the text talks about most.',
    enter: [
      'Paste a natural text sample, such as a 700-word guide about refund policy and shipping delays.',
      'Use product copy, class notes, meeting notes, or a support article when you want a topic map.',
      'Press Extract keywords.',
      'Review repeated words and short phrases, then group close variants such as cost and costs by hand.',
      'Use the list as topic clues, then choose natural wording yourself.',
    ],
    read: [
      'Higher counts mean a term appears more often in the pasted text, not that people search for it.',
      'A "refund policy" count of 5 means that pair appears five times after filtering. Removing words or punctuation can join tokens, so it may not be a verbatim phrase in the original draft.',
      'Phrases such as "shipping delay," "battery life," or "charging time" can show repeated topics better than single words.',
      'The result is not search volume, keyword difficulty, or ranking advice.',
    ],
    mistakes: [
      'Do not stuff every repeated phrase into a page title.',
      'Do not ignore the reader, the wording, or the actual question being answered.',
      'Do not treat brand names, duplicate variants, or repeated filler words as automatically useful keywords.',
      'Do not use the list as a final SEO plan without checking intent and reader language.',
    ],
    sources: [sourceLinks.googleHelpfulContent, sourceLinks.transformersJs],
  },
  'image-classifier': {
    summary:
      'Learn how to use the browser image classifier with clear, low-stakes photos, read the top 5 labels, and understand why confidence scores are guesses instead of proof.',
    purpose:
      'The Image Classifier guesses likely labels for a chosen JPG, PNG, or WebP image in your browser. It is useful for simple object photos, classroom demos, file-naming clues, and low-stakes checks where a manual review still comes next.',
    enter: [
      'Choose a clear JPG, PNG, or WebP image with one main subject, such as a dog, plant, mug, vehicle, fruit, shoe, or desk object.',
      'Use a photo with good light and a simple background. A bright dog on a plain floor usually works better than a dark, crowded shelf.',
      'Press Classify image so your browser can load the image-classification model and process the local file.',
      'Review the top 5 labels and confidence scores, then compare them with what you can see in the image.',
      'Check important labels manually before naming a file, tagging a gallery, sorting notes, or sharing the result.',
    ],
    read: [
      'The top label is the model guess, not guaranteed truth. If the result says golden retriever at 72%, read that as the closest learned label, not proof of the dog breed.',
      'Scores are confidence values for the labels the model knows. A 72% label and a 19% label can both be wrong if the real object is outside the model training labels.',
      'The remaining labels are useful clues. If several labels point toward dog breeds, kitchenware, plants, or vehicles, the broad category may be more trustworthy than the exact label.',
      'Crowded, blurry, cropped, low-light, or unusual images can produce mixed labels. That is a signal to retake the photo or verify by eye.',
      'The result is not identity recognition, safety review, medical advice, product-authenticity proof, legal evidence, or content moderation.',
    ],
    mistakes: [
      'Do not use this for identity, medical, safety, legal, product-authenticity, or moderation decisions.',
      'Do not expect a crowded desk, group photo, store shelf, or dark room to produce one perfect label.',
      'Do not treat a breed, plant, food, or brand-like label as final without checking another source.',
      'Do not assume low confidence means the image is bad; it may simply show an object the model did not learn well.',
      'Do not upload private, sensitive, or identity-focused images just because the tool runs in your browser.',
    ],
    sources: [sourceLinks.transformersJs, sourceLinks.googleHelpfulContent],
  },
  'tone-checker': {
    summary:
      'Learn how to use the browser tone checker for short emails, support replies, captions, and chat messages without treating tone labels as proof of intent.',
    purpose:
      'The Tone Checker reviews how a short message may feel to a reader. It helps you spot friendly or helpful, formal or careful, urgent or direct, and unclear or mixed wording before you send an email, support reply, caption, or chat note.',
    enter: [
      'Paste at least 12 characters from one short message or draft.',
      'Use 1 to 5 sentences when possible so the tool has enough wording, punctuation, and context to compare.',
      'Try low-risk examples first, such as "Thanks for waiting. I can help with that now." or "Please fix this immediately before launch."',
      'Press Check tone.',
      'Read the likely tone label and the writing notes.',
      'Adjust the wording based on your audience and situation.',
    ],
    read: [
      'The top label is the closest match among friendly or helpful, formal or careful, urgent or direct, and unclear or mixed.',
      'A result such as urgent or direct at 64% means the wording may feel time-sensitive or blunt; it is not proof of the writer intent.',
      'Notes point to words, punctuation, and phrasing patterns that may affect how the text feels to a reader.',
      'The tool cannot know your audience, relationship, culture, humor, sarcasm, or full situation.',
    ],
    mistakes: [
      'Do not use tone output to accuse someone of intent.',
      'Do not ignore audience expectations or workplace style rules.',
      'Do not use the result as evidence for HR issues, legal risk, mental health, customer-safety decisions, or personality judgments.',
      'Do not paste private conflict messages unless you are comfortable processing them in your browser tab.',
      'Do not assume a direct message is rude; a launch request like "Please fix this immediately before launch" may simply be time-sensitive.',
    ],
    sources: [sourceLinks.transformersJs, sourceLinks.googleHelpfulContent],
  },
  'reading-level-checker': {
    title: 'Reading Level Checker: Fix Hard Sentences',
    description:
      'Use this free reading level checker to calculate grade and reading ease, find long sentences, and get practical revision clues for English text.',
    summary:
      'Learn how to check English reading level, find the longest sentence, and use plain-language revision clues before publishing.',
    purpose:
      'The Reading Level Checker is a browser-only English readability helper for help pages, classroom notes, email drafts, blog sections, and support replies. It calculates Flesch-Kincaid grade and Flesch Reading Ease, then shows the longest sentence, sentences over 20 words, average sentence length, and long-word share so you know where to start editing.',
    enter: [
      'Paste at least 40 characters of finished or nearly finished English text; one full paragraph works better than a headline.',
      'For a fairer result, test 100 to 800 words from the actual guide, help article, worksheet, or support reply.',
      'Press Check reading level and read the grade, reading ease, longest sentence, sentences-over-20 count, average sentence length, and long-word share.',
      'Start with the sentence shown in the revision panel. Check whether it carries more than one idea, then shorten or split it only when the meaning stays clear.',
      'For a quick test, paste: Enter your numbers, press calculate, and read the answer. The tool should show about grade 6.3, reading ease 66.1, no sentences over 20 words, and 2 long words.',
    ],
    read: [
      'Grade level is a Flesch-Kincaid estimate for English prose, not an official school placement or accessibility certificate.',
      'Reading ease falls when sentences run long or words use more syllables. Use the score to compare drafts, not to judge a reader.',
      'The first sentence shown is the longest detected sentence. It is a practical starting point, not proof that the sentence is wrong.',
      'The tool flags sentences over 20 words because the CDC says to strive for an average of 20 words and one idea per sentence. Clear longer sentences can stay.',
      'Long words are counted at 7 or more letters. Keep necessary names and technical terms, but explain unfamiliar words near their first use.',
      'W3C treats formulas as one way to measure reading level and also points to summaries, illustrations, definitions, and other supplemental content for complex information.',
    ],
    mistakes: [
      'Do not test only a headline, menu label, or one sentence and treat it as a full-page score.',
      'Do not assume low grade level means the text is correct, complete, persuasive, or trustworthy.',
      'Do not remove important legal, medical, finance, school, or product terms just to lower the number.',
      'Do not use the English result for mixed-language text, code, URLs, abbreviations, or number-heavy passages without checking the wording yourself.',
      'Do not ignore layout, examples, headings, tables, images, definitions, translation needs, or reader context.',
      'Do not compare a 40-word intro against a 1,000-word article without noting the sample size.',
    ],
    sources: [
      sourceLinks.fleschKincaid,
      sourceLinks.w3cReadingLevel,
      sourceLinks.cdcPlainLanguage,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'audio-video-transcriber': {
    title: 'How to Transcribe Audio or Video in Your Browser',
    description:
      'Turn a local recording into editable timestamped text, then check and download TXT, SRT, or WebVTT without uploading the media.',
    summary:
      'Learn how to inspect a local media file, choose a decodable audio track, run a pinned Whisper Tiny model, and correct a partial or complete transcript.',
    purpose:
      'The Audio and Video Transcriber creates a draft transcript from one permitted recording. Mediabunny reads the local container in five-minute sections, while a pinned Whisper Tiny model turns 16 kHz audio into timestamped text inside a separate browser worker.',
    enter: [
      'Choose one permitted audio or video file up to 250 MB and 60 minutes. The file stays on your device.',
      'Wait for the browser to identify the container, duration, audio tracks, and whether it can decode the selected codec.',
      'Choose the dialogue audio track when the file has more than one. Unsupported tracks are labelled before any model download.',
      'Choose English for the smaller English-only model, Auto for a model guess, or a named language for the multilingual model.',
      'Keep WebAssembly selected for the broadest compatibility. Try WebGPU beta only on a detected adapter and be ready for the automatic fallback.',
      'Confirm that you have permission to transcribe the recording, then press Transcribe recording and keep the tab open.',
      'Review completed sections while the next block runs. Stop at any time and keep the partial transcript.',
      'Click timestamps to listen again, edit mistakes, then copy the text or download TXT, SRT, or WebVTT.',
    ],
    read: [
      'A timestamp marks the model segment, not a word-perfect edit point. Click it and listen around the boundary before moving captions in an editor.',
      'TXT contains the transcript without caption syntax. SRT and WebVTT preserve start and end times for video players and editors.',
      'The tool publishes each completed five-minute section immediately. A later failure does not erase earlier text.',
      'A repeated five-second edge helps Whisper keep words near a block boundary. The browser removes matching repeated words and keeps timestamps moving forward.',
      'English uses a pinned timestamped Whisper Tiny English model. Auto and other languages use the pinned multilingual model.',
      'WebAssembly is the dependable q8 route. WebGPU can help on compatible Chromium devices, but long speech workloads can still use substantial browser memory.',
      'No audio, video, transcript, filename, or language choice is sent to Access Free Tools. The selected model files are fetched from Hugging Face after you start.',
      'Treat every transcript as a draft. Names, numbers, dates, accents, specialist words, crosstalk, music, and quiet speech need a listening check.',
    ],
    mistakes: [
      'Do not transcribe a private meeting, call, class, interview, or copyrighted recording without permission.',
      'Do not assume a smooth sentence was actually spoken. Whisper can create plausible text when audio is unclear or silent.',
      'Do not trust names, prices, account numbers, measurements, dates, or quotations without listening again.',
      'Do not label speakers from this output. Version one does not perform speaker diarization.',
      'Do not close or refresh the tab before downloading work you want to keep. Access Free Tools does not store it.',
      'Do not start with WebGPU just because it is available. Compatibility mode is the safer first choice for long recordings.',
      'Do not rename a file extension and expect the codec to change. Convert unsupported audio to a real MP3 or WAV file.',
      'Do not describe Auto as guaranteed language detection. It is the multilingual model making a best-effort language choice.',
    ],
    sources: [
      sourceLinks.whisperModelCard,
      sourceLinks.whisperEnglishTimestamped,
      sourceLinks.whisperMultilingualTimestamped,
      sourceLinks.transformersJs,
      sourceLinks.transformersWebGpu,
      sourceLinks.mediabunny,
    ],
  },
  'text-to-speech-audiobook-generator': {
    title: 'How to Turn Text into an MP3 in Your Browser',
    description:
      'Choose multilingual Supertonic or English Kokoro, assign fixed voices by chapter, and download 128 kbps MP3 files generated in your browser.',
    summary:
      'Learn how to paste text, import TXT, Markdown, or EPUB chapters locally, compare voice samples, cast chapter voices, and download MP3s or an ordered ZIP.',
    purpose:
      'The Text to Speech MP3 Generator runs either pinned Supertonic 3 or pinned Kokoro 82M with its MP3 encoder in a browser worker. It is for text you wrote, public-domain material, or text you have permission to convert.',
    enter: [
      'Paste up to 10,000 characters, or open a local TXT or Markdown file up to 64 KB or an EPUB up to 8 MB. The document is parsed locally and is not uploaded.',
      'Choose Single MP3 or Chapter MP3s. Review chapter names, text, and order before generating anything.',
      'Choose Supertonic for multilingual text or Kokoro 82M HQ for US and UK English.',
      'Choose a supported language, one fixed voice preset, and a reading speed from 0.9x to 1.5x. Kokoro has 28 grouped US and UK English voices.',
      'In chapter mode, use the default voice for new chapters, apply it to every chapter, or choose a different fixed voice on individual chapters.',
      'Play the pre-recorded samples to compare voices without loading a model, then confirm your rights and the model-use terms before pressing Generate MP3.',
      'Allow the selected model to download on first use: about 398 MB for Supertonic, about 326 MB for full-precision Kokoro WebGPU, or about 92 MB for Kokoro compatibility mode.',
      'Check the estimated duration and MP3 size before downloading the model. Then play and download the result before closing or refreshing the tab.',
      'In chapter mode, download each MP3 separately or create an ordered ZIP containing only the completed MP3 files.',
    ],
    read: [
      'Every fixed voice has a short pre-recorded sample at 1.0x speed. Playing a sample loads only that MP3, not the speech model, and it never uses your text.',
      'Model loading downloads the ONNX files from the pinned Hugging Face revision. It does not send your text to Hugging Face.',
      'Supertonic prefers WebGPU and falls back to WebAssembly. Kokoro prefers full-precision WebGPU and automatically retries with its q8 WebAssembly compatibility model when needed.',
      'A 90-second no-progress watchdog stops a stalled worker. Kokoro gets one automatic compatibility retry instead of leaving the Stop button running forever.',
      'Only one model worker stays loaded. Changing the model unloads the previous one before the new model can start.',
      'Long Kokoro input is divided into ordered sections before generation instead of being silently truncated at the model limit.',
      'Single mode provides one 128 kbps mono MP3. Chapter mode generates one chapter at a time through the same loaded worker, preserves completed files after a later failure, and allows one retry for the failed chapter.',
      'Every chapter keeps its own voice assignment. Supertonic chapter voices use the selected text language. Kokoro chapter voices automatically use their matching US or UK English dialect.',
      'Optional MP3 and ZIP names are cleaned for Windows and macOS. The chapter ZIP contains separate audio files only, never the source text.',
      'Favourite and recent voice IDs stay in local browser storage. Text, document names, audio, language, and voice choices are not stored there.',
      'Markdown headings and the EPUB reading spine become editable chapters. Unsafe paths, scripts, remote resources, encrypted EPUBs, nested archives, and suspicious compression are rejected.',
      'Supertonic Language not specified is best-effort processing, not detection. Kokoro browser support is currently US and UK English only.',
      'Listen for names, dates, abbreviations, formulas, numbers, missing lines, repeated lines, and mixed-language pronunciation before sharing the audio.',
    ],
    mistakes: [
      'Do not convert a book, article, course, or private document unless you have permission.',
      'Do not assume browser processing removes copyright, consent, or prohibited-use responsibilities.',
      'Do not describe either model\'s fixed voices as voice cloning or upload reference audio. The pilot supports neither feature.',
      'Do not assume a successful job means every word was pronounced correctly.',
      'Do not close or refresh the tab before downloading the MP3 because the browser-only result is not stored by Access Free Tools.',
      'Do not skip the imported chapter review. Navigation pages, unusual markup, names, and abbreviations can still need a manual correction before speech generation.',
      'Do not switch models to create character voices within one chapter set. Pick one model, then assign its fixed voices per chapter so the browser avoids large model swaps.',
      'Do not treat an open model as unrestricted. Supertonic uses OpenRAIL-M terms, while Kokoro and its browser code use Apache-2.0 components with separate attribution requirements.',
    ],
    sources: [
      sourceLinks.supertonic,
      sourceLinks.supertonicVoices,
      sourceLinks.supertonicLicense,
      sourceLinks.kokoroBrowser,
      sourceLinks.kokoroModel,
      sourceLinks.kokoroLicense,
      sourceLinks.phonemizer,
      sourceLinks.espeak,
      sourceLinks.wasmMediaEncoders,
    ],
  },
};

function buildAiMetaDescription(tool: (typeof aiTools)[number], summary: string) {
  const base = summary.replace(/\.$/, '');
  const description = `${base}. Includes input tips, output checks, privacy notes, and model limits for the ${tool.name}.`;
  return description.length > 160 ? `${description.slice(0, 156).trim()}...` : description;
}

function makeGuide(toolSlug: string): AiGuideDefinition {
  const tool = aiTools.find((candidate) => candidate.slug === toolSlug);
  const detail = guideDetails[toolSlug];

  if (!tool || !detail) {
    throw new Error(`Missing AI guide detail for ${toolSlug}`);
  }

  const isOcrTool = tool.slug === 'image-to-text-ocr-tool';
  const isReadingLevelTool = tool.slug === 'reading-level-checker';
  const isLanguageTool = tool.slug === 'language-detector';
  const isBrowserTtsTool = tool.slug === 'text-to-speech-audiobook-generator';
  const isBrowserTranscriber = tool.slug === 'audio-video-transcriber';

  return {
    slug: `how-to-use-${tool.slug}`,
    toolSlug: tool.slug,
    label: `${tool.name} guide`,
    title: detail.title ?? `How to use the ${tool.name}`,
    description: detail.description ?? buildAiMetaDescription(tool, detail.summary),
    path: `/blog/how-to-use-${tool.slug}/`,
    intro: detail.intro ?? `${detail.purpose} Use this guide to understand what to enter, how to read the output, and what to double-check before relying on the result.`,
    quickStart: aiInstructionRepairs[tool.slug]?.instructions ?? detail.enter,
    sections: [
      {
        title: isOcrTool
          ? 'What this OCR tool does'
          : isLanguageTool
            ? 'What this language detector does'
          : isReadingLevelTool
            ? 'What this readability tool does'
            : isBrowserTtsTool
              ? 'What this browser text-to-MP3 tool does'
              : isBrowserTranscriber
                ? 'What this browser transcriber does'
              : 'What this AI tool does',
        paragraphs: [
          detail.purpose,
          ...(aiInstructionRepairs[tool.slug]?.guidePrivacyParagraphs ?? [
          isOcrTool
            ? 'The important privacy idea is simple: the image is read in your browser tab. Access Free Tools does not need to receive the selected image for OCR to work.'
            : isLanguageTool
              ? 'Your pasted text is checked in this browser tab with franc-min. The tool does not send the text to a language-detection server.'
            : isReadingLevelTool
              ? 'Your text stays in the browser tab. The checker uses local English formulas and sentence counts, so it does not need a server model or text upload.'
              : isBrowserTtsTool
                ? 'The pasted text stays inside the browser tab and is sent only to the dedicated local worker. There is no TTS upload or server queue.'
                : isBrowserTranscriber
                  ? 'The local recording is decoded in a browser worker and never uploaded to Access Free Tools. The selected pinned model files download only after you start transcription.'
                : 'The important privacy idea is simple: your input runs in the browser tab. Access Free Tools does not need to receive the image or text for the tool to work.',
          isOcrTool
            ? 'The OCR worker, WebAssembly core, and language files are served from Access Free Tools after you press Read text. That first run can take longer than a normal calculator.'
            : isLanguageTool
              ? 'The detector compares character patterns with local language profiles. Its package loads when you run detection; it needs no server model or OCR language files.'
            : isReadingLevelTool
              ? 'The result uses word count, sentence count, and an English syllable estimate. Names, abbreviations, numbers, and mixed-language text can make that estimate less reliable.'
              : isBrowserTtsTool
                ? 'The selected model downloads on first use: about 398 MB for multilingual Supertonic, about 326 MB for full-precision English Kokoro on WebGPU, or about 92 MB for Kokoro compatibility mode. Only that model runs in a dedicated browser worker, where inference and MP3 creation stay local.'
                : isBrowserTranscriber
                  ? 'Mediabunny checks the container and audio codec before the speech model downloads. Supported containers can still fail when the current browser cannot decode the audio track inside them.'
                : 'For this first self-hosted pass, OCR files and the starter text classifier files are served from Access Free Tools after you click the tool button. Heavier experimental model tools may still download model files from a third-party model host until we self-host more models.',
          ]),
        ],
      },
      {
        title: 'How to read the result',
        paragraphs: [
          isOcrTool
            ? 'Start with the extracted text, then check the original image. OCR is useful, but it can still miss punctuation, split columns badly, or swap similar-looking characters.'
            : isLanguageTool
              ? 'Start with the language name and three-letter code, then inspect Alternatives. The ranking can help you choose what to check next, but it cannot certify the language.'
            : isReadingLevelTool
              ? 'Start with the grade and reading-ease estimates, then use the sentence preview and counts to choose one edit. Recheck the same passage so the comparison uses the same sample.'
              : isBrowserTtsTool
                ? 'Start with short, low-risk text. Download and listen to the MP3 before converting something longer.'
                : isBrowserTranscriber
                  ? 'Start with a short, clear recording. Click each timestamp around uncertain text, correct the words, and export only after checking important details.'
                : 'Start with the main result, then read the supporting notes. Browser AI tools are useful helpers, but they can still be wrong, incomplete, or unsure.',
        ],
        bullets: detail.read,
      },
      {
        title: 'Common mistakes to avoid',
        paragraphs: [
          'The safest way to use the result is to compare it with the original input and think about the real task you are doing.',
        ],
        bullets: detail.mistakes,
      },
      ...(detail.extraSections ?? []),
      {
        title: 'Research and references',
        paragraphs: [
          isBrowserTtsTool
            ? 'These primary sources define the browser runtime, pinned model capabilities, and OpenRAIL-M license boundary. Access Free Tools does not claim ownership of the model or preset voices.'
            : isBrowserTranscriber
              ? 'These primary sources define the media reader, pinned Whisper models, browser runtime, known accuracy limits, and experimental WebGPU boundary.'
            : 'These references shaped the tool behavior, browser-only model approach, privacy notes, and result limits.',
        ],
        links: detail.sources,
      },
    ],
    sidecarText: `Open the ${tool.name}, try one low-risk example, and check the result before using it in a real task.`,
  };
}

export const aiBlogGuides: AiGuideDefinition[] = aiTools.map((tool) => makeGuide(tool.slug));

export const aiBlogPosts: BlogPostDefinition[] = aiBlogGuides.map((guide) => ({
  slug: guide.slug,
  title: guide.title,
  label: guide.label,
  summary: guide.description,
}));
