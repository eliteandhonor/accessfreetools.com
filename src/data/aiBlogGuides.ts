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
      'Learn how to copy text from screenshots and image files, choose clearer OCR images, and catch common copy mistakes.',
    purpose:
      'The Image to Text OCR Tool turns a clear image of typed or printed words into editable text in your browser. Use it for screenshots, labels, receipts, and simple document photos when you want a draft copy without uploading the image to Access Free Tools.',
    enter: [
      'Choose a sharp screenshot or photo with typed or printed text.',
      'Pick the language shown in the image.',
      'Press Read text and wait while the OCR files load in the browser.',
      'Before copying, compare names, totals, dates, and codes with the image.',
    ],
    read: [
      'Treat the result as a draft copy, not a certified transcript.',
      'If the image says INV-10018 or $42.50, check those exact characters before pasting.',
      'Columns, tiny text, blur, glare, and sideways photos can lower accuracy.',
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
      'A phrase like "refund policy" appearing 5 times means the draft repeats that phrase.',
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
  return description.length > 160 ? `${description.slice(0, 156).trim()}...` : description;
}

function makeGuide(toolSlug: string): AiGuideDefinition {
  const tool = aiTools.find((candidate) => candidate.slug === toolSlug);
  const detail = guideDetails[toolSlug];

  if (!tool || !detail) {
    throw new Error(`Missing AI guide detail for ${toolSlug}`);
  }

  const isOcrTool = tool.slug === 'image-to-text-ocr-tool';

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
        title: isOcrTool ? 'What this OCR tool does' : 'What this AI tool does',
        paragraphs: [
          detail.purpose,
          isOcrTool
            ? 'The important privacy idea is simple: the image is read in your browser tab. Access Free Tools does not need to receive the selected image for OCR to work.'
            : 'The important privacy idea is simple: your input runs in the browser tab. Access Free Tools does not need to receive the image or text for the tool to work.',
          isOcrTool
            ? 'The OCR worker, WebAssembly core, and language files are served from Access Free Tools after you press Read text. That first run can take longer than a normal calculator.'
            : 'For this first self-hosted pass, OCR files and the starter text classifier files are served from Access Free Tools after you click the tool button. Heavier experimental model tools may still download model files from a third-party model host until we self-host more models.',
        ],
      },
      {
        title: 'How to read the result',
        paragraphs: [
          isOcrTool
            ? 'Start with the extracted text, then check the original image. OCR is useful, but it can still miss punctuation, split columns badly, or swap similar-looking characters.'
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
