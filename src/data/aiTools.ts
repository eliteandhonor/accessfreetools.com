import type { CategorySlug } from './categories';
import type { ToolDefinition, ToolExample, ToolFaq } from './tools';

interface AiToolSpec {
  slug: string;
  name: string;
  summary: string;
  description: string;
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
  return {
    slug: spec.slug,
    name: spec.name,
    category: aiCategory,
    summary: spec.summary,
    description: spec.description,
    icon: spec.icon,
    aliases: spec.name === 'Image to Text OCR Tool' ? ['OCR Tool', 'Image Text Reader'] : undefined,
    seoTitle: spec.seoTitle ?? `${spec.name} | Free Browser AI Tool`,
    seoDescription: spec.seoDescription ?? spec.description,
    useCases: spec.useCases,
    examples: spec.examples,
    faq: spec.faq ?? makeAiFaq(spec),
    relatedSlugs: spec.relatedSlugs,
  };
}

export const aiTools: ToolDefinition[] = [
  makeAiTool({
    slug: 'image-to-text-ocr-tool',
    name: 'Image to Text OCR Tool',
    summary: 'Copy text from screenshots, labels, receipts, and clear document images without uploading the image.',
    description:
      'Use this free OCR tool to turn clear screenshots, labels, receipts, and simple document photos into editable text in your browser.',
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
          'Use a sharp, straight, high-contrast image. Crop close to the text, avoid glare, and zoom in before taking a screenshot if the original text is tiny.',
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
      'Read the list as a map of what the text talks about. A phrase like "refund policy" appearing 5 times means the draft repeats that phrase; it does not mean people search for it or that it should be stuffed into a title.',
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
    summary: 'Estimate reading grade level, sentence length, and readability signals.',
    description:
      'Estimate the reading grade level, reading ease, word count, sentence length, and long-word signals for a pasted paragraph in your browser.',
    icon: 'tool-ai-reading',
    modelNote: 'Uses browser readability formulas, not a server model, so it runs locally and gives explainable scoring signals.',
    inputMeaning:
      'Paste at least 40 characters from one paragraph, help article, school note, blog draft, or instruction block. A 100 to 800 word sample usually gives a steadier estimate than a headline, menu label, or single sentence.',
    resultMeaning:
      'Read the grade level as a Flesch-Kincaid-style estimate of text difficulty. The tool also shows reading ease, total words, sentence count, average sentence length, and long words of 7 or more letters so you can see why the score moved.',
    doubleCheck:
      'Check jargon, audience age, subject difficulty, layout, examples, images, language mix, and required technical terms manually. A grade 6 estimate does not prove the text is accurate, useful, or right for every reader.',
    useCases: [
      'Estimate whether a help article is readable enough for general customers.',
      'Check average sentence length before publishing a blog guide or product FAQ.',
      'Make school notes, safety instructions, or onboarding text easier to scan.',
      'Compare a 300-word draft before and after replacing jargon or splitting long sentences.',
    ],
    examples: [
      {
        label: 'Simple help text',
        expression: 'Enter your numbers, press calculate, and read the answer.',
        result: 'About grade 6.3, reading ease 66.1, 9 words, 1 sentence, and 2 long words',
      },
      {
        label: 'Blog draft sample',
        expression: 'Paste 300 words from a how-to guide before publishing.',
        result: 'Grade estimate, reading ease, words, sentences, and average sentence length',
      },
      {
        label: 'Technical paragraph',
        expression: 'Paste a jargon-heavy paragraph about implementation details.',
        result: 'Higher difficulty warning from longer words and denser sentences',
      },
    ],
    relatedSlugs: ['keyword-extractor', 'text-summarizer', 'word-counter'],
  }),
];
