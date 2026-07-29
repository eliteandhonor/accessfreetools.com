import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, isAbsolute, relative, resolve } from 'node:path';

export const WRITING_PRECEDENCE = Object.freeze([
  {
    id: 'factual',
    label: 'Factual accuracy',
    responsibility: 'Verify claims and limits against current evidence before style review.',
  },
  {
    id: 'brand',
    label: 'Brand code',
    responsibility: 'Use clear, practical language without hype or false promises.',
  },
  {
    id: 'reader-first',
    label: 'Reader-first',
    responsibility: 'Keep public copy useful to the reader and remove internal agent instructions.',
  },
  {
    id: 'stop-slop',
    label: 'Stop Slop',
    responsibility: 'Remove predictable AI writing patterns while preserving a natural voice.',
  },
  {
    id: 'clarity',
    label: 'Clarity diagnostics',
    responsibility: 'Flag mechanical readability risks after the higher-priority checks.',
  },
]);

export const WRITING_MODES = Object.freeze({
  editorial: Object.freeze({
    sentenceWordLimit: 34,
    paragraphWordLimit: 120,
    paragraphSentenceLimit: 6,
    warnOnContractions: false,
  }),
  technical: Object.freeze({
    sentenceWordLimit: 20,
    paragraphWordLimit: 80,
    paragraphSentenceLimit: 4,
    warnOnContractions: true,
  }),
});

export const UPSTREAM_WRITING_REFERENCE = Object.freeze({
  repository: 'https://github.com/woosal1337/blog',
  path: 'videos/ep01-the-cure-for-ai-slop',
  commit: 'b912d5fa59f368253683af2ebfac64ad6d08312d',
  pinnedUrl:
    'https://github.com/woosal1337/blog/tree/b912d5fa59f368253683af2ebfac64ad6d08312d/videos/ep01-the-cure-for-ai-slop',
  licenseUrl:
    'https://github.com/woosal1337/blog/blob/b912d5fa59f368253683af2ebfac64ad6d08312d/LICENSE',
  note:
    'Conceptual inspiration only. This is an original heuristic checker, not an official or certified ASD-STE100 checker.',
});

const SUPPORTED_DIRECTORY_EXTENSIONS = new Set([
  '.astro',
  '.htm',
  '.html',
  '.md',
  '.mdx',
  '.txt',
]);

const EXCLUDED_DIRECTORY_NAMES = new Set([
  '.astro',
  '.git',
  '.npm-cache',
  'dist',
  'node_modules',
  'output',
  'test-results',
]);

const HARD_RULES = Object.freeze([
  {
    id: 'factual.false-certainty',
    layer: 'factual',
    message: 'Replace the certainty claim with a sourced, bounded statement.',
    pattern:
      /\b(?:100\s*%\s+(?:accurate|correct|safe|secure)|always accurate|completely safe|guaranteed (?:accuracy|results?|rankings?|success)|guaranteed to (?:rank|succeed|work)|never fails?|will definitely (?:rank|succeed|work)|zero[- ]risk)\b/giu,
  },
  {
    id: 'brand.hype',
    layer: 'brand',
    message: 'Replace hype with a specific, supportable benefit.',
    pattern:
      /\b(?:game[- ]chang(?:er|ing)|in today(?:'|’|&apos;)s (?:digital|fast-paced) world|revolutionary|supercharge your|(?:the )?ultimate guide|transform the way|unlock the power)\b/giu,
  },
  {
    id: 'reader-first.agent-facing-text',
    layer: 'reader-first',
    message: 'Remove internal agent or approval language from public copy.',
    pattern:
      /\b(?:agent instructions?|approval notes?|final judge|human approval|micro-agent|ready for (?:human )?approval|seo (?:agent|workbench)|the agent should|this (?:article|copy|draft|medium post|page|post|section) should)\b/giu,
  },
  {
    id: 'stop-slop.em-dash',
    layer: 'stop-slop',
    message: 'Replace the em dash with punctuation that fits the sentence.',
    pattern: /—|&mdash;|&#8212;|&#x2014;/giu,
  },
]);

export const SHARED_SLOP_PATTERNS = Object.freeze([
  /in today(?:'|’|&apos;)s (?:fast-paced|digital) world/giu,
  /game[- ]chang(?:er|ing)/giu,
  /unlock (?:the|your|new|the power)/giu,
  /delve(?: into)?/giu,
  /it(?:'|’)s important to note/giu,
  /whether you(?:'|’)re/giu,
  /not just .{0,80} but also/giu,
  /revolutionary/giu,
  /transformative/giu,
  /the ultimate(?: guide)?/giu,
  /a testament to/giu,
  /navigate the (?:complexities|landscape)/giu,
  /seamlessly/giu,
  /leverage/giu,
  /robust/giu,
  /supercharge/giu,
  /cutting-edge/giu,
  /transform the way/giu,
]);

const NOMINALIZATION_PATTERN =
  /\b(?:assessment|completion|consideration|creation|determination|evaluation|facilitation|implementation|measurement|optimization|selection|utilization|validation|verification)\b/giu;

const PASSIVE_PATTERN =
  /\b(?:am|are|be|been|being|get|gets|got|is|was|were)\s+(?:[\p{L}\p{N}'’-]+\s+){0,2}(?:[\p{L}]+(?:ed|en)|approved|built|caught|chosen|cut|done|found|given|held|kept|known|left|lost|made|paid|put|read|run|sent|set|shown|sold|taught|told|won|written)\b/giu;

const CONTRACTION_PATTERN =
  /\b(?:aren't|can't|couldn't|didn't|doesn't|don't|hadn't|hasn't|haven't|I'd|I'll|I'm|isn't|it's|mustn't|shouldn't|that's|there's|they'd|they'll|they're|they've|wasn't|we'd|we'll|we're|we've|weren't|won't|wouldn't|you'd|you'll|you're|you've)\b/giu;

function maskPreservingLines(value) {
  return String(value).replace(/[^\n]/g, ' ');
}

export function extractProse(value) {
  let text = String(value ?? '').replace(/\r\n?/g, '\n');

  if (text.startsWith('---')) {
    text = text.replace(/^---[ \t]*\n[\s\S]*?\n---[ \t]*(?:\n|$)/, maskPreservingLines);
  }

  const maskedRegions = [
    /```[\s\S]*?```/g,
    /~~~[\s\S]*?~~~/g,
    /<!--[\s\S]*?-->/g,
    /<script\b[\s\S]*?<\/script>/gi,
    /<style\b[\s\S]*?<\/style>/gi,
    /<pre\b[\s\S]*?<\/pre>/gi,
    /<code\b[\s\S]*?<\/code>/gi,
    /`[^`\n]+`/g,
    /<[^>]+>/g,
  ];

  for (const pattern of maskedRegions) {
    text = text.replace(pattern, maskPreservingLines);
  }

  return text;
}

export function countWords(value) {
  return String(value).match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

function segmentSentences(text) {
  const segments = [];
  const sentenceText = text
    .replace(/\n[ \t]*\n/gu, (boundary) => `.${' '.repeat(boundary.length - 1)}`)
    .replace(/\n/gu, ' ');
  const pattern = /[^.!?]+(?:[.!?]+(?=\s|$)|$)/gu;

  for (const match of sentenceText.matchAll(pattern)) {
    const raw = match[0];
    const leadingWhitespace = raw.match(/^\s*/u)?.[0].length ?? 0;
    const value = raw.trim();
    if (!value) continue;
    segments.push({
      index: (match.index ?? 0) + leadingWhitespace,
      value,
      words: countWords(value),
    });
  }

  return segments;
}

function segmentParagraphs(text) {
  const segments = [];
  const boundaryPattern = /\n[ \t]*\n/gu;
  let start = 0;

  for (const boundary of text.matchAll(boundaryPattern)) {
    const raw = text.slice(start, boundary.index);
    const leadingWhitespace = raw.match(/^\s*/u)?.[0].length ?? 0;
    const value = raw.trim();
    if (value) {
      segments.push({
        index: start + leadingWhitespace,
        value,
        words: countWords(value),
        sentences: segmentSentences(value).length,
      });
    }
    start = (boundary.index ?? 0) + boundary[0].length;
  }

  const raw = text.slice(start);
  const leadingWhitespace = raw.match(/^\s*/u)?.[0].length ?? 0;
  const value = raw.trim();
  if (value) {
    segments.push({
      index: start + leadingWhitespace,
      value,
      words: countWords(value),
      sentences: segmentSentences(value).length,
    });
  }

  return segments;
}

function locationForIndex(text, index) {
  const before = text.slice(0, Math.max(0, index));
  const lines = before.split('\n');
  return {
    line: lines.length,
    column: (lines.at(-1)?.length ?? 0) + 1,
  };
}

function excerptForIndex(text, index, length = 0) {
  const start = Math.max(0, index - 60);
  const end = Math.min(text.length, index + Math.max(length, 1) + 100);
  return text
    .slice(start, end)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

function createFinding({
  id,
  layer,
  severity,
  message,
  match,
  text,
  index,
}) {
  return {
    id,
    layer,
    severity,
    message,
    match,
    location: locationForIndex(text, index),
    excerpt: excerptForIndex(text, index, match?.length ?? 0),
    _index: index,
  };
}

function regexFindings(text, rule, severity) {
  const pattern = new RegExp(
    rule.pattern.source,
    rule.pattern.flags.includes('g') ? rule.pattern.flags : `${rule.pattern.flags}g`,
  );

  return [...text.matchAll(pattern)].map((match) =>
    createFinding({
      id: rule.id,
      layer: rule.layer,
      severity,
      message: rule.message,
      match: match[0],
      text,
      index: match.index ?? 0,
    }),
  );
}

export function findSharedSlopHits(value) {
  const text = String(value ?? '');
  return SHARED_SLOP_PATTERNS.flatMap((pattern) => {
    const matcher = new RegExp(pattern.source, pattern.flags);
    return [...text.matchAll(matcher)].map((match) => match[0]);
  });
}

function clarityWarnings(text, config) {
  const findings = [];
  const sentences = segmentSentences(text);
  const paragraphs = segmentParagraphs(text);

  for (const sentence of sentences) {
    if (sentence.words > config.sentenceWordLimit) {
      findings.push(
        createFinding({
          id: 'clarity.long-sentence',
          layer: 'clarity',
          severity: 'warning',
          message: `This sentence has ${sentence.words} words; the ${config.name} limit is ${config.sentenceWordLimit}.`,
          match: sentence.value,
          text,
          index: sentence.index,
        }),
      );
    }
  }

  findings.push(
    ...regexFindings(
      text,
      {
        id: 'clarity.passive-wording',
        layer: 'clarity',
        message: 'Name the actor and use active voice when that makes the sentence clearer.',
        pattern: PASSIVE_PATTERN,
      },
      'warning',
    ),
  );

  findings.push(
    ...regexFindings(
      text,
      {
        id: 'clarity.semicolon',
        layer: 'clarity',
        message: 'Consider splitting the sentence or using a simpler connection.',
        pattern: /;/gu,
      },
      'warning',
    ),
  );

  findings.push(
    ...regexFindings(
      text,
      {
        id: 'clarity.nominalization',
        layer: 'clarity',
        message: 'Consider a direct verb if it makes this idea easier to follow.',
        pattern: NOMINALIZATION_PATTERN,
      },
      'warning',
    ),
  );

  for (const paragraph of paragraphs) {
    if (
      paragraph.words > config.paragraphWordLimit ||
      paragraph.sentences > config.paragraphSentenceLimit
    ) {
      findings.push(
        createFinding({
          id: 'clarity.long-paragraph',
          layer: 'clarity',
          severity: 'warning',
          message:
            `This paragraph has ${paragraph.words} words and ${paragraph.sentences} sentences; ` +
            `the ${config.name} limits are ${config.paragraphWordLimit} words and ${config.paragraphSentenceLimit} sentences.`,
          match: paragraph.value,
          text,
          index: paragraph.index,
        }),
      );
    }
  }

  if (config.warnOnContractions) {
    findings.push(
      ...regexFindings(
        text,
        {
          id: 'clarity.technical-contraction',
          layer: 'clarity',
          message: 'Spell out the contraction in strict technical copy.',
          pattern: CONTRACTION_PATTERN,
        },
        'warning',
      ),
    );
  }

  return findings;
}

export function normalizeWritingMode(mode) {
  const normalized = String(mode ?? '').trim().toLowerCase();
  if (!(normalized in WRITING_MODES)) {
    throw new Error(
      `Unsupported writing mode "${mode}". Use editorial or technical.`,
    );
  }
  return normalized;
}

export function analyzeWritingText(value, { mode = 'editorial', sourcePath = '<text>' } = {}) {
  const normalizedMode = normalizeWritingMode(mode);
  const config = {
    ...WRITING_MODES[normalizedMode],
    name: normalizedMode,
  };
  const text = extractProse(value);
  const hardFindings = HARD_RULES.flatMap((rule) => regexFindings(text, rule, 'error'));
  const warnings = clarityWarnings(text, config);
  const findings = [...hardFindings, ...warnings]
    .sort((left, right) => {
      if (left._index !== right._index) return left._index - right._index;
      if (left.severity === right.severity) return left.id.localeCompare(right.id);
      return left.severity === 'error' ? -1 : 1;
    })
    .map(({ _index, ...finding }) => finding);

  const metrics = {
    words: countWords(text),
    sentences: segmentSentences(text).length,
    paragraphs: segmentParagraphs(text).length,
    hardErrors: hardFindings.length,
    warnings: warnings.length,
  };

  return {
    sourcePath,
    mode: normalizedMode,
    status:
      metrics.hardErrors > 0
        ? 'fail'
        : metrics.warnings > 0
          ? 'pass-with-warnings'
          : 'pass',
    metrics,
    findings,
  };
}

function isInsideRoot(rootDir, targetPath) {
  const value = relative(rootDir, targetPath);
  return value === '' || (!value.startsWith('..') && !isAbsolute(value));
}

function reportPath(rootDir, targetPath) {
  const value = isInsideRoot(rootDir, targetPath)
    ? relative(rootDir, targetPath)
    : targetPath;
  return value.replaceAll('\\', '/');
}

export function collectWritingFiles(targetPath) {
  const resolvedTarget = resolve(targetPath);
  if (!existsSync(resolvedTarget)) {
    throw new Error(`Writing target does not exist: ${resolvedTarget}`);
  }

  const targetStats = statSync(resolvedTarget);
  if (targetStats.isFile()) return [resolvedTarget];
  if (!targetStats.isDirectory()) {
    throw new Error(`Writing target must be a file or directory: ${resolvedTarget}`);
  }

  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const fullPath = resolve(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRECTORY_NAMES.has(entry.name)) visit(fullPath);
        continue;
      }
      if (
        entry.isFile() &&
        SUPPORTED_DIRECTORY_EXTENSIONS.has(extname(entry.name).toLowerCase())
      ) {
        files.push(fullPath);
      }
    }
  };

  visit(resolvedTarget);
  files.sort((left, right) => left.localeCompare(right));
  if (!files.length) {
    throw new Error(
      `Writing target contains no supported text files: ${resolvedTarget}`,
    );
  }
  return files;
}

export function buildWritingQualityReport({
  mode = 'editorial',
  targetPath,
  rootDir = process.cwd(),
  generatedAt = new Date().toISOString(),
} = {}) {
  if (!targetPath) throw new Error('A writing target file or directory is required.');
  const normalizedMode = normalizeWritingMode(mode);
  const resolvedRoot = resolve(rootDir);
  const resolvedTarget = resolve(targetPath);
  const files = collectWritingFiles(resolvedTarget).map((filePath) =>
    analyzeWritingText(readFileSync(filePath, 'utf8'), {
      mode: normalizedMode,
      sourcePath: reportPath(resolvedRoot, filePath),
    }),
  );

  const summary = files.reduce(
    (totals, file) => ({
      files: totals.files + 1,
      words: totals.words + file.metrics.words,
      hardErrors: totals.hardErrors + file.metrics.hardErrors,
      warnings: totals.warnings + file.metrics.warnings,
    }),
    { files: 0, words: 0, hardErrors: 0, warnings: 0 },
  );

  return {
    schemaVersion: 1,
    generatedAt,
    status:
      summary.hardErrors > 0
        ? 'fail'
        : summary.warnings > 0
          ? 'pass-with-warnings'
          : 'pass',
    mode: normalizedMode,
    target: reportPath(resolvedRoot, resolvedTarget),
    precedence: WRITING_PRECEDENCE,
    modeRules: WRITING_MODES[normalizedMode],
    upstreamReference: UPSTREAM_WRITING_REFERENCE,
    summary,
    files,
  };
}

function inlineCode(value) {
  return `\`${String(value).replaceAll('`', "'")}\``;
}

export function renderWritingQualityMarkdown(report) {
  const lines = [
    '# Writing quality report',
    '',
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    `Mode: ${report.mode}`,
    `Target: ${report.target}`,
    '',
    '## Summary',
    '',
    `- Files: ${report.summary.files}`,
    `- Words: ${report.summary.words}`,
    `- Hard errors: ${report.summary.hardErrors}`,
    `- Warnings: ${report.summary.warnings}`,
    '',
    '## Rule precedence',
    '',
    ...report.precedence.map(
      (layer, index) => `${index + 1}. ${layer.label}: ${layer.responsibility}`,
    ),
    '',
    '## Files',
    '',
  ];

  for (const file of report.files) {
    lines.push(
      `### ${file.sourcePath}`,
      '',
      `Status: ${file.status}`,
      `Words: ${file.metrics.words}`,
      `Hard errors: ${file.metrics.hardErrors}`,
      `Warnings: ${file.metrics.warnings}`,
      '',
    );

    if (!file.findings.length) {
      lines.push('- No findings.', '');
      continue;
    }

    for (const finding of file.findings) {
      lines.push(
        `- ${finding.severity.toUpperCase()} ${inlineCode(finding.id)} ` +
          `at ${finding.location.line}:${finding.location.column}: ${finding.message} ` +
          `Match: ${inlineCode(finding.match)}`,
      );
    }
    lines.push('');
  }

  lines.push(
    '## Source boundary',
    '',
    `Conceptual reference: ${report.upstreamReference.pinnedUrl}`,
    `Pinned commit: ${report.upstreamReference.commit}`,
    '',
    report.upstreamReference.note,
    '',
  );

  return `${lines.join('\n')}\n`;
}
