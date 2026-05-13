import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const args = process.argv.slice(2);
const option = (name, fallback = undefined) =>
  args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) ?? fallback;

function localDateStamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: process.env.AFT_AUDIT_TIME_ZONE ?? 'Australia/Brisbane',
    year: 'numeric',
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

const outputDir = resolve(option('--output-dir', join('output', 'recognition-tracker', localDateStamp())));
const queuePath = resolve('docs', 'promotion-queue.md');

const platformDefinitions = [
  {
    key: 'medium',
    label: 'Medium',
    urlPattern: /https:\/\/medium\.com\/@accessfreetools\/[^\s)`"<>]+/gi,
    profilePattern: /https:\/\/medium\.com\/@accessfreetools\b/gi,
    blockPattern: /medium account (?:blocked|suspended)/i,
  },
  {
    key: 'pinterest',
    label: 'Pinterest',
    urlPattern: /https:\/\/(?:au\.)?pinterest\.com\/pin\/[0-9]+\/?/gi,
    profilePattern: /https:\/\/(?:au\.)?pinterest\.com\/accessfreetools\/?/gi,
    blockPattern: /pinterest account (?:blocked|suspended)/i,
  },
  {
    key: 'quora',
    label: 'Quora',
    urlPattern: /https:\/\/(?:www\.)?quora\.com\/(?:profile\/Brendan-1929\/[^\s)`"<>]+|How-[^\s)`"<>]+\/answer\/Access-Free-Tools)|https:\/\/accessfreetoolssspace\.quora\.com\/[^\s)`"<>]*/gi,
    profilePattern: /https:\/\/(?:www\.)?quora\.com\/profile\/Brendan-1929|https:\/\/accessfreetoolssspace\.quora\.com\/?/gi,
    blockPattern: /quora account (?:blocked|suspended)/i,
  },
  {
    key: 'bluesky',
    label: 'Bluesky',
    urlPattern: /https:\/\/bsky\.app\/profile\/accessfreetools\.bsky\.social\/post\/[^\s)`"<>]+/gi,
    profilePattern: /https:\/\/bsky\.app\/profile\/accessfreetools\.bsky\.social\b/gi,
    blockPattern: /bluesky account (?:blocked|suspended)/i,
  },
  {
    key: 'dev',
    label: 'DEV Community',
    urlPattern: /https:\/\/dev\.to\/accessfreetools\/[^\s)`"<>]+/gi,
    profilePattern: /https:\/\/dev\.to\/accessfreetools\b/gi,
    blockPattern: /dev.*(?:forbidden|suspended|limited access|blocked)/i,
  },
  {
    key: 'reddit',
    label: 'Reddit',
    urlPattern: /https:\/\/(?:www\.)?reddit\.com\/(?:user\/accessfreetools\/comments\/[^\s)`"<>]+|r\/[^\s)`"<>]+\/comments\/[^\s)`"<>]+)/gi,
    profilePattern: /https:\/\/(?:www\.)?reddit\.com\/user\/accessfreetools\/?/gi,
    blockPattern: /reddit.*(?:banned|blocked)|account has been banned/i,
  },
];

function readText(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function readJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    return { parseError: error instanceof Error ? error.message : String(error) };
  }
}

function cleanUrl(url = '') {
  return url.replace(/[).,;:!?]+$/g, '');
}

function matchUrls(text, pattern) {
  return [...new Set((text.match(pattern) ?? []).map(cleanUrl))].sort();
}

function cleanInline(value = '') {
  return value.replace(/`/g, '').trim();
}

function parseQueueRows(markdown) {
  return markdown
    .split('\n')
    .filter((line) => line.trim().startsWith('|') && !line.includes('---'))
    .map((line) => line.split('|').map((cell) => cleanInline(cell)).filter(Boolean))
    .filter((cells) => cells.length >= 6 && cells[0] !== 'Priority')
    .map((cells) => ({
      priority: cells[0],
      page: cells[1],
      angle: cells[2],
      channel: cells[3],
      status: cells[4],
      nextAction: cells.slice(5).join(' | '),
    }));
}

function rowMentionsPlatform(row, definition) {
  const text = `${row.channel} ${row.nextAction} ${row.page}`.toLowerCase();
  return text.includes(definition.key) || text.includes(definition.label.toLowerCase().split(' ')[0]);
}

function hasRowProof(row) {
  return /https?:\/\//i.test(row.nextAction) || /output\//i.test(row.nextAction) || /public|verified|checked/i.test(row.nextAction);
}

function platformStatus(definition, markdown, rows) {
  const proofUrls = matchUrls(markdown, definition.urlPattern);
  const profileUrls = matchUrls(markdown, definition.profilePattern);
  const platformRows = rows.filter((row) => rowMentionsPlatform(row, definition));
  const blocked = definition.blockPattern.test(markdown);
  const waitingRows = platformRows.filter((row) => ['rss-connected', 'unverified', 'approved', 'needs approval'].includes(row.status));
  const claimedWithoutProof = platformRows.filter((row) => ['posted', 'done'].includes(row.status) && !hasRowProof(row));
  const status = blocked
    ? 'blocked'
    : proofUrls.length
      ? 'active-with-proof'
      : profileUrls.length
        ? 'profile-only'
        : waitingRows.length
          ? 'waiting-for-proof'
          : 'not-started';

  return {
    key: definition.key,
    label: definition.label,
    status,
    publicProofUrls: proofUrls,
    profileUrls,
    queueRows: platformRows.length,
    waitingRows: waitingRows.map((row) => ({
      page: row.page,
      status: row.status,
      nextAction: row.nextAction,
    })),
    claimedWithoutProof,
    notes: blocked
      ? [`${definition.label} is blocked in the current promotion queue notes.`]
      : proofUrls.length
        ? [`${definition.label} has public proof URLs recorded.`]
        : profileUrls.length
          ? [`${definition.label} has a profile URL but no public post proof in the queue notes.`]
          : [],
  };
}

function searchConsoleStatus() {
  const report = readJson(resolve('output', 'search-console-url-inspection.json'));
  const inspections = Array.isArray(report?.inspections) ? report.inspections : [];
  const indexed = inspections.filter((item) => String(item.verdict).toUpperCase() === 'PASS').length;
  const gaps = inspections.length - indexed;

  return {
    key: 'search-console',
    label: 'Google Search Console',
    status: report?.parseError ? 'parse-error' : inspections.length ? 'snapshot-present' : 'missing',
    reportPath: 'output/search-console-url-inspection.json',
    indexed,
    gaps,
    generatedAt: report?.generatedAt ?? '',
  };
}

function bingStatus() {
  const report = readJson(resolve('output', 'seo-agent-self-evaluation.json'));
  const statusReport = readJson(resolve('output', 'dataforseo-status.json'));
  const bingFreshness =
    statusReport?.services?.dataforseo_labs?.databases?.bing?.date_update ??
    statusReport?.dataforseo_labs?.databases?.bing?.date_update ??
    '';

  return {
    key: 'bing',
    label: 'Bing',
    status: report || statusReport ? 'snapshot-present' : 'missing',
    reportPath: report ? 'output/seo-agent-self-evaluation.json' : statusReport ? 'output/dataforseo-status.json' : '',
    bingDatabaseFreshness: bingFreshness,
  };
}

function crawlScoutStatus() {
  const report = readJson(resolve('output', 'crawlscout', 'crawlscout-summary.json'));
  const markdown = readText(resolve('output', 'crawlscout', 'crawlscout-summary.md'));

  return {
    key: 'crawlscout',
    label: 'CrawlScout',
    status: report?.parseError ? 'parse-error' : report || markdown ? 'snapshot-present' : 'missing',
    reportPath: report ? 'output/crawlscout/crawlscout-summary.json' : markdown ? 'output/crawlscout/crawlscout-summary.md' : '',
    notes: Array.isArray(report?.notes) ? report.notes.slice(0, 4) : [],
  };
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function renderMarkdown(report) {
  const lines = [
    '# Recognition Tracker',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Public proof URLs: ${report.totals.publicProofUrls}`,
    `Blocked platforms: ${report.totals.blockedPlatforms}`,
    `Claimed rows missing proof: ${report.totals.claimedWithoutProof}`,
    '',
    '## Owned And Social Platforms',
    '',
  ];

  for (const platform of report.platforms) {
    lines.push(`### ${platform.label}`);
    lines.push('');
    lines.push(`- Status: ${platform.status}`);
    lines.push(`- Public proof URLs: ${platform.publicProofUrls.length ? platform.publicProofUrls.join(', ') : 'none'}`);
    lines.push(`- Profile URLs: ${platform.profileUrls.length ? platform.profileUrls.join(', ') : 'none'}`);
    lines.push(`- Queue rows: ${platform.queueRows}`);
    lines.push(`- Waiting rows: ${platform.waitingRows.length}`);
    lines.push(`- Claimed without proof: ${platform.claimedWithoutProof.length}`);
    lines.push('');
  }

  lines.push('## Search And Crawl Proof', '');
  for (const source of report.searchSources) {
    lines.push(`- ${source.label}: ${source.status}${source.reportPath ? ` (${source.reportPath})` : ''}`);
  }

  lines.push('', '## Rule', '');
  lines.push('- A platform is not active unless a public URL, public profile/feed proof, screenshot, or generated report supports the claim.');
  lines.push('');

  return `${lines.join('\n')}\n`;
}

const queueMarkdown = readText(queuePath);
const rows = parseQueueRows(queueMarkdown);
const platforms = platformDefinitions.map((definition) => platformStatus(definition, queueMarkdown, rows));
const searchSources = [searchConsoleStatus(), bingStatus(), crawlScoutStatus()];
const claimedWithoutProof = platforms.flatMap((platform) =>
  platform.claimedWithoutProof.map((row) => ({ platform: platform.label, ...row })),
);
const report = {
  generatedAt: new Date().toISOString(),
  outputDir,
  queuePath: 'docs/promotion-queue.md',
  totals: {
    platforms: platforms.length,
    publicProofUrls: platforms.reduce((total, platform) => total + platform.publicProofUrls.length, 0),
    blockedPlatforms: platforms.filter((platform) => platform.status === 'blocked').length,
    claimedWithoutProof: claimedWithoutProof.length,
  },
  platforms,
  searchSources,
  claimedWithoutProof,
};

writeJson(join(outputDir, 'summary.json'), report);
writeText(join(outputDir, 'summary.md'), renderMarkdown(report));
writeJson(resolve('output', 'recognition-tracker', 'latest.json'), report);
writeText(resolve('output', 'recognition-tracker', 'latest.md'), renderMarkdown(report));

console.log(`Recognition tracker: ${report.totals.publicProofUrls} public proof URL(s), ${report.totals.blockedPlatforms} blocked platform(s), ${report.totals.claimedWithoutProof} claimed row(s) missing proof.`);
console.log(`Report: ${join(outputDir, 'summary.md')}`);

if (claimedWithoutProof.length > 0) {
  process.exitCode = 1;
}
