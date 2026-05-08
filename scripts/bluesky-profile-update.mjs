const BSKY_SERVICE = 'https://bsky.social';
const DEFAULT_DESCRIPTION =
  'Free calculators, converters, AI text tools, and practical guides for everyday math, home projects, finance, school, and browser tasks.';

function parseArgs() {
  const displayNameArg = process.argv.find((arg) => arg.startsWith('--display-name='));
  const descriptionArg = process.argv.find((arg) => arg.startsWith('--description='));

  return {
    displayName: displayNameArg?.slice('--display-name='.length) || 'Access Free Tools',
    description: descriptionArg?.slice('--description='.length) || DEFAULT_DESCRIPTION,
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

async function createSession() {
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

async function putProfileRecord(session, existingRecord, options) {
  const record = {
    ...(existingRecord.value ?? {}),
    $type: 'app.bsky.actor.profile',
    displayName: options.displayName,
    description: options.description,
  };

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
  const result = await putProfileRecord(session, existingRecord, options);

  console.log(`Updated Bluesky profile for ${session.handle}.`);
  console.log(`Display name: ${options.displayName}`);
  console.log(`Description: ${options.description}`);
  console.log(`Record URI: ${result.uri}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
