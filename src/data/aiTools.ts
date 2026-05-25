import type { CategorySlug } from './categories';
import type { ToolDefinition, ToolExample, ToolFaq } from './tools';

interface AiToolSpec {
  slug: string;
  name: string;
  summary: string;
  description: string;
  icon: string;
  modelNote: string;
  inputMeaning: string;
  resultMeaning: string;
  doubleCheck: string;
  useCases: string[];
  examples: ToolExample[];
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
    seoTitle: `${spec.name} | Free Browser AI Tool`,
    seoDescription: spec.description,
    useCases: spec.useCases,
    examples: spec.examples,
    faq: makeAiFaq(spec),
    relatedSlugs: spec.relatedSlugs,
  };
}

export const aiTools: ToolDefinition[] = [
  makeAiTool({
    slug: 'image-to-text-ocr-tool',
    name: 'Image to Text OCR Tool',
    summary: 'Extract readable text from an image in your browser with OCR.',
    description:
      'Use this free browser OCR tool to read text from screenshots, labels, notes, and simple document images without uploading the image to Access Free Tools.',
    icon: 'tool-ai-ocr',
    modelNote: 'Uses self-hosted Tesseract.js OCR files in the browser after you choose an image and press the read button.',
    inputMeaning:
      'Choose an image file that contains readable printed or typed text. The language setting tells OCR which character patterns to expect, and image quality matters: sharper, brighter, higher-contrast images usually give better text.',
    resultMeaning:
      'Read the extracted text as a best effort copy. Line breaks, punctuation, columns, handwriting, and small letters may need cleanup before you paste the result somewhere important.',
    doubleCheck:
      'Check names, numbers, totals, dates, and email addresses against the original image. OCR can confuse similar characters such as 0 and O, 1 and l, or 5 and S.',
    useCases: [
      'Copy text from a screenshot without retyping it.',
      'Turn a clear label, receipt, or note image into editable text.',
      'Grab text from simple document images for a draft or study note.',
      'Check whether an image is clean enough for OCR before using it elsewhere.',
    ],
    examples: [
      { label: 'Screenshot text', expression: 'Upload a clear screenshot with a heading and paragraph', result: 'Editable text output' },
      { label: 'Printed label', expression: 'Upload a product label with block text', result: 'Best effort label text' },
      { label: 'Study note image', expression: 'Upload a photo of typed notes', result: 'Copied lines for review' },
    ],
    relatedSlugs: ['image-classifier', 'text-summarizer', 'keyword-extractor'],
  }),
  makeAiTool({
    slug: 'sentiment-analyzer',
    name: 'Sentiment Analyzer',
    summary: 'Check whether text reads positive, negative, or uncertain in your browser.',
    description:
      'Use this free browser sentiment analyzer to classify short text as positive or negative with a local browser model and plain-language confidence notes.',
    icon: 'tool-ai-sentiment',
    modelNote: 'Uses a self-hosted Transformers.js text model only after you press Analyze sentiment.',
    inputMeaning:
      'Paste the sentence, review, comment, or short paragraph you want to check. Longer text can mix different emotions, so use one focused passage for clearer results.',
    resultMeaning:
      'Read the label as the model prediction and the score as confidence for that prediction. A high score does not mean the model understands sarcasm, context, or intent.',
    doubleCheck:
      'Check sarcasm, jokes, mixed reviews, slang, and sensitive topics manually. Sentiment models can miss tone when the words are positive but the meaning is negative.',
    useCases: [
      'Check the emotional direction of a short review or comment.',
      'Compare how two draft messages might read to someone else.',
      'Spot strongly negative wording before publishing support or product copy.',
      'Practice understanding sentiment labels for school or data projects.',
    ],
    examples: [
      { label: 'Positive review', expression: 'This saved me time and felt clear.', result: 'Likely positive' },
      { label: 'Negative review', expression: 'The answer was confusing and I had to redo everything.', result: 'Likely negative' },
      { label: 'Mixed message', expression: 'The idea is good, but the instructions need work.', result: 'Check manually' },
    ],
    relatedSlugs: ['tone-checker', 'keyword-extractor', 'reading-level-checker'],
  }),
  makeAiTool({
    slug: 'language-detector',
    name: 'Language Detector',
    summary: 'Guess the language of pasted text with browser-side language detection.',
    description:
      'Use this free language detector to identify the likely language of a text sample in your browser, with alternatives and clear confidence limits.',
    icon: 'tool-ai-language',
    modelNote: 'Uses the open-source franc language detector in the browser after you press Detect language.',
    inputMeaning:
      'Paste at least a few words, ideally a full sentence or paragraph. Language detection works better with natural text than with names, addresses, codes, or single words.',
    resultMeaning:
      'Read the top language as the best guess and the alternatives as nearby matches. Unknown means the sample is too short, too mixed, or not clear enough for the detector.',
    doubleCheck:
      'Check short text, mixed-language text, romanized text, and technical strings manually. A language detector is a clue, not proof of the writer or location.',
    useCases: [
      'Guess the language of a pasted sentence or paragraph.',
      'Check whether a mixed note contains enough text for detection.',
      'Compare top alternatives when two languages look similar.',
      'Sort simple text samples before translation or research.',
    ],
    examples: [
      { label: 'English sentence', expression: 'This calculator works in the browser.', result: 'Likely English' },
      { label: 'Spanish sentence', expression: 'Esta herramienta funciona en el navegador.', result: 'Likely Spanish' },
      { label: 'Short text', expression: 'Hola', result: 'Too short or uncertain' },
    ],
    relatedSlugs: ['text-summarizer', 'keyword-extractor', 'text-case-converter'],
  }),
  makeAiTool({
    slug: 'text-summarizer',
    name: 'Text Summarizer',
    summary: 'Create a short browser-generated summary from pasted text.',
    description:
      'Use this free browser text summarizer to shorten a passage into a quick draft summary, with strict length limits and experimental model notes.',
    icon: 'tool-ai-summary',
    modelNote: 'Uses a Transformers.js summarization model after you press Summarize text, with a simple extractive fallback if the model is not available.',
    inputMeaning:
      'Paste a paragraph or short article section. The tool works best when the text has enough sentences to summarize and is not too long for your browser device.',
    resultMeaning:
      'Read the summary as a draft, not a replacement for the original. It should capture the main idea, but it may skip details, numbers, exceptions, or source context.',
    doubleCheck:
      'Compare the summary with the original before publishing or studying from it. Important claims, dates, prices, health details, legal details, and quotes need manual checking.',
    useCases: [
      'Turn a long note into a shorter study draft.',
      'Summarize a blog section before rewriting it in your own words.',
      'Create a quick preview of pasted research text.',
      'Check whether a passage has a clear main point.',
    ],
    examples: [
      { label: 'Study paragraph', expression: 'Paste 150 to 500 words of notes', result: 'Short summary draft' },
      { label: 'Blog section', expression: 'Paste one article section', result: 'Main idea summary' },
      { label: 'Too short', expression: 'Paste one tiny sentence', result: 'Needs more text' },
    ],
    relatedSlugs: ['keyword-extractor', 'reading-level-checker', 'sentiment-analyzer'],
  }),
  makeAiTool({
    slug: 'keyword-extractor',
    name: 'Keyword Extractor',
    summary: 'Pull repeated and important words or phrases from pasted text.',
    description:
      'Use this free browser keyword extractor to find repeated words, likely key phrases, and topic clues from pasted text without sending the text to a server.',
    icon: 'tool-ai-keywords',
    modelNote: 'Uses lightweight browser text analysis rather than a server model, so it runs fast and keeps text local.',
    inputMeaning:
      'Paste the page, paragraph, caption, notes, or draft you want to inspect. The tool removes common filler words and looks for repeated topic words and short phrases.',
    resultMeaning:
      'Read the keyword list as topic clues. Higher counts usually mean a word or phrase appears more often, not that it is automatically the best SEO keyword.',
    doubleCheck:
      'Check search intent, natural wording, duplicates, brand names, and context before using a keyword list in a title, blog, or product page.',
    useCases: [
      'Find topic words in a blog draft or study passage.',
      'Clean up repeated terms before writing a title or summary.',
      'Compare what a page talks about against what you meant it to cover.',
      'Create a first-pass keyword list without uploading text.',
    ],
    examples: [
      { label: 'Blog draft', expression: 'Paste a 400-word article draft', result: 'Top words and phrases' },
      { label: 'Product notes', expression: 'Paste feature notes', result: 'Repeated topic clues' },
      { label: 'Class notes', expression: 'Paste study notes', result: 'Main vocabulary list' },
    ],
    relatedSlugs: ['text-summarizer', 'reading-level-checker', 'slug-generator'],
  }),
  makeAiTool({
    slug: 'image-classifier',
    name: 'Image Classifier',
    summary: 'Classify an uploaded image in your browser with model confidence notes.',
    description:
      'Use this free browser image classifier to get likely labels for a photo or simple image without uploading the image to Access Free Tools.',
    icon: 'tool-ai-image',
    modelNote: 'Uses a Transformers.js image classification model after you choose an image and press Classify image.',
    inputMeaning:
      'Choose a photo or simple image with one main subject. The classifier works best when the image is clear, well lit, and not packed with many different objects.',
    resultMeaning:
      'Read labels as model guesses and scores as confidence. The top label is not guaranteed, and the model can only choose from labels it learned during training.',
    doubleCheck:
      'Check important image labels manually. Do not use this tool for identity, safety, medical, legal, product authenticity, or moderation decisions.',
    useCases: [
      'Get a quick label guess for a simple image.',
      'Compare model confidence across a few likely labels.',
      'Learn how image classification results are presented.',
      'Check whether a photo has one clear main subject.',
    ],
    examples: [
      { label: 'Single object photo', expression: 'Upload a clear image of one main object', result: 'Likely image labels' },
      { label: 'Busy image', expression: 'Upload a crowded scene', result: 'Lower confidence labels' },
      { label: 'Unusual object', expression: 'Upload a rare item', result: 'May need manual check' },
    ],
    relatedSlugs: ['image-to-text-ocr-tool', 'color-contrast-checker', 'aspect-ratio-calculator'],
  }),
  makeAiTool({
    slug: 'tone-checker',
    name: 'Tone Checker',
    summary: 'Check whether pasted text sounds friendly, formal, urgent, or unclear.',
    description:
      'Use this free browser tone checker to review the style of a message, email, caption, or support reply with local AI-assisted feedback.',
    icon: 'tool-ai-tone',
    modelNote: 'Uses a self-hosted browser text classifier after you press Check tone, with a simple local fallback if the model is not available.',
    inputMeaning:
      'Paste the message or draft you want to check. The tool reads word choice, punctuation, and phrasing to estimate tone labels such as friendly, formal, urgent, or unclear.',
    resultMeaning:
      'Read the tone label as writing feedback, not a judgment of the person who wrote it. The notes explain which words or patterns may affect how the message feels.',
    doubleCheck:
      'Check audience, culture, relationship, sarcasm, and context yourself. A tone checker cannot know the full situation behind a message.',
    useCases: [
      'Review an email before sending it.',
      'Make support copy sound clearer and calmer.',
      'Compare a casual draft with a more formal rewrite.',
      'Spot urgent or confusing wording in a short message.',
    ],
    examples: [
      { label: 'Friendly note', expression: 'Thanks for waiting, I can help with that now.', result: 'Likely friendly/helpful' },
      { label: 'Urgent note', expression: 'Please fix this immediately before launch.', result: 'Likely urgent/direct' },
      { label: 'Formal note', expression: 'We appreciate your patience and will review the request.', result: 'Likely formal' },
    ],
    relatedSlugs: ['sentiment-analyzer', 'reading-level-checker', 'text-case-converter'],
  }),
  makeAiTool({
    slug: 'reading-level-checker',
    name: 'Reading Level Checker',
    summary: 'Estimate reading grade level, sentence length, and readability signals.',
    description:
      'Use this free browser reading level checker to estimate grade level, reading ease, word count, sentence length, and plain-language signals.',
    icon: 'tool-ai-reading',
    modelNote: 'Uses browser readability formulas, not a server model, so it runs locally and gives explainable scoring signals.',
    inputMeaning:
      'Paste the text you want to check. The calculator looks at sentences, words, syllables, and long words to estimate how hard the text may be to read.',
    resultMeaning:
      'Read the grade level as an estimate of text difficulty. It does not measure truth, quality, creativity, or whether the text is right for your exact audience.',
    doubleCheck:
      'Check jargon, audience age, subject difficulty, formatting, examples, and visuals manually. A short sentence can still be hard if the topic is complex.',
    useCases: [
      'Estimate whether a guide is easy enough for general readers.',
      'Check sentence length before publishing a blog or help page.',
      'Make school notes or instructions easier to read.',
      'Compare a draft before and after simplifying it.',
    ],
    examples: [
      { label: 'Simple help text', expression: 'Paste a short support paragraph', result: 'Reading grade estimate' },
      { label: 'Blog draft', expression: 'Paste 300 words of a guide', result: 'Ease score and sentence stats' },
      { label: 'Technical paragraph', expression: 'Paste jargon-heavy text', result: 'Higher difficulty warning' },
    ],
    relatedSlugs: ['keyword-extractor', 'text-summarizer', 'word-counter'],
  }),
];
