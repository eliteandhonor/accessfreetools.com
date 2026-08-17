import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';

const OUTPUT_DIR = resolve('output', 'editorial-ocr-experiment');
const LANGUAGE_DIR = resolve('public', 'ai-models', 'tesseract', 'lang');
const WIDTH = 1200;
const HEIGHT = 675;

const cases = [
  {
    id: 'blur',
    label: 'Blurred screenshot',
    expected: 'INVOICE 1049 TOTAL $42.50 DUE AUGUST 26',
    render: { fontSize: 52, foreground: '#17212b', background: '#ffffff', blur: 2.2 },
    lesson: 'Blur joins letter edges and makes punctuation and digits harder to separate.',
  },
  {
    id: 'low-contrast',
    label: 'Low contrast',
    expected: 'ORDER 7814 SUBTOTAL $38.25 READY TODAY',
    render: { fontSize: 52, foreground: '#b8bcc0', background: '#eef0f2' },
    lesson: 'Small brightness differences leave fewer clean edges for OCR to follow.',
  },
  {
    id: 'cropped',
    label: 'Cropped first characters',
    expected: 'REFERENCE ZX-1049-B STATUS PAID',
    render: { fontSize: 54, foreground: '#111827', background: '#ffffff', x: -42 },
    lesson: 'Cropping removes evidence. OCR cannot reconstruct characters that are outside the image.',
  },
  {
    id: 'tiny-text',
    label: 'Tiny text',
    expected: 'PRODUCT CODE A7X9 QUANTITY 18 BATCH 2206',
    render: { fontSize: 13, foreground: '#111827', background: '#ffffff' },
    lesson: 'Tiny glyphs provide too few pixels for reliable character shapes.',
  },
  {
    id: 'glare',
    label: 'Glare across the total',
    expected: 'RECEIPT 6201 TOTAL $57.80 CARD APPROVED',
    render: { fontSize: 52, foreground: '#111827', background: '#dde3e8', glare: true },
    lesson: 'Glare erases contrast in part of the image even when the rest stays sharp.',
  },
  {
    id: 'language-choice',
    label: 'Spanish language choice',
    expected: 'NÚMERO DE PEDIDO 431 DESCRIPCIÓN CAFÉ MOLIDO TOTAL 42,50 EUROS',
    render: { fontSize: 46, foreground: '#111827', background: '#ffffff', spanish: true },
    lesson: 'The matching language model can improve accented words and language-specific character patterns.',
  },
];

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function linesFor(item) {
  if (item.id === 'language-choice') {
    return ['Número de pedido 431', 'Descripción: café molido', 'Total: 42,50 euros'];
  }

  const words = item.expected.split(' ');
  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')];
}

function imageSvg(item) {
  const { background, foreground, fontSize, x = 100, glare = false } = item.render;
  const lines = linesFor(item);
  const lineHeight = Math.round(fontSize * 1.55);
  const startY = item.id === 'tiny-text' ? 310 : 275;
  const text = lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${startY + index * lineHeight}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" fill="${foreground}">${escapeXml(line)}</text>`,
    )
    .join('\n');

  const glareLayer = glare
    ? `<defs><radialGradient id="glare"><stop offset="0" stop-color="#ffffff" stop-opacity="0.98"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.78"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs><ellipse cx="665" cy="348" rx="310" ry="155" fill="url(#glare)"/>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${background}"/>
  <rect x="55" y="55" width="1090" height="565" rx="20" fill="none" stroke="${foreground}" stroke-opacity="0.14" stroke-width="3"/>
  ${text}
  ${glareLayer}
</svg>`;
}

function normalize(value) {
  return String(value)
    .normalize('NFC')
    .toUpperCase()
    .replace(/[^\p{L}0-9$.,-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function editDistance(left, right) {
  const a = [...left];
  const b = [...right];
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}

async function renderCase(item) {
  const path = join(OUTPUT_DIR, `${item.id}.png`);
  let pipeline = sharp(Buffer.from(imageSvg(item))).png();
  if (item.render.blur) pipeline = pipeline.blur(item.render.blur);
  await pipeline.toFile(path);
  return path;
}

async function recognize(worker, imagePath, expected) {
  const { data } = await worker.recognize(imagePath);
  const normalizedExpected = normalize(expected);
  const normalizedActual = normalize(data.text);
  return {
    rawText: data.text.trim(),
    normalizedText: normalizedActual,
    confidence: typeof data.confidence === 'number' ? Math.round(data.confidence) : null,
    manualCharacterEdits: editDistance(normalizedExpected, normalizedActual),
    expectedCharacters: normalizedExpected.length,
  };
}

function markdownReport(report) {
  const rows = report.results
    .map((item) => {
      const primary = item.recognition.eng;
      const language = item.recognition.spa
        ? `; Spanish model ${item.recognition.spa.manualCharacterEdits} edits at ${item.recognition.spa.confidence}% confidence`
        : '';
      return `| ${item.label} | ${primary.manualCharacterEdits} | ${primary.confidence ?? 'n/a'}% | ${item.recognition.spa ? 'English and Spanish' : 'English'}${language} |`;
    })
    .join('\n');

  return `# Tesseract.js browser OCR image-quality experiment

Generated: ${report.generatedAt}

This report uses six synthetic, non-private images. The harness runs the installed Tesseract.js ${report.tesseractVersion} package with the same self-hosted language files used by Access Free Tools. "Manual character edits" means Levenshtein edits after case and repeated whitespace are normalized; accents remain significant.

| Case | English-model edits | Confidence | Language run |
| --- | ---: | ---: | --- |
${rows}

## Results

${report.results
  .map((item) => {
    const lines = [
      `### ${item.label}`,
      '',
      `- Expected: \`${normalize(item.expected)}\``,
      `- English OCR: \`${item.recognition.eng.normalizedText || '(no text)'}\``,
      `- English edits: ${item.recognition.eng.manualCharacterEdits}; confidence: ${item.recognition.eng.confidence ?? 'n/a'}%.`,
    ];
    if (item.recognition.spa) {
      lines.push(
        `- Spanish OCR: \`${item.recognition.spa.normalizedText || '(no text)'}\``,
        `- Spanish edits: ${item.recognition.spa.manualCharacterEdits}; confidence: ${item.recognition.spa.confidence ?? 'n/a'}%.`,
      );
    }
    lines.push(`- Lesson: ${item.lesson}`, `- Image: \`${item.imagePath}\``);
    return lines.join('\n');
  })
  .join('\n\n')}

## Boundaries

- These synthetic cases show behavior in this fixed harness, not a universal OCR benchmark.
- Confidence is Tesseract's own estimate and does not replace manual checking.
- The public browser tool self-hosts its worker, core, and language files; this Node harness uses the installed package core plus the same local language files.
`;
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const imagePaths = new Map();
  for (const item of cases) imagePaths.set(item.id, await renderCase(item));

  const logger = (message) => {
    if (message.status === 'recognizing text' && message.progress === 1) {
      process.stdout.write('.');
    }
  };
  const englishWorker = await createWorker('eng', undefined, { langPath: LANGUAGE_DIR, logger });
  const results = [];
  try {
    for (const item of cases) {
      results.push({
        id: item.id,
        label: item.label,
        expected: item.expected,
        imagePath: imagePaths.get(item.id),
        lesson: item.lesson,
        recognition: {
          eng: await recognize(englishWorker, imagePaths.get(item.id), item.expected),
        },
      });
    }
  } finally {
    await englishWorker.terminate();
  }

  const spanishWorker = await createWorker('spa', undefined, { langPath: LANGUAGE_DIR, logger });
  try {
    const languageResult = results.find((item) => item.id === 'language-choice');
    languageResult.recognition.spa = await recognize(
      spanishWorker,
      imagePaths.get('language-choice'),
      languageResult.expected,
    );
  } finally {
    await spanishWorker.terminate();
  }

  const packageJson = JSON.parse(await import('node:fs').then(({ readFileSync }) => readFileSync(resolve('node_modules', 'tesseract.js', 'package.json'), 'utf8')));
  const report = {
    generatedAt: new Date().toISOString(),
    tesseractVersion: packageJson.version,
    imageCount: results.length,
    privacy: 'Synthetic text only; no user images or private files.',
    results,
  };

  writeFileSync(join(OUTPUT_DIR, 'latest.json'), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(join(OUTPUT_DIR, 'latest.md'), markdownReport(report));
  process.stdout.write('\n');
  console.log(`OCR experiment complete: ${results.length} synthetic cases.`);
  console.log(`Saved ${join(OUTPUT_DIR, 'latest.json')}`);
  console.log(`Saved ${join(OUTPUT_DIR, 'latest.md')}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
