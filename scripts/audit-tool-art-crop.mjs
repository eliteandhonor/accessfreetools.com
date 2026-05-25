import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import sharp from 'sharp';

const rootDir = process.cwd();
const sourceDir = resolve(rootDir, 'public/tool-art');
const outputDir = resolve(rootDir, 'output/tool-art-crop-review');
const edgePx = 24;
const minLuma = 48;
const reviewEdgeRatio = 0.04;
const sheetSize = 30;
const thumbWidth = 240;
const thumbHeight = 126;
const labelHeight = 44;
const columns = 5;

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function labelForFile(file) {
  return file.replace(/-(tool|guide)\.webp$/, ' $1').replace(/-/g, ' ');
}

async function imageStats(filePath) {
  const { data, info } = await sharp(filePath)
    .removeAlpha()
    .toColourspace('srgb')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let foreground = 0;
  let edgeForeground = 0;
  const edgeCounts = { top: 0, right: 0, bottom: 0, left: 0 };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 3;
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      const luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
      const foregroundPixel = luma >= minLuma || (luma >= 38 && chroma >= 16);

      if (!foregroundPixel) continue;

      foreground += 1;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      let isEdge = false;
      if (y < edgePx) {
        edgeCounts.top += 1;
        isEdge = true;
      }
      if (x >= width - edgePx) {
        edgeCounts.right += 1;
        isEdge = true;
      }
      if (y >= height - edgePx) {
        edgeCounts.bottom += 1;
        isEdge = true;
      }
      if (x < edgePx) {
        edgeCounts.left += 1;
        isEdge = true;
      }
      if (isEdge) edgeForeground += 1;
    }
  }

  const margins = foreground
    ? {
        left: minX,
        top: minY,
        right: width - 1 - maxX,
        bottom: height - 1 - maxY,
      }
    : null;
  const failEdges = margins
    ? Object.entries(margins)
        .filter(([, value]) => value < edgePx)
        .map(([key]) => key)
    : [];
  const edgeRatio = foreground ? Number((edgeForeground / foreground).toFixed(4)) : 0;

  return {
    file: basename(filePath),
    width,
    height,
    bytes: statSync(filePath).size,
    margins,
    edgeCounts,
    foreground,
    edgeForeground,
    edgeRatio,
    failEdges,
    likelyNeedsVisualReview:
      edgeRatio >= reviewEdgeRatio && (failEdges.includes('top') || failEdges.includes('bottom')),
  };
}

async function writeContactSheets(candidates) {
  for (let sheetIndex = 0; sheetIndex < Math.ceil(candidates.length / sheetSize); sheetIndex += 1) {
    const batch = candidates.slice(sheetIndex * sheetSize, (sheetIndex + 1) * sheetSize);
    const composite = [];

    for (let index = 0; index < batch.length; index += 1) {
      const item = batch[index];
      const x = (index % columns) * thumbWidth;
      const y = Math.floor(index / columns) * (thumbHeight + labelHeight);
      const image = await sharp(resolve(sourceDir, item.file))
        .resize(thumbWidth, thumbHeight, { fit: 'contain', background: '#111827' })
        .png()
        .toBuffer();
      const label = escapeXml(labelForFile(item.file));
      const detail = escapeXml(
        `edge ${item.edgeRatio} margins t${item.margins?.top ?? '-'} b${item.margins?.bottom ?? '-'} l${item.margins?.left ?? '-'} r${item.margins?.right ?? '-'}`,
      );
      const labelSvg = Buffer.from(
        `<svg width="${thumbWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111827"/><text x="6" y="15" fill="#f8fafc" font-family="Arial" font-size="12">${label.slice(0, 34)}</text><text x="6" y="32" fill="#cbd5e1" font-family="Arial" font-size="11">${detail}</text></svg>`,
      );

      composite.push({ input: image, left: x, top: y });
      composite.push({ input: labelSvg, left: x, top: y + thumbHeight });
    }

    const rows = Math.ceil(batch.length / columns);
    await sharp({
      create: {
        width: columns * thumbWidth,
        height: rows * (thumbHeight + labelHeight),
        channels: 3,
        background: '#0f172a',
      },
    })
      .composite(composite)
      .png()
      .toFile(resolve(outputDir, `severe-${String(sheetIndex + 1).padStart(2, '0')}.png`));
  }
}

mkdirSync(outputDir, { recursive: true });
for (const oldSheet of readdirSync(outputDir).filter((name) => /^severe-\d+\.png$/.test(name))) {
  rmSync(resolve(outputDir, oldSheet));
}

const results = [];
for (const file of readdirSync(sourceDir).filter((name) => name.endsWith('.webp'))) {
  results.push(await imageStats(resolve(sourceDir, file)));
}

results.sort(
  (a, b) =>
    Number(b.likelyNeedsVisualReview) - Number(a.likelyNeedsVisualReview) ||
    b.edgeRatio - a.edgeRatio ||
    a.file.localeCompare(b.file),
);

const candidates = results.filter((result) => result.likelyNeedsVisualReview);
await writeContactSheets(candidates);

const report = {
  generatedAt: new Date().toISOString(),
  note:
    'Heuristic crop/zoom review queue. Use visual QA before rejection or approval; edge smoke can cause false positives.',
  thresholds: { edgePx, minLuma, reviewEdgeRatio },
  totals: {
    images: results.length,
    likelyNeedsVisualReview: candidates.length,
    contactSheets: Math.ceil(candidates.length / sheetSize),
  },
  results,
};

writeFileSync(resolve(outputDir, 'edge-crop-audit.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(
  resolve(outputDir, 'edge-crop-audit.md'),
  [
    '# Tool Art Crop Review',
    '',
    report.note,
    '',
    `Images checked: ${report.totals.images}`,
    `Likely visual-review candidates: ${report.totals.likelyNeedsVisualReview}`,
    `Contact sheets: ${report.totals.contactSheets}`,
    '',
    ...candidates
      .slice(0, 80)
      .map(
        (item) =>
          `- ${item.file}: edge ${item.edgeRatio}, margins ${JSON.stringify(item.margins)}, edges ${item.failEdges.join(', ')}`,
      ),
    candidates.length > 80 ? `- ...${candidates.length - 80} more` : '',
    '',
  ]
    .filter(Boolean)
    .join('\n'),
);

console.log(
  `Tool art crop review checked ${report.totals.images} images; ${report.totals.likelyNeedsVisualReview} need visual review.`,
);
console.log('Wrote output/tool-art-crop-review/edge-crop-audit.json');
