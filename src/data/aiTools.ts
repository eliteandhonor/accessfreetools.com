import type { CategorySlug } from './categories';
import type { ToolDefinition, ToolExample, ToolFaq } from './tools';
import { aiInstructionRepairs } from './aiInstructionRepairs';

interface AiToolSpec {
  slug: string;
  name: string;
  summary: string;
  description: string;
  aliases?: string[];
  seoTitle?: string;
  seoDescription?: string;
  icon: string;
  modelNote: string;
  inputMeaning: string;
  resultMeaning: string;
  doubleCheck: string;
  useCases: string[];
  examples: ToolExample[];
  faq?: ToolFaq[];
  relatedSlugs: string[];
  applicationCategory?: ToolDefinition['applicationCategory'];
}

const aiCategory: CategorySlug = 'ai-tools';

function makeAiFaq(spec: AiToolSpec): ToolFaq[] {
  return [
    {
      question: `When should I use the ${spec.name}?`,
      answer: `Use it when you want a quick browser-side AI helper for this task: ${spec.useCases
        .slice(0, 2)
        .join(' ')} It is best for drafts, checks, and learning, not final expert decisions.`,
    },
    {
      question: `What do the main ${spec.name} inputs mean?`,
      answer: spec.inputMeaning,
    },
    {
      question: `How should I read the ${spec.name} result?`,
      answer: spec.resultMeaning,
    },
    {
      question: `What should I double-check before trusting the ${spec.name}?`,
      answer: spec.doubleCheck,
    },
    {
      question: 'Does this AI tool upload my input to Access Free Tools?',
      answer:
        'No. The tool runs in your browser tab. Your text or image is not uploaded to Access Free Tools. OCR plus the first text model are served from Access Free Tools after you click the button; some experimental model tools may still download model files from a third-party model host until we self-host more models.',
    },
    {
      question: 'Why can the first run take longer than normal?',
      answer:
        'The first run may need to download model, OCR, or language data into the browser. After that, the browser can often reuse cached files, but speed still depends on your device, browser, and internet connection.',
    },
    {
      question: 'Can I rely on the AI result as a final answer?',
      answer:
        'No. Treat it as a helpful estimate or draft. AI and text-analysis tools can misunderstand short inputs, blurry images, unusual wording, mixed languages, or topics outside their training data.',
    },
  ];
}

function makeAiTool(spec: AiToolSpec): ToolDefinition {
  const repair = aiInstructionRepairs[spec.slug];
  const faqAnswers = repair?.faqAnswers ?? (spec.slug === 'language-detector' ? {
    privacy: 'Language detection compares your pasted text with franc-min language profiles in this browser tab. It does not upload the text to a language-detection service. See the Privacy Policy for separate site analytics and session-replay handling.',
    firstRun: 'The browser loads the small franc-min package when you press Detect language. This detector does not download an AI model or OCR files. Use at least 20 characters after trimming outer spaces, and try a longer sample in one language if a guess looks wrong.',
  } : undefined);
  const faq = (spec.faq ?? makeAiFaq(spec)).map((entry) => {
    if (!faqAnswers) return entry;
    if (entry.question === 'Does this AI tool upload my input to Access Free Tools?' ||
        entry.question === 'Does the OCR image upload to Access Free Tools?') {
      return { ...entry, answer: faqAnswers.privacy };
    }
    if (entry.question === 'Why can the first run take longer than normal?' ||
        entry.question === 'Why can the first OCR run take longer?') {
      return { ...entry, answer: faqAnswers.firstRun };
    }
    return entry;
  });
  return {
    slug: spec.slug,
    name: spec.name,
    category: aiCategory,
    summary: spec.summary,
    description: spec.description,
    icon: spec.icon,
    aliases: spec.aliases ?? (spec.name === 'Image to Text OCR Tool' ? ['OCR Tool', 'Image Text Reader'] : undefined),
    seoTitle: spec.seoTitle ?? `${spec.name} | Free Browser AI Tool`,
    seoDescription: spec.seoDescription ?? spec.description,
    useCases: spec.useCases,
    examples: spec.examples,
    faq,
    relatedSlugs: spec.relatedSlugs,
    applicationCategory: spec.applicationCategory,
  };
}

export const aiTools: ToolDefinition[] = [
  makeAiTool({
    slug: 'image-to-text-ocr-tool',
    name: 'Image to Text OCR Tool',
    summary: 'Copy text from screenshots, labels, receipts, and clear document images without uploading the image.',
    description:
      'Use this free OCR tool to turn clear screenshots, labels, receipts, and simple document photos into editable text in your browser. Image quality matters, so start with sharp, straight, high-contrast text when you can.',
    seoTitle: 'Image to Text OCR Tool | Copy Text From Images',
    seoDescription:
      'Extract text from screenshots, labels, receipts, and simple document images with browser OCR. See privacy notes, best-image tips, and mistakes to check.',
    icon: 'tool-ai-ocr',
    modelNote: 'Uses self-hosted Tesseract.js OCR files in the browser after you choose an image and press Read text.',
    inputMeaning:
      'Choose a sharp image with typed or printed text. Pick the language shown in the image, and crop out menus, shadows, and tiny side text when you can.',
    resultMeaning:
      'Read the OCR output as a draft copy of the image text. Simple lines usually work best; columns, punctuation, tiny letters, handwriting, and totals still need checking.',
    doubleCheck:
      'Check names, totals, dates, invoice numbers, email addresses, and codes against the original image. OCR can mix up 0/O, 1/l/I, 5/S, and 8/B.',
    useCases: [
      'Copy a clear screenshot line without retyping it.',
      'Turn a label, receipt, or typed note photo into editable text.',
      'Grab text from a simple document image for a draft or study note.',
      'Pull a tracking number, product code, or receipt total into a draft before checking every character.',
      'Check whether a photo is sharp enough before you trust the OCR result.',
    ],
    examples: [
      {
        label: 'Invoice screenshot',
        expression: 'Upload an image that shows "Invoice INV-10018 total $42.50"',
        result: 'Copy the text, then check INV-10018 and $42.50 against the image.',
      },
      {
        label: 'Box label',
        expression: 'Upload a label that says "Do not stack above 4 boxes"',
        result: 'Use the extracted warning only after checking the number 4.',
      },
      {
        label: 'Study note photo',
        expression: 'Upload a sharp photo of typed notes with one heading and three lines',
        result: 'Copy the lines into a draft, then fix line breaks and punctuation.',
      },
      {
        label: 'Tracking label',
        expression: 'Upload a label that shows "ZX-1049-B" and a delivery date',
        result: 'Check every letter, number, and dash before pasting the code anywhere official.',
      },
    ],
    faq: [
      {
        question: 'When should I use the Image to Text OCR Tool?',
        answer:
          'Use it when a clear screenshot, label, receipt, or typed note has text you do not want to retype. It is best for simple printed text, not messy handwriting or official transcripts.',
      },
      {
        question: 'Does the OCR image upload to Access Free Tools?',
        answer:
          'No. The image is read in your browser tab. The OCR worker, core, and language files load from Access Free Tools after you press Read text, but the selected image is not uploaded to our server.',
      },
      {
        question: 'What kind of image gives the best OCR result?',
        answer:
          'Image quality changes OCR accuracy. Use a sharp, straight, high-contrast image. Crop close to the text, avoid glare, and zoom in before taking a screenshot if the original text is tiny.',
      },
      {
        question: 'Can this read handwriting?',
        answer:
          'Not reliably. Tesseract-style OCR works much better on typed or printed text. Handwriting, cursive, decorative fonts, and low-light photos can produce messy output.',
      },
      {
        question: 'Why can the first OCR run take longer?',
        answer:
          'The browser may need to download the OCR worker, WebAssembly core, and OCR language model data the first time. After that, your browser can often reuse cached files.',
      },
      {
        question: 'What should I double-check before copying the result?',
        answer:
          'Check names, totals, dates, invoice numbers, email addresses, and codes. OCR can confuse characters like 0/O, 1/l/I, 5/S, and 8/B.',
      },
      {
        question: 'Can I use OCR for receipts, totals, or product codes?',
        answer:
          'Yes, but treat the result as a draft. Compare totals, decimal points, dates, invoice numbers, tracking codes, and product codes against the image before you paste or submit them.',
      },
      {
        question: 'What should I try if the OCR output is messy?',
        answer:
          'Crop closer, retake the photo straight-on, brighten the image, increase contrast, or use a higher-resolution screenshot. Then run OCR again and compare the result with the original.',
      },
      {
        question: 'Should I use this for private IDs, passwords, or legal records?',
        answer:
          'No. Even with browser-side OCR, do not process passwords, private IDs, bank records, medical records, legal text, or sensitive work documents unless you fully understand the privacy and accuracy risk.',
      },
    ],
    relatedSlugs: ['image-classifier', 'text-summarizer', 'keyword-extractor'],
  }),
  makeAiTool({
    slug: 'sentiment-analyzer',
    name: 'Sentiment Analyzer',
    summary: 'Check whether text reads positive, negative, or uncertain in your browser.',
    description:
      'Use this free browser sentiment analyzer to check 1 to 3 sentence reviews, comments, or draft replies for positive, negative, or uncertain tone.',
    icon: 'tool-ai-sentiment',
    modelNote: 'Uses a self-hosted Transformers.js text model only after you press Analyze sentiment.',
    inputMeaning:
      'Paste one focused sentence, review, comment, or short paragraph. For example, use a 1 to 3 sentence support reply or product review instead of a full page, because longer text can mix different emotions.',
    resultMeaning:
      'Read the label as the model prediction and the score as confidence for that prediction. If positive is about 92% and negative is about 8%, the text probably reads positive, but the model still may miss sarcasm, context, or intent.',
    doubleCheck:
      'Check sarcasm, jokes, mixed reviews, slang, and sensitive topics manually. Sentiment models can miss tone when the words are positive but the meaning is negative.',
    useCases: [
      'Check the emotional direction of a 1 to 3 sentence review or comment.',
      'Compare two draft messages before sending a customer reply.',
      'Spot strongly negative wording before publishing support, product, or app-store copy.',
      'Practice understanding sentiment labels for school or data projects.',
    ],
    examples: [
      { label: 'Positive review', expression: 'This saved me 10 minutes and felt clear.', result: 'Likely positive, then check the confidence score.' },
      { label: 'Negative review', expression: 'The answer was confusing and I had to redo everything twice.', result: 'Likely negative, but reread the full context.' },
      { label: 'Mixed message', expression: 'The idea is good, but step 2 needs work.', result: 'Check manually because mixed text can split the score.' },
    ],
    relatedSlugs: ['tone-checker', 'keyword-extractor', 'reading-level-checker'],
  }),
  makeAiTool({
    slug: 'language-detector',
    name: 'Language Detector',
    summary: 'Guess the language of pasted text with browser-side language detection.',
    description:
      'Use this free browser language detector to check a sentence or short paragraph, see likely languages, and spot uncertain text.',
    icon: 'tool-ai-language',
    modelNote: 'Uses the open-source franc language detector in the browser after you press Detect language.',
    inputMeaning:
      'Paste one natural sentence or short paragraph, such as a support note, product review, or copied message. For example, a 5 to 50 word note is usually stronger than 1 or 2 loose words. Avoid single words, names, addresses, URLs, and tracking codes because they can look like many languages.',
    resultMeaning:
      'Read the top language as the best guess and alternatives as nearby matches. If Spanish is high but Portuguese also appears, check the full sentence before translating or tagging it.',
    doubleCheck:
      'Check short text, mixed-language text, romanized words, names, addresses, URLs, and technical strings manually. A language detector is a clue, not proof of the writer, country, or location.',
    useCases: [
      'Check the likely language of a support note, comment, or short review before routing it.',
      'Compare alternatives when Spanish, Portuguese, Italian, or French text looks similar.',
      'Flag text that is too short, mixed, romanized, or code-heavy for a confident label.',
      'Sort simple text samples before translation, research, or cleanup.',
    ],
    examples: [
      { label: 'English sentence', expression: 'This support note was clear and easy to follow.', result: 'Likely English, then check alternatives.' },
      { label: 'Spanish sentence', expression: 'Esta herramienta funciona en el navegador.', result: 'Likely Spanish, but compare close Romance-language matches.' },
      { label: 'Short text', expression: 'Hola', result: 'Too short or uncertain; paste a full sentence.' },
    ],
    relatedSlugs: ['text-summarizer', 'keyword-extractor', 'text-case-converter'],
  }),
  makeAiTool({
    slug: 'text-summarizer',
    name: 'Text Summarizer',
    summary: 'Summarize pasted notes into a browser-generated draft.',
    description:
      'Use this free browser text summarizer to condense 120 to 900 words of notes, article text, or support updates into a short draft summary you can check against the source.',
    icon: 'tool-ai-summary',
    modelNote: 'Uses a Transformers.js summarization model after you press Summarize text, with a simple extractive fallback if the model is not available.',
    inputMeaning:
      'Paste a paragraph or short section with enough context, usually 120 to 900 words. Notes, help docs, class material, and article excerpts work better than one sentence or a full document.',
    resultMeaning:
      'Read the result as a draft of the main point. If the source says a deadline is June 15 or a price is $42.50, check those details in the original before copying the summary.',
    doubleCheck:
      'Compare the summary with the original before publishing, studying, or sending it. Names, dates, dollar amounts, quoted wording, health details, legal details, finance details, and tax details need manual checking.',
    useCases: [
      'Condense a 300-word class note into a few review lines.',
      'Summarize a support update before writing a reply or status note.',
      'Preview a long article section before deciding whether to read it closely.',
      'Check whether a passage has one clear main point or too many mixed ideas.',
    ],
    examples: [
      { label: 'Study note', expression: 'Paste 180 words about photosynthesis notes', result: 'Short draft summary of the main process' },
      { label: 'Support update', expression: 'Paste a 300-word update with dates and owners', result: 'Summary draft, then verify each date and name' },
      { label: 'Too short', expression: 'Paste one sentence: The meeting moved.', result: 'Add more context before trusting the summary.' },
    ],
    relatedSlugs: ['keyword-extractor', 'reading-level-checker', 'sentiment-analyzer'],
  }),
  makeAiTool({
    slug: 'keyword-extractor',
    name: 'Keyword Extractor',
    summary: 'Pull repeated and important words or phrases from pasted text.',
    description:
      'Find repeated topic words and short phrases in pasted drafts, class notes, product copy, or support notes without sending text to Access Free Tools.',
    icon: 'tool-ai-keywords',
    modelNote:
      'Uses count-based browser text analysis, not search-volume data or a ranking model, so it runs fast and keeps pasted text local.',
    inputMeaning:
      'Paste 80 to 1,500 words when possible: a draft section, study notes, product copy, meeting notes, or a support reply. The tool lowercases the text, removes common filler words, counts repeated terms, and highlights short phrases that appear more than once.',
    resultMeaning:
      'Read the list as a map of repeated topics. A "refund policy" count of 5 means that pair occurs five times after filtering. Removed words and punctuation can join tokens, so check the original draft before treating a pair as a verbatim phrase. Counts do not measure search demand.',
    doubleCheck:
      'Check intent, reader language, brand names, duplicate variants, and missing terms before using a keyword list in a title, blog, or product page. Merge close forms such as cost and costs manually.',
    useCases: [
      'Find repeated topics in a 700-word blog draft before writing a title.',
      'Check whether product copy mentions the same feature names customers use.',
      'Pull vocabulary from class notes before making flashcards.',
      'Spot accidental repetition in a support article or FAQ.',
    ],
    examples: [
      {
        label: 'Blog draft',
        expression: 'Paste a 700-word guide about refund policy and shipping delays',
        result: 'Repeated phrases such as "refund policy" and "shipping delay"',
      },
      {
        label: 'Product notes',
        expression: 'Paste product copy with battery life, charging time, and warranty notes',
        result: 'Topic list with counts for battery, charging, and warranty',
      },
      {
        label: 'Class notes',
        expression: 'Paste 250 words about photosynthesis and chlorophyll',
        result: 'Main vocabulary such as chlorophyll, sunlight, and carbon dioxide',
      },
    ],
    relatedSlugs: ['text-summarizer', 'reading-level-checker', 'slug-generator'],
  }),
  makeAiTool({
    slug: 'image-classifier',
    name: 'Image Classifier',
    summary: 'Classify an uploaded image in your browser with model confidence notes.',
    description:
      'Classify clear, low-stakes images in your browser with top model labels and confidence scores without uploading the file to Access Free Tools.',
    icon: 'tool-ai-image',
    modelNote:
      'Loads the Xenova/vit-base-patch16-224 image-classification model after you choose an image and press Classify image.',
    inputMeaning:
      'Choose a JPG, PNG, or WebP image with one clear main subject, such as a pet, plant, vehicle, food, or household object. The classifier works best with good light, a simple background, and images that are not crowded or identity-sensitive.',
    resultMeaning:
      'Read the top 5 labels as model guesses and the percentages as confidence scores. A label such as golden retriever at 72% means the model found that training label most similar; it is not proof of breed, identity, product authenticity, or safety.',
    doubleCheck:
      'Check important image labels manually, especially for rare objects, mixed scenes, brand names, animals, plants, and anything consequential. Do not use this tool for identity, safety, medical, legal, product-authenticity, or moderation decisions.',
    useCases: [
      'Get a quick label guess for a simple object photo before naming a file.',
      'Compare confidence scores for a pet, plant, vehicle, food, or household item.',
      'Learn how image classification results are presented.',
      'Spot when a crowded or low-light image produces uncertain guesses.',
    ],
    examples: [
      {
        label: 'Clear pet photo',
        expression: 'Choose a bright photo of one dog on a plain floor',
        result: 'Top labels with confidence scores and a manual breed check',
      },
      {
        label: 'Kitchen object',
        expression: 'Choose a clear mug or bowl photo',
        result: 'Object-like labels, not a product-authenticity result',
      },
      {
        label: 'Crowded scene',
        expression: 'Choose a busy desk or shelf photo',
        result: 'Mixed or lower-confidence labels to verify manually',
      },
    ],
    relatedSlugs: ['image-to-text-ocr-tool', 'color-contrast-checker', 'aspect-ratio-calculator'],
  }),
  makeAiTool({
    slug: 'tone-checker',
    name: 'Tone Checker',
    summary: 'Check whether pasted text sounds friendly, formal, urgent, or unclear.',
    description:
      'Check the likely tone of a short email, support reply, caption, or chat message in your browser without uploading the text to Access Free Tools.',
    icon: 'tool-ai-tone',
    modelNote:
      'Uses a self-hosted zero-shot browser text classifier after you press Check tone, then falls back to local wording and punctuation clues if the model is not available.',
    inputMeaning:
      'Paste at least 12 characters from one short message or draft. Emails, support replies, captions, and workplace chat notes work best when they are 1 to 5 sentences and still have enough context to show word choice, punctuation, and phrasing.',
    resultMeaning:
      'Read the top label as the closest writing tone among friendly or helpful, formal or careful, urgent or direct, and unclear or mixed. A result such as urgent or direct at 64% means the wording may feel time-sensitive or blunt; it is not proof of the writer intent.',
    doubleCheck:
      'Check audience, role, culture, relationship, humor, sarcasm, and the real situation yourself. Do not use tone output to judge personality, intent, HR issues, legal risk, mental health, or customer-safety decisions.',
    useCases: [
      'Review a short email before sending it to a customer, teacher, or teammate.',
      'Make a support reply sound calmer before it leaves the help desk.',
      'Compare a casual caption with a more formal rewrite.',
      'Spot wording that may feel urgent, blunt, or unclear in a chat message.',
    ],
    examples: [
      {
        label: 'Friendly support reply',
        expression: 'Thanks for waiting. I can help with that now.',
        result: 'Likely friendly or helpful, with a quick check for missing detail',
      },
      {
        label: 'Launch request',
        expression: 'Please fix this immediately before launch.',
        result: 'Likely urgent or direct, not automatically rude or wrong',
      },
      {
        label: 'Formal client note',
        expression: 'We appreciate your patience and will review the request.',
        result: 'Likely formal or careful, with audience context still needed',
      },
    ],
    relatedSlugs: ['sentiment-analyzer', 'reading-level-checker', 'text-case-converter'],
  }),
  makeAiTool({
    slug: 'reading-level-checker',
    name: 'Reading Level Checker',
    summary: 'Check English reading grade and find the first sentence to simplify.',
    description:
      'Paste English text to calculate Flesch-Kincaid grade and reading ease, flag sentences over 20 words, and find the longest sentence to review in your browser.',
    aliases: ['Flesch-Kincaid Calculator', 'Readability Checker', 'Reading Grade Calculator'],
    seoTitle: 'Reading Level Checker | Grade & Sentence Review',
    seoDescription:
      'Check English reading grade and reading ease, then find long sentences and words to review first. Free, private, and runs in your browser.',
    icon: 'tool-ai-reading',
    modelNote: 'Uses English readability formulas and sentence checks in your browser. No server model or text upload is needed.',
    inputMeaning:
      'Paste at least 40 characters of English prose from a paragraph, help article, school note, blog draft, or instruction block. A 100 to 800 word sample usually gives a steadier estimate than a headline, menu label, or single sentence.',
    resultMeaning:
      'Read the grade as a Flesch-Kincaid estimate, then use the longest-sentence preview, sentences-over-20 count, and long-word share to choose what to edit first. A flag is a review clue, not an automatic failure.',
    doubleCheck:
      'Check jargon, audience age, subject difficulty, layout, examples, images, names, abbreviations, numbers, and language mix yourself. A low grade estimate does not prove the text is accurate, useful, accessible, or right for every reader.',
    useCases: [
      'Find the longest sentence in a help article before publishing.',
      'Check whether a support reply has sentences over 20 words.',
      'Compare the same 300-word draft before and after splitting long sentences.',
      'Review jargon and long-word share in school notes, instructions, or onboarding text.',
    ],
    examples: [
      {
        label: 'Simple help text',
        expression: 'Enter your numbers, press calculate, and read the answer.',
        result: 'About grade 6.3, reading ease 66.1, no sentences over 20 words, and 2 long words',
      },
      {
        label: 'Long support sentence',
        expression: 'Paste a support reply with one sentence longer than 20 words.',
        result: 'The longest sentence appears first with its word count and a split-or-shorten clue',
      },
      {
        label: 'Technical paragraph',
        expression: 'Paste a jargon-heavy paragraph about implementation details.',
        result: 'Grade and reading-ease estimates plus long-word count and share',
      },
    ],
    faq: [
      {
        question: 'What formulas does the Reading Level Checker use?',
        answer:
          'It uses the Flesch-Kincaid grade formula and Flesch Reading Ease. Both use average sentence length and estimated English syllables per word. The page shows the exact equations after each check.',
      },
      {
        question: 'How should I read the grade level and reading-ease scores?',
        answer:
          'Treat grade level as an estimate of English text difficulty. Higher reading-ease scores usually mean easier scanning. Double-check the wording with your real audience because neither score measures accuracy, usefulness, tone, layout, or subject knowledge.',
      },
      {
        question: 'Why does the tool flag sentences over 20 words?',
        answer:
          'The 20-word mark is an editing checkpoint based on current CDC plain-language guidance to aim for about 20 words per sentence. A longer sentence can still be clear, so review the idea and wording before you split it.',
      },
      {
        question: 'How does the tool choose the first sentence to review?',
        answer:
          'It counts the words in each detected sentence and shows the longest one first. This gives you a concrete place to start, but jargon, missing context, poor order, and weak examples can matter more than sentence length.',
      },
      {
        question: 'Does a lower grade level always make writing better?',
        answer:
          'No. Keep necessary names, legal terms, medical terms, product names, and technical vocabulary when your reader needs them. Explain unfamiliar terms and improve the surrounding sentence instead of chasing the lowest number.',
      },
      {
        question: 'Can I use this checker for languages other than English?',
        answer:
          'Not reliably. The syllable estimate and formulas on this page are designed for English prose. Mixed-language text, abbreviations, names, numbers, code, and URLs can distort the score.',
      },
      {
        question: 'Does this score prove that my page is accessible?',
        answer:
          'No. This is not an accessibility certificate. A readability formula is one signal; accessibility also depends on the audience, structure, headings, definitions, examples, images, supplemental explanations, and assistive technology.',
      },
      {
        question: 'Does the Reading Level Checker upload my text?',
        answer:
          'No. The formulas and sentence checks run in your browser tab. Your text is not uploaded to Access Free Tools, and no model download is needed for this checker.',
      },
    ],
    relatedSlugs: ['keyword-extractor', 'text-summarizer', 'word-counter'],
  }),
  makeAiTool({
    slug: 'audio-video-transcriber',
    name: 'Audio and Video Transcriber',
    summary: 'Turn a local recording into an editable transcript and subtitle files without uploading the media.',
    description:
      'Transcribe one local audio or video file in your browser with pinned Whisper Tiny models. Review timestamped text, then download TXT, SRT, or WebVTT without uploading the recording to Access Free Tools.',
    aliases: ['Audio Transcriber', 'Video Transcriber', 'Audio to Text Converter', 'Video to Text Converter'],
    seoTitle: 'Audio and Video Transcriber | Browser Whisper Tool',
    seoDescription:
      'Transcribe local audio or video in your browser. Edit timestamped text and download TXT, SRT, or WebVTT without uploading your recording.',
    icon: 'tool-ai-transcribe',
    modelNote:
      'English uses a pinned timestamped Whisper Tiny English model. Auto and other languages use a pinned multilingual Whisper Tiny model. The selected quantized model downloads only after transcription starts and runs in a dedicated browser worker.',
    inputMeaning:
      'Choose one permitted MP3, WAV, M4A, AAC, FLAC, OGG, Opus, MP4, MOV, WebM, or MKV file up to 250 MB and 60 minutes. The browser checks its audio tracks and codec before downloading a speech model.',
    resultMeaning:
      'The result is editable timestamped text. Click a timestamp to check the local recording, then copy the transcript or download TXT, SRT, or WebVTT captions.',
    doubleCheck:
      'Listen again for names, numbers, dates, specialist terms, accents, overlapping speakers, quiet speech, and sections with music or noise. Whisper output is a draft, not a certified transcript.',
    applicationCategory: 'MultimediaApplication',
    useCases: [
      'Create a draft transcript from your own interview, lesson, meeting, voice note, or video recording.',
      'Build editable SRT or WebVTT caption files for permitted media.',
      'Recover completed transcript sections when a long browser job is cancelled or a later block fails.',
      'Check several audio tracks in a video before choosing the dialogue track.',
      'Transcribe English with the smaller English model or choose a named language for multilingual speech.',
      'Keep private media on the device instead of sending it to a speech API or upload server.',
    ],
    examples: [
      {
        label: 'English voice note',
        expression: 'Choose a 6-minute MP3, select English, confirm permission, and transcribe',
        result: 'Editable timestamped text plus TXT, SRT, and WebVTT downloads',
      },
      {
        label: 'Caption a local video',
        expression: 'Choose a 20-minute MP4, select its dialogue track, and use WebAssembly mode',
        result: 'Caption segments appear as each five-minute block finishes',
      },
      {
        label: 'Spanish recording',
        expression: 'Choose Spanish before starting a permitted M4A recording',
        result: 'The multilingual Whisper Tiny model produces a timestamped draft for manual review',
      },
      {
        label: 'Interrupted long recording',
        expression: 'Stop after two completed sections of a longer recording',
        result: 'The completed partial transcript remains editable and downloadable',
      },
    ],
    faq: [
      {
        question: 'Does the transcriber upload my audio or video?',
        answer:
          'No. The selected file, decoded audio, transcript, filename, and language choice stay in this browser tab. They are not uploaded to Access Free Tools. The pinned model files download from Hugging Face only after you start transcription.',
      },
      {
        question: 'Which audio and video files can I transcribe?',
        answer:
          'The tool can inspect MP3, WAV, M4A or AAC, FLAC, OGG or Opus, MP4, MOV, WebM, and MKV containers. The audio codec inside the file must also be decodable by your current browser. An unsupported codec is rejected before the model download.',
      },
      {
        question: 'What do the main Audio and Video Transcriber inputs mean?',
        answer:
          'Choose the local recording, then select its dialogue audio track when several tracks are present. English uses the smaller English model; Auto or a named non-English language uses the multilingual model. WebAssembly is the compatibility choice, while WebGPU is an optional beta path on supported devices.',
      },
      {
        question: 'What are the file and recording limits?',
        answer:
          'The beta accepts one file up to 250 MB and 60 minutes. Desktop is recommended above 15 minutes because decoding and speech recognition use device memory and processor time.',
      },
      {
        question: 'Which model does the browser transcriber use?',
        answer:
          'English uses the pinned onnx-community Whisper Tiny English timestamped model. Auto and named non-English choices use the pinned multilingual timestamped model. Both use quantized browser files and run through Transformers.js.',
      },
      {
        question: 'How should I read the Audio and Video Transcriber result?',
        answer:
          'Treat the timestamped text as an editable first draft, not a certified transcript. Click a timestamp to compare each important section with the local recording before copying or exporting it.',
      },
      {
        question: 'What should I double-check before trusting the Audio and Video Transcriber transcript?',
        answer:
          'Check names, numbers, dates, accents, technical terms, overlapping voices, quiet speech, music, and noisy sections. Whisper can mishear speech or produce plausible words that were not spoken.',
      },
      {
        question: 'Can I edit and download a partial transcript?',
        answer:
          'Yes. Each completed five-minute section appears immediately. If you stop the job or a later section fails, completed caption segments stay available for editing, copying, and TXT, SRT, or WebVTT download.',
      },
      {
        question: 'What is the difference between SRT and WebVTT?',
        answer:
          'Both store timed captions. SRT is widely accepted by editors and video platforms. WebVTT is designed for web video and starts with a WEBVTT header. TXT contains the words without caption timing syntax.',
      },
      {
        question: 'Why does the tool offer WebAssembly and WebGPU?',
        answer:
          'The q8 WebAssembly path is the dependable compatibility choice. WebGPU can be faster on a supported device but remains experimental for this workload, so the tool detects an adapter, labels the option as beta, and can fall back to WebAssembly.',
      },
      {
        question: 'Can this tool identify different speakers?',
        answer:
          'No. Version one does not provide speaker identification or diarization. It also does not translate, record a microphone, import URLs, process batches, or render captions back into a video.',
      },
      {
        question: 'What happens when I reset or close the page?',
        answer:
          'The browser revokes the local media URL and terminates its workers. The transcript is not stored by Access Free Tools, so download the files you want before resetting, refreshing, or closing the tab.',
      },
    ],
    relatedSlugs: ['text-to-speech-audiobook-generator', 'image-to-text-ocr-tool', 'language-detector', 'text-summarizer'],
  }),
  makeAiTool({
    slug: 'text-to-speech-audiobook-generator',
    name: 'Text to Speech MP3 Generator',
    summary: 'Turn permitted text into a downloadable MP3 directly in your browser.',
    description:
      'Listen to voice samples, paste text or open a local TXT, Markdown, or EPUB file, assign voices by chapter, then download MP3s or an ordered ZIP. No text is uploaded to Access Free Tools.',
    aliases: ['Text to Speech Generator', 'Text to MP3 Converter', 'Multilingual Text to Speech'],
    seoTitle: 'Text to Speech MP3 Generator | Browser TTS',
    seoDescription:
      'Convert permitted text into a downloadable MP3 with multilingual Supertonic or full-precision English Kokoro browser speech. No text upload.',
    icon: 'tool-ai-voice',
    modelNote:
      'Choose pinned Supertonic 3 for 31 named languages and 10 described voices, or pinned Kokoro 82M for full-precision English speech with 28 fixed US and UK voices. Kokoro can attempt WebGPU when an adapter is detected and automatically falls back to its compact q8 WebAssembly model. Only the selected model and voice load. Inference and MP3 creation stay on the visitor device.',
    inputMeaning:
      'Paste text or open a local TXT, Markdown, or EPUB document containing up to 10,000 characters combined. Review imported chapters, then choose one model, a language, a default voice, optional chapter-specific voices, and a reading speed.',
    resultMeaning:
      'Compare a pre-recorded sample for every fixed voice without loading a model, save favourite voices locally, and check the estimated length and size. Generate one 128 kbps mono MP3 or separate voice-labelled chapter MP3s with an ordered ZIP.',
    doubleCheck:
      'Check pronunciation, language choice, missing or repeated lines, rights to the source text, and any prohibited use before sharing or publishing generated audio.',
    useCases: [
      'Create private listening copies of your own notes, drafts, stories, or public-domain text.',
      'Download spoken instructions or study notes as a standard MP3 file.',
      'Turn permitted Markdown headings or an EPUB reading order into named, reorderable chapter MP3s.',
      'Give narration, quoted sections, or dialogue chapters different fixed voices while keeping one model loaded.',
      'Use Supertonic for multilingual text or compare Kokoro fixed voices for US and UK English.',
      'Create accessibility or study audio without a server queue, account, or paid processing plan.',
    ],
    examples: [
      {
        label: 'Short English draft',
        expression: 'Paste a 2,000-character draft, choose Supertonic, English, preset F1, and 1.0x speed',
        result: 'One 128 kbps MP3 held in the browser tab for listening and download',
      },
      {
        label: 'Study notes',
        expression: 'Paste permitted notes, choose their language and a fixed voice, then press Generate MP3',
        result: 'Local audio playback and an MP3 download without uploading the notes',
      },
      {
        label: 'Two-voice chapter set',
        expression: 'Choose Chapter MP3s, assign Bella to narration and Emma to a quoted chapter, then generate',
        result: 'Two labelled MP3 results and one ordered audio-only ZIP from the same loaded Kokoro model',
      },
      {
        label: 'Higher-quality English model',
        expression: 'Choose Kokoro, English (United States), and the Bella fixed voice',
        result: 'English speech from full-precision WebGPU or the automatic q8 compatibility fallback as a downloadable MP3',
      },
    ],
    faq: [
      {
        question: 'How do I turn text into an MP3?',
        answer:
          'Paste text or open a local TXT, Markdown, or EPUB file with up to 10,000 characters combined. Choose single or chapter mode, compare the voice samples, select a language, voice, and speed, accept the rights notice, then generate and download the MP3 files.',
      },
      {
        question: 'Does playing a voice sample download the speech model?',
        answer:
          'No. Each fixed voice has a short pre-recorded MP3 sample. Playing it downloads only that small audio file, not the Supertonic or Kokoro model, and it does not use your text.',
      },
      {
        question: 'Does Access Free Tools upload my text?',
        answer:
          'No. The text stays in your browser tab and is sent only to the local browser worker. It is not uploaded to Access Free Tools or included in requests to the model host.',
      },
      {
        question: 'Where is the text-to-speech model running?',
        answer:
          'The selected Supertonic or Kokoro model runs in a dedicated worker inside your browser. Access Free Tools serves the page, while pinned model files are downloaded from Hugging Face only after you start generation.',
      },
      {
        question: 'Does Access Free Tools store my text or generated audio?',
        answer:
          'No. Your text is not uploaded. It stays in a worker inside this browser tab, and the generated MP3 is held in a temporary browser URL for the current tab. Download the file before closing or refreshing the page.',
      },
      {
        question: 'Can I download the generated speech as an MP3?',
        answer:
          'Yes. The browser encodes each result as a 128 kbps mono MP3. Single mode provides one file. Chapter mode keeps separate ordered MP3s and can package completed chapters in a ZIP that contains no source text.',
      },
      {
        question: 'Can each chapter use a different voice?',
        answer:
          'Yes. Choose one browser model for the chapter set, then assign any fixed voice from that model to each chapter. Kokoro can mix its US and UK English voices and uses the matching dialect for each chapter. The queue keeps one model loaded and changes only the small voice file when needed.',
      },
      {
        question: 'Does best effort detect the language?',
        answer:
          'No. Supertonic best effort processes text without a named language; it is not language detection. Kokoro does not offer that option and its current browser path supports only US and UK English.',
      },
      {
        question: 'Can I clone a voice or upload my own voice?',
        answer:
          'No. The pilot offers 10 fixed Supertonic presets and 28 fixed Kokoro voices for US and UK English. It does not support voice uploads, cloning, reference audio, or custom voice data.',
      },
      {
        question: 'How much text can I convert at once?',
        answer:
          'You can convert up to 10,000 characters at a time, either as one text or across up to 100 chapters. TXT and Markdown files can be up to 64 KB, and EPUB files can be up to 8 MB. Oversized or unsafe documents are rejected instead of silently truncated.',
      },
      {
        question: 'Are Markdown and EPUB files uploaded or stored?',
        answer:
          'No. The browser reads and parses the selected document locally. Remote resources, scripts, encrypted EPUBs, unsafe archive paths, nested archives, and suspicious compression are rejected. Only the chapter text you review is passed to the local speech worker.',
      },
      {
        question: 'Can I use any book or article I find online?',
        answer:
          'No. Use text you wrote, public-domain text, or material you have permission to convert. You must also follow the model license, prohibited-use terms, copyright rules, and any limits on sharing the resulting audio.',
      },
      {
        question: 'Will every name and number be pronounced correctly?',
        answer:
          'No. Text-to-speech can misread names, abbreviations, formulas, code, dates, phone numbers, mixed languages, and unusual punctuation. Double-check the MP3 by listening, then correct the text before generating again.',
      },
      {
        question: 'Why can browser speech generation take a long time?',
        answer:
          'Supertonic downloads about 398 MB and prefers WebGPU, with a slower WebAssembly fallback. Kokoro downloads about 326 MB for full-precision WebGPU or about 92 MB for its automatic q8 WebAssembly compatibility mode. Generation time also depends on text length, section count, connection speed, and device memory.',
      },
      {
        question: 'Which browser text-to-speech model should I choose?',
        answer:
          'Choose Supertonic when you need one of its 31 named languages. Try Kokoro 82M HQ for US or UK English and a more natural English voice choice. Kokoro prefers full-precision WebGPU and can retry with a smaller q8 WebAssembly model when compatibility mode is needed. Both use fixed voices, stay in the browser tab, and need a listening check before you rely on the MP3.',
      },
    ],
    relatedSlugs: ['text-summarizer', 'reading-level-checker', 'word-counter'],
  }),
];
