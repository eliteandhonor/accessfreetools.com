import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, normalize } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const publicDistDir = existsSync(join(distDir, 'client')) ? join(distDir, 'client') : distDir;
const htmlFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}

if (!existsSync(distDir)) {
  throw new Error('dist folder is missing. Run npm run build before npm run check:structured-data.');
}

walk(publicDistDir);

const issues = [];
let jsonLdCount = 0;
const jsonLdPattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

function decodeHtmlEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, 'utf8');
  for (const match of html.matchAll(jsonLdPattern)) {
    jsonLdCount += 1;
    const rawJson = decodeHtmlEntities(match[1].trim());
    try {
      const parsed = JSON.parse(rawJson);
      if (!parsed['@context']) {
        issues.push(`${normalize(htmlFile)} has JSON-LD without @context`);
      }
    } catch (error) {
      issues.push(`${normalize(htmlFile)} has invalid JSON-LD: ${error.message}`);
    }
  }
}

if (issues.length > 0) {
  console.error(issues.join('\n'));
  process.exit(1);
}

console.log(`Validated ${jsonLdCount} JSON-LD blocks across ${htmlFiles.length} HTML files.`);
