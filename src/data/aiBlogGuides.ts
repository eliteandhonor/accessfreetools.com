import type { BlogPostDefinition } from './blogPosts';
import { aiTools } from './aiTools';

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
  summary: string;
  purpose: string;
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
  googleHelpfulContent: {
    href: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
    label: 'Google Search Central: helpful content guidance',
  },
};

const guideDetails: Record<string, AiGuideDetail> = {
  'image-to-text-ocr-tool': {
    summary:
      'Learn how to use the browser-only Image to Text OCR Tool, choose clearer images, read OCR output, and avoid common copy mistakes.',
    purpose:
      'The Image to Text OCR Tool reads text from an image in your browser. It is useful when you have a screenshot, label, or simple document image and want editable text without uploading that image to Access Free Tools.',
    enter: [
      'Open the tool and choose a clear image file.',
      'Pick the language that best matches the text in the image.',
      'Press Read text and wait while OCR data loads in the browser.',
      'Copy the result only after checking numbers, names, and line breaks.',
    ],
    read: [
      'The result is best effort editable text, not a certified copy.',
      'Short lines, columns, tiny text, blur, and glare can lower accuracy.',
      'If the result looks messy, try a sharper crop with better contrast.',
    ],
    mistakes: [
      'Do not trust OCR for totals, serial numbers, passwords, IDs, or legal wording without checking the original.',
      'Do not upload private documents if you do not need OCR for that exact file.',
      'Do not expect handwriting or stylized fonts to work as cleanly as typed text.',
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
    enter: [
      'Paste a full sentence or paragraph when possible.',
      'Press Detect language.',
      'Read the top result and the alternative guesses.',
      'Use more text if the result is unknown or surprising.',
    ],
    read: [
      'The top result is the closest match from the detector.',
      'Alternatives are useful when related languages look similar.',
      'Unknown usually means the text is too short, too mixed, or too code-like.',
    ],
    mistakes: [
      'Do not use one word as proof of a language.',
      'Do not use language detection to guess identity or nationality.',
      'Do not trust mixed-language, romanized, or heavily abbreviated text without checking.',
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
      'Learn how to use the browser keyword extractor, read phrase counts, and avoid treating repeated words as guaranteed SEO wins.',
    purpose:
      'The Keyword Extractor finds repeated words and short phrases in pasted text. It is useful for drafts, notes, and content planning when you want to see what the text talks about most.',
    enter: [
      'Paste the text you want to inspect.',
      'Press Extract keywords.',
      'Review the top words and phrases.',
      'Use the list as topic clues, then choose natural wording yourself.',
    ],
    read: [
      'Higher counts mean a term appears more often in the pasted text.',
      'Phrases can show repeated topics better than single words.',
      'The result is not a ranking tool or search-volume tool.',
    ],
    mistakes: [
      'Do not stuff every keyword into a page title.',
      'Do not ignore search intent, reader clarity, or the actual question being answered.',
      'Do not treat brand names and repeated filler words as automatically useful keywords.',
    ],
    sources: [sourceLinks.googleHelpfulContent, sourceLinks.transformersJs],
  },
  'image-classifier': {
    summary:
      'Learn how to use the browser image classifier, read confidence labels, and understand why model labels can be wrong.',
    purpose:
      'The Image Classifier guesses likely labels for a chosen image in your browser. It is useful for learning how classification works and for quick, low-stakes image labels.',
    enter: [
      'Choose a clear image with one main subject.',
      'Press Classify image so the browser can load the model.',
      'Review the top labels and confidence scores.',
      'Check important labels manually before using them.',
    ],
    read: [
      'The top label is the model guess, not guaranteed truth.',
      'Scores are confidence values for the available labels.',
      'The model cannot label something it has not learned well.',
    ],
    mistakes: [
      'Do not use this for identity, medical, safety, legal, or moderation decisions.',
      'Do not expect crowded scenes to produce a perfect label.',
      'Do not assume low confidence means the image is bad; it may just be outside the model label set.',
    ],
    sources: [sourceLinks.transformersJs, sourceLinks.googleHelpfulContent],
  },
  'tone-checker': {
    summary:
      'Learn how to use the browser tone checker for emails, support replies, and short messages without treating it as a final judgment.',
    purpose:
      'The Tone Checker reviews how a message may feel to a reader. It helps you spot friendly, formal, urgent, or unclear wording before sending or publishing.',
    enter: [
      'Paste the message or draft you want to review.',
      'Press Check tone.',
      'Read the likely tone and the writing notes.',
      'Adjust the wording based on your audience and situation.',
    ],
    read: [
      'The tone label is writing feedback, not a judgment of the writer.',
      'Notes point to words and patterns that may affect how the text feels.',
      'The tool cannot know your relationship, culture, or full context.',
    ],
    mistakes: [
      'Do not use tone output to accuse someone of intent.',
      'Do not ignore audience expectations or workplace style rules.',
      'Do not paste private conflict messages unless you are comfortable processing them locally.',
    ],
    sources: [sourceLinks.transformersJs, sourceLinks.googleHelpfulContent],
  },
  'reading-level-checker': {
    summary:
      'Learn how to use the browser reading level checker, read grade-level estimates, and improve hard-to-read drafts.',
    purpose:
      'The Reading Level Checker estimates how difficult text may be by counting words, sentences, syllables, and long words. It is useful for guides, school notes, and help text.',
    enter: [
      'Paste the text you want to check.',
      'Press Check reading level.',
      'Review grade level, reading ease, sentence length, and word stats.',
      'Simplify long sentences or jargon, then run the check again.',
    ],
    read: [
      'Grade level is an estimate of difficulty, not a school-approved score.',
      'Reading ease gets lower when sentences or words are harder.',
      'Stats help explain why the text may feel easy or hard.',
    ],
    mistakes: [
      'Do not assume low grade level means the text is accurate or helpful.',
      'Do not ignore layout, examples, headings, and visuals.',
      'Do not use one formula as the final rule for every audience.',
    ],
    sources: [sourceLinks.fleschKincaid, sourceLinks.googleHelpfulContent],
  },
};

function buildAiMetaDescription(tool: (typeof aiTools)[number], summary: string) {
  const base = summary.replace(/\.$/, '');
  const description = `${base}. Includes input tips, output checks, privacy notes, and model limits for the ${tool.name}.`;
  return description.length > 170 ? `${description.slice(0, 166).trim()}...` : description;
}

function makeGuide(toolSlug: string): AiGuideDefinition {
  const tool = aiTools.find((candidate) => candidate.slug === toolSlug);
  const detail = guideDetails[toolSlug];

  if (!tool || !detail) {
    throw new Error(`Missing AI guide detail for ${toolSlug}`);
  }

  return {
    slug: `how-to-use-${tool.slug}`,
    toolSlug: tool.slug,
    label: `${tool.name} guide`,
    title: `How to use the ${tool.name}`,
    description: buildAiMetaDescription(tool, detail.summary),
    path: `/blog/how-to-use-${tool.slug}/`,
    intro: `${detail.purpose} Use this guide to understand what to enter, how to read the output, and what to double-check before relying on the result.`,
    quickStart: detail.enter,
    sections: [
      {
        title: 'What this AI tool does',
        paragraphs: [
          detail.purpose,
          'The important privacy idea is simple: your input runs in the browser tab. Access Free Tools does not need to receive the image or text for the tool to work.',
          'For this first self-hosted pass, OCR files and the starter text classifier files are served from Access Free Tools after you click the tool button. Heavier experimental model tools may still download model files from a third-party model host until we self-host more models.',
        ],
      },
      {
        title: 'How to read the result',
        paragraphs: [
          'Start with the main result, then read the supporting notes. Browser AI tools are useful helpers, but they can still be wrong, incomplete, or unsure.',
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
      {
        title: 'Research and references',
        paragraphs: [
          'These references shaped the tool behavior, browser-only model approach, privacy notes, and result limits.',
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
