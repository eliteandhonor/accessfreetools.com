import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { ocrEnglishQaFixture } from '../src/components/ocrEnglishQaFixture.ts';

const target = path.resolve('public', `.${ocrEnglishQaFixture.path}`);
if (existsSync(target)) throw new Error(`Fixture already exists: ${target}. Preserve its reviewed bytes.`);
const browser = await chromium.launch({ headless: true });
const blocked = [];
try {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  await context.route('**/*', async route => {
    blocked.push(route.request().url());
    await route.abort('blockedbyclient');
  });
  const page = await context.newPage();
  const dataUrl = await page.evaluate(fixture => {
    const canvas = document.createElement('canvas');
    canvas.width = fixture.width;
    canvas.height = fixture.height;
    const painter = canvas.getContext('2d');
    if (!painter) throw new Error('Canvas drawing unavailable.');
    painter.fillStyle = fixture.background;
    painter.fillRect(0, 0, canvas.width, canvas.height);
    painter.fillStyle = fixture.foreground;
    painter.font = fixture.font;
    painter.fillText(fixture.text, fixture.x, fixture.y);
    return canvas.toDataURL('image/png');
  }, ocrEnglishQaFixture);
  if (blocked.length) throw new Error('Fixture generation attempted a network request.');
  const bytes = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, bytes, { flag: 'wx' });
  console.log(JSON.stringify({
    target,
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    browser: browser.version(),
    fixture: ocrEnglishQaFixture,
    blocked,
    scope: 'Synthetic QA file from the pre-existing English fixture definition. No OCR experiment or inference runs during generation.',
  }, null, 2));
  await context.close();
} finally {
  await browser.close();
}
