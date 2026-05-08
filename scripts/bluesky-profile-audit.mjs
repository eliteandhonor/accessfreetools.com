import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const DEFAULT_HANDLE = 'accessfreetools.bsky.social';
const DEFAULT_JSON_REPORT = resolve('output', 'promotion', 'bluesky', 'bluesky-profile-audit.json');
const DEFAULT_MD_REPORT = resolve('output', 'promotion', 'bluesky', 'bluesky-profile-audit.md');
const PUBLIC_API = 'https://public.api.bsky.app';

function parseArgs() {
  const handleArg = process.argv.find((arg) => arg.startsWith('--handle='));
  const jsonArg = process.argv.find((arg) => arg.startsWith('--json='));
  const mdArg = process.argv.find((arg) => arg.startsWith('--md='));

  return {
    handle: handleArg?.slice('--handle='.length) || process.env.BLUESKY_HANDLE || DEFAULT_HANDLE,
    jsonReport: resolve(jsonArg?.slice('--json='.length) ?? DEFAULT_JSON_REPORT),
    mdReport: resolve(mdArg?.slice('--md='.length) ?? DEFAULT_MD_REPORT),
    avatarVerified:
      process.argv.includes('--avatar-verified') || process.env.BLUESKY_AVATAR_VERIFIED === 'true',
  };
}

async function getProfile(handle) {
  const url = new URL('/xrpc/app.bsky.actor.getProfile', PUBLIC_API);
  url.searchParams.set('actor', handle);
  const response = await fetch(url);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(body)}`);
  }
  return body;
}

function hasText(value, expected) {
  return typeof value === 'string' && value.toLowerCase().includes(expected.toLowerCase());
}

function audit(profile, options) {
  const checks = [
    {
      name: 'profile exists',
      passed: Boolean(profile.did && profile.handle),
      detail: `${profile.handle || 'missing handle'} / ${profile.did || 'missing DID'}`,
    },
    {
      name: 'display name is branded',
      passed: profile.displayName === 'Access Free Tools',
      detail: profile.displayName || 'missing display name',
    },
    {
      name: 'bio explains the site',
      passed:
        hasText(profile.description, 'calculator') &&
        hasText(profile.description, 'access') &&
        hasText(profile.description, 'tools'),
      detail: profile.description || 'missing bio',
    },
    {
      name: 'branded avatar is verified',
      passed: options.avatarVerified,
      detail: options.avatarVerified
        ? 'manual visual check recorded'
        : profile.avatar
          ? 'avatar URL exists, but branded/custom avatar is not visually verified'
          : 'missing avatar',
    },
    {
      name: 'first post exists',
      passed: Number(profile.postsCount ?? 0) > 0,
      detail: `${profile.postsCount ?? 0} post(s)`,
    },
  ];

  return {
    generatedAt: new Date().toISOString(),
    handle: profile.handle,
    did: profile.did,
    createdAt: profile.createdAt,
    indexedAt: profile.indexedAt,
    followersCount: profile.followersCount ?? 0,
    followsCount: profile.followsCount ?? 0,
    postsCount: profile.postsCount ?? 0,
    checks,
    passed: checks.every((check) => check.passed),
    nextActions: checks
      .filter((check) => !check.passed)
      .map((check) => {
        if (check.name === 'display name is branded') return 'Set display name to Access Free Tools.';
        if (check.name === 'bio explains the site') {
          return 'Add the approved Access Free Tools bio from docs/promotion-account-launch-kit.md.';
        }
        if (check.name === 'branded avatar is verified') {
          return 'Upload or visually confirm the branded Access Free Tools avatar, then rerun with BLUESKY_AVATAR_VERIFIED=true only after checking the public profile.';
        }
        if (check.name === 'first post exists') {
          return 'Create an app password, run npm run promotion:bluesky:quality, then publish the approved starter post.';
        }
        return `Fix: ${check.name}.`;
      }),
  };
}

function markdown(report) {
  const checks = report.checks
    .map((check) => `- ${check.passed ? 'PASS' : 'TODO'}: ${check.name} - ${check.detail}`)
    .join('\n');
  const nextActions =
    report.nextActions.length > 0
      ? report.nextActions.map((action) => `- ${action}`).join('\n')
      : '- No profile gaps found.';

  return `# Bluesky Profile Audit

Generated: ${report.generatedAt}
Profile: https://bsky.app/profile/${report.handle}
DID: ${report.did}

## Summary

- Created: ${report.createdAt}
- Indexed: ${report.indexedAt}
- Followers: ${report.followersCount}
- Following: ${report.followsCount}
- Posts: ${report.postsCount}
- Passed: ${report.passed ? 'yes' : 'no'}

## Checks

${checks}

## Next Actions

${nextActions}
`;
}

async function main() {
  const options = parseArgs();
  const profile = await getProfile(options.handle);
  const report = audit(profile, options);

  mkdirSync(dirname(options.jsonReport), { recursive: true });
  writeFileSync(options.jsonReport, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(options.mdReport, markdown(report));

  console.log(`Audited Bluesky profile https://bsky.app/profile/${report.handle}`);
  console.log(`Passed: ${report.passed ? 'yes' : 'no'}`);
  console.log(`Saved JSON report to ${options.jsonReport}`);
  console.log(`Saved markdown report to ${options.mdReport}`);

  if (!report.passed) {
    for (const action of report.nextActions) {
      console.log(`Next: ${action}`);
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
