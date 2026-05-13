import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BSKY_SERVICE = 'https://bsky.social';
const DEFAULT_AVATAR_PATH = resolve('public', 'bluesky', 'access-free-tools-avatar.png');
const LOCAL_ENV_PATH = resolve('.local', 'bluesky.env');
const DEFAULT_DESCRIPTION =
  'Access Free Tools shares free calculators, converters, AI text tools, and practical guides for everyday math, home projects, finance, school, and browser tasks.';

function parseArgs() {
  const displayNameArg = process.argv.find((arg) => arg.startsWith('--display-name='));
  const descriptionArg = process.argv.find((arg) => arg.startsWith('--description='));
  const avatarArg = process.argv.find((arg) => arg.startsWith('--avatar='));
  const skipAvatar = process.argv.includes('--skip-avatar');

  return {
    displayName: displayNameArg?.slice('--display-name='.length) || 'Access Free Tools',
    description: descriptionArg?.slice('--description='.length) || DEFAULT_DESCRIPTION,
    avatarPath: skipAvatar ? '' : resolve(avatarArg?.slice('--avatar='.length) ?? DEFAULT_AVATAR_PATH),
  };
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(body)}`);
  }
  return body;
}

function loadLocalEnv(path) {
  if (!existsSync(path)) return;
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (!process.env[key]) {
      process.env[key] = rawValue.replace(/^["']|["']$/g, '');
    }
  }
}

async function createSession() {
  loadLocalEnv(LOCAL_ENV_PATH);
  const identifier = process.env.BLUESKY_HANDLE;
  const password = process.env.BLUESKY_APP_PASSWORD;
  if (!identifier || !password) {
    throw new Error('Set BLUESKY_HANDLE and BLUESKY_APP_PASSWORD before updating Bluesky profile.');
  }

  return requestJson(`${BSKY_SERVICE}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}

async function uploadAvatar(session, avatarPath) {
  if (!avatarPath) return null;
  if (!existsSync(avatarPath)) {
    throw new Error(`Avatar file not found: ${avatarPath}`);
  }

  const response = await fetch(`${BSKY_SERVICE}/xrpc/com.atproto.repo.uploadBlob`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${session.accessJwt}`,
      'content-type': 'image/png',
    },
    body: readFileSync(avatarPath),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(body)}`);
  }
  return body.blob;
}

async function getProfileRecord(session) {
  try {
    const url = new URL(`${BSKY_SERVICE}/xrpc/com.atproto.repo.getRecord`);
    url.searchParams.set('repo', session.did);
    url.searchParams.set('collection', 'app.bsky.actor.profile');
    url.searchParams.set('rkey', 'self');
    return await requestJson(url, {
      headers: {
        authorization: `Bearer ${session.accessJwt}`,
      },
    });
  } catch (error) {
    if (!String(error.message).includes('RecordNotFound')) throw error;
    return { value: {} };
  }
}

async function putProfileRecord(session, existingRecord, options, avatarBlob) {
  const record = {
    ...(existingRecord.value ?? {}),
    $type: 'app.bsky.actor.profile',
    displayName: options.displayName,
    description: options.description,
  };

  if (avatarBlob) {
    record.avatar = avatarBlob;
  }

  return requestJson(`${BSKY_SERVICE}/xrpc/com.atproto.repo.putRecord`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${session.accessJwt}`,
    },
    body: JSON.stringify({
      repo: session.did,
      collection: 'app.bsky.actor.profile',
      rkey: 'self',
      record,
    }),
  });
}

async function main() {
  const options = parseArgs();
  const session = await createSession();
  const existingRecord = await getProfileRecord(session);
  const avatarBlob = await uploadAvatar(session, options.avatarPath);
  const result = await putProfileRecord(session, existingRecord, options, avatarBlob);

  console.log(`Updated Bluesky profile for ${session.handle}.`);
  console.log(`Display name: ${options.displayName}`);
  console.log(`Description: ${options.description}`);
  console.log(`Avatar: ${avatarBlob ? 'uploaded branded image' : 'unchanged'}`);
  console.log(`Record URI: ${result.uri}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
