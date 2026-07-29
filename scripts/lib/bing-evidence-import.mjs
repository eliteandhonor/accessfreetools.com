import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const BING_OVERVIEW_PATTERN =
  /^accessfreetools\.com_SearchPerformanceOverview_All_(\d{1,2})_(\d{1,2})_(\d{4})(?: \(\d+\))?\.csv$/i;

function normalizedHeader(value) {
  return String(value ?? '')
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function rowLookup(row) {
  return new Map(Object.entries(row).map(([key, value]) => [normalizedHeader(key), value]));
}

function firstValue(lookup, aliases) {
  for (const alias of aliases) {
    if (lookup.has(alias)) return lookup.get(alias);
  }
  return undefined;
}

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function metric(value, { integer = false } = {}) {
  if (!hasValue(value)) return { present: false, valid: true, value: null };
  const normalized = String(value).trim().replace(/,/g, '').replace(/%$/, '');
  const parsed = Number(normalized);
  return {
    present: true,
    valid: Number.isFinite(parsed) && (!integer || Number.isInteger(parsed)),
    value: Number.isFinite(parsed) ? parsed : null,
  };
}

function issue(rowNumber, code, field, message) {
  return { code, field, message, rowNumber };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function validCalendarDate(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function parseCsv(text) {
  const source = String(text ?? '').replace(/^\uFEFF/, '');
  const records = [];
  let field = '';
  let record = [];
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      record.push(field);
      field = '';
    } else if (char === '\n') {
      record.push(field);
      records.push(record);
      record = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (quoted) throw new Error('CSV contains an unterminated quoted field.');
  if (field || record.length) {
    record.push(field);
    records.push(record);
  }

  const populated = records.filter((values) => values.some((value) => String(value).trim() !== ''));
  const [rawHeaders = [], ...body] = populated;
  const headers = rawHeaders.map((header) => String(header).replace(/^\uFEFF/, '').trim());
  const normalized = headers.map(normalizedHeader);

  if (!headers.length) return [];
  if (normalized.some((header) => !header)) throw new Error('CSV contains a blank header.');
  if (new Set(normalized).size !== normalized.length) throw new Error('CSV contains duplicate headers.');

  return body.map((values, index) => {
    if (values.length > headers.length) {
      throw new Error(`CSV row ${index + 2} contains more fields than the header.`);
    }
    return Object.fromEntries(headers.map((header, column) => [header, String(values[column] ?? '').trim()]));
  });
}

export function normalizeBingDate(value) {
  if (!hasValue(value)) return '';
  const raw = String(value).trim();
  const iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s].*)?$/);
  const us = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s.*)?$/);

  let year;
  let month;
  let day;
  if (iso) {
    [, year, month, day] = iso.map(Number);
  } else if (us) {
    [, month, day, year] = us.map(Number);
  } else {
    return '';
  }

  return validCalendarDate(year, month, day) ? `${year}-${pad(month)}-${pad(day)}` : '';
}

export function dataDateFromFileName(fileName) {
  const match = basename(String(fileName ?? '')).match(BING_OVERVIEW_PATTERN);
  if (!match) return '';
  const [, monthValue, dayValue, yearValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  return validCalendarDate(year, month, day) ? `${year}-${pad(month)}-${pad(day)}` : '';
}

function isAiCitationRow(lookup) {
  const aiHeaders = [
    'aicitation',
    'aicitations',
    'aisearchquery',
    'citation',
    'citations',
    'groundingquery',
    'groundingqueries',
  ];
  if (aiHeaders.some((header) => lookup.has(header))) return true;

  const type = firstValue(lookup, ['channel', 'reporttype', 'searchtype', 'type']);
  return hasValue(type) && /\b(ai|copilot|generative)\b/i.test(String(type));
}

export function normalizeBingRow(row, rowNumber = 2) {
  const lookup = rowLookup(row);
  const stream = isAiCitationRow(lookup) ? 'ai-citations' : 'traditional-search';
  const rawDate = firstValue(lookup, ['date', 'day']);
  const clicks = metric(firstValue(lookup, ['click', 'clicks']), { integer: true });
  const impressions = metric(firstValue(lookup, ['impression', 'impressions']), { integer: true });
  const ctr = metric(firstValue(lookup, ['avgctr', 'averagectr', 'ctr']));
  const position = metric(firstValue(lookup, ['avgposition', 'averageposition', 'position']));
  const citations = metric(firstValue(lookup, ['aicitation', 'aicitations', 'citation', 'citations']), {
    integer: true,
  });
  const date = normalizeBingDate(rawDate);
  const issues = [];

  if (hasValue(rawDate) && !date) {
    issues.push(issue(rowNumber, 'invalid-date', 'date', 'Date is not a supported calendar date.'));
  }
  if (clicks.present && (!clicks.valid || clicks.value < 0)) {
    issues.push(issue(rowNumber, 'invalid-clicks', 'clicks', 'Clicks must be a non-negative integer.'));
  }
  if (impressions.present && (!impressions.valid || impressions.value < 0)) {
    issues.push(issue(rowNumber, 'invalid-impressions', 'impressions', 'Impressions must be a non-negative integer.'));
  }
  if (ctr.present && (!ctr.valid || ctr.value < 0 || ctr.value > 100)) {
    issues.push(issue(rowNumber, 'invalid-ctr', 'ctrPercent', 'CTR must be a number from 0 through 100.'));
  }
  if (position.present && (!position.valid || position.value < 0)) {
    issues.push(issue(rowNumber, 'invalid-position', 'position', 'Position must be a non-negative number.'));
  }
  if (citations.present && (!citations.valid || citations.value < 0)) {
    issues.push(issue(rowNumber, 'invalid-citations', 'citations', 'Citations must be a non-negative integer.'));
  }

  const validCounts =
    (!clicks.present || (clicks.valid && clicks.value >= 0)) &&
    (!impressions.present || (impressions.valid && impressions.value >= 0));
  if (
    validCounts &&
    clicks.present &&
    impressions.present &&
    clicks.value > impressions.value
  ) {
    issues.push(
      issue(rowNumber, 'clicks-exceed-impressions', 'clicks', 'Clicks cannot be greater than impressions.'),
    );
  }

  const validCtr = ctr.present && ctr.valid && ctr.value >= 0 && ctr.value <= 100;
  if (validCounts && validCtr && clicks.present && impressions.present) {
    if (impressions.value === 0 && ctr.value !== 0) {
      issues.push(issue(rowNumber, 'ctr-without-impressions', 'ctrPercent', 'CTR must be zero when impressions are zero.'));
    } else if (impressions.value > 0 && clicks.value <= impressions.value) {
      const expected = (clicks.value / impressions.value) * 100;
      if (Math.abs(expected - ctr.value) > 0.02) {
        issues.push(
          issue(
            rowNumber,
            'ctr-mismatch',
            'ctrPercent',
            'CTR is inconsistent with the row click and impression counts.',
          ),
        );
      }
    }
  }

  const normalized = {
    clicks: clicks.value,
    ctrPercent: ctr.value,
    date,
    impressions: impressions.value,
    issueCodes: issues.map((item) => item.code),
    position: position.value,
    rowNumber,
    valid: issues.length === 0,
  };

  if (stream === 'ai-citations') normalized.citations = citations.value;
  return { issues, row: normalized, stream };
}

function reportPeriod(rows) {
  const dates = rows.map((row) => row.date).filter(Boolean).sort();
  return dates.length ? { endDate: dates.at(-1), startDate: dates[0] } : null;
}

function round(value, places = 2) {
  return Number(value.toFixed(places));
}

function summarizeRows(rows, { citations = false } = {}) {
  const accepted = rows.filter((row) => row.valid);
  const clicks = accepted.reduce((sum, row) => sum + (row.clicks ?? 0), 0);
  const impressions = accepted.reduce((sum, row) => sum + (row.impressions ?? 0), 0);
  const positioned = accepted.filter((row) => row.position !== null && row.impressions > 0);
  const positionWeight = positioned.reduce((sum, row) => sum + row.impressions, 0);

  const totals = {
    acceptedRows: accepted.length,
    clicks,
    ctrPercent: impressions ? round((clicks / impressions) * 100) : 0,
    excludedRows: rows.length - accepted.length,
    flaggedRows: rows.length - accepted.length,
    impressions,
    rows: rows.length,
    weightedAveragePosition: positionWeight
      ? round(positioned.reduce((sum, row) => sum + row.position * row.impressions, 0) / positionWeight)
      : null,
  };
  if (citations) totals.citations = accepted.reduce((sum, row) => sum + (row.citations ?? 0), 0);
  return totals;
}

export function buildBingEvidenceReport({
  generatedAt = new Date().toISOString(),
  sourceFileName,
  sourceText,
}) {
  const parsed = parseCsv(sourceText);
  const traditionalRows = [];
  const aiRows = [];
  const issues = [];

  parsed.forEach((sourceRow, index) => {
    const normalized = normalizeBingRow(sourceRow, index + 2);
    issues.push(...normalized.issues);
    if (normalized.stream === 'ai-citations') aiRows.push(normalized.row);
    else traditionalRows.push(normalized.row);
  });

  const allRows = [...traditionalRows, ...aiRows];
  const period = reportPeriod(allRows);
  const safeFileName = basename(String(sourceFileName || 'bing-evidence.csv'));
  const dataDate = dataDateFromFileName(safeFileName) || period?.endDate || '';

  return {
    aiCitations: {
      rows: aiRows,
      totals: summarizeRows(aiRows, { citations: true }),
    },
    generatedAt,
    issues,
    kind: 'bing-webmaster-evidence',
    notes: [
      'Traditional search performance and AI citation evidence are stored separately.',
      'Rows with validation issues are retained for diagnosis and excluded from totals.',
      'The report stores normalized metrics and source provenance, not the source CSV body or absolute path.',
    ],
    source: {
      dataDate: dataDate || null,
      fileName: safeFileName,
      reportPeriod: period,
      sha256: createHash('sha256').update(String(sourceText ?? ''), 'utf8').digest('hex'),
    },
    status: issues.length ? 'attention' : 'pass',
    traditionalSearch: {
      rows: traditionalRows,
      totals: summarizeRows(traditionalRows),
    },
  };
}

function markdownValue(value) {
  return value === null || value === undefined || value === '' ? 'not available' : String(value);
}

export function renderBingEvidenceMarkdown(report) {
  const traditional = report.traditionalSearch.totals;
  const ai = report.aiCitations.totals;
  const period = report.source.reportPeriod;
  const issueRows = report.issues.length
    ? report.issues
        .map((item) => `| ${item.rowNumber} | ${item.code} | ${item.field} | ${item.message} |`)
        .join('\n')
    : '| none | none | none | No validation issues found. |';

  return `# Bing Webmaster Evidence Import

Generated: ${report.generatedAt}

Status: ${report.status}

## Source

- File: ${report.source.fileName}
- SHA-256: ${report.source.sha256}
- Data date: ${markdownValue(report.source.dataDate)}
- Report period: ${period ? `${period.startDate} to ${period.endDate}` : 'not available'}

## Traditional Search

- Rows: ${traditional.rows}
- Accepted rows: ${traditional.acceptedRows}
- Excluded rows: ${traditional.excludedRows}
- Clicks: ${traditional.clicks}
- Impressions: ${traditional.impressions}
- Calculated CTR: ${traditional.ctrPercent}%
- Weighted average position: ${markdownValue(traditional.weightedAveragePosition)}

## AI Citations

- Rows: ${ai.rows}
- Accepted rows: ${ai.acceptedRows}
- Excluded rows: ${ai.excludedRows}
- Citations: ${ai.citations}

AI citation evidence is kept separate from traditional clicks, impressions, rankings, and CTR.

## Validation Issues

| Source row | Code | Field | Explanation |
| ---: | --- | --- | --- |
${issueRows}

## Handling Notes

${report.notes.map((note) => `- ${note}`).join('\n')}
`;
}

function fileDateRank(fileName) {
  const date = dataDateFromFileName(fileName);
  return date ? Date.parse(`${date}T00:00:00Z`) : 0;
}

export function newestBingEvidenceCsv(
  downloads = process.env.USERPROFILE ? join(process.env.USERPROFILE, 'Downloads') : '',
) {
  if (!downloads || !existsSync(downloads)) return '';
  return (
    readdirSync(downloads, { withFileTypes: true })
      .filter((entry) => entry.isFile() && BING_OVERVIEW_PATTERN.test(entry.name))
      .map((entry) => {
        const fullPath = join(downloads, entry.name);
        return {
          dateRank: fileDateRank(entry.name),
          fullPath,
          mtime: statSync(fullPath).mtimeMs,
        };
      })
      .sort((left, right) => right.dateRank - left.dateRank || right.mtime - left.mtime)[0]?.fullPath ?? ''
  );
}

export function writeBingEvidenceReport(report, outputDir = resolve('output', 'bing-webmaster')) {
  mkdirSync(outputDir, { recursive: true });
  const jsonPath = join(outputDir, 'latest.json');
  const markdownPath = join(outputDir, 'latest.md');
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  writeFileSync(markdownPath, renderBingEvidenceMarkdown(report), 'utf8');
  return { jsonPath, markdownPath };
}
