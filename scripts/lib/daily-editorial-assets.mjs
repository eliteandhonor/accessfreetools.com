import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const escapeXml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[character]);

function lines(value, maxCharacters, maxLines) {
  // A wide uppercase repository name must fit as well as normal prose.
  // Units conservatively approximate sans-serif glyph widths at the fixed size.
  const units = (text) => [...text].reduce((sum, character) => sum +
    (/[MWmw@%]/.test(character) ? 1.9 : /[A-Z]/.test(character) ? 1.5 : /[^\x20-\x7e]/.test(character) ? 2 : 1), 0);
  const words = String(value).replace(/[\r\n\t]+/g, ' ').trim().split(/\s+/);
  const output = [];
  let line = '';
  for (const word of words) {
    if (line && units(`${line} ${word}`) > maxCharacters) {
      output.push(line);
      line = '';
      if (output.length === maxLines) break;
    }
    line = `${line}${line ? ' ' : ''}${word}`;
  }
  if (output.length < maxLines && line) output.push(line);
  return output.map((line) => {
    if (units(line) <= maxCharacters) return line;
    let shortened = line;
    while (shortened && units(`${shortened}…`) > maxCharacters) shortened = shortened.slice(0, -1);
    return `${shortened}…`;
  });
}

function textLines(values, x, y, size, color) {
  return values.map((value, index) => `<text x="${x}" y="${y + index * (size + 9)}" font-family="sans-serif" font-size="${size}" fill="${color}">${escapeXml(value)}</text>`).join('');
}

export function dailyEditorialImageInfo(article) {
  if (!article || !slugPattern.test(article.slug) || article.slug.length > 100) throw new Error('Invalid daily image slug');
  if (typeof article.problem !== 'string' || !article.problem.trim() || article.problem.length > 1200 ||
      !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(article.project?.fullName)) {
    throw new Error('A conceptual image requires the article problem and exact project name');
  }
  return {
    imagePath: `/social/daily-${article.slug}.png`,
    webpPath: `/social/daily-${article.slug}.webp`,
    alt: 'Original diagram linking a practical problem, a GitHub project, and a decision to evaluate it.',
    caption: 'Original Access Free Tools conceptual diagram. This is an illustration, not a project screenshot or a test result.',
  };
}

// All shapes are authored here. No project logo, screenshot, copied asset, model
// image service, fetched URL, external SVG reference, or installed project is used.
export function buildDailyEditorialSvg(article) {
  dailyEditorialImageInfo(article);
  const digest = createHash('sha256').update(`${article.project.fullName}\n${article.problem}`).digest();
  const colors = ['#0d7c73', '#375ea8', '#8354a5', '#a65a2e'];
  const accent = colors[digest[0] % colors.length];
  const problem = textLines(lines(article.problem, 26, 3), 90, 390, 19, '#243a41');
  const repository = textLines(lines(article.project.fullName.replace('/', ' / '), 24, 3), 465, 390, 19, '#243a41');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#eef7f6"/>
  <circle cx="1110" cy="50" r="210" fill="${accent}" opacity=".06"/>
  <circle cx="40" cy="625" r="210" fill="${accent}" opacity=".06"/>
  <path d="M345 305H443M715 305H813" stroke="${accent}" stroke-width="7" fill="none"/>
  <path d="m426 290 17 15-17 15m370-30 17 15-17 15" stroke="${accent}" stroke-width="7" fill="none"/>
  <g fill="#fff" stroke="#cde0de" stroke-width="2">
    <rect x="60" y="125" width="285" height="390" rx="28"/>
    <rect x="445" y="125" width="270" height="390" rx="28"/>
    <rect x="815" y="125" width="325" height="390" rx="28"/>
  </g>
  <g stroke="${accent}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M167 214h65v104h-65zM181 235h38M181 254h28M181 273h38"/>
    <circle cx="572" cy="240" r="13"/><circle cx="608" cy="278" r="13"/><circle cx="552" cy="314" r="13"/>
    <path d="M572 253v14q0 11-11 18l-9 9M585 244q23 0 23 21"/>
    <circle cx="973" cy="264" r="53"/><path d="m945 266 19 19 39-43"/>
  </g>
  ${textLines(['Your problem'], 90, 170, 23, '#172f36')}
  ${textLines(['Project sources'], 465, 170, 23, '#172f36')}
  ${textLines(['Your decision'], 845, 170, 23, '#172f36')}
  ${problem}${repository}
  ${textLines(['Check whether it fits', 'your task and limits.'], 845, 390, 19, '#243a41')}
  ${textLines(['Original conceptual diagram · Access Free Tools'], 60, 575, 17, '#536c73')}
  </svg>`;
}

export async function createDailyEditorialAssets(article, { outputDir } = {}) {
  if (typeof outputDir !== 'string' || !outputDir.trim()) throw new Error('An explicit staging outputDir is required');
  const info = dailyEditorialImageInfo(article);
  const svg = Buffer.from(buildDailyEditorialSvg(article));
  const [png, webp] = await Promise.all([
    sharp(svg).png({ compressionLevel: 9 }).toBuffer(),
    sharp(svg).webp({ quality: 88, effort: 6 }).toBuffer(),
  ]);
  await mkdir(outputDir, { recursive: true });
  const pngName = `daily-${article.slug}.png`;
  const webpName = `daily-${article.slug}.webp`;
  await writeFile(join(outputDir, pngName), png);
  await writeFile(join(outputDir, webpName), webp);
  return { ...info, files: [
    { name: pngName, path: join(outputDir, pngName), sha256: createHash('sha256').update(png).digest('hex') },
    { name: webpName, path: join(outputDir, webpName), sha256: createHash('sha256').update(webp).digest('hex') },
  ] };
}
