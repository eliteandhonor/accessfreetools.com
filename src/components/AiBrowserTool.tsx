import { useMemo, useState } from 'react';

export type AiToolVariant =
  | 'ocr'
  | 'sentiment'
  | 'language'
  | 'summary'
  | 'keywords'
  | 'image-classifier'
  | 'tone'
  | 'reading-level';

interface Props {
  variant: AiToolVariant;
}

interface AiResult {
  label: string;
  answer: string;
  textOutput?: string;
  metrics: Array<{
    label: string;
    value: string;
  }>;
  steps: string[];
  note: string;
}

interface AiConfig {
  title: string;
  description: string;
  inputLabel: string;
  placeholder?: string;
  buttonLabel: string;
  sampleTexts: Array<{
    label: string;
    text: string;
  }>;
  privacyNote: string;
  modelNote: string;
  acceptsImage?: boolean;
}

type TextPipelineTask = 'sentiment-analysis' | 'summarization' | 'zero-shot-classification';

const pipelineCache = new Map<string, unknown>();

const aiConfigs: Record<AiToolVariant, AiConfig> = {
  ocr: {
    title: 'Image to Text OCR Tool',
    description: 'Choose an image and read printed text with browser OCR.',
    inputLabel: 'Image file',
    buttonLabel: 'Read text',
    acceptsImage: true,
    sampleTexts: [],
    privacyNote: 'The selected image is read in this browser tab and is not uploaded to Access Free Tools.',
    modelNote: 'OCR language data loads only after you press Read text.',
  },
  sentiment: {
    title: 'Sentiment Analyzer',
    description: 'Check whether a short message reads positive or negative.',
    inputLabel: 'Text to analyze',
    placeholder: 'Paste a review, comment, caption, or short paragraph...',
    buttonLabel: 'Analyze sentiment',
    sampleTexts: [
      { label: 'Positive review', text: 'This tool saved me time and was easy to use.' },
      { label: 'Negative review', text: 'The answer was confusing and I had to redo everything.' },
      { label: 'Mixed message', text: 'The idea is good, but the instructions need work.' },
    ],
    privacyNote: 'Text stays in this browser tab. The sentiment model runs after you press the button.',
    modelNote: 'A small Transformers.js model may download from a model host on first use.',
  },
  language: {
    title: 'Language Detector',
    description: 'Guess the language of a sentence or paragraph.',
    inputLabel: 'Text to detect',
    placeholder: 'Paste a full sentence or paragraph...',
    buttonLabel: 'Detect language',
    sampleTexts: [
      { label: 'English', text: 'This calculator works in the browser.' },
      { label: 'Spanish', text: 'Esta herramienta funciona en el navegador.' },
      { label: 'French', text: 'Cet outil fonctionne dans le navigateur.' },
    ],
    privacyNote: 'Language detection runs locally in the browser with the open-source franc package.',
    modelNote: 'No server model is needed for this tool.',
  },
  summary: {
    title: 'Text Summarizer',
    description: 'Shorten a paragraph into a draft summary.',
    inputLabel: 'Text to summarize',
    placeholder: 'Paste 120 to 900 words. Keep private or sensitive text out of the tool if you do not need it...',
    buttonLabel: 'Summarize text',
    sampleTexts: [
      {
        label: 'Tool guide',
        text:
          'Access Free Tools builds browser utilities that help people finish small tasks without signup. Each tool should explain the inputs, show examples, and keep private work in the browser whenever possible. The goal is to make calculators, converters, text tools, and AI helpers easy to understand.',
      },
      {
        label: 'Study note',
        text:
          'Photosynthesis is the process plants use to convert light energy into chemical energy. Plants take in carbon dioxide and water, then use sunlight to make glucose and release oxygen. This process supports plant growth and provides oxygen for many living things.',
      },
    ],
    privacyNote: 'Text is processed in the browser. The model may download on first use, but your pasted text is not sent to Access Free Tools.',
    modelNote: 'Summarization is experimental and may use a simple local fallback if the model is unavailable.',
  },
  keywords: {
    title: 'Keyword Extractor',
    description: 'Find repeated words and phrases in pasted text.',
    inputLabel: 'Text to inspect',
    placeholder: 'Paste a blog draft, notes, product description, or paragraph...',
    buttonLabel: 'Extract keywords',
    sampleTexts: [
      {
        label: 'Blog draft',
        text:
          'Free browser tools help students, creators, and business owners finish quick tasks. Browser tools can calculate numbers, format text, check images, and explain results without signup.',
      },
      {
        label: 'Product notes',
        text:
          'The calculator page should be fast, private, mobile friendly, and easy to understand. Clear examples and FAQ answers make the calculator more useful.',
      },
    ],
    privacyNote: 'Keyword extraction is local text analysis. No model or server upload is required.',
    modelNote: 'This tool uses count-based browser analysis, not search-volume data.',
  },
  'image-classifier': {
    title: 'Image Classifier',
    description: 'Get likely labels for a clear image.',
    inputLabel: 'Image file',
    buttonLabel: 'Classify image',
    acceptsImage: true,
    sampleTexts: [],
    privacyNote: 'The image is classified in this browser tab and is not uploaded to Access Free Tools.',
    modelNote: 'A browser image model may download from a model host on first use.',
  },
  tone: {
    title: 'Tone Checker',
    description: 'Check whether a short message sounds friendly, formal, urgent, or unclear.',
    inputLabel: 'Message to check',
    placeholder: 'Paste an email, support reply, caption, or short message...',
    buttonLabel: 'Check tone',
    sampleTexts: [
      { label: 'Friendly', text: 'Thanks for waiting. I can help with that now.' },
      { label: 'Urgent', text: 'Please fix this immediately before launch.' },
      { label: 'Formal', text: 'We appreciate your patience and will review the request.' },
    ],
    privacyNote: 'Text stays in this browser tab. The tone model or local fallback runs only after you press the button.',
    modelNote: 'Tone is writing feedback, not a judgment of the person who wrote the message.',
  },
  'reading-level': {
    title: 'Reading Level Checker',
    description: 'Estimate grade level, reading ease, and sentence length.',
    inputLabel: 'Text to check',
    placeholder: 'Paste a paragraph, help article, school note, or blog draft...',
    buttonLabel: 'Check reading level',
    sampleTexts: [
      {
        label: 'Simple guide',
        text: 'Enter your numbers, press calculate, and read the answer. Check the examples if the result looks strange.',
      },
      {
        label: 'Technical note',
        text:
          'The implementation reconciles client-side hydration boundaries with static prerendered metadata and conditional runtime inference dependencies.',
      },
    ],
    privacyNote: 'Readability scoring runs locally with formulas. No server model is needed.',
    modelNote: 'Grade level is an estimate based on sentence and word patterns.',
  },
};

const languageNames: Record<string, string> = {
  eng: 'English',
  spa: 'Spanish',
  fra: 'French',
  deu: 'German',
  ita: 'Italian',
  por: 'Portuguese',
  nld: 'Dutch',
  swe: 'Swedish',
  nor: 'Norwegian',
  dan: 'Danish',
  fin: 'Finnish',
  pol: 'Polish',
  rus: 'Russian',
  ukr: 'Ukrainian',
  ara: 'Arabic',
  hin: 'Hindi',
  jpn: 'Japanese',
  kor: 'Korean',
  cmn: 'Mandarin Chinese',
  und: 'Unknown',
};

const stopWords = new Set([
  'about',
  'after',
  'again',
  'also',
  'and',
  'are',
  'because',
  'but',
  'can',
  'for',
  'from',
  'has',
  'have',
  'into',
  'not',
  'that',
  'the',
  'their',
  'then',
  'there',
  'this',
  'use',
  'uses',
  'was',
  'with',
  'you',
  'your',
]);

function requireText(text: string, minimum = 12) {
  const trimmed = text.trim();

  if (trimmed.length < minimum) {
    throw new Error(`Enter at least ${minimum} characters so the tool has enough context.`);
  }

  return trimmed;
}

function formatPercent(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}

async function getPipeline(task: TextPipelineTask | 'image-classification', model: string) {
  const cacheKey = `${task}:${model}`;
  const cached = pipelineCache.get(cacheKey);

  if (cached) return cached;

  const transformers = (await import('@huggingface/transformers')) as {
    env?: {
      allowLocalModels?: boolean;
    };
    pipeline: (taskName: string, modelName: string) => Promise<unknown>;
  };

  if (transformers.env) {
    transformers.env.allowLocalModels = false;
  }

  const loaded = await transformers.pipeline(task, model);
  pipelineCache.set(cacheKey, loaded);
  return loaded;
}

function normalizeClassifierOutput(output: unknown): Array<{ label: string; score: number }> {
  if (Array.isArray(output)) {
    return output
      .flat()
      .filter((item): item is { label: string; score: number } =>
        Boolean(item && typeof item.label === 'string' && typeof item.score === 'number'),
      );
  }

  if (output && typeof output === 'object' && 'labels' in output && 'scores' in output) {
    const candidate = output as { labels: unknown; scores: unknown };
    const labels = candidate.labels;
    const scores = candidate.scores;

    if (!Array.isArray(labels) || !Array.isArray(scores)) {
      return [];
    }

    return labels.map((label, index) => ({
      label: String(label),
      score: Number(scores[index] ?? 0),
    }));
  }

  return [];
}

function simpleSentimentFallback(text: string): AiResult {
  const positive = ['good', 'great', 'easy', 'love', 'helpful', 'saved', 'fast', 'clear', 'excellent', 'happy'];
  const negative = ['bad', 'hard', 'confusing', 'slow', 'hate', 'broken', 'wrong', 'angry', 'difficult', 'terrible'];
  const lower = text.toLowerCase();
  const positiveHits = positive.filter((word) => lower.includes(word)).length;
  const negativeHits = negative.filter((word) => lower.includes(word)).length;
  const label = positiveHits >= negativeHits ? 'Likely positive' : 'Likely negative';

  return {
    label: 'Local fallback result',
    answer: label,
    metrics: [
      { label: 'Positive clues', value: String(positiveHits) },
      { label: 'Negative clues', value: String(negativeHits) },
    ],
    steps: [
      'The browser model was unavailable, so the tool used a simple local word-clue fallback.',
      'It counted positive and negative clue words.',
      'Short or sarcastic messages still need manual review.',
    ],
    note: 'Fallback results are rougher than model results.',
  };
}

async function runSentiment(text: string): Promise<AiResult> {
  const input = requireText(text);

  try {
    const classifier = (await getPipeline(
      'sentiment-analysis',
      'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
    )) as (value: string) => Promise<unknown>;
    const output = normalizeClassifierOutput(await classifier(input));
    const best = output[0];

    if (!best) throw new Error('No sentiment label returned.');

    return {
      label: 'Sentiment model result',
      answer: best.label === 'POSITIVE' ? 'Likely positive' : best.label === 'NEGATIVE' ? 'Likely negative' : best.label,
      metrics: [{ label: 'Confidence', value: formatPercent(best.score) }],
      steps: [
        'The browser loaded a text-classification model after you pressed the button.',
        'The model compared the wording with patterns from its training data.',
        'The highest-scoring label is shown with a confidence score.',
      ],
      note: 'Check sarcasm, mixed feelings, slang, and sensitive messages manually.',
    };
  } catch {
    return simpleSentimentFallback(input);
  }
}

function splitSentences(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function localSummary(text: string): string {
  const sentences = splitSentences(text);
  return sentences.slice(0, Math.min(3, sentences.length)).join(' ');
}

async function runSummary(text: string): Promise<AiResult> {
  const input = requireText(text, 80);

  if (input.length > 6000) {
    throw new Error('Keep the text under 6,000 characters so it stays friendly to the browser.');
  }

  try {
    const summarizer = (await getPipeline('summarization', 'Xenova/distilbart-cnn-6-6')) as (
      value: string,
      options?: Record<string, number>,
    ) => Promise<unknown>;
    const output = await summarizer(input, { max_new_tokens: 80, min_length: 20 });
    const first = Array.isArray(output) ? output[0] : output;
    const summary =
      first && typeof first === 'object' && 'summary_text' in first
        ? String(first.summary_text)
        : localSummary(input);

    return {
      label: 'Summary draft',
      answer: 'Generated summary',
      textOutput: summary,
      metrics: [
        { label: 'Original characters', value: String(input.length) },
        { label: 'Summary characters', value: String(summary.length) },
      ],
      steps: [
        'The browser loaded the summarization model after you pressed the button.',
        'The model produced a shorter draft from the pasted passage.',
        'The summary should be checked against the original before use.',
      ],
      note: 'Summaries can miss details, numbers, exceptions, and source context.',
    };
  } catch {
    const summary = localSummary(input);

    return {
      label: 'Extractive fallback summary',
      answer: 'Fallback summary',
      textOutput: summary,
      metrics: [
        { label: 'Original characters', value: String(input.length) },
        { label: 'Sentences used', value: String(Math.min(3, splitSentences(input).length)) },
      ],
      steps: [
        'The browser model was unavailable, so the tool used a local extractive fallback.',
        'It selected the first clear sentences as a simple summary.',
        'You should rewrite and verify the result before publishing it.',
      ],
      note: 'Fallback summaries are simple and may not capture the whole passage.',
    };
  }
}

async function runLanguage(text: string): Promise<AiResult> {
  const input = requireText(text, 20);
  const { francAll } = await import('franc-min');
  const guesses = francAll(input, { minLength: 20 }).slice(0, 3);
  const best = guesses[0];
  const bestCode = best?.[0] ?? 'und';
  const alternatives = guesses
    .map(([code, distance]) => `${languageNames[code] ?? code} (${code}, distance ${Math.round(distance)})`)
    .join(', ');

  return {
    label: 'Language detection result',
    answer: languageNames[bestCode] ?? bestCode,
    metrics: [
      { label: 'Language code', value: bestCode },
      { label: 'Alternatives', value: alternatives || 'No alternatives returned' },
    ],
    steps: [
      'The browser compared character patterns in your text with language profiles.',
      'Longer natural text usually gives a stronger result.',
      'Unknown or surprising results usually mean the sample is too short, mixed, or not natural prose.',
    ],
    note: 'Language detection is not proof of identity, location, or fluency.',
  };
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function topCounts(items: string[], limit: number) {
  const counts = new Map<string, number>();

  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}

function runKeywords(text: string): AiResult {
  const input = requireText(text, 60);
  const words = tokenize(input);
  const phrases: string[] = [];

  for (let index = 0; index < words.length - 1; index += 1) {
    phrases.push(`${words[index]} ${words[index + 1]}`);
  }

  const topWords = topCounts(words, 8);
  const topPhrases = topCounts(phrases, 6);
  const output = [
    'Top words:',
    ...(topWords.length ? topWords.map(([word, count]) => `- ${word}: ${count}`) : ['- Not enough repeated words found.']),
    '',
    'Top phrases:',
    ...(topPhrases.length ? topPhrases.map(([phrase, count]) => `- ${phrase}: ${count}`) : ['- Not enough repeated phrases found.']),
  ].join('\n');

  return {
    label: 'Keyword clues',
    answer: topWords[0]?.[0] ?? 'No repeated keyword found',
    textOutput: output,
    metrics: [
      { label: 'Useful words checked', value: String(words.length) },
      { label: 'Repeated words', value: String(topWords.length) },
      { label: 'Repeated phrases', value: String(topPhrases.length) },
    ],
    steps: [
      'The tool removed common filler words and punctuation.',
      'It counted repeated words and two-word phrases.',
      'The list shows topic clues, not search volume or ranking difficulty.',
    ],
    note: 'Use these as writing clues, then choose natural keywords for real readers.',
  };
}

function countSyllables(word: string) {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');

  if (!cleaned) return 0;

  const withoutSilentE = cleaned.length > 3 ? cleaned.replace(/e$/, '') : cleaned;
  const groups = withoutSilentE.match(/[aeiouy]+/g);

  return Math.max(1, groups?.length ?? 1);
}

function runReadingLevel(text: string): AiResult {
  const input = requireText(text, 40);
  const sentences = Math.max(1, splitSentences(input).length);
  const words = input.match(/[A-Za-z0-9'-]+/g) ?? [];
  const wordCount = Math.max(1, words.length);
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);
  const longWords = words.filter((word) => word.replace(/[^A-Za-z]/g, '').length >= 7).length;
  const grade = 0.39 * (wordCount / sentences) + 11.8 * (syllables / wordCount) - 15.59;
  const ease = 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / wordCount);

  return {
    label: 'Readability estimate',
    answer: `About grade ${Math.max(1, Math.round(grade * 10) / 10)}`,
    metrics: [
      { label: 'Reading ease', value: `${Math.round(ease * 10) / 10}` },
      { label: 'Words', value: String(wordCount) },
      { label: 'Sentences', value: String(sentences) },
      { label: 'Average sentence', value: `${Math.round((wordCount / sentences) * 10) / 10} words` },
      { label: 'Long words', value: String(longWords) },
    ],
    steps: [
      'The tool estimated syllables, words, and sentences.',
      'It applied a Flesch-Kincaid-style grade formula.',
      'Long sentences and longer words usually raise the grade estimate.',
    ],
    note: 'This is an estimate, not an official school score.',
  };
}

function localToneFallback(text: string): AiResult {
  const lower = text.toLowerCase();
  const exclamations = (text.match(/!/g) ?? []).length;
  const politeHits = ['thanks', 'please', 'appreciate', 'happy to', 'help'].filter((word) => lower.includes(word)).length;
  const urgentHits = ['urgent', 'immediately', 'asap', 'now', 'deadline', 'fix'].filter((word) => lower.includes(word)).length;
  const formalHits = ['review', 'request', 'regarding', 'appreciate', 'sincerely'].filter((word) => lower.includes(word)).length;
  const scores = [
    { label: 'Friendly or helpful', score: politeHits + (exclamations > 0 ? 0.5 : 0) },
    { label: 'Urgent or direct', score: urgentHits + exclamations },
    { label: 'Formal or careful', score: formalHits },
    { label: 'Unclear or mixed', score: lower.length < 80 ? 1 : 0 },
  ].sort((a, b) => b.score - a.score);

  return {
    label: 'Tone estimate',
    answer: scores[0].label,
    metrics: scores.map((item) => ({ label: item.label, value: String(item.score) })),
    steps: [
      'The browser checked wording, punctuation, and tone clues.',
      'It ranked common tone labels for the draft.',
      'Audience and context still matter more than the score.',
    ],
    note: 'Tone feedback is for editing your writing, not judging intent.',
  };
}

async function runTone(text: string): Promise<AiResult> {
  const input = requireText(text);

  try {
    const classifier = (await getPipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli')) as (
      value: string,
      labels: string[],
    ) => Promise<unknown>;
    const output = normalizeClassifierOutput(
      await classifier(input, ['friendly or helpful', 'formal or careful', 'urgent or direct', 'unclear or mixed']),
    );
    const best = output[0];

    if (!best) throw new Error('No tone label returned.');

    return {
      label: 'Tone model result',
      answer: best.label,
      metrics: output.slice(0, 4).map((item) => ({ label: item.label, value: formatPercent(item.score) })),
      steps: [
        'The browser loaded a zero-shot text classifier after you pressed the button.',
        'The classifier compared your draft with tone labels.',
        'The top label is shown with the strongest score.',
      ],
      note: 'Check audience, culture, sarcasm, and relationship context manually.',
    };
  } catch {
    return localToneFallback(input);
  }
}

async function runOcr(file: File | null, language: string, onProgress: (message: string) => void): Promise<AiResult> {
  if (!file) {
    throw new Error('Choose an image file before running OCR.');
  }

  const tesseract = (await import('tesseract.js')) as {
    createWorker: (
      langs?: string,
      oem?: unknown,
      options?: { logger?: (message: { status?: string; progress?: number }) => void },
    ) => Promise<{
      recognize: (image: File) => Promise<{ data: { text: string; confidence?: number } }>;
      terminate: () => Promise<unknown>;
    }>;
  };
  const worker = await tesseract.createWorker(language, undefined, {
    logger: (message) => {
      if (message.status) {
        onProgress(`${message.status}${message.progress ? ` ${Math.round(message.progress * 100)}%` : ''}`);
      }
    },
  });

  try {
    const { data } = await worker.recognize(file);
    const text = data.text.trim();

    return {
      label: 'OCR text',
      answer: text ? 'Text found' : 'No clear text found',
      textOutput: text || 'No readable text was found. Try a sharper image with stronger contrast.',
      metrics: [
        { label: 'Language', value: language },
        { label: 'Confidence', value: typeof data.confidence === 'number' ? `${Math.round(data.confidence)}%` : 'Not reported' },
        { label: 'Characters', value: String(text.length) },
      ],
      steps: [
        'The browser loaded OCR language data after you pressed the button.',
        'OCR scanned the selected image for text shapes.',
        'The extracted text is shown for manual checking and copying.',
      ],
      note: 'Check names, numbers, dates, and punctuation against the original image.',
    };
  } finally {
    await worker.terminate();
  }
}

async function runImageClassifier(file: File | null): Promise<AiResult> {
  if (!file) {
    throw new Error('Choose an image file before classifying it.');
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const classifier = (await getPipeline('image-classification', 'Xenova/vit-base-patch16-224')) as (
      image: string,
    ) => Promise<unknown>;
    const output = normalizeClassifierOutput(await classifier(imageUrl)).slice(0, 5);
    const best = output[0];

    if (!best) throw new Error('No image labels returned.');

    return {
      label: 'Image labels',
      answer: best.label,
      textOutput: output.map((item) => `- ${item.label}: ${formatPercent(item.score)}`).join('\n'),
      metrics: [
        { label: 'Top confidence', value: formatPercent(best.score) },
        { label: 'Labels shown', value: String(output.length) },
      ],
      steps: [
        'The browser loaded an image-classification model after you pressed the button.',
        'The model compared the image with labels from its training data.',
        'The highest-scoring labels are shown for manual checking.',
      ],
      note: 'Do not use image labels for identity, safety, medical, legal, or moderation decisions.',
    };
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export default function AiBrowserTool({ variant }: Props) {
  const config = aiConfigs[variant];
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('eng');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AiResult | null>(null);
  const [history, setHistory] = useState<AiResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const canCopy = Boolean(result?.textOutput || result?.answer);
  const resultText = useMemo(() => result?.textOutput ?? result?.answer ?? '', [result]);

  async function runTool(nextText = text) {
    setLoading(true);
    setError('');
    setCopied(false);
    setStatus('Preparing browser tool...');

    try {
      let nextResult: AiResult;

      if (variant === 'ocr') {
        nextResult = await runOcr(file, language, setStatus);
      } else if (variant === 'sentiment') {
        nextResult = await runSentiment(nextText);
      } else if (variant === 'language') {
        nextResult = await runLanguage(nextText);
      } else if (variant === 'summary') {
        nextResult = await runSummary(nextText);
      } else if (variant === 'keywords') {
        nextResult = runKeywords(nextText);
      } else if (variant === 'image-classifier') {
        nextResult = await runImageClassifier(file);
      } else if (variant === 'tone') {
        nextResult = await runTone(nextText);
      } else {
        nextResult = runReadingLevel(nextText);
      }

      setResult(nextResult);
      setHistory((items) => [nextResult, ...items].slice(0, 4));
      setStatus('Done');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'The browser AI tool could not finish. Try a smaller input.');
      setStatus('');
    } finally {
      setLoading(false);
    }
  }

  function useSample(sampleText: string) {
    setText(sampleText);
    void runTool(sampleText);
  }

  async function copyResult() {
    if (!navigator.clipboard || !canCopy) return;

    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
    } catch {
      setCopied(false);
      setError('Copy was not available in this browser. You can still select the result manually.');
    }
  }

  return (
    <section className="advanced-calculator advanced-calculator-ai" aria-label={`${config.title} workspace`}>
      <div className="advanced-panel ai-panel">
        <div className="ai-tool-heading">
          <span>Browser-only AI</span>
          <h2>{config.title}</h2>
          <p>{config.description}</p>
        </div>

        {config.acceptsImage ? (
          <div className="advanced-fields ai-fields">
            <label className="advanced-field">
              <span>{config.inputLabel}</span>
              <input
                accept="image/*"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                  setResult(null);
                  setError('');
                  setCopied(false);
                }}
                type="file"
              />
              <small>Use a clear image. Private images stay in this browser tab.</small>
            </label>
            {variant === 'ocr' && (
              <label className="advanced-field">
                <span>OCR language</span>
                <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                  <option value="eng">English</option>
                  <option value="spa">Spanish</option>
                  <option value="fra">French</option>
                  <option value="deu">German</option>
                  <option value="ita">Italian</option>
                  <option value="por">Portuguese</option>
                </select>
                <small>Choose the language that best matches the image text.</small>
              </label>
            )}
          </div>
        ) : (
          <label className="advanced-field ai-textarea-field">
            <span>{config.inputLabel}</span>
            <textarea
              onChange={(event) => {
                setText(event.target.value);
                setError('');
                setCopied(false);
              }}
              placeholder={config.placeholder}
              value={text}
            />
            <small>Keep private or sensitive text out unless you really need to process it.</small>
          </label>
        )}

        <div className="advanced-actions">
          <button className="button-primary" disabled={loading} onClick={() => void runTool()} type="button">
            {loading ? 'Working...' : config.buttonLabel}
          </button>
          <button className="button-secondary" disabled={!canCopy || loading} onClick={copyResult} type="button">
            {copied ? 'Copied' : 'Copy result'}
          </button>
        </div>

        {status && <p className="ai-status" aria-live="polite">{status}</p>}
        {error && <p className="calculator-error" role="alert">{error}</p>}

        {result && (
          <article className="advanced-result-card ai-result-card" aria-live="polite">
            <span>{result.label}</span>
            <strong>{result.answer}</strong>
            {result.textOutput && <pre className="utility-text-output">{result.textOutput}</pre>}
            <dl>
              {result.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
            <p>{result.note}</p>
          </article>
        )}

        {result && (
          <div className="advanced-steps">
            <h2>How this ran</h2>
            <ol>
              {result.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <aside className="advanced-side-panel ai-side-panel">
        {config.sampleTexts.length > 0 && (
          <div>
            <h2>Examples</h2>
            <div className="advanced-quick-grid utility-example-grid">
              {config.sampleTexts.map((sample) => (
                <button disabled={loading} key={sample.label} onClick={() => useSample(sample.text)} type="button">
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2>Recent results</h2>
          {history.length === 0 ? (
            <p>Run the tool to keep a short in-tab history. Nothing is saved to an account.</p>
          ) : (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.answer}-${index}`}>
                  <span>{item.label}</span>
                  <strong>{item.answer}</strong>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="advanced-note ai-privacy-note">
          <p>{config.privacyNote}</p>
          <p>{config.modelNote}</p>
          <p>No upload to Access Free Tools. No account needed.</p>
        </div>
      </aside>
    </section>
  );
}
