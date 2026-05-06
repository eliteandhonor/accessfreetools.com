import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const outputDir = resolve('output', 'promotion', 'pinterest');
const width = 1000;
const height = 1500;

const pins = [
  {
    file: 'free-online-tools-library.png',
    title: 'Free Online Tools',
    subtitle: 'Calculators, converters, AI browser tools, and practical guides without signup.',
    chips: ['300+ tools', 'No signup', 'Clear guides'],
    url: 'accessfreetools.com/tools/',
    accent: '#0f766e',
    accent2: '#6d5dfc',
    accent3: '#38bdf8',
  },
  {
    file: 'free-calculator-resources.png',
    title: 'Free Calculator Resources',
    subtitle: 'A simple hub for everyday math, finance, home projects, school, and planning.',
    chips: ['Math', 'Finance', 'Home'],
    url: 'accessfreetools.com/free-calculator-resources/',
    accent: '#0891b2',
    accent2: '#0f766e',
    accent3: '#f97316',
  },
  {
    file: 'basic-calculator.png',
    title: 'Basic Calculator',
    subtitle: 'Fast everyday math with keyboard support, history, and a plain-language guide.',
    chips: ['Add', 'Percent', 'Copy'],
    url: 'accessfreetools.com/tools/basic-calculator/',
    accent: '#2563eb',
    accent2: '#0f766e',
    accent3: '#f59e0b',
  },
  {
    file: 'percentage-calculator.png',
    title: 'Percentage Calculator',
    subtitle: 'Discounts, tips, markups, percent change, and reverse percentages explained.',
    chips: ['Discounts', 'Change', 'Tips'],
    url: 'accessfreetools.com/tools/percentage-calculator/',
    accent: '#be185d',
    accent2: '#7c3aed',
    accent3: '#06b6d4',
  },
  {
    file: 'mortgage-calculator.png',
    title: 'Mortgage Calculator',
    subtitle: 'Estimate monthly payment, interest, taxes, and amortization before comparing loans.',
    chips: ['Payment', 'Interest', 'Guide'],
    url: 'accessfreetools.com/tools/mortgage-calculator/',
    accent: '#1d4ed8',
    accent2: '#0f766e',
    accent3: '#f59e0b',
  },
  {
    file: 'bmi-calculator.png',
    title: 'BMI Calculator',
    subtitle: 'Estimate BMI with clear notes about what the result can and cannot tell you.',
    chips: ['Estimate', 'Ranges', 'Limits'],
    url: 'accessfreetools.com/tools/bmi-calculator/',
    accent: '#16a34a',
    accent2: '#0891b2',
    accent3: '#f97316',
  },
  {
    file: 'wallpaper-calculator.png',
    title: 'Wallpaper Calculator',
    subtitle: 'Estimate rolls using wall size, pattern repeat, openings, and waste percent.',
    chips: ['Rolls', 'Repeat', 'Waste'],
    url: 'accessfreetools.com/tools/wallpaper-calculator/',
    accent: '#b45309',
    accent2: '#0f766e',
    accent3: '#d946ef',
  },
  {
    file: 'browser-ai-tools.png',
    title: 'Browser AI Tools',
    subtitle: 'OCR, language, tone, reading level, keywords, and summaries with privacy notes.',
    chips: ['OCR', 'Tone', 'Reading'],
    url: 'accessfreetools.com/categories/ai-tools/',
    accent: '#6d5dfc',
    accent2: '#0891b2',
    accent3: '#f97316',
  },
  {
    file: 'image-to-text-ocr.png',
    title: 'Image To Text OCR',
    subtitle: 'Extract text from screenshots and images in your browser, with OCR limits explained.',
    chips: ['Images', 'Text', 'Private'],
    url: 'accessfreetools.com/tools/image-to-text-ocr-tool/',
    accent: '#7c3aed',
    accent2: '#0f766e',
    accent3: '#38bdf8',
  },
];

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function brandMarkHtml() {
  return `
    <div class="mark" aria-hidden="true">
      <strong>A</strong>
      <span class="spark"></span>
    </div>`;
}

function pinHtml(pin) {
  const chips = pin.chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join('');

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        align-items: stretch;
        background:
          radial-gradient(circle at 18% 13%, color-mix(in srgb, ${pin.accent3} 20%, transparent), transparent 34%),
          radial-gradient(circle at 84% 9%, color-mix(in srgb, ${pin.accent2} 18%, transparent), transparent 38%),
          linear-gradient(155deg, color-mix(in srgb, ${pin.accent} 14%, #f8fbff), #f8fbff 46%, #fff7ed),
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
          linear-gradient(rgba(17, 24, 39, 0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(17, 24, 39, 0.07) 1px, transparent 1px);
        background-size: 56px 56px;
        inset: 0;
        mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent 76%);
        position: absolute;
      }
      main {
        display: flex;
        flex-direction: column;
        min-height: 100%;
        padding: 76px 70px 70px;
        position: relative;
        width: 100%;
      }
      .top {
        align-items: center;
        display: flex;
        gap: 22px;
      }
      .mark {
        align-items: center;
        background: linear-gradient(135deg, ${pin.accent}, ${pin.accent2} 56%, ${pin.accent3});
        border-radius: 28px;
        box-shadow: 0 22px 54px rgba(15, 23, 42, 0.2);
        display: grid;
        height: 124px;
        justify-content: center;
        position: relative;
        width: 124px;
      }
      .mark strong {
        color: #fff;
        font-size: 68px;
        font-weight: 950;
        letter-spacing: -4px;
        line-height: 1;
      }
      .spark {
        border: 5px solid rgba(255, 255, 255, 0.93);
        border-radius: 999px;
        height: 38px;
        position: absolute;
        right: 14px;
        top: 14px;
        width: 38px;
      }
      .spark::before,
      .spark::after {
        background: #fff;
        border-radius: 999px;
        content: '';
        height: 6px;
        left: 7px;
        position: absolute;
        top: 11px;
        width: 16px;
      }
      .spark::after {
        height: 16px;
        left: 12px;
        top: 6px;
        width: 6px;
      }
      .brand {
        color: #334155;
        font-size: 35px;
        font-weight: 900;
        letter-spacing: 0;
        line-height: 1.05;
      }
      h1 {
        color: #111827;
        font-size: 108px;
        font-weight: 950;
        letter-spacing: 0;
        line-height: 0.93;
        margin: 120px 0 34px;
        max-width: 850px;
      }
      p {
        color: #334155;
        font-size: 42px;
        font-weight: 760;
        line-height: 1.22;
        margin: 0;
        max-width: 840px;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        margin-top: 62px;
      }
      .chips span {
        background: rgba(255, 255, 255, 0.82);
        border: 2px solid rgba(255, 255, 255, 0.95);
        border-left: 12px solid ${pin.accent};
        border-radius: 18px;
        box-shadow: 0 16px 38px rgba(15, 23, 42, 0.11);
        color: #111827;
        font-size: 31px;
        font-weight: 950;
        padding: 18px 24px 18px 18px;
      }
      .preview {
        background: rgba(255, 255, 255, 0.7);
        border: 2px solid rgba(255, 255, 255, 0.92);
        border-radius: 34px;
        box-shadow: 0 28px 76px rgba(15, 23, 42, 0.12);
        margin-top: auto;
        padding: 34px;
      }
      .bar {
        background: #fff;
        border-radius: 22px;
        display: grid;
        gap: 18px;
        padding: 28px;
      }
      .row {
        align-items: center;
        display: grid;
        gap: 18px;
        grid-template-columns: 80px 1fr;
      }
      .icon {
        align-items: center;
        background: color-mix(in srgb, ${pin.accent3} 30%, #fff);
        border: 2px solid color-mix(in srgb, ${pin.accent2} 34%, #fff);
        border-radius: 18px;
        color: ${pin.accent};
        display: grid;
        font-size: 44px;
        font-weight: 950;
        height: 80px;
        justify-content: center;
      }
      .line {
        background: color-mix(in srgb, ${pin.accent} 18%, #e2e8f0);
        border-radius: 999px;
        height: 18px;
        width: 100%;
      }
      .line.short {
        width: 68%;
      }
      .url {
        color: #475569;
        font-size: 30px;
        font-weight: 900;
        margin-top: 26px;
      }
    </style>
  </head>
  <body>
    <div class="grid"></div>
    <main>
      <div class="top">
        ${brandMarkHtml()}
        <div class="brand">Access<br />Free Tools</div>
      </div>
      <h1>${escapeHtml(pin.title)}</h1>
      <p>${escapeHtml(pin.subtitle)}</p>
      <div class="chips">${chips}</div>
      <section class="preview" aria-hidden="true">
        <div class="bar">
          <div class="row"><div class="icon">=</div><div><div class="line"></div><br /><div class="line short"></div></div></div>
          <div class="row"><div class="icon">%</div><div><div class="line short"></div><br /><div class="line"></div></div></div>
        </div>
        <div class="url">${escapeHtml(pin.url)}</div>
      </section>
    </main>
  </body>
</html>`;
}

function avatarHtml() {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        align-items: center;
        background: transparent;
        display: grid;
        height: 1000px;
        justify-content: center;
        margin: 0;
        width: 1000px;
      }
      .mark {
        align-items: center;
        background: linear-gradient(135deg, #0f766e, #6d5dfc 58%, #38bdf8);
        border-radius: 230px;
        box-shadow: 0 44px 120px rgba(15, 23, 42, 0.24);
        display: grid;
        height: 760px;
        justify-content: center;
        position: relative;
        width: 760px;
      }
      strong {
        color: #fff;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 430px;
        font-weight: 950;
        letter-spacing: -28px;
        line-height: 1;
      }
      span {
        border: 34px solid rgba(255, 255, 255, 0.95);
        border-radius: 999px;
        height: 210px;
        position: absolute;
        right: 88px;
        top: 88px;
        width: 210px;
      }
      span::before,
      span::after {
        background: #fff;
        border-radius: 999px;
        content: '';
        height: 38px;
        left: 42px;
        position: absolute;
        top: 70px;
        width: 86px;
      }
      span::after {
        height: 86px;
        left: 66px;
        top: 46px;
        width: 38px;
      }
    </style>
  </head>
  <body>
    <div class="mark"><strong>A</strong><span></span></div>
  </body>
</html>`;
}

mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });

for (const pin of pins) {
  await page.setContent(pinHtml(pin), { waitUntil: 'networkidle' });
  await page.screenshot({
    path: resolve(outputDir, pin.file),
    type: 'png',
    fullPage: false,
  });
  console.log(`Generated output/promotion/pinterest/${pin.file}`);
}

await page.setViewportSize({ width: 1000, height: 1000 });
await page.setContent(avatarHtml(), { waitUntil: 'networkidle' });
await page.screenshot({
  path: resolve(outputDir, 'access-free-tools-avatar.png'),
  type: 'png',
  fullPage: false,
  omitBackground: true,
});
console.log('Generated output/promotion/pinterest/access-free-tools-avatar.png');

await browser.close();
