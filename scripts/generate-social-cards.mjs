import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const outputDir = resolve('public', 'social');
const width = 1200;
const height = 630;

const cards = [
  {
    file: 'access-free-tools.png',
    title: 'Access Free Tools',
    subtitle: 'Fast calculators, clear guides, no signup.',
    chips: ['Calculate', 'Compare', 'Learn', 'Grow'],
    accent: '#0f766e',
    accent2: '#6d5dfc',
    accent3: '#ff7a59',
  },
  {
    file: 'free-calculators.png',
    title: 'Free Online Calculators',
    subtitle: 'Math, finance, health, project, and school calculators.',
    chips: ['Basic math', 'Percentages', 'Finance', 'Health'],
    accent: '#0f766e',
    accent2: '#2563eb',
    accent3: '#f59e0b',
  },
  {
    file: 'finance-calculators.png',
    title: 'Finance Calculators',
    subtitle: 'Mortgage, loan, salary, tax, interest, and planning estimates.',
    chips: ['Mortgage', 'Loans', 'Salary', 'Interest'],
    accent: '#2563eb',
    accent2: '#0f766e',
    accent3: '#f59e0b',
  },
  {
    file: 'health-calculators.png',
    title: 'Health & Fitness Calculators',
    subtitle: 'Educational BMI, calorie, pregnancy, pace, and nutrition estimates.',
    chips: ['BMI', 'Calories', 'Pregnancy', 'Fitness'],
    accent: '#0f766e',
    accent2: '#d946ef',
    accent3: '#22c55e',
  },
  {
    file: 'home-project-calculators.png',
    title: 'Home Project Calculators',
    subtitle: 'Concrete, paint, roofing, flooring, wallpaper, and material planning.',
    chips: ['Concrete', 'Paint', 'Roofing', 'Flooring'],
    accent: '#b45309',
    accent2: '#0f766e',
    accent3: '#2563eb',
  },
  {
    file: 'browser-ai-tools.png',
    title: 'Browser AI Tools',
    subtitle: 'Private OCR, summaries, tone, keywords, language, and reading checks.',
    chips: ['OCR', 'Summaries', 'Tone', 'Reading'],
    accent: '#6d5dfc',
    accent2: '#0891b2',
    accent3: '#f97316',
  },
  {
    file: 'developer-tools.png',
    title: 'Developer Tools',
    subtitle: 'Passwords, JSON, URL encoding, subnetting, hashes, and web utilities.',
    chips: ['Passwords', 'JSON', 'URLs', 'Subnet'],
    accent: '#334155',
    accent2: '#0f766e',
    accent3: '#38bdf8',
  },
  {
    file: 'tools-library.png',
    title: 'Free Tool Library',
    subtitle: 'Search calculators, converters, text tools, AI helpers, and utilities.',
    chips: ['Tools', 'Categories', 'Guides', 'Search'],
    accent: '#0f766e',
    accent2: '#6d5dfc',
    accent3: '#06b6d4',
  },
  {
    file: 'free-guides.png',
    title: 'Utility Guides',
    subtitle: 'Plain-language examples, formulas, FAQs, and tool walkthroughs.',
    chips: ['Examples', 'Formulas', 'FAQs', 'Limits'],
    accent: '#7c3aed',
    accent2: '#0f766e',
    accent3: '#f97316',
  },
  {
    file: 'free-calculator-resources.png',
    title: 'Free Calculator Resources',
    subtitle: 'A practical resource hub for students, teachers, writers, and builders.',
    chips: ['Classrooms', 'Projects', 'Finance', 'Study'],
    accent: '#0891b2',
    accent2: '#0f766e',
    accent3: '#f97316',
  },
];

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function cardHtml(card) {
  const chips = card.chips
    .map((chip, index) => `<span style="--chip-color:${[card.accent, card.accent2, card.accent3, '#111827'][index] ?? card.accent}">${escapeHtml(chip)}</span>`)
    .join('');

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        align-items: center;
        background:
          linear-gradient(135deg, color-mix(in srgb, ${card.accent} 18%, #f8fbff), #fbf7ff 44%, #fff6ef),
          #f8fbff;
        color: #111827;
        display: flex;
        font-family: Arial, Helvetica, sans-serif;
        height: ${height}px;
        justify-content: center;
        margin: 0;
        overflow: hidden;
        width: ${width}px;
      }
      .grid {
        background-image:
          linear-gradient(rgba(15, 23, 42, 0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(15, 23, 42, 0.07) 1px, transparent 1px);
        background-size: 64px 64px;
        inset: 0;
        mask-image: linear-gradient(135deg, rgba(0, 0, 0, 0.72), transparent 72%);
        position: absolute;
      }
      .card {
        align-items: center;
        display: grid;
        gap: 44px;
        grid-template-columns: 220px 1fr;
        padding: 86px;
        position: relative;
        width: 100%;
      }
      .mark {
        align-items: center;
        background: linear-gradient(135deg, ${card.accent}, ${card.accent2} 58%, ${card.accent3});
        border-radius: 44px;
        box-shadow: 0 28px 70px rgba(17, 24, 39, 0.22);
        display: grid;
        height: 198px;
        justify-content: center;
        position: relative;
        width: 198px;
      }
      .mark strong {
        color: #fff;
        font-size: 98px;
        font-weight: 950;
        letter-spacing: -5px;
        line-height: 1;
      }
      .spark {
        border-radius: 999px;
        border: 7px solid rgba(255, 255, 255, 0.92);
        height: 58px;
        position: absolute;
        right: 24px;
        top: 24px;
        width: 58px;
      }
      .spark::before,
      .spark::after {
        background: #fff;
        border-radius: 999px;
        content: '';
        height: 9px;
        left: 10px;
        position: absolute;
        top: 18px;
        width: 24px;
      }
      .spark::after {
        height: 24px;
        left: 17px;
        top: 10px;
        width: 9px;
      }
      h1 {
        font-size: 74px;
        font-weight: 950;
        letter-spacing: -1px;
        line-height: 0.96;
        margin: 0 0 24px;
        max-width: 820px;
      }
      p {
        color: #334155;
        font-size: 32px;
        font-weight: 700;
        line-height: 1.28;
        margin: 0;
        max-width: 790px;
      }
      .chips {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin-top: 42px;
      }
      .chips span {
        background: rgba(255, 255, 255, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.9);
        border-left: 10px solid var(--chip-color);
        border-radius: 18px;
        box-shadow: 0 12px 36px rgba(17, 24, 39, 0.1);
        color: #111827;
        font-size: 28px;
        font-weight: 900;
        padding: 18px 24px 18px 18px;
      }
      .url {
        bottom: 48px;
        color: #475569;
        font-size: 26px;
        font-weight: 800;
        left: 86px;
        position: absolute;
      }
    </style>
  </head>
  <body>
    <div class="grid"></div>
    <main class="card">
      <div class="mark" aria-hidden="true"><strong>A</strong><span class="spark"></span></div>
      <section>
        <h1>${escapeHtml(card.title)}</h1>
        <p>${escapeHtml(card.subtitle)}</p>
        <div class="chips">${chips}</div>
      </section>
      <div class="url">accessfreetools.com</div>
    </main>
  </body>
</html>`;
}

mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });

for (const card of cards) {
  await page.setContent(cardHtml(card), { waitUntil: 'networkidle' });
  await page.screenshot({
    path: resolve(outputDir, card.file),
    clip: { x: 0, y: 0, width, height },
  });
  console.log(`Generated public/social/${card.file}`);
}

await browser.close();
