import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readHostingerLocalEnv } from './lib/hostinger-api.mjs';

const root = process.cwd();
const hostingerToken = readHostingerLocalEnv().HOSTINGER_API_TOKEN || process.env.HOSTINGER_API_TOKEN || '';
const trackedFiles = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const issues = [];

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

for (const file of trackedFiles) {
  const path = resolve(root, file);
  if (!existsSync(path) || isBinary(path)) continue;
  const text = readFileSync(path, 'utf8');
  if (/HOSTINGER_API_TOKEN\s*=\s*[A-Za-z0-9._~+/=-]{20,}/.test(text)) {
    issues.push(`${file} appears to contain an inline Hostinger API token assignment.`);
  }
}

if (issues.length) {
  console.error('Secret redaction check failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Secret redaction check passed.');
