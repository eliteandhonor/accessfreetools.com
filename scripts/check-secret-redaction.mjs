import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readHostingerLocalEnv } from './lib/hostinger-api.mjs';

const root = process.cwd();
// Cloud/editorial validation must not open local credential files. Keep the
// existing owner-local exact-value scan available outside that explicit mode.
const trackedOnly = process.env.AFT_SECRET_SCAN_MODE === 'tracked-only';
const hostingerToken = trackedOnly ? '' : readHostingerLocalEnv().HOSTINGER_API_TOKEN || process.env.HOSTINGER_API_TOKEN || '';
const ollamaToken = trackedOnly ? '' : readLocalEnv(resolve(root, '.local', 'ollama.env')).OLLAMA_API_KEY || process.env.OLLAMA_API_KEY || process.env.OLLAMA || '';
const trackedFiles = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const issues = [];

function readLocalEnv(path) {
  if (!existsSync(path)) return {};

  return readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .reduce((values, line) => {
      const match = line.trim().match(/^([A-Z0-9_]+)=(.*)$/);
      if (!match) return values;
      values[match[1]] = match[2].replace(/^["']|["']$/g, '');
      return values;
    }, {});
}

function isBinary(path) {
  const buffer = readFileSync(path);
  return buffer.includes(0);
}

if (hostingerToken) {
  for (const file of trackedFiles) {
    const path = resolve(root, file);
    if (!existsSync(path) || isBinary(path)) continue;
    const text = readFileSync(path, 'utf8');
    if (text.includes(hostingerToken)) {
      issues.push(`${file} contains the local Hostinger API token.`);
    }
  }
}

if (ollamaToken) {
  for (const file of trackedFiles) {
    const path = resolve(root, file);
    if (!existsSync(path) || isBinary(path)) continue;
    const text = readFileSync(path, 'utf8');
    if (text.includes(ollamaToken)) {
      issues.push(`${file} contains the local Ollama API key.`);
    }
  }
}

for (const file of trackedFiles) {
  const path = resolve(root, file);
  if (!existsSync(path) || isBinary(path)) continue;
  const text = readFileSync(path, 'utf8');
  if (/HOSTINGER_API_TOKEN\s*=\s*[A-Za-z0-9._~+/=-]{20,}/.test(text)) {
    issues.push(`${file} appears to contain an inline Hostinger API token assignment.`);
  }

  if (/OLLAMA(?:_API_KEY)?\s*=\s*[A-Za-z0-9._~+/=-]{30,}/.test(text)) {
    issues.push(`${file} appears to contain an inline Ollama API key assignment.`);
  }

  if (/\b(?:JINA_API_KEY|TYPESAFE_API_KEY)\s*[:=]\s*["']?[A-Za-z0-9._~+/=-]{24,}/.test(text)) {
    issues.push(`${file} appears to contain an inline research-provider key assignment.`);
  }
}

if (issues.length) {
  console.error('Secret redaction check failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Secret redaction check passed.');
