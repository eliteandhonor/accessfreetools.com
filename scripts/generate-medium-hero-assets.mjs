import { mkdirSync, writeFileSync } from 'node:fs';
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

function renderSvg(hero) {
  const [bgA, bgB, accent, ink] = hero.colors;
  const titleLines = wrapText(hero.title, 21);
  const detailY = Math.min(532, 238 + titleLines.length * 68 + 34);
  const titleSvg = titleLines
    .map(
      (line, index) =>
        `<text x="86" y="${238 + index * 68}" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="800" fill="${ink}">${escapeXml(line)}</text>`,
    )
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
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
  <text x="86" y="128" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" fill="${accent}" letter-spacing="1.8">${escapeXml(hero.kicker.toUpperCase())}</text>
  ${titleSvg}
  <text x="86" y="${detailY}" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="600" fill="${ink}" opacity="0.74">${escapeXml(hero.detail)}</text>
  <g transform="translate(86 584)">
    <rect width="268" height="52" rx="16" fill="#ffffff" opacity="0.82"/>
    <text x="24" y="34" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800" fill="${ink}">Access Free Tools</text>
  </g>
</svg>`;
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const results = [];

  for (const hero of heroes) {
    const outputPath = resolve(OUTPUT_DIR, `${hero.slug}.jpg`);
    const svg = renderSvg(hero);
    await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toFile(outputPath);
    results.push({
      slug: hero.slug,
      path: outputPath,
      url: `https://accessfreetools.com/medium/${hero.slug}.jpg`,
      width: 1200,
      height: 675,
    });
  }

  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`);
  console.log(`Generated ${results.length} Medium hero image(s).`);
  console.log(`Saved report to ${REPORT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
