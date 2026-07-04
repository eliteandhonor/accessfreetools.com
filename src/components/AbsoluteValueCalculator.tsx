import { useMemo, useState } from 'react';
import { calculateAbsoluteValue, formatCalculatorNumber, type AbsoluteValueResult } from '../lib/calculator';

interface AbsoluteValueInputs {
  value: string;
  comparisonValue: string;
}

interface AbsoluteValueExample {
  label: string;
  inputs: AbsoluteValueInputs;
}

interface AbsoluteValueCalculation {
  expression: string;
  result: AbsoluteValueResult;
  steps: string[];
}

const defaultInputs: AbsoluteValueInputs = {
  value: '-12.5',
  comparisonValue: '',
};

const examples: AbsoluteValueExample[] = [
  {
    label: 'Negative number',
    inputs: { value: '-12.5', comparisonValue: '' },
  },
  {
    label: 'Already positive',
    inputs: { value: '8', comparisonValue: '' },
  },
  {
    label: 'Absolute difference',
    inputs: { value: '82', comparisonValue: '57' },
  },
  {
    label: 'Temperature change',
    inputs: { value: '-4', comparisonValue: '11' },
  },
];

function parseNumber(value: string, label: string) {
  const parsed = Number(value.trim());

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function buildCalculation(inputs: AbsoluteValueInputs): AbsoluteValueCalculation {
  const value = parseNumber(inputs.value, 'Value');
  const hasComparison = inputs.comparisonValue.trim().length > 0;
  const comparisonValue = hasComparison ? parseNumber(inputs.comparisonValue, 'Comparison value') : undefined;
  const result = calculateAbsoluteValue(value, comparisonValue);
  const valueText = formatCalculatorNumber(value);
  const absoluteText = formatCalculatorNumber(result.absoluteValue);

  if (comparisonValue !== undefined) {
    const comparisonText = formatCalculatorNumber(comparisonValue);
    const signedText = formatCalculatorNumber(result.signedDifference ?? 0);
    const differenceText = formatCalculatorNumber(result.absoluteDifference ?? 0);

    return {
      expression: `|${valueText} - ${comparisonText}|`,
      result,
      steps: [
        `Find the signed difference: ${valueText} - ${comparisonText} = ${signedText}.`,
        `Take the absolute value of the difference: |${signedText}| = ${differenceText}.`,
        `The distance between ${valueText} and ${comparisonText} is ${differenceText}.`,
      ],
    };
  }

  return {
    expression: `|${valueText}|`,
    result,
    steps: [
      `Start with ${valueText}.`,
      value < 0 ? `Remove the negative sign because absolute value measures distance from zero.` : `Keep the value because it is already zero or positive.`,
      `The absolute value is ${absoluteText}.`,
    ],
  };
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="absolute-field">
      <span>{label}</span>
      <input inputMode="decimal" onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} />
    </label>
  );
}

export default function AbsoluteValueCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<AbsoluteValueCalculation>(() => buildCalculation(defaultInputs));
  const [history, setHistory] = useState<AbsoluteValueCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const resultText = useMemo(() => {
    const result = calculation.result.absoluteDifference ?? calculation.result.absoluteValue;

    return formatCalculatorNumber(result);
  }, [calculation]);
  const signedDifferenceText = useMemo(() => {
    if (calculation.result.signedDifference === undefined) return 'n/a';

    return formatCalculatorNumber(calculation.result.signedDifference);
  }, [calculation]);
  const modeText = calculation.result.comparisonValue === undefined ? 'Absolute value' : 'Absolute difference';

  const updateInput = (key: keyof AbsoluteValueInputs, value: string) => {
    setInputs((current) => ({ ...current, [key]: value }));
    setCopied(false);
  };

  const calculate = (nextInputs = inputs) => {
    try {
      const nextCalculation = buildCalculation(nextInputs);
      setCalculation(nextCalculation);
      setHistory((items) => [nextCalculation, ...items].slice(0, 6));
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the absolute value inputs');
      setCopied(false);
    }
  };

  const loadExample = (example: AbsoluteValueExample) => {
    setInputs(example.inputs);
    calculate(example.inputs);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`${calculation.expression} = ${resultText}`);
    setCopied(true);
  };

  return (
    <section className="absolute-calculator" aria-label="Absolute value calculator">
      <div className="absolute-panel">
        <div className="absolute-fields">
          <NumberField label="Value" value={inputs.value} onChange={(value) => updateInput('value', value)} />
          <NumberField
            label="Compare with"
            placeholder="Optional"
            value={inputs.comparisonValue}
            onChange={(value) => updateInput('comparisonValue', value)}
          />
        </div>

        <div className="absolute-quick-grid" aria-label="Quick absolute value examples">
          {examples.map((example) => (
            <button key={example.label} onClick={() => loadExample(example)} type="button">
              {example.label}
            </button>
          ))}
        </div>

        <div className="absolute-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Calculate absolute value
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="absolute-result-card" aria-live="polite">
          <span>{error ? 'Check inputs' : calculation.expression}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{resultText}</strong>
              <dl>
                <div>
                  <dt>Mode</dt>
                  <dd>{modeText}</dd>
                </div>
                <div>
                  <dt>Signed difference</dt>
                  <dd>{signedDifferenceText}</dd>
                </div>
                <div>
                  <dt>Distance meaning</dt>
                  <dd>Never negative</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="absolute-steps">
            <h2>Steps</h2>
            <ol>
              {calculation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <aside className="absolute-side-panel" aria-label="Absolute value examples and history">
        <section>
          <h2>Examples</h2>
          <div className="absolute-quick-grid absolute-example-list">
            {examples.map((example) => (
              <button key={example.label} onClick={() => loadExample(example)} type="button">
                {example.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Recent answers</h2>
          {history.length > 0 ? (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <span>{item.expression}</span>
                  <strong>{formatCalculatorNumber(item.result.absoluteDifference ?? item.result.absoluteValue)}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent absolute value answers will appear here.</p>
          )}
        </section>

        <section className="absolute-note">
          <h2>Input tips</h2>
          <p>Leave Compare with blank for a single absolute value like |−12.5|.</p>
          <p>Enter both boxes when you want the absolute difference or distance between two numbers.</p>
        </section>
      </aside>
    </section>
  );
}
