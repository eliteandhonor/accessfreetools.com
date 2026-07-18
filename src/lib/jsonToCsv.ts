export const MAX_JSON_TO_CSV_INPUT_BYTES = 5 * 1024 * 1024;

export type CsvDelimiter = ',' | ';' | '\t';

export interface JsonToCsvOptions {
  delimiter: CsvDelimiter;
  escapeSpreadsheetFormulas: boolean;
  includeBom: boolean;
  maxInputBytes?: number;
}

export interface JsonToCsvResult {
  cells: string[][];
  columnCount: number;
  csv: string;
  escapedFormulaCells: number;
  headers: string[];
  rowCount: number;
  sourceType: 'object' | 'array';
}

type JsonRecord = Record<string, unknown>;

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getUtf8ByteLength(value: string) {
  return new TextEncoder().encode(value).byteLength;
}

function assignFlattenedValue(
  target: Map<string, string>,
  path: string,
  value: string,
) {
  if (target.has(path)) {
    throw new Error(
      `Two JSON fields flatten to the same column "${path}". Rename one field before converting.`,
    );
  }

  target.set(path, value);
}

function flattenRecord(
  record: JsonRecord,
  target: Map<string, string>,
  prefix = '',
) {
  for (const [key, value] of Object.entries(record)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (isJsonRecord(value)) {
      if (Object.keys(value).length === 0) {
        assignFlattenedValue(target, path, '{}');
      } else {
        flattenRecord(value, target, path);
      }
      continue;
    }

    if (Array.isArray(value)) {
      assignFlattenedValue(target, path, JSON.stringify(value));
      continue;
    }

    assignFlattenedValue(
      target,
      path,
      value === null || value === undefined ? '' : String(value),
    );
  }
}

function protectSpreadsheetFormula(value: string) {
  return /^\s*[=+\-@]/u.test(value) ? `'${value}` : value;
}

function escapeCsvField(value: string, delimiter: CsvDelimiter) {
  if (
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes('\r') ||
    value.includes('\n')
  ) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
}

export function convertJsonToCsv(
  input: string,
  options: JsonToCsvOptions,
): JsonToCsvResult {
  const trimmedInput = input.trim();
  if (!trimmedInput) {
    throw new Error('Paste a JSON object or an array of objects first.');
  }

  const maxInputBytes =
    options.maxInputBytes ?? MAX_JSON_TO_CSV_INPUT_BYTES;
  const inputBytes = getUtf8ByteLength(input);
  if (inputBytes > maxInputBytes) {
    throw new Error(
      `JSON input is larger than the ${Math.round(maxInputBytes / 1024 / 1024)} MB browser limit.`,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmedInput);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown JSON error';
    throw new Error(`JSON could not be parsed. ${detail}`);
  }

  const sourceType = Array.isArray(parsed) ? 'array' : 'object';
  const records: JsonRecord[] = Array.isArray(parsed)
    ? parsed.map((item, index) => {
        if (!isJsonRecord(item)) {
          throw new Error(
            `Array item ${index + 1} is not an object. Use one object or an array containing only objects.`,
          );
        }
        return item;
      })
    : isJsonRecord(parsed)
      ? [parsed]
      : [];

  if (records.length === 0) {
    throw new Error(
      Array.isArray(parsed)
        ? 'The JSON array is empty. Add at least one object before converting.'
        : 'The top-level JSON value must be an object or an array of objects.',
    );
  }

  const flattenedRows = records.map((record) => {
    const row = new Map<string, string>();
    flattenRecord(record, row);
    return row;
  });

  const headers: string[] = [];
  const seenHeaders = new Set<string>();
  for (const row of flattenedRows) {
    for (const header of row.keys()) {
      if (seenHeaders.has(header)) continue;
      seenHeaders.add(header);
      headers.push(header);
    }
  }

  if (headers.length === 0) {
    throw new Error('The JSON object has no fields to convert.');
  }

  let escapedFormulaCells = 0;
  const protect = (value: string) => {
    if (!options.escapeSpreadsheetFormulas) return value;
    const protectedValue = protectSpreadsheetFormula(value);
    if (protectedValue !== value) escapedFormulaCells += 1;
    return protectedValue;
  };

  const protectedHeaders = headers.map(protect);
  const cells = flattenedRows.map((row) =>
    headers.map((header) => protect(row.get(header) ?? '')),
  );
  const lines = [
    protectedHeaders.map((value) => escapeCsvField(value, options.delimiter)).join(options.delimiter),
    ...cells.map((row) =>
      row.map((value) => escapeCsvField(value, options.delimiter)).join(options.delimiter),
    ),
  ];
  const csvBody = lines.join('\r\n');

  return {
    cells,
    columnCount: headers.length,
    csv: `${options.includeBom ? '\uFEFF' : ''}${csvBody}`,
    escapedFormulaCells,
    headers: protectedHeaders,
    rowCount: records.length,
    sourceType,
  };
}
