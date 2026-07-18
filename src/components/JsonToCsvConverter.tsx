import { useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  Clipboard,
  Download,
  FileJson2,
  RotateCcw,
  ShieldCheck,
  Table2,
  Upload,
} from 'lucide-react';
import { emitAftToolAction } from '../lib/aftToolAnalytics';
import {
  convertJsonToCsv,
  getUtf8ByteLength,
  MAX_JSON_TO_CSV_INPUT_BYTES,
  type CsvDelimiter,
  type JsonToCsvResult,
} from '../lib/jsonToCsv';

const sampleJson = `[
  {
    "name": "Ada",
    "profile": {
      "city": "Brisbane",
      "team": "Data"
    },
    "tags": ["browser", "private"],
    "spreadsheet_note": "=2+2"
  },
  {
    "name": "Grace",
    "profile": {
      "city": "Sydney",
      "team": "Platform"
    },
    "tags": ["csv", "json"],
    "spreadsheet_note": "Checked"
  }
]`;

function emitConverterAction(action: string, clarityEvent: string) {
  emitAftToolAction({
    action,
    category: 'developer-tools',
    clarityEvent,
    toolName: 'JSON to CSV Converter',
    toolSlug: 'json-to-csv-converter',
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(bytes < 1024 * 100 ? 1 : 0)} KB`;
}

export default function JsonToCsvConverter() {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState<CsvDelimiter>(',');
  const [escapeFormulas, setEscapeFormulas] = useState(true);
  const [includeBom, setIncludeBom] = useState(false);
  const [result, setResult] = useState<JsonToCsvResult | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const fileInput = useRef<HTMLInputElement | null>(null);

  function resetResult() {
    setResult(null);
    setError('');
    setNotice('');
  }

  function runConversion() {
    try {
      const nextResult = convertJsonToCsv(input, {
        delimiter,
        escapeSpreadsheetFormulas: escapeFormulas,
        includeBom,
      });
      setResult(nextResult);
      setError('');
      setNotice(
        `Converted ${nextResult.rowCount} ${nextResult.rowCount === 1 ? 'row' : 'rows'} into ${nextResult.columnCount} columns.`,
      );
      emitConverterAction('Convert JSON', 'json_to_csv_convert');
    } catch (conversionError) {
      setResult(null);
      setNotice('');
      setError(
        conversionError instanceof Error
          ? conversionError.message
          : 'The JSON could not be converted.',
      );
    }
  }

  async function loadFile(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_JSON_TO_CSV_INPUT_BYTES) {
      setError('That file is larger than the 5 MB browser limit.');
      setNotice('');
      setResult(null);
      return;
    }

    try {
      const text = await file.text();
      setInput(text);
      setResult(null);
      setError('');
      setNotice(`Loaded a ${formatBytes(file.size)} JSON file. Press Convert JSON to continue.`);
      emitConverterAction('Load JSON file', 'json_to_csv_load_file');
    } catch {
      setError('The browser could not read that file. Try pasting the JSON instead.');
      setNotice('');
      setResult(null);
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  async function copyCsv() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.csv);
      setNotice('CSV copied to your clipboard.');
      setError('');
      emitConverterAction('Copy CSV', 'json_to_csv_copy');
    } catch {
      setError('The browser could not copy the CSV. Select the output and copy it manually.');
    }
  }

  function downloadCsv() {
    if (!result) return;
    const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'json-to-csv.csv';
    link.click();
    URL.revokeObjectURL(url);
    setNotice('CSV download started.');
    setError('');
    emitConverterAction('Download CSV', 'json_to_csv_download');
  }

  function loadSample() {
    setInput(sampleJson);
    resetResult();
    setNotice('Sample JSON loaded. Press Convert JSON to see the flattened columns.');
    emitConverterAction('Load sample', 'json_to_csv_sample');
  }

  function clearTool() {
    setInput('');
    resetResult();
  }

  const previewHeaders = result?.headers.slice(0, 12) ?? [];
  const previewRows = result?.cells.slice(0, 20) ?? [];
  const hiddenColumns = result ? Math.max(0, result.columnCount - previewHeaders.length) : 0;
  const hiddenRows = result ? Math.max(0, result.rowCount - previewRows.length) : 0;

  return (
    <section className="json-csv-tool" aria-labelledby="json-csv-heading">
      <div className="json-csv-tool__header">
        <div>
          <p className="json-csv-tool__eyebrow">Private browser converter</p>
          <h2 id="json-csv-heading">JSON input to CSV preview</h2>
          <p>
            Paste one object or an array of objects. Nested objects become dot-notation
            columns, while arrays stay together inside one CSV cell.
          </p>
        </div>
        <span className="json-csv-tool__privacy">
          <ShieldCheck aria-hidden="true" size={19} />
          Input stays in this tab
        </span>
      </div>

      <div className="json-csv-tool__workspace">
        <section className="json-csv-tool__pane" aria-labelledby="json-input-heading">
          <div className="json-csv-tool__pane-title">
            <span><FileJson2 aria-hidden="true" size={20} /></span>
            <div>
              <h3 id="json-input-heading">1. Add JSON</h3>
              <p>{formatBytes(getUtf8ByteLength(input))} of 5 MB</p>
            </div>
          </div>

          <label htmlFor="json-csv-input">JSON object or array of objects</label>
          <textarea
            id="json-csv-input"
            data-clarity-mask="true"
            value={input}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder='[{"name":"Ada","profile":{"city":"Brisbane"}}]'
            onChange={(event) => {
              setInput(event.target.value);
              resetResult();
            }}
          />

          <div className="json-csv-tool__input-actions">
            <label className="json-csv-tool__file-button">
              <Upload aria-hidden="true" size={18} />
              Choose JSON file
              <input
                ref={fileInput}
                className="json-csv-tool__file-input"
                data-clarity-mask="true"
                type="file"
                accept=".json,application/json,text/plain"
                onChange={(event) => void loadFile(event.target.files?.[0])}
              />
            </label>
            <button
              type="button"
              data-aft-analytics-manual="true"
              onClick={loadSample}
            >
              <Check aria-hidden="true" size={18} />
              Load sample
            </button>
            <button
              type="button"
              className="json-csv-tool__icon-button"
              aria-label="Clear JSON and CSV"
              title="Clear JSON and CSV"
              data-aft-analytics-manual="true"
              onClick={clearTool}
            >
              <RotateCcw aria-hidden="true" size={18} />
            </button>
          </div>
        </section>

        <div className="json-csv-tool__bridge" aria-hidden="true">
          <ArrowRight size={24} />
        </div>

        <section className="json-csv-tool__pane" aria-labelledby="csv-settings-heading">
          <div className="json-csv-tool__pane-title">
            <span><Table2 aria-hidden="true" size={20} /></span>
            <div>
              <h3 id="csv-settings-heading">2. Choose CSV settings</h3>
              <p>Safe defaults for spreadsheet exports</p>
            </div>
          </div>

          <label htmlFor="json-csv-delimiter">Column delimiter</label>
          <select
            id="json-csv-delimiter"
            value={delimiter}
            onChange={(event) => {
              setDelimiter(event.target.value as CsvDelimiter);
              resetResult();
            }}
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value={'\t'}>Tab</option>
          </select>

          <fieldset className="json-csv-tool__checks">
            <legend>Export safety</legend>
            <label>
              <input
                type="checkbox"
                checked={escapeFormulas}
                onChange={(event) => {
                  setEscapeFormulas(event.target.checked);
                  resetResult();
                }}
              />
              <span>
                <strong>Escape spreadsheet formulas</strong>
                <small>Prefixes cells starting with =, +, -, or @ with an apostrophe.</small>
              </span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={includeBom}
                onChange={(event) => {
                  setIncludeBom(event.target.checked);
                  resetResult();
                }}
              />
              <span>
                <strong>Add UTF-8 BOM</strong>
                <small>Can help some spreadsheet apps recognise non-English characters.</small>
              </span>
            </label>
          </fieldset>

          {!escapeFormulas && (
            <p className="json-csv-tool__warning" role="note">
              Formula escaping is off. Review untrusted cells before opening the CSV in a spreadsheet.
            </p>
          )}

          <button
            type="button"
            className="json-csv-tool__convert"
            data-aft-analytics-manual="true"
            onClick={runConversion}
          >
            Convert JSON
            <ArrowRight aria-hidden="true" size={19} />
          </button>
        </section>
      </div>

      <div className="json-csv-tool__messages" aria-live="polite">
        {error && <p className="json-csv-tool__error" role="alert">{error}</p>}
        {!error && notice && <p className="json-csv-tool__notice">{notice}</p>}
      </div>

      {result && (
        <section className="json-csv-tool__result" aria-labelledby="csv-preview-heading">
          <div className="json-csv-tool__result-heading">
            <div>
              <p className="json-csv-tool__eyebrow">Conversion ready</p>
              <h3 id="csv-preview-heading">CSV preview</h3>
            </div>
            <dl>
              <div><dt>Rows</dt><dd>{result.rowCount}</dd></div>
              <div><dt>Columns</dt><dd>{result.columnCount}</dd></div>
              <div><dt>Protected cells</dt><dd>{result.escapedFormulaCells}</dd></div>
            </dl>
          </div>

          <div
            className="json-csv-tool__table-wrap"
            data-clarity-mask="true"
            tabIndex={0}
            aria-label="Scrollable CSV preview"
          >
            <table>
              <caption className="sr-only">
                Preview of the first 20 rows and 12 columns in the converted CSV
              </caption>
              <thead>
                <tr>{previewHeaders.map((header) => <th key={header}>{header}</th>)}</tr>
              </thead>
              <tbody>
                {previewRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.slice(0, previewHeaders.length).map((cell, columnIndex) => (
                      <td key={`${rowIndex}-${columnIndex}`}>{cell || <span aria-label="Empty cell">-</span>}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(hiddenRows > 0 || hiddenColumns > 0) && (
            <p className="json-csv-tool__preview-limit">
              Preview capped at 20 rows and 12 columns.
              {hiddenRows > 0 ? ` ${hiddenRows} more rows are in the CSV.` : ''}
              {hiddenColumns > 0 ? ` ${hiddenColumns} more columns are in the CSV.` : ''}
            </p>
          )}

          <label htmlFor="json-csv-output">Copy-ready CSV</label>
          <textarea
            id="json-csv-output"
            data-clarity-mask="true"
            value={result.csv}
            readOnly
            spellCheck={false}
          />

          <div className="json-csv-tool__result-actions">
            <button
              type="button"
              data-aft-analytics-manual="true"
              onClick={() => void copyCsv()}
            >
              <Clipboard aria-hidden="true" size={18} />
              Copy CSV
            </button>
            <button
              type="button"
              className="primary"
              data-aft-analytics-manual="true"
              onClick={downloadCsv}
            >
              <Download aria-hidden="true" size={18} />
              Download CSV
            </button>
          </div>
        </section>
      )}
    </section>
  );
}
