import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const outputDir = resolve('output', 'promotion', 'pinterest');
const publicDir = resolve('public', 'pinterest');
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
  {
    file: 'voltage-drop-calculator.png',
    title: 'Voltage Drop Calculator',
    subtitle: 'Check how wire length, current, voltage, and wire size can affect a circuit estimate.',
    chips: ['Wire', 'Voltage', 'Safety'],
    url: 'accessfreetools.com/tools/voltage-drop-calculator/',
    accent: '#dc2626',
    accent2: '#2563eb',
    accent3: '#f59e0b',
  },
  {
    file: 'sand-calculator.png',
    title: 'Sand Calculator',
    subtitle: 'Estimate sand volume and weight for pavers, bases, play areas, and landscaping projects.',
    chips: ['Depth', 'Area', 'Weight'],
    url: 'accessfreetools.com/tools/sand-calculator/',
    accent: '#b45309',
    accent2: '#0f766e',
    accent3: '#facc15',
  },
  {
    file: 'markdown-table-generator.png',
    title: 'Markdown Table Generator',
    subtitle: 'Build clean Markdown tables from rows and columns without fighting spacing by hand.',
    chips: ['Rows', 'Columns', 'Copy'],
    url: 'accessfreetools.com/tools/markdown-table-generator/',
    accent: '#334155',
    accent2: '#2563eb',
    accent3: '#22c55e',
  },
  {
    file: 'body-surface-area-calculator.png',
    title: 'Body Surface Area Calculator',
    subtitle: 'Estimate BSA from height and weight with plain notes about why the result is only a guide.',
    chips: ['Height', 'Weight', 'Estimate'],
    url: 'accessfreetools.com/tools/body-surface-area-calculator/',
    accent: '#16a34a',
    accent2: '#0891b2',
    accent3: '#a78bfa',
  },
  {
    file: 'speed-calculator.png',
    title: 'Speed Calculator',
    subtitle: 'Calculate speed, distance, or time for travel, pacing, and simple motion questions.',
    chips: ['Speed', 'Distance', 'Time'],
    url: 'accessfreetools.com/tools/speed-calculator/',
    accent: '#0284c7',
    accent2: '#7c3aed',
    accent3: '#f97316',
  },
  {
    file: 'payment-calculator.png',
    title: 'Payment Calculator',
    subtitle: 'Estimate loan payments with principal, rate, term, and plain-language result notes.',
    chips: ['Loan', 'Rate', 'Term'],
    url: 'accessfreetools.com/tools/payment-calculator/',
    accent: '#1d4ed8',
    accent2: '#0f766e',
    accent3: '#f59e0b',
  },
  {
    file: 'hex-calculator.png',
    title: 'Hex Calculator',
    subtitle: 'Convert and calculate hexadecimal values for learning, code, and number-base checks.',
    chips: ['Hex', 'Decimal', 'Binary'],
    url: 'accessfreetools.com/tools/hex-calculator/',
    accent: '#7c3aed',
    accent2: '#db2777',
    accent3: '#06b6d4',
  },
  {
    file: 'amp-hours-to-watt-hours.png',
    title: 'Amp Hours To Watt Hours',
    subtitle: 'Convert battery amp-hours to watt-hours using voltage so capacity is easier to compare.',
    chips: ['Battery', 'Voltage', 'Energy'],
    url: 'accessfreetools.com/tools/amp-hours-to-watt-hours-calculator/',
    accent: '#0f766e',
    accent2: '#2563eb',
    accent3: '#84cc16',
  },
  {
    file: 'watts-to-amps-calculator.png',
    title: 'Watts To Amps Calculator',
    subtitle: 'Convert watts to amps using voltage and phase, then read the safety notes before real wiring decisions.',
    chips: ['Watts', 'Amps', 'Voltage'],
    url: 'accessfreetools.com/tools/watts-to-amps-calculator/',
    accent: '#dc2626',
    accent2: '#2563eb',
    accent3: '#f59e0b',
  },
  {
    file: 'watts-to-amps-before-you-convert.png',
    title: 'Before You Convert Watts To Amps',
    subtitle: 'Watts alone is not enough. Voltage, phase, and power factor can change the current estimate a lot.',
    chips: ['Voltage', 'Phase', 'Limits'],
    url: 'accessfreetools.com/tools/watts-to-amps-calculator/',
    accent: '#b91c1c',
    accent2: '#0f766e',
    accent3: '#f59e0b',
  },
  {
    file: 'ad-revenue-calculator.png',
    title: 'Ad Revenue Calculator',
    subtitle: 'Estimate RPM, CPC, CTR, pageviews, and revenue so a new site plan is easier to compare.',
    chips: ['RPM', 'CTR', 'Revenue'],
    url: 'accessfreetools.com/tools/ad-revenue-calculator/',
    accent: '#1d4ed8',
    accent2: '#0f766e',
    accent3: '#f59e0b',
  },
  {
    file: 'percent-off-calculator.png',
    title: 'Percent Off Calculator',
    subtitle: 'Check the discount, final sale price, and savings amount before trusting a sale sign.',
    chips: ['Discount', 'Savings', 'Price'],
    url: 'accessfreetools.com/tools/percent-off-calculator/',
    accent: '#be185d',
    accent2: '#7c3aed',
    accent3: '#38bdf8',
  },
  {
    file: 'mortgage-amortization-calculator.png',
    title: 'Mortgage Amortization',
    subtitle: 'See how a payment can split between interest and principal across the loan timeline.',
    chips: ['Payment', 'Interest', 'Principal'],
    url: 'accessfreetools.com/tools/mortgage-amortization-calculator/',
    accent: '#1d4ed8',
    accent2: '#0f766e',
    accent3: '#f97316',
  },
  {
    file: 'concrete-calculator.png',
    title: 'Concrete Calculator',
    subtitle: 'Estimate concrete for slabs, footings, holes, and posts with extra material reminders.',
    chips: ['Slabs', 'Footings', 'Volume'],
    url: 'accessfreetools.com/tools/concrete-calculator/',
    accent: '#475569',
    accent2: '#0f766e',
    accent3: '#f59e0b',
  },
  {
    file: 'recipe-scaler.png',
    title: 'Recipe Scaler',
    subtitle: 'Double, halve, or resize ingredient amounts without guessing at the counter.',
    chips: ['Ingredients', 'Scale', 'Cook'],
    url: 'accessfreetools.com/tools/recipe-scaler/',
    accent: '#ea580c',
    accent2: '#16a34a',
    accent3: '#facc15',
  },
  {
    file: 'unit-price-calculator.png',
    title: 'Unit Price Calculator',
    subtitle: 'Compare price per ounce, pound, item, or pack so deals are easier to judge.',
    chips: ['Compare', 'Price', 'Deals'],
    url: 'accessfreetools.com/tools/unit-price-calculator/',
    accent: '#0f766e',
    accent2: '#1d4ed8',
    accent3: '#f59e0b',
  },
  {
    file: 'word-counter.png',
    title: 'Word Counter',
    subtitle: 'Count words, characters, sentences, and reading time for essays, notes, and drafts.',
    chips: ['Words', 'Characters', 'Reading'],
    url: 'accessfreetools.com/tools/word-counter/',
    accent: '#7c3aed',
    accent2: '#2563eb',
    accent3: '#22c55e',
  },
  {
    file: 'sales-tax-calculator.png',
    title: 'Sales Tax Calculator',
    subtitle: 'Add tax to a price or work backward from a total before checking a receipt or checkout.',
    chips: ['Price', 'Tax rate', 'Total'],
    url: 'accessfreetools.com/tools/sales-tax-calculator/',
    accent: '#0f766e',
    accent2: '#2563eb',
    accent3: '#f97316',
    artPath: 'public/tool-art/sales-tax-calculator-tool.webp',
  },
  {
    file: 'kawaii-calculator.png',
    title: 'Kawaii Calculator',
    subtitle: 'A cute browser calculator for everyday math, percentages, memory, and quick checks.',
    chips: ['Cute design', 'Percent key', 'No signup'],
    url: 'accessfreetools.com/tools/kawaii-calculator/',
    accent: '#be185d',
    accent2: '#6d5dfc',
    accent3: '#38bdf8',
    artPath: 'public/tool-art/kawaii-calculator-tool.webp',
  },
  {
    file: 'concrete-block-calculator.png',
    title: 'Concrete Block Calculator',
    subtitle: 'Estimate blocks from wall size, block dimensions, openings, and a practical waste allowance.',
    chips: ['Wall size', 'Openings', 'Block count'],
    url: 'accessfreetools.com/tools/concrete-block-calculator/',
    accent: '#475569',
    accent2: '#0f766e',
    accent3: '#f59e0b',
    artPath: 'public/tool-art/concrete-block-calculator-tool.webp',
  },
  {
    file: 'interest-rate-calculator.png',
    title: 'Interest Rate Calculator',
    subtitle: 'Compare interest estimates from a starting amount, rate, time, and compounding choice.',
    chips: ['Principal', 'Rate', 'Time'],
    url: 'accessfreetools.com/tools/interest-rate-calculator/',
    accent: '#0f766e',
    accent2: '#1d4ed8',
    accent3: '#f59e0b',
    artPath: 'public/tool-art/interest-rate-calculator-tool.webp',
  },
  {
    file: 'date-calculator.png',
    title: 'Date Calculator',
    subtitle: 'Add or subtract days from a date, or count the time between two calendar dates.',
    chips: ['Add days', 'Subtract', 'Date gap'],
    url: 'accessfreetools.com/tools/date-calculator/',
    accent: '#2563eb',
    accent2: '#0f766e',
    accent3: '#f97316',
    artPath: 'public/tool-art/date-calculator-tool.webp',
  },
  {
    file: 'fraction-calculator.png',
    title: 'Fraction Calculator',
    subtitle: 'Add, subtract, multiply, or divide fractions and reduce the result with working shown.',
    chips: ['Add', 'Divide', 'Simplify'],
    url: 'accessfreetools.com/tools/fraction-calculator/',
    accent: '#7c3aed',
    accent2: '#2563eb',
    accent3: '#22c55e',
    artPath: 'public/tool-art/fraction-calculator-tool.webp',
  },
  {
    file: 'gas-mileage-calculator.png',
    title: 'Gas Mileage Calculator',
    subtitle: 'Estimate MPG, litres per 100 km, fuel used, and trip cost from real journey numbers.',
    chips: ['Distance', 'Fuel', 'Trip cost'],
    url: 'accessfreetools.com/tools/gas-mileage-calculator/',
    accent: '#0891b2',
    accent2: '#16a34a',
    accent3: '#f59e0b',
    artPath: 'public/tool-art/gas-mileage-calculator-tool.webp',
  },
  {
    file: 'oven-temperature-converter.png',
    title: 'Oven Temperature Converter',
    subtitle: 'Convert recipe temperatures between Celsius, Fahrenheit, and gas mark before baking.',
    chips: ['Celsius', 'Fahrenheit', 'Gas mark'],
    url: 'accessfreetools.com/tools/oven-temperature-converter/',
    accent: '#dc2626',
    accent2: '#ea580c',
    accent3: '#facc15',
    artPath: 'public/tool-art/oven-temperature-converter-tool.webp',
  },
  {
    file: 'golf-handicap-calculator.png',
    title: 'Golf Handicap Calculator',
    subtitle: 'Estimate a golf handicap from scores, course rating, slope, and round information.',
    chips: ['Scores', 'Slope', 'Estimate'],
    url: 'accessfreetools.com/tools/golf-handicap-calculator/',
    accent: '#15803d',
    accent2: '#0891b2',
    accent3: '#f59e0b',
    artPath: 'public/tool-art/golf-handicap-calculator-tool.webp',
  },
  {
    file: 'flooring-calculator.png',
    title: 'Flooring Calculator',
    subtitle: 'Estimate room area, flooring quantity, pack coverage, and a practical waste allowance.',
    chips: ['Room size', 'Pack cover', 'Waste'],
    url: 'accessfreetools.com/tools/flooring-calculator/',
    accent: '#92400e',
    accent2: '#0f766e',
    accent3: '#f59e0b',
    artPath: 'public/tool-art/flooring-calculator-tool.webp',
  },
  {
    file: 'area-calculator.png',
    title: 'Area Calculator',
    subtitle: 'Find the area of common shapes with units, formulas, and clear input labels.',
    chips: ['Shapes', 'Units', 'Formulas'],
    url: 'accessfreetools.com/tools/area-calculator/',
    accent: '#2563eb',
    accent2: '#7c3aed',
    accent3: '#22c55e',
    artPath: 'public/tool-art/triangle-calculator-tool.webp',
  },
  {
    file: 'engine-horsepower-calculator.png',
    title: 'Engine Horsepower Calculator',
    subtitle: 'Solve horsepower, torque, or RPM and compare engine power with an estimated wheel result.',
    chips: ['Torque', 'RPM', 'Wheel HP'],
    url: 'accessfreetools.com/tools/engine-horsepower-calculator/',
    accent: '#be123c',
    accent2: '#2563eb',
    accent3: '#f59e0b',
    artPath: 'public/tool-art/engine-horsepower-calculator-tool.webp',
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
  const art = pin.artPath
    ? `data:image/webp;base64,${readFileSync(resolve(pin.artPath)).toString('base64')}`
    : '';
  const lowerPanel = art
    ? `<section class="art" aria-hidden="true">
        <img src="${art}" alt="" />
        <div class="art-url">${escapeHtml(pin.url)}</div>
      </section>`
    : `<section class="preview" aria-hidden="true">
        <div class="bar">
          <div class="row"><div class="icon">=</div><div><div class="line"></div><br /><div class="line short"></div></div></div>
          <div class="row"><div class="icon">%</div><div><div class="line short"></div><br /><div class="line"></div></div></div>
        </div>
        <div class="url">${escapeHtml(pin.url)}</div>
      </section>`;

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
      main.has-art h1 {
        font-size: 82px;
        line-height: 1;
        margin: 70px 0 24px;
      }
      p {
        color: #334155;
        font-size: 42px;
        font-weight: 760;
        line-height: 1.22;
        margin: 0;
        max-width: 840px;
      }
      main.has-art p {
        font-size: 36px;
        line-height: 1.24;
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
      main.has-art .chips {
        margin-top: 34px;
      }
      .art {
        background: #0f172a;
        border: 2px solid rgba(255, 255, 255, 0.94);
        border-radius: 34px;
        box-shadow: 0 28px 76px rgba(15, 23, 42, 0.18);
        height: 520px;
        margin-top: auto;
        overflow: hidden;
        position: relative;
      }
      .art img {
        display: block;
        height: 100%;
        object-fit: contain;
        object-position: center;
        width: 100%;
      }
      .art-url {
        backdrop-filter: blur(8px);
        background: rgba(15, 23, 42, 0.84);
        border-radius: 18px;
        bottom: 22px;
        color: #fff;
        font-size: 27px;
        font-weight: 900;
        left: 24px;
        padding: 15px 18px;
        position: absolute;
        right: 24px;
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
    <main class="${art ? 'has-art' : ''}">
      <div class="top">
        ${brandMarkHtml()}
        <div class="brand">Access<br />Free Tools</div>
      </div>
      <h1>${escapeHtml(pin.title)}</h1>
      <p>${escapeHtml(pin.subtitle)}</p>
      <div class="chips">${chips}</div>
      ${lowerPanel}
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
mkdirSync(publicDir, { recursive: true });

for (const entry of readdirSync(publicDir, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.png') && entry.name !== 'access-free-tools-avatar.png') {
    rmSync(resolve(publicDir, entry.name));
  }
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });

for (const pin of pins) {
  await page.setContent(pinHtml(pin), { waitUntil: 'networkidle' });
  const image = await page.screenshot({
    type: 'png',
    fullPage: false,
  });
  const publicImage = await page.screenshot({
    type: 'jpeg',
    quality: 84,
    fullPage: false,
  });
  const publicFile = pin.file.replace(/\.png$/, '.jpg');

  writeFileSync(resolve(outputDir, pin.file), image);
  writeFileSync(resolve(publicDir, publicFile), publicImage);
  console.log(`Generated output/promotion/pinterest/${pin.file}`);
  console.log(`Generated public/pinterest/${publicFile}`);
}

await page.setViewportSize({ width: 1000, height: 1000 });
await page.setContent(avatarHtml(), { waitUntil: 'networkidle' });
const avatarImage = await page.screenshot({
  type: 'png',
  fullPage: false,
  omitBackground: true,
});
writeFileSync(resolve(outputDir, 'access-free-tools-avatar.png'), avatarImage);
writeFileSync(resolve(publicDir, 'access-free-tools-avatar.png'), avatarImage);
console.log('Generated output/promotion/pinterest/access-free-tools-avatar.png');
console.log('Generated public/pinterest/access-free-tools-avatar.png');

await browser.close();
