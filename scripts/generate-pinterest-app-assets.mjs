import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { chromium } from '@playwright/test';

import { loadPinterestAppCoverage } from './lib/pinterest-app-catalog.mjs';
import { createToolArtEntries, readCanonicalTools } from './lib/tool-art-manifest.mjs';

const width = 1000;
const height = 1500;
const force = process.argv.includes('--force');
const requestedSlugs = process.argv
  .find((argument) => argument.startsWith('--slug='))
  ?.slice('--slug='.length)
  .split(',')
  .map((slug) => slug.trim())
  .filter(Boolean);
const boardConfig = JSON.parse(readFileSync(resolve('src', 'data', 'pinterestCategoryBoards.json'), 'utf8'));
const tools = readCanonicalTools();
const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
const artBySlug = new Map(
  createToolArtEntries(tools)
    .filter((entry) => entry.kind === 'tool')
    .map((entry) => [entry.slug, entry]),
);
const coverage = loadPinterestAppCoverage();
const catalogApps = coverage.apps.filter((app) => app.source === 'catalog');
const selectedApps = requestedSlugs
  ? catalogApps.filter((app) => requestedSlugs.includes(app.slug))
  : catalogApps;
const outputReportPath = resolve('output', 'promotion', 'pinterest-app-assets.json');

if (requestedSlugs?.length && selectedApps.length !== requestedSlugs.length) {
  const found = new Set(selectedApps.map((app) => app.slug));
  const missing = requestedSlugs.filter((slug) => !found.has(slug));
  throw new Error(`Unknown or already-manual Pinterest app slug(s): ${missing.join(', ')}`);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function trimAtWord(value, maxLength) {
  const clean = String(value).replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  const shortened = clean.slice(0, maxLength + 1).replace(/\s+\S*$/, '').trim();
  return `${shortened || clean.slice(0, maxLength).trim()}...`;
}

function titleFontSize(title) {
  if (title.length > 46) return 58;
  if (title.length > 36) return 66;
  if (title.length > 27) return 74;
  return 84;
}

function artDataUrl(slug) {
  const entry = artBySlug.get(slug);
  if (!entry || entry.status !== 'approved') return '';
  const filePath = resolve('public', entry.imagePath.replace(/^\//, ''));
  if (!existsSync(filePath)) return '';
  return `data:image/webp;base64,${readFileSync(filePath).toString('base64')}`;
}

function fallbackPanel(tool, colors) {
  const initials = tool.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return `<div class="fallback" aria-hidden="true">
    <div class="fallback-mark" style="--accent:${colors.accent};--accent2:${colors.accent2}">${escapeHtml(initials)}</div>
    <div class="fallback-lines"><span></span><span></span><span></span></div>
    <div class="fallback-result">=</div>
  </div>`;
}

function pinHtml(app, tool) {
  const colors = boardConfig[tool.category];
  const art = artDataUrl(tool.slug);
  const summary = trimAtWord(tool.summary || tool.description, 190);
  const categoryLabel = colors.boardTitle.replace(/ Calculators$| Tools$/g, '');
  const chips = [categoryLabel, 'Free browser tool', 'Clear examples'];
  const artPanel = art
    ? `<div class="art"><img src="${art}" alt="" /></div>`
    : fallbackPanel(tool, colors);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      html, body { height: ${height}px; margin: 0; width: ${width}px; }
      body {
        background: #f7faf9;
        color: #10211d;
        font-family: Arial, Helvetica, sans-serif;
        overflow: hidden;
      }
      main {
        border-top: 24px solid ${colors.accent};
        display: grid;
        grid-template-rows: auto auto auto auto minmax(0, 1fr) auto;
        height: 100%;
        padding: 52px 58px 46px;
        position: relative;
      }
      main::before {
        background: ${colors.accent2};
        content: '';
        height: 12px;
        left: 58px;
        position: absolute;
        right: 58px;
        top: 160px;
      }
      .brand-row {
        align-items: center;
        display: flex;
        gap: 20px;
        min-height: 90px;
      }
      .brand-mark {
        align-items: center;
        background: ${colors.accent};
        border: 8px solid #ffffff;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
        color: #ffffff;
        display: grid;
        font-size: 46px;
        font-weight: 900;
        height: 86px;
        justify-content: center;
        width: 86px;
      }
      .brand {
        color: #344b44;
        font-size: 32px;
        font-weight: 900;
        line-height: 1.02;
      }
      h1 {
        color: #10211d;
        font-size: ${titleFontSize(tool.name)}px;
        font-weight: 900;
        letter-spacing: 0;
        line-height: 1.02;
        margin: 60px 0 20px;
        overflow-wrap: anywhere;
      }
      .summary {
        color: #405b53;
        font-size: 31px;
        font-weight: 700;
        line-height: 1.28;
        margin: 0;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin: 24px 0 28px;
      }
      .chips span {
        background: #ffffff;
        border: 2px solid #cbdad5;
        border-left: 10px solid ${colors.accent3};
        color: #203a32;
        font-size: 23px;
        font-weight: 850;
        padding: 12px 16px 11px;
      }
      .art,
      .fallback {
        align-self: stretch;
        background: #111827;
        border: 4px solid #ffffff;
        box-shadow: 0 20px 44px rgba(15, 23, 42, 0.18);
        min-height: 0;
        overflow: hidden;
      }
      .art img {
        display: block;
        height: 100%;
        object-fit: contain;
        object-position: center;
        width: 100%;
      }
      .fallback {
        align-items: center;
        background: #eaf2ef;
        display: grid;
        gap: 30px;
        grid-template-columns: 200px 1fr 120px;
        padding: 58px;
      }
      .fallback-mark {
        align-items: center;
        background: var(--accent);
        border: 10px solid #ffffff;
        color: #ffffff;
        display: flex;
        font-size: 72px;
        font-weight: 900;
        height: 180px;
        justify-content: center;
        width: 180px;
      }
      .fallback-lines { display: grid; gap: 22px; }
      .fallback-lines span { background: #abc4bb; height: 24px; }
      .fallback-lines span:nth-child(2) { width: 72%; }
      .fallback-result {
        align-items: center;
        background: #ffffff;
        color: ${colors.accent2};
        display: flex;
        font-size: 76px;
        font-weight: 900;
        height: 120px;
        justify-content: center;
      }
      footer {
        align-items: center;
        color: #344b44;
        display: flex;
        font-size: 24px;
        font-weight: 900;
        justify-content: space-between;
        padding-top: 24px;
      }
      footer strong { color: ${colors.accent}; }
    </style>
  </head>
  <body>
    <main>
      <div class="brand-row">
        <div class="brand-mark">A</div>
        <div class="brand">Access<br />Free Tools</div>
      </div>
      <h1>${escapeHtml(tool.name)}</h1>
      <p class="summary">${escapeHtml(summary)}</p>
      <div class="chips">${chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join('')}</div>
      ${artPanel}
      <footer><span>Free to use. No signup.</span><strong>accessfreetools.com</strong></footer>
    </main>
  </body>
</html>`;
}

mkdirSync(dirname(outputReportPath), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
const results = [];

try {
  for (const app of selectedApps) {
    const tool = toolBySlug.get(app.slug);
    if (!tool) throw new Error(`Missing canonical tool for ${app.slug}.`);
    const outputPath = resolve('public', 'pinterest', 'apps', `${app.slug}.jpg`);
    mkdirSync(dirname(outputPath), { recursive: true });

    if (existsSync(outputPath) && !force) {
      results.push({ slug: app.slug, status: 'skipped-existing', outputPath });
      continue;
    }

    await page.setContent(pinHtml(app, tool), { waitUntil: 'load' });
    const layout = await page.evaluate(() => {
      const h1 = document.querySelector('h1')?.getBoundingClientRect();
      const summary = document.querySelector('.summary')?.getBoundingClientRect();
      const panel = document.querySelector('.art, .fallback')?.getBoundingClientRect();
      const footer = document.querySelector('footer')?.getBoundingClientRect();
      return {
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        headingOverlap: Boolean(h1 && summary && h1.bottom > summary.top + 1),
        panelOverlap: Boolean(panel && footer && panel.bottom > footer.top + 1),
        panelHeight: panel?.height ?? 0,
      };
    });

    if (
      layout.scrollWidth > width ||
      layout.scrollHeight > height ||
      layout.headingOverlap ||
      layout.panelOverlap ||
      layout.panelHeight < 360
    ) {
      throw new Error(`Pinterest asset layout failed for ${app.slug}: ${JSON.stringify(layout)}`);
    }

    const image = await page.screenshot({ type: 'jpeg', quality: 76, fullPage: false });
    writeFileSync(outputPath, image);
    results.push({
      slug: app.slug,
      status: 'generated',
      outputPath,
      bytes: image.byteLength,
      usedApprovedArt: Boolean(artDataUrl(app.slug)),
    });
  }
} finally {
  await browser.close();
}

const report = {
  generatedAt: new Date().toISOString(),
  selected: selectedApps.length,
  generated: results.filter((result) => result.status === 'generated').length,
  skippedExisting: results.filter((result) => result.status === 'skipped-existing').length,
  usedFallback: results.filter((result) => result.status === 'generated' && !result.usedApprovedArt).length,
  results,
};

writeFileSync(outputReportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(
  `Pinterest app assets: ${report.generated} generated, ${report.skippedExisting} already present, ${report.usedFallback} generated without approved tool art.`,
);
console.log(`Saved Pinterest app asset report to ${outputReportPath}`);
