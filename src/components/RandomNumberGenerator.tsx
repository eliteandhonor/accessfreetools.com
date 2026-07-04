import { useMemo, useState } from 'react';
import { generateRandomNumbers, parseExcludedNumbers } from '../lib/calculator';

interface RandomInputs {
  min: string;
  max: string;
  quantity: string;
  excluded: string;
  allowDuplicates: boolean;
  sortResults: boolean;
}

interface RandomRun {
  label: string;
  numbers: number[];
  settings: string;
}

interface RandomExample {
  label: string;
  inputs: RandomInputs;
}

const defaultInputs: RandomInputs = {
  min: '1',
  max: '100',
  quantity: '1',
  excluded: '',
  allowDuplicates: true,
  sortResults: false,
};

const examples: RandomExample[] = [
  {
    label: 'Pick 1 to 10',
    inputs: {
      min: '1',
      max: '10',
      quantity: '1',
      excluded: '',
      allowDuplicates: true,
      sortResults: false,
    },
  },
  {
    label: 'Five from 1 to 100',
    inputs: {
      min: '1',
      max: '100',
      quantity: '5',
      excluded: '',
      allowDuplicates: true,
      sortResults: false,
    },
  },
  {
    label: 'Unique sorted 1 to 50',
    inputs: {
      min: '1',
      max: '50',
      quantity: '6',
      excluded: '',
      allowDuplicates: false,
      sortResults: true,
    },
  },
  {
    label: 'Skip 7 and 13',
    inputs: {
      min: '1',
      max: '20',
      quantity: '5',
      excluded: '7, 13',
      allowDuplicates: false,
      sortResults: true,
    },
  },
];

function parseWholeNumber(value: string, label: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`${label} is required`);
  }

  const parsed = Number(trimmed);

  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${label} must be a whole number`);
  }

  return parsed;
}

function buildRandomRun(inputs: RandomInputs): RandomRun {
  const min = parseWholeNumber(inputs.min, 'Minimum');
  const max = parseWholeNumber(inputs.max, 'Maximum');
  const quantity = parseWholeNumber(inputs.quantity, 'Quantity');
  const excludedNumbers = parseExcludedNumbers(inputs.excluded);
  const numbers = generateRandomNumbers({
    min,
    max,
    quantity,
    excludedNumbers,
    allowDuplicates: inputs.allowDuplicates,
    sortResults: inputs.sortResults,
  });
  const uniqueLabel = inputs.allowDuplicates ? 'duplicates allowed' : 'unique only';
  const sortLabel = inputs.sortResults ? 'sorted' : 'draw order';
  const excludedLabel = excludedNumbers.length > 0 ? `, excluding ${excludedNumbers.join(', ')}` : '';

  return {
    label: `${quantity} ${quantity === 1 ? 'number' : 'numbers'} from ${min} to ${max}`,
    numbers,
    settings: `${uniqueLabel}, ${sortLabel}${excludedLabel}`,
  };
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="random-field">
      <span>{label}</span>
      <input
        inputMode="numeric"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

export default function RandomNumberGenerator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [run, setRun] = useState<RandomRun | null>(null);
  const [history, setHistory] = useState<RandomRun[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const resultText = useMemo(() => run?.numbers.join(', ') ?? '', [run]);

  const updateInput = <Key extends keyof RandomInputs>(key: Key, value: RandomInputs[Key]) => {
    setInputs((current) => ({ ...current, [key]: value }));
    setCopied(false);
  };

  const generate = (nextInputs = inputs) => {
    try {
      const nextRun = buildRandomRun(nextInputs);
      setRun(nextRun);
      setHistory((items) => [nextRun, ...items].slice(0, 6));
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the random number inputs');
      setCopied(false);
    }
  };

  const loadExample = (example: RandomExample) => {
    setInputs(example.inputs);
    generate(example.inputs);
  };

  const copyResult = async () => {
    if (!navigator.clipboard || !resultText || error) return;
    await navigator.clipboard.writeText(resultText);
    setCopied(true);
  };

  return (
    <section className="random-generator" aria-label="Random number generator">
      <div className="random-panel">
        <div className="random-settings-grid">
          <NumberField label="Minimum" value={inputs.min} onChange={(value) => updateInput('min', value)} />
          <NumberField label="Maximum" value={inputs.max} onChange={(value) => updateInput('max', value)} />
          <NumberField label="Quantity" value={inputs.quantity} onChange={(value) => updateInput('quantity', value)} />
        </div>

        <label className="random-field random-excluded-field">
          <span>Exclude numbers</span>
          <input
            onChange={(event) => updateInput('excluded', event.target.value)}
            placeholder="Example: 7, 13, 24"
            value={inputs.excluded}
          />
        </label>

        <div className="random-toggle-grid">
          <label>
            <input
              checked={!inputs.allowDuplicates}
              onChange={(event) => updateInput('allowDuplicates', !event.target.checked)}
              type="checkbox"
            />
            <span>
              <strong>Unique results</strong>
              <small>No repeated numbers in one list.</small>
            </span>
          </label>
          <label>
            <input
              checked={inputs.sortResults}
              onChange={(event) => updateInput('sortResults', event.target.checked)}
              type="checkbox"
            />
            <span>
              <strong>Sort results</strong>
              <small>Show the final list from low to high.</small>
            </span>
          </label>
        </div>

        <div className="random-actions">
          <button className="button-primary" onClick={() => generate()} type="button">
            Generate numbers
          </button>
          <button className="button-secondary" disabled={!resultText || Boolean(error)} onClick={copyResult} type="button">
            {copied ? 'Copied' : 'Copy results'}
          </button>
        </div>

        <div className="random-result-card" aria-live="polite">
          <span>{error ? 'Check inputs' : run?.label ?? 'Ready to generate'}</span>
          {error ? (
            <strong>{error}</strong>
          ) : run ? (
            <>
              <div className="random-number-list">
                {run.numbers.map((number, index) => (
                  <b key={`${number}-${index}`}>{number}</b>
                ))}
              </div>
              <p>{run.settings}</p>
            </>
          ) : (
            <>
              <strong>Press Generate numbers</strong>
              <p>Choose a range, set quantity, and generate a private in-browser result.</p>
            </>
          )}
        </div>
      </div>

      <section className="random-side-panel" aria-label="Random number examples and history">
        <section>
          <h2>Examples</h2>
          <div className="random-example-list">
            {examples.map((example) => (
              <button key={example.label} onClick={() => loadExample(example)} type="button">
                {example.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Recent results</h2>
          {history.length > 0 ? (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.label}-${index}`}>
                  <span>{item.label}</span>
                  <strong>{item.numbers.join(', ')}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent random results will appear here.</p>
          )}
        </section>

        <section className="random-note">
          <h2>Everyday use note</h2>
          <p>
            Browser randomness is useful for ordinary picks and examples. Do not use this page for
            passwords, gambling, legal drawings, or security-critical decisions.
          </p>
        </section>
      </section>
    </section>
  );
}
