import { createHash } from 'node:crypto';
import { createReadStream, existsSync, lstatSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

const rootDir = process.cwd();
const protectedRoots = ['output', 'agents', '.local'];
const duplicateThresholdBytes = 1024 * 1024;
const reportBase = resolve(rootDir, 'output', 'maintenance', 'proof-retention-audit-latest');

function normalizePath(path) {
  return relative(rootDir, path).replaceAll('\\', '/');
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unit = units[0];
  for (let index = 1; index < units.length && value >= 1024; index += 1) {
    value /= 1024;
    unit = units[index];
  }
  return `${value.toFixed(value >= 10 ? 1 : 2)} ${unit}`;
}

function inventory(path, files, directoryTotals) {
  if (!existsSync(path)) return 0;
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) return 0;
  if (stat.isFile()) {
    files.push({ path: normalizePath(path), absolutePath: path, sizeBytes: stat.size });
    return stat.size;
  }
  if (!stat.isDirectory()) return 0;

  let total = 0;
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    total += inventory(resolve(path, entry.name), files, directoryTotals);
  }
  directoryTotals.set(normalizePath(path), total);
  return total;
}

function hashFile(path) {
  return new Promise((resolveHash, reject) => {
    const hash = createHash('sha256');
    const stream = createReadStream(path);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolveHash(hash.digest('hex')));
  });
}

async function findDuplicateGroups(files) {
  const sameSize = new Map();
  for (const file of files) {
    if (file.sizeBytes < duplicateThresholdBytes) continue;
    const group = sameSize.get(file.sizeBytes) ?? [];
    group.push(file);
    sameSize.set(file.sizeBytes, group);
  }

  const duplicateGroups = [];
  for (const group of sameSize.values()) {
    if (group.length < 2) continue;
    const byHash = new Map();
    for (const file of group) {
      const hash = await hashFile(file.absolutePath);
      const matches = byHash.get(hash) ?? [];
      matches.push(file);
      byHash.set(hash, matches);
    }
    for (const [sha256, matches] of byHash) {
      if (matches.length < 2) continue;
      duplicateGroups.push({
        sha256,
        sizeBytes: matches[0].sizeBytes,
        reclaimableBytes: matches[0].sizeBytes * (matches.length - 1),
        paths: matches.map((file) => file.path),
      });
    }
  }
  return duplicateGroups.sort((a, b) => b.reclaimableBytes - a.reclaimableBytes);
}

function markdown(report) {
  const roots = report.protectedRoots
    .map((item) => `| \`${item.path}\` | ${formatBytes(item.sizeBytes)} | ${item.fileCount} |`)
    .join('\n');
  const directories = report.largestDirectories
    .map((item) => `| \`${item.path}\` | ${formatBytes(item.sizeBytes)} |`)
    .join('\n');
  const files = report.largestFiles
    .map((item) => `| \`${item.path}\` | ${formatBytes(item.sizeBytes)} |`)
    .join('\n');
  const duplicates = report.duplicateGroups.length
    ? report.duplicateGroups
        .slice(0, 30)
        .map(
          (group) =>
            `- ${formatBytes(group.reclaimableBytes)} duplicate potential (${formatBytes(group.sizeBytes)} each): ${group.paths.map((path) => `\`${path}\``).join(', ')}`,
        )
        .join('\n')
    : '- No exact duplicate files at or above 1 MB were found.';

  return `# Proof Retention Audit

Generated: ${report.generatedAt}

This report is read-only. It does not authorize deletion. \`output/\`, \`agents/\`, and \`.local/\` remain protected by the safe-cleanup denylist.

## Protected Roots

| path | size | files |
| --- | ---: | ---: |
${roots}

## Largest Directories

| path | size |
| --- | ---: |
${directories}

## Largest Files

| path | size |
| --- | ---: |
${files}

## Exact Duplicate Candidates

${duplicates}

Any cleanup of these paths needs a separate evidence-retention decision. Rebuildable project artifacts should continue to use \`npm run maintenance:clean:safe\`.
`;
}

const files = [];
const directoryTotals = new Map();
const rootReports = protectedRoots.map((name) => {
  const path = resolve(rootDir, name);
  const startCount = files.length;
  const sizeBytes = inventory(path, files, directoryTotals);
  return { path: name, exists: existsSync(path), sizeBytes, fileCount: files.length - startCount };
});

const duplicateGroups = await findDuplicateGroups(files);
const report = {
  generatedAt: new Date().toISOString(),
  kind: 'proof-retention-audit',
  rootDir,
  policy: 'read-only; no deletion authorized',
  protectedRoots: rootReports,
  largestDirectories: [...directoryTotals.entries()]
    .filter(([path]) => path && !protectedRoots.includes(path))
    .map(([path, sizeBytes]) => ({ path, sizeBytes }))
    .sort((a, b) => b.sizeBytes - a.sizeBytes)
    .slice(0, 30),
  largestFiles: files
    .map(({ path, sizeBytes }) => ({ path, sizeBytes }))
    .sort((a, b) => b.sizeBytes - a.sizeBytes)
    .slice(0, 30),
  duplicateThresholdBytes,
  duplicateGroups,
};

mkdirSync(dirname(reportBase), { recursive: true });
writeFileSync(`${reportBase}.json`, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(`${reportBase}.md`, markdown(report));

console.log('Proof retention audit: pass');
for (const item of rootReports) {
  console.log(`- ${item.path}: ${formatBytes(item.sizeBytes)} across ${item.fileCount} files`);
}
console.log(`- Exact duplicate groups >= 1 MB: ${duplicateGroups.length}`);
console.log('- No files were deleted.');
