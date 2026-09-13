import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const OUTPUT_DIR = resolve('public', 'medium');
const REPORT_PATH = resolve('output', 'promotion', 'medium-hero-assets.json');

const heroes = [
  {
    slug: 'right-free-online-calculator',
    kicker: 'Calculator choice',
    title: 'Pick the right free online calculator',
    detail: 'Match the question, check the inputs, read the result.',
    colors: ['#e8fbff', '#fff7e2', '#5e6bff', '#0f172a'],
  },
  {
    slug: 'percentage-calculator-discounts',
    kicker: 'Percentage help',
    title: 'Discounts, tips, and markups without guessing',
    detail: 'Original value + rate + result check.',
    colors: ['#fff1f7', '#e1f7ff', '#c2185b', '#201124'],
  },
  {
    slug: 'wallpaper-waste-percent',
    kicker: 'Home project math',
    title: 'What waste percent means for wallpaper',
    detail: 'Extra material for cuts, repeats, corners, and mistakes.',
    colors: ['#f4ffe7', '#fff3dd', '#2f855a', '#10231a'],
  },
  {
    slug: 'browser-only-ai-tools-privacy',
    kicker: 'Browser-side AI',
    title: 'Useful AI tools without uploading your input',
    detail: 'Private quick checks, honest model limits.',
    colors: ['#eef2ff', '#e0fff4', '#4f46e5', '#111827'],
  },
  {
    slug: 'mortgage-payment-before-shopping',
    kicker: 'Finance estimate',
    title: 'Mortgage payment estimates before home shopping',
    detail: 'A planning number, not a lender approval.',
    colors: ['#eaf8ff', '#fff6dd', '#0369a1', '#13212b'],
  },
  {
    slug: 'bmi-result-limits',
    kicker: 'Health calculator limits',
    title: 'BMI is a quick screen, not a full health score',
    detail: 'Height and weight need context.',
    colors: ['#f1fff2', '#e8f2ff', '#16815d', '#14251f'],
  },
  {
    slug: 'watts-to-amps-safety',
    kicker: 'Electrical calculator',
    title: 'Watts to amps needs voltage and caution',
    detail: 'Useful math, not wiring permission.',
    colors: ['#fff8df', '#e7f6ff', '#b45309', '#241a0b'],
  },
  {
    slug: 'ad-revenue-calculator-creator',
    kicker: 'Website planning',
    title: 'Ad revenue estimates without fake promises',
    detail: 'RPM, impressions, and traffic scenarios.',
    colors: ['#f0fdf4', '#eff6ff', '#047857', '#0f1f1a'],
  },
  {
    slug: 'voltage-drop-wire-length',
    kicker: 'Wire-run planning',
    title: 'Voltage drop changes when wire runs get long',
    detail: 'Distance, current, wire size, and percent loss.',
    colors: ['#ecfeff', '#fff7ed', '#0e7490', '#0f2024'],
  },
  {
    slug: 'markdown-table-cleanup',
    kicker: 'Writing and docs',
    title: 'Clean Markdown tables without hand-spacing rows',
    detail: 'Headers, rows, preview, copy.',
    colors: ['#f5f3ff', '#f0fdfa', '#6d28d9', '#17132d'],
  },
];

const staticHeroes = [
  {
    slug: 'codex-backlink-workflow',
    expectedWidth: 1200,
    expectedHeight: 675,
    detailLines: ['Custom smoke-kawaii hero image; no generated text overlay.'],
    titleLines: ['How I used a Codex backlink workflow'],
  },
  {
    slug: 'github-stars-security-review',
    expectedWidth: 1200,
    expectedHeight: 675,
    detailLines: ['Custom smoke-kawaii repository review scene; no generated text overlay.'],
    titleLines: ['GitHub stars are not a security review'],
  },
  {
    slug: 'kawaii-calculator-serious-math',
    expectedWidth: 1200,
    expectedHeight: 675,
    detailLines: ['Custom smoke-kawaii calculator testing scene; no generated text overlay.'],
    titleLines: ['Why the cute calculator still needs serious math checks'],
  },
  {
    slug: 'browser-text-to-speech-kokoro-vs-supertonic',
    expectedWidth: 1200,
    expectedHeight: 675,
    detailLines: ['Custom smoke-kawaii browser TTS scene; no generated text overlay.'],
    titleLines: ['Kokoro vs Supertonic in the browser'],
  },
  {
    slug: 'ai-draft-passed-every-check',
    expectedWidth: 1200,
    expectedHeight: 675,
    detailLines: ['Custom smoke-kawaii editing decision scene; no generated text overlay.'],
    titleLines: ['My AI draft passed every check'],
  },
];

const canvas = {
  width: 1200,
  height: 675,
};

const layout = {
  leftX: 86,
  kickerY: 128,
  titleY: 238,
  titleLineHeight: 68,
  titleFontSize: 54,
  detailFontSize: 30,
  detailLineHeight: 40,
  detailTopGap: 34,
  maxTextRight: 700,
  calculatorX: 724,
  calculatorY: 126,
  calculatorWidth: 330,
  calculatorHeight: 390,
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapText(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function estimatedTextWidth(text, fontSize, weight = 600) {
  const weightFactor = weight >= 800 ? 0.61 : 0.56;
  return Math.ceil(text.length * fontSize * weightFactor);
}

function textBoxFor(line, x, y, fontSize, weight = 600) {
  return {
    line,
    x,
    y: y - fontSize,
    width: estimatedTextWidth(line, fontSize, weight),
    height: Math.ceil(fontSize * 1.2),
  };
}

function intersects(a, b, gap = 0) {
  return !(
    a.x + a.width + gap <= b.x ||
    b.x + b.width + gap <= a.x ||
    a.y + a.height + gap <= b.y ||
    b.y + b.height + gap <= a.y
  );
}

function buildHeroLayout(hero) {
  const titleLines = wrapText(hero.title, 18);
  const detailLines = wrapText(hero.detail, 34);
  const detailStartY = Math.min(
    532 - Math.max(0, detailLines.length - 1) * layout.detailLineHeight,
    layout.titleY + titleLines.length * layout.titleLineHeight + layout.detailTopGap,
  );

  const textBoxes = [
    textBoxFor(hero.kicker.toUpperCase(), layout.leftX, layout.kickerY, 28, 800),
    ...titleLines.map((line, index) =>
      textBoxFor(line, layout.leftX, layout.titleY + index * layout.titleLineHeight, layout.titleFontSize, 800),
    ),
    ...detailLines.map((line, index) =>
      textBoxFor(
        line,
        layout.leftX,
        detailStartY + index * layout.detailLineHeight,
        layout.detailFontSize,
        600,
      ),
    ),
  ];

  const calculatorBox = {
    x: layout.calculatorX,
    y: layout.calculatorY,
    width: layout.calculatorWidth,
    height: layout.calculatorHeight,
  };

  return {
    titleLines,
    detailLines,
    detailStartY,
    textBoxes,
    calculatorBox,
  };
}

function validateHeroLayout(hero, heroLayout) {
  const errors = [];

  for (const box of heroLayout.textBoxes) {
    if (box.x + box.width > layout.maxTextRight) {
      errors.push(
        `"${box.line}" extends past safe text column (${box.x + box.width}px > ${layout.maxTextRight}px).`,
      );
    }

    if (intersects(box, heroLayout.calculatorBox, 22)) {
      errors.push(`"${box.line}" overlaps the calculator artwork safe zone.`);
    }

    if (box.y < 0 || box.y + box.height > canvas.height) {
      errors.push(`"${box.line}" falls outside the image canvas.`);
    }
  }

  return errors.map((message) => ({
    slug: hero.slug,
    message,
  }));
}

function renderSvg(hero) {
  const [bgA, bgB, accent, ink] = hero.colors;
  const heroLayout = buildHeroLayout(hero);
  const titleSvg = heroLayout.titleLines
    .map(
      (line, index) =>
        `<text x="${layout.leftX}" y="${layout.titleY + index * layout.titleLineHeight}" font-family="Inter, Arial, sans-serif" font-size="${layout.titleFontSize}" font-weight="800" fill="${ink}">${escapeXml(line)}</text>`,
    )
    .join('\n');
  const detailSvg = heroLayout.detailLines
    .map(
      (line, index) =>
        `<text x="${layout.leftX}" y="${heroLayout.detailStartY + index * layout.detailLineHeight}" font-family="Inter, Arial, sans-serif" font-size="${layout.detailFontSize}" font-weight="600" fill="${ink}" opacity="0.74">${escapeXml(line)}</text>`,
    )
    .join('\n');

  return {
    heroLayout,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bgA}"/>
      <stop offset="1" stop-color="${bgB}"/>
    </linearGradient>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M 42 0 L 0 0 0 42" fill="none" stroke="${accent}" stroke-opacity="0.1" stroke-width="1"/>
    </pattern>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#0f172a" flood-opacity="0.14"/>
    </filter>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#grid)"/>
  <path d="M 0 512 C 230 454 342 570 570 512 C 781 459 948 420 1200 477 L 1200 675 L 0 675 Z" fill="${accent}" opacity="0.13"/>
  <g filter="url(#shadow)">
    <rect x="724" y="126" width="330" height="390" rx="32" fill="#ffffff" opacity="0.9"/>
    <rect x="766" y="178" width="246" height="76" rx="16" fill="${ink}"/>
    <text x="980" y="228" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="800" fill="#ffffff">42</text>
    <g fill="${accent}" opacity="0.95">
      <rect x="766" y="288" width="58" height="46" rx="13"/>
      <rect x="860" y="288" width="58" height="46" rx="13"/>
      <rect x="954" y="288" width="58" height="46" rx="13"/>
      <rect x="766" y="366" width="58" height="46" rx="13"/>
      <rect x="860" y="366" width="58" height="46" rx="13"/>
      <rect x="954" y="366" width="58" height="46" rx="13"/>
    </g>
    <path d="M812 462 H966" stroke="${accent}" stroke-width="16" stroke-linecap="round"/>
  </g>
  <text x="${layout.leftX}" y="${layout.kickerY}" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" fill="${accent}" letter-spacing="1.8">${escapeXml(hero.kicker.toUpperCase())}</text>
  ${titleSvg}
  ${detailSvg}
  <g transform="translate(86 584)">
    <rect width="268" height="52" rx="16" fill="#ffffff" opacity="0.82"/>
    <text x="24" y="34" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800" fill="${ink}">Access Free Tools</text>
  </g>
</svg>`,
  };
}

async function main() {
  const checkOnly = process.argv.includes('--check');
  if (!checkOnly) mkdirSync(OUTPUT_DIR, { recursive: true });
  const results = [];
  const layoutChecks = [];

  for (const hero of heroes) {
    const outputPath = resolve(OUTPUT_DIR, `${hero.slug}.jpg`);
    const { heroLayout, svg } = renderSvg(hero);
    const layoutErrors = validateHeroLayout(hero, heroLayout);
    if (checkOnly) {
      try {
        const metadata = await sharp(outputPath).metadata();
        if (metadata.width !== 1200 || metadata.height !== 675) layoutErrors.push({ message: 'Existing image dimensions must be 1200x675.' });
      } catch {
        layoutErrors.push({ message: 'Existing image is missing or unreadable.' });
      }
    }
    layoutChecks.push({
      slug: hero.slug,
      status: layoutErrors.length > 0 ? 'failed' : 'passed',
      errors: layoutErrors.map((error) => error.message),
      detailLines: heroLayout.detailLines,
      titleLines: heroLayout.titleLines,
    });

    if (layoutErrors.length > 0) {
      continue;
    }

    if (!checkOnly) await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toFile(outputPath);
    results.push({
      slug: hero.slug,
      path: outputPath,
      url: `https://accessfreetools.com/medium/${hero.slug}.jpg`,
      width: 1200,
      height: 675,
    });
  }

  for (const hero of staticHeroes) {
    const outputPath = resolve(OUTPUT_DIR, `${hero.slug}.jpg`);
    const errors = [];
    let metadata = null;

    if (!existsSync(outputPath)) {
      errors.push(`Static Medium hero image is missing: ${outputPath}`);
    } else {
      metadata = await sharp(outputPath).metadata();
      if (metadata.width !== hero.expectedWidth || metadata.height !== hero.expectedHeight) {
        errors.push(
          `Static Medium hero image should be ${hero.expectedWidth}x${hero.expectedHeight}; found ${metadata.width}x${metadata.height}.`,
        );
      }
    }

    layoutChecks.push({
      slug: hero.slug,
      status: errors.length > 0 ? 'failed' : 'passed',
      errors,
      detailLines: hero.detailLines,
      titleLines: hero.titleLines,
    });

    if (errors.length === 0) {
      results.push({
        slug: hero.slug,
        path: outputPath,
        url: `https://accessfreetools.com/medium/${hero.slug}.jpg`,
        width: metadata.width,
        height: metadata.height,
      });
    }
  }

  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(
    REPORT_PATH,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), mode: checkOnly ? 'check' : 'generate', results, layoutChecks }, null, 2)}\n`,
  );

  const failedChecks = layoutChecks.filter((check) => check.status === 'failed');
  if (failedChecks.length > 0) {
    for (const check of failedChecks) {
      console.error(`${check.slug}: ${check.errors.join(' ')}`);
    }
    console.error(`Medium hero image generation failed: ${failedChecks.length} layout issue(s).`);
    console.error(`Saved report to ${REPORT_PATH}`);
    process.exit(1);
  }

  console.log(`${checkOnly ? 'Checked existing' : 'Generated'} ${results.length} Medium hero image(s).`);
  console.log(`Medium hero layout checks passed: ${layoutChecks.length} image(s).`);
  console.log(`Saved report to ${REPORT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
