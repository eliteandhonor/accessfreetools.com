import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, normalize } from 'node:path';

const distDir = join(process.cwd(), 'dist');
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

function targetPathForUrl(url) {
  const cleanUrl = url.split('#')[0].split('?')[0];
  if (!cleanUrl || !cleanUrl.startsWith('/')) {
    return null;
  }

  if (cleanUrl === '/') {
    return join(distDir, 'index.html');
  }

  const withoutLeadingSlash = cleanUrl.slice(1);
  if (withoutLeadingSlash.endsWith('/')) {
    return join(distDir, withoutLeadingSlash, 'index.html');
  }

  return join(distDir, withoutLeadingSlash);
}

if (!existsSync(distDir)) {
  throw new Error('dist folder is missing. Run npm run build before npm run check:links.');
}

walk(distDir);

const issues = [];
const attributePattern = /\b(?:href|src)=["']([^"']+)["']/g;

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, 'utf8');
  for (const match of html.matchAll(attributePattern)) {
    const value = match[1];
    if (
      !value.startsWith('/') ||
      value.startsWith('//') ||
      value.startsWith('/cdn-cgi/') ||
      value.includes('{{')
    ) {
      continue;
    }

    const target = targetPathForUrl(value);
    if (target && !existsSync(target)) {
      issues.push(`${normalize(htmlFile)} links to missing ${value}`);
    }
  }
}

if (issues.length > 0) {
  console.error(issues.join('\n'));
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML files for internal links.`);
