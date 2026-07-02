import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { codexHomeDenylist, formatBytes, listCleanupCandidates, pathSizeBytes, projectDenylist } from './lib/safe-cleanup.mjs';

function runCommand(label, command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
  });
  const stderr = [result.stderr, result.error ? String(result.error.message ?? result.error) : ''].filter(Boolean).join('\n');

  return {
    label,
    command: command === process.execPath ? ['node', ...args].join(' ') : [command, ...args].join(' '),
    exitCode: typeof result.status === 'number' ? result.status : 1,
    stdout: String(result.stdout || '').trim(),
    stderr: String(stderr || '').trim(),
  };
}

function runAftCommand(label, args, cwd) {
  return runCommand(label, process.execPath, ['scripts/aft-cli.mjs', ...args], cwd);
}

function topDirectorySizes(rootDir, limit = 20) {
  if (!existsSync(rootDir)) return [];
  return readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const absolutePath = resolve(rootDir, entry.name);
      return {
        name: entry.name,
        path: absolutePath,
        sizeBytes: pathSizeBytes(absolutePath),
      };
    })
    .sort((a, b) => b.sizeBytes - a.sizeBytes)
    .slice(0, limit);
}

function protectedProjectPaths(rootDir) {
  const protectedPaths = [
    'output',
    'agents',
    '.local',
    '.env',
    'Host API',
    'docs/seo-tool-review-queue.md',
    'docs/enterprise-seo-audit-agent-briefing-2026-06-19.md',
    'output/seo-tool-review',
    'output/seo-agents',
    'agents/serpforge-ai/reports',
  ];

  return protectedPaths.map((relativePath) => {
    const absolutePath = resolve(rootDir, relativePath);
    return {
      relativePath,
      absolutePath,
      exists: existsSync(absolutePath),
      sizeBytes: existsSync(absolutePath) ? pathSizeBytes(absolutePath) : 0,
    };
  });
}

function gitDirtyLines(gitStatus) {
  return String(gitStatus.stdout || '')
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line && !line.startsWith('##'));
}

function commandBlock(command) {
  return `### ${command.label}

- Command: \`${command.command}\`
- Exit code: ${command.exitCode}

\`\`\`text
${command.stdout || '(no stdout)'}
${command.stderr ? `\nSTDERR:\n${command.stderr}` : ''}
\`\`\`
`;
}

function tableRows(items, nameField = 'name') {
  return items
    .map((item) => `| ${item[nameField]} | ${formatBytes(item.sizeBytes)} | ${item.exists === false ? 'no' : 'yes'} |`)
    .join('\n');
}

function auditMarkdown(report) {
  return `# Safe Cleanup Maintenance Audit

Generated: ${report.generatedAt}

## Summary

- Repository: \`${report.rootDir}\`
- Git dirty files: ${report.git.dirtyFiles.length ? report.git.dirtyFiles.join('; ') : 'none'}
- Cleanup mode: conservative audit only
- Safe cleanup candidates: ${report.cleanupCandidates.length}
- Safe cleanup candidate size: ${formatBytes(report.cleanupCandidateBytes)}
- Codex home: \`${report.codexHome.path}\`

## Current Gate Commands

${report.commands.map(commandBlock).join('\n')}

## Safe Cleanup Candidates

| path | size | exists |
| --- | ---: | --- |
${tableRows(report.cleanupCandidates, 'relativePath') || '| none | 0 B | no |'}

## Protected Project Paths

| path | size | exists |
| --- | ---: | --- |
${tableRows(report.protectedProjectPaths, 'relativePath')}

## Largest Project Directories

| path | size | exists |
| --- | ---: | --- |
${tableRows(report.projectDirectories)}

## Codex Home Summary

- Audit-only protected patterns: ${codexHomeDenylist.map((item) => `\`${item}\``).join(', ')}

| path | size | exists |
| --- | ---: | --- |
${tableRows(report.codexHome.directories)}

## Hard Denylist

${projectDenylist.map((item) => `- ${item.path ?? item.pattern}`).join('\n')}
`;
}

const rootDir = process.cwd();
const codexHomePath = resolve(process.env.CODEX_HOME || resolve(homedir(), '.codex'));
const gitStatus = runCommand('Git status', 'git', ['status', '--short', '--branch'], rootDir);
const seoQueue = runAftCommand('SEO tool queue', ['seo-tool-queue'], rootDir);
const seoApproval = runAftCommand('SEO approval status', ['seo-approval-status', 'text-case-converter'], rootDir);
const cleanupCandidates = listCleanupCandidates(rootDir);

const report = {
  generatedAt: new Date().toISOString(),
  kind: 'safe-cleanup-audit',
  rootDir,
  git: {
    dirtyFiles: gitDirtyLines(gitStatus),
  },
  commands: [gitStatus, seoQueue, seoApproval],
  cleanupCandidates,
  cleanupCandidateBytes: cleanupCandidates.reduce((sum, candidate) => sum + candidate.sizeBytes, 0),
  protectedProjectPaths: protectedProjectPaths(rootDir),
  projectDirectories: topDirectorySizes(rootDir),
  codexHome: {
    path: codexHomePath,
    directories: topDirectorySizes(codexHomePath),
  },
};

const outputDir = resolve(rootDir, 'output', 'maintenance');
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, 'safe-cleanup-audit-latest.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(resolve(outputDir, 'safe-cleanup-audit-latest.md'), auditMarkdown(report));

console.log('Safe cleanup audit: pass');
console.log(`- Dirty files: ${report.git.dirtyFiles.length ? report.git.dirtyFiles.join('; ') : 'none'}`);
console.log(`- Safe cleanup candidates: ${report.cleanupCandidates.length}`);
console.log(`- Safe cleanup candidate size: ${formatBytes(report.cleanupCandidateBytes)}`);
console.log(`- Saved report: output/maintenance/safe-cleanup-audit-latest.md`);
