import { useMemo, useState } from 'react';
import { calculatePercentError, formatCalculatorNumber, type PercentErrorResult } from '../lib/calculator';

interface PercentErrorInputs {
  measuredValue: string;
  acceptedValue: string;
  unit: string;
}

interface PercentErrorCalculation {
  label: string;
  result: PercentErrorResult;
  unit: string;
  steps: string[];
}

interface PercentErrorExample {
  label: string;
  inputs: PercentErrorInputs;
}

const defaultInputs: PercentErrorInputs = {
  measuredValue: '2.45',
  acceptedValue: '2.70',
  unit: 'g/cm3',
};

const examples: PercentErrorExample[] = [
  {
    label: 'Density lab',
    inputs: { measuredValue: '2.45', acceptedValue: '2.70', unit: 'g/cm3' },
  },
  {
    label: 'Length measurement',
    inputs: { measuredValue: '48', acceptedValue: '50', unit: 'cm' },
  },
  {
    label: 'Thermometer check',
    inputs: { measuredValue: '99.1', acceptedValue: '100', unit: 'C' },
  },
  {
    label: 'High reading',
    inputs: { measuredValue: '105', acceptedValue: '100', unit: 'mL' },
  },
];

function parseNumber(value: string, label: string) {
  const parsed = Number(value.trim());

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function formatPercent(value: number) {
  return `${formatCalculatorNumber(value)}%`;
}

function formatSignedPercent(value: number) {
  const formatted = formatPercent(value);
  return value > 0 ? `+${formatted}` : formatted;
}

function unitSuffix(unit: string) {
  return unit ? ` ${unit}` : '';
}

function buildCalculation(inputs: PercentErrorInputs): PercentErrorCalculation {
  const measuredValue = parseNumber(inputs.measuredValue, 'Measured value');
  const acceptedValue = parseNumber(inputs.acceptedValue, 'Accepted value');
  const unit = inputs.unit.trim();
  const result = calculatePercentError(measuredValue, acceptedValue);
  const suffix = unitSuffix(unit);

  return {
    label: `${formatCalculatorNumber(measuredValue)}${suffix} measured vs ${formatCalculatorNumber(acceptedValue)}${suffix} accepted`,
    result,
    unit,
    steps: [
      `Find the error: ${formatCalculatorNumber(measuredValue)} - ${formatCalculatorNumber(acceptedValue)} = ${formatCalculatorNumber(result.error)}${suffix}.`,
      `Use the absolute error: |${formatCalculatorNumber(result.error)}| = ${formatCalculatorNumber(result.absoluteError)}${suffix}.`,
      `Divide by the accepted value size: ${formatCalculatorNumber(result.absoluteError)} / ${formatCalculatorNumber(Math.abs(acceptedValue))} = ${formatCalculatorNumber(result.relativeError)}.`,
      `Multiply by 100 to get ${formatPercent(result.percentError)}.`,
    ],
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
    <label className="percent-error-field">
      <span>{label}</span>
      <input
        inputMode="decimal"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

export default function PercentErrorCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<PercentErrorCalculation>(() => buildCalculation(defaultInputs));
  const [history, setHistory] = useState<PercentErrorCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const resultText = useMemo(() => formatPercent(calculation.result.percentError), [calculation]);
  const signedText = useMemo(() => formatSignedPercent(calculation.result.signedPercentError), [calculation]);
  const directionText = useMemo(() => {
    if (calculation.result.signedPercentError > 0) return 'Measured value is higher than accepted value.';
    if (calculation.result.signedPercentError < 0) return 'Measured value is lower than accepted value.';
    return 'Measured value matches the accepted value.';
  }, [calculation]);

  const updateInput = (key: keyof PercentErrorInputs, value: string) => {
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
      setError(caughtError instanceof Error ? caughtError.message : 'Check the percent error inputs');
      setCopied(false);
    }
  };

  const loadExample = (example: PercentErrorExample) => {
    setInputs(example.inputs);
    calculate(example.inputs);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(
      `Percent error: ${resultText}; signed percent error: ${signedText}; absolute error: ${formatCalculatorNumber(calculation.result.absoluteError)}${unitSuffix(calculation.unit)}`,
    );
    setCopied(true);
  };

  return (
    <section className="percent-error-calculator" aria-label="Percent error calculator">
      <div className="percent-error-panel">
        <div className="percent-error-fields">
          <NumberField
            label="Measured or experimental value"
            value={inputs.measuredValue}
            onChange={(value) => updateInput('measuredValue', value)}
          />
          <NumberField
            label="Accepted or true value"
            value={inputs.acceptedValue}
            onChange={(value) => updateInput('acceptedValue', value)}
          />
          <label className="percent-error-field">
            <span>Unit label</span>
            <input
              onChange={(event) => updateInput('unit', event.target.value)}
              placeholder="Optional"
              value={inputs.unit}
            />
          </label>
        </div>

        <div className="percent-error-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Calculate percent error
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="percent-error-result-card" aria-live="polite">
          <span>{error ? 'Check inputs' : calculation.label}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{resultText}</strong>
              <p>{directionText}</p>
              <dl>
                <div>
                  <dt>Absolute error</dt>
                  <dd>
                    {formatCalculatorNumber(calculation.result.absoluteError)}
                    {unitSuffix(calculation.unit)}
                  </dd>
                </div>
                <div>
                  <dt>Signed percent error</dt>
                  <dd>{signedText}</dd>
                </div>
                <div>
                  <dt>Relative error</dt>
                  <dd>{formatCalculatorNumber(calculation.result.relativeError)}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="percent-error-steps">
            <h2>Steps</h2>
            <ol>
              {calculation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <aside className="percent-error-side-panel" aria-label="Percent error examples and history">
        <section>
          <h2>Examples</h2>
          <div className="percent-error-example-list">
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
                <li key={`${item.label}-${index}`}>
                  <span>{item.label}</span>
                  <strong>{formatPercent(item.result.percentError)}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent percent error answers will appear here.</p>
          )}
        </section>
      </aside>
    </section>
  );
}
