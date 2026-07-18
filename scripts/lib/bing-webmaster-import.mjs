import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

import { parseCsv, sourceDataDate } from './search-console-performance-import.mjs';

const DOWNLOADS_DIR = process.env.USERPROFILE ? join(process.env.USERPROFILE, 'Downloads') : '';
const HARD_KEYWORD_ISSUES = new Set(['clicks-exceed-impressions', 'ctr-out-of-range', 'invalid-metric']);

const sourceDefinitions = {
  aiQueries: {
    kind: 'bing-ai-search-queries',
    pattern: /^accessfreetools\.com_AISearchQueriesReport_.*\.csv$/i,
  },
  keywords: {
    kind: 'bing-keyword-performance',
    pattern: /^accessfreetools\.com_KeywordReport_.*\.csv$/i,
  },
  latestLinks: {
    kind: 'bing-latest-links',
    pattern: /^accessfreetools\.com-Latest links-.*\.csv$/i,
  },
};

function newestMatchingFile(directory, pattern) {
  if (!directory || !existsSync(directory)) return '';
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && pattern.test(entry.name))
    .map((entry) => {
      const filePath = join(directory, entry.name);
      return { filePath, modifiedAt: statSync(filePath).mtimeMs };
    })
    .sort((left, right) => right.modifiedAt - left.modifiedAt)[0]?.filePath ?? '';
}

export function newestBingWebmasterFiles(downloads = DOWNLOADS_DIR) {
  return Object.fromEntries(
    Object.entries(sourceDefinitions).map(([key, definition]) => [
      key,
      newestMatchingFile(downloads, definition.pattern),
    ]),
  );
}

function numericMetric(value) {
  const text = String(value ?? '').trim();
  const normalized = text.replace(/,/g, '').replace(/%$/, '');
  const number = Number(normalized);
  return {
    valid: text !== '' && Number.isFinite(number),
    value: Number.isFinite(number) ? number : 0,
  };
}

function rounded(value, digits = 2) {
  return Number(Number(value || 0).toFixed(digits));
}

function fileMetadata(filePath, kind) {
  if (!filePath || !existsSync(filePath)) return null;
  const buffer = readFileSync(filePath);
  return {
    dataDate: sourceDataDate(filePath),
    fileName: basename(filePath),
    kind,
    sha256: createHash('sha256').update(buffer).digest('hex'),
    sizeBytes: buffer.length,
  };
}

function readRows(filePath) {
  return filePath && existsSync(filePath) ? parseCsv(readFileSync(filePath, 'utf8')) : [];
}

export function parseBingKeywordCsv(text) {
  const [header = '', ...lines] = String(text ?? '').split(/\r?\n/);
  const headerNames = header
    .split(',')
    .map((value) => value.replace(/^"|"$/g, '').trim());

  return lines
    .filter((line) => line.trim())
    .map((line) => {
      const match = line.match(/^(.*),"([^"]*)","([^"]*)","([^"]*)","([^"]*)"$/);
      if (match) {
        const query = match[1].replace(/^"/, '').replace(/"$/, '').replace(/""/g, '"');
        return {
          Keyword: query,
          Impressions: match[2],
          Clicks: match[3],
          CTR: match[4],
          'Avg. Position': match[5],
        };
      }

      const parsed = parseCsv(`${header}\n${line}`)[0];
      if (parsed) return parsed;
      return Object.fromEntries(headerNames.map((name) => [name, '']));
    });
}

function keywordIssue(type, rowNumber, query, detail, severity = 'warning') {
  return { detail, query, rowNumber, severity, type };
}

function normalizeKeywordRows(rows) {
  const issues = [];
  const normalized = rows.map((row, index) => {
    const rowNumber = index + 2;
    const query = row.Keyword ?? '';
    const impressions = numericMetric(row.Impressions);
    const clicks = numericMetric(row.Clicks);
    const ctr = numericMetric(row.CTR);
    const position = numericMetric(row['Avg. Position']);

    if (![impressions, clicks, ctr, position].every((metric) => metric.valid)) {
      issues.push(keywordIssue('invalid-metric', rowNumber, query, 'One or more required metrics are blank or non-numeric.', 'error'));
    }
    if (clicks.value > impressions.value) {
      issues.push(
        keywordIssue(
          'clicks-exceed-impressions',
          rowNumber,
          query,
          `${clicks.value} clicks exceed ${impressions.value} impressions.`,
          'error',
        ),
      );
    }
    if (ctr.value < 0 || ctr.value > 100) {
      issues.push(keywordIssue('ctr-out-of-range', rowNumber, query, `Reported CTR is ${ctr.value}%.`, 'error'));
    }
    if (position.value < 0 || position.value > 100) {
      issues.push(
        keywordIssue(
          'position-outlier',
          rowNumber,
          query,
          `Average position ${position.value} is outside the 0-100 review range.`,
        ),
      );
    }

    const computedCtrPercent = impressions.value ? (clicks.value / impressions.value) * 100 : 0;
    if (impressions.value > 0 && Math.abs(computedCtrPercent - ctr.value) > 0.15) {
      issues.push(
        keywordIssue(
          'ctr-mismatch',
          rowNumber,
          query,
          `Reported CTR ${ctr.value}% differs from computed CTR ${rounded(computedCtrPercent)}%.`,
        ),
      );
    }

    return {
      clicks: clicks.value,
      computedCtrPercent: rounded(computedCtrPercent),
      ctrPercent: ctr.value,
      impressions: impressions.value,
      position: position.value,
      query,
      rowNumber,
    };
  });

  const hardIssueRows = new Set(
    issues.filter((issue) => HARD_KEYWORD_ISSUES.has(issue.type)).map((issue) => issue.rowNumber),
  );
  const validated = normalized.filter((row) => !hardIssueRows.has(row.rowNumber));
  return { issues, normalized, validated };
}

function sum(rows, field) {
  return rows.reduce((total, row) => total + Number(row[field] ?? 0), 0);
}

function keywordTotals(rows) {
  const clicks = sum(rows, 'clicks');
  const impressions = sum(rows, 'impressions');
  const positionRows = rows.filter((row) => row.impressions > 0 && row.position >= 0 && row.position <= 100);
  const positionWeight = sum(positionRows, 'impressions');
  return {
    clicks,
    ctrPercent: impressions ? rounded((clicks / impressions) * 100) : 0,
    impressions,
    rows: rows.length,
    weightedPosition: positionWeight
      ? rounded(
          positionRows.reduce((total, row) => total + row.position * row.impressions, 0) / positionWeight,
        )
      : 0,
  };
}

function normalizeAiRows(rows) {
  const issues = [];
  const normalized = rows.map((row, index) => {
    const citations = numericMetric(row.Citations);
    const share = numericMetric(row['Citation Share']);
    const rowNumber = index + 2;
    if (!citations.valid || !share.valid) {
      issues.push({
        detail: 'Citations or citation share is blank or non-numeric.',
        query: row['Grounding Query'] ?? '',
        rowNumber,
        severity: 'error',
        type: 'invalid-ai-metric',
      });
    }
    if (citations.value < 0 || share.value < 0 || share.value > 100) {
      issues.push({
        detail: `Citations ${citations.value}; citation share ${share.value}%.`,
        query: row['Grounding Query'] ?? '',
        rowNumber,
        severity: 'error',
        type: 'ai-metric-out-of-range',
      });
    }
    return {
      citationSharePercent: share.value,
      citations: citations.value,
      groundingQuery: row['Grounding Query'] ?? '',
      intent: row.Intent ?? '',
      rowNumber,
      topic: row.Topic ?? '',
    };
  });
  return { issues, normalized };
}

function aiTopicSummary(rows) {
  const topics = new Map();
  for (const row of rows) {
    const key = row.topic || 'Unspecified';
    const current = topics.get(key) ?? { citationShareTotal: 0, citations: 0, queries: 0, topic: key };
    current.citationShareTotal += row.citationSharePercent;
    current.citations += row.citations;
    current.queries += 1;
    topics.set(key, current);
  }
  return [...topics.values()]
    .map((topic) => ({
      citations: topic.citations,
      meanCitationSharePercent: rounded(topic.citationShareTotal / topic.queries),
      queries: topic.queries,
      topic: topic.topic,
    }))
    .sort((left, right) => right.citations - left.citations);
}

function normalizeLatestLinks(rows) {
  const issues = [];
  const normalized = rows.map((row, index) => {
    const linkingPage = String(row['Linking page'] ?? '').trim();
    let validUrl = false;
    try {
      validUrl = new URL(linkingPage).protocol === 'https:';
    } catch {
      validUrl = false;
    }
    if (!validUrl) {
      issues.push({
        detail: 'Linking page is not a valid HTTPS URL.',
        linkingPage,
        rowNumber: index + 2,
        severity: 'warning',
        type: 'invalid-linking-page',
      });
    }
    return {
      lastCrawled: row['Last crawled'] ?? '',
      linkingPage,
      rowNumber: index + 2,
    };
  });
  return { issues, normalized };
}

function sourcesFor(files) {
  return Object.fromEntries(
    Object.entries(sourceDefinitions).map(([key, definition]) => [
      key,
      fileMetadata(files[key], definition.kind),
    ]),
  );
}

export function buildBingWebmasterReport({ aiQueriesFile = '', generatedAt = new Date().toISOString(), keywordsFile = '', latestLinksFile = '' }) {
  if (![aiQueriesFile, keywordsFile, latestLinksFile].some((filePath) => filePath && existsSync(filePath))) {
    throw new Error('No Bing Webmaster evidence files were found.');
  }

  const keywordRows = keywordsFile && existsSync(keywordsFile)
    ? parseBingKeywordCsv(readFileSync(keywordsFile, 'utf8'))
    : [];
  const keywordResult = normalizeKeywordRows(keywordRows);
  const aiResult = normalizeAiRows(readRows(aiQueriesFile));
  const linkResult = normalizeLatestLinks(readRows(latestLinksFile));
  const qualityIssues = [...keywordResult.issues, ...aiResult.issues, ...linkResult.issues];
  const keywordRawTotals = keywordTotals(keywordResult.normalized);
  const keywordValidatedTotals = keywordTotals(keywordResult.validated);
  const aiCitations = sum(aiResult.normalized, 'citations');
  const aiMeanCitationSharePercent = aiResult.normalized.length
    ? rounded(sum(aiResult.normalized, 'citationSharePercent') / aiResult.normalized.length)
    : 0;

  return {
    generatedAt,
    kind: 'bing-webmaster-evidence',
    status: qualityIssues.some((issue) => issue.severity === 'error')
      ? 'attention'
      : qualityIssues.length
        ? 'warning'
        : 'pass',
    source: sourcesFor({
      aiQueries: aiQueriesFile,
      keywords: keywordsFile,
      latestLinks: latestLinksFile,
    }),
    totals: {
      ai: {
        citations: aiCitations,
        meanCitationSharePercent: aiMeanCitationSharePercent,
        queries: aiResult.normalized.length,
      },
      keywords: {
        excludedRows: keywordResult.normalized.length - keywordResult.validated.length,
        raw: keywordRawTotals,
        validated: keywordValidatedTotals,
      },
      latestLinks: linkResult.normalized.length,
      qualityIssues: qualityIssues.length,
    },
    keywords: keywordResult.normalized,
    aiQueries: aiResult.normalized,
    latestLinks: linkResult.normalized,
    qualityIssues,
    opportunities: {
      aiTopics: aiTopicSummary(aiResult.normalized),
      pageOneZeroClickKeywords: keywordResult.validated
        .filter((row) => row.clicks === 0 && row.impressions > 0 && row.position > 0 && row.position <= 10)
        .sort((left, right) => right.impressions - left.impressions)
        .slice(0, 25),
      topKeywords: [...keywordResult.validated]
        .sort((left, right) => right.impressions - left.impressions)
        .slice(0, 25),
    },
    notes: [
      'Keyword totals are row-summed from the supplied export and may not equal Bing dashboard totals.',
      'Validated keyword totals exclude impossible metric rows but retain the raw totals for traceability.',
      'AI citations are references in supported AI answers, not clicks, rankings, backlinks, or authority proof.',
      'Latest Links is a recent-link sample, not a complete backlink inventory.',
    ],
  };
}

function cell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function markdownRows(rows, fields, emptyCells) {
  if (!rows.length) return `| ${emptyCells.join(' | ')} |`;
  return rows.map((row) => `| ${fields.map((field) => cell(row[field])).join(' | ')} |`).join('\n');
}

export function renderBingWebmasterMarkdown(report) {
  const sourceRows = Object.values(report.source)
    .filter(Boolean)
    .map((source) => `| ${source.kind} | ${source.fileName} | ${source.dataDate || 'unknown'} | ${source.sha256} |`)
    .join('\n');

  return `# Bing Webmaster Evidence

Generated: ${report.generatedAt}

Status: ${report.status}

## Summary

- Keyword rows: ${report.totals.keywords.raw.rows}; raw ${report.totals.keywords.raw.impressions} impressions and ${report.totals.keywords.raw.clicks} clicks.
- Validated keyword rows: ${report.totals.keywords.validated.rows}; ${report.totals.keywords.validated.impressions} impressions and ${report.totals.keywords.validated.clicks} clicks.
- Excluded impossible keyword rows: ${report.totals.keywords.excludedRows}.
- AI search: ${report.totals.ai.queries} grounding queries, ${report.totals.ai.citations} citations, ${report.totals.ai.meanCitationSharePercent}% mean citation share.
- Latest Links rows: ${report.totals.latestLinks}.
- Quality issues: ${report.totals.qualityIssues}.

## Sources

| Kind | File | Data date | SHA-256 |
| --- | --- | --- | --- |
${sourceRows || '| none | none | unknown | none |'}

## Data Quality

| Severity | Type | Row | Query or URL | Detail |
| --- | --- | ---: | --- | --- |
${markdownRows(
  report.qualityIssues.slice(0, 30).map((issue) => ({
    detail: issue.detail,
    label: issue.query || issue.linkingPage || '',
    rowNumber: issue.rowNumber,
    severity: issue.severity,
    type: issue.type,
  })),
  ['severity', 'type', 'rowNumber', 'label', 'detail'],
  ['none', 'none', '0', '', 'No issues detected'],
)}

## Top Validated Keywords

| Query | Impressions | Clicks | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
${markdownRows(
  report.opportunities.topKeywords,
  ['query', 'impressions', 'clicks', 'ctrPercent', 'position'],
  ['none', '0', '0', '0', '0'],
)}

## AI Citation Topics

| Topic | Queries | Citations | Mean citation share |
| --- | ---: | ---: | ---: |
${markdownRows(
  report.opportunities.aiTopics,
  ['topic', 'queries', 'citations', 'meanCitationSharePercent'],
  ['none', '0', '0', '0'],
)}

## Latest Links

| Linking page | Last crawled |
| --- | --- |
${markdownRows(report.latestLinks, ['linkingPage', 'lastCrawled'], ['none', ''])}

## Interpretation Rules

${report.notes.map((note) => `- ${note}`).join('\n')}
`;
}

export function writeBingWebmasterReport(report, outputDir = resolve('output', 'bing-webmaster')) {
  const jsonPath = join(outputDir, 'latest.json');
  const markdownPath = join(outputDir, 'latest.md');
  mkdirSync(dirname(jsonPath), { recursive: true });
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(markdownPath, renderBingWebmasterMarkdown(report));
  return { jsonPath, markdownPath };
}
