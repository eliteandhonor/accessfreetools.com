import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const LOCAL_ENV_FILES = [resolve('.local', 'ollama.env')];

let loadedLocalEnv = false;

function parseEnvFile(path: string) {
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (!process.env[key]) {
      process.env[key] = rawValue.replace(/^["']|["']$/g, '');
    }
  }
}

export function loadPrivateEnv() {
  if (loadedLocalEnv) return;
  loadedLocalEnv = true;

  for (const file of LOCAL_ENV_FILES) {
    parseEnvFile(file);
  }
}

export function getOllamaApiKey() {
  loadPrivateEnv();
  return process.env.OLLAMA_API_KEY || process.env.OLLAMA || '';
}

export function isAskEnabled() {
  loadPrivateEnv();
  return (process.env.AFT_ASK_ENABLED ?? 'true').toLowerCase() !== 'false';
}

export function getApiBetaToken() {
  loadPrivateEnv();
  return process.env.AFT_API_BETA_TOKEN || '';
}
