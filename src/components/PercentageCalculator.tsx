import { useMemo, useState } from 'react';
import {
  applyPercentageAdjustment,
  calculatePercentageChange,
  calculatePercentageOf,
  calculatePercentOf,
  formatCalculatorNumber,
  reversePercentageAdjustment,
  reversePercentageValue,
  type PercentageAdjustmentDirection,
} from '../lib/calculator';

type PercentageMode = 'of' | 'part' | 'change' | 'adjust' | 'reverse';
type ReversePercentageType = 'part-of-whole' | 'after-increase' | 'after-decrease';

interface PercentageInputs {
  percent: string;
  value: string;
  part: string;
  whole: string;
  originalValue: string;
  newValue: string;
  baseValue: string;
  adjustPercent: string;
  reverseValue: string;
  reversePercent: string;
}

interface PercentageCalculation {
  label: string;
  result: string;
  supporting: string;
  steps: string[];
}

interface PercentageExample {
  label: string;
  mode: PercentageMode;
  direction?: PercentageAdjustmentDirection;
  reverseType?: ReversePercentageType;
  inputs: Partial<PercentageInputs>;
}

const defaultInputs: PercentageInputs = {
  percent: '20',
  value: '80',
  part: '25',
  whole: '200',
  originalValue: '160',
  newValue: '116',
  baseValue: '120',
  adjustPercent: '25',
  reverseValue: '30',
  reversePercent: '15',
};

const modeLabels: Record<PercentageMode, { label: string; description: string }> = {
  of: {
    label: 'Percent of a number',
    description: 'Find answers like 20% of 80.',
  },
  part: {
    label: 'What percent?',
    description: 'Find answers like 25 is what percent of 200.',
  },
  change: {
    label: 'Percentage change',
    description: 'Find increase or decrease from one value to another.',
  },
  adjust: {
    label: 'Add or subtract percent',
    description: 'Increase or decrease a number by a percentage.',
  },
  reverse: {
    label: 'Reverse percent',
    description: 'Find a whole, or the value before an increase or decrease.',
  },
};

const examples: PercentageExample[] = [
  {
    label: '20% of 80',
    mode: 'of',
    inputs: { percent: '20', value: '80' },
  },
  {
    label: '25 is what % of 200?',
    mode: 'part',
    inputs: { part: '25', whole: '200' },
  },
  {
    label: '160 to 116',
    mode: 'change',
    inputs: { originalValue: '160', newValue: '116' },
  },
  {
    label: '120 plus 25%',
    mode: 'adjust',
    direction: 'increase',
    inputs: { baseValue: '120', adjustPercent: '25' },
  },
  {
    label: '30 is 15% of what?',
    mode: 'reverse',
    reverseType: 'part-of-whole',
    inputs: { reverseValue: '30', reversePercent: '15' },
  },
  {
    label: '120 after 20% increase',
    mode: 'reverse',
    reverseType: 'after-increase',
    inputs: { reverseValue: '120', reversePercent: '20' },
  },
  {
    label: '80 after 20% decrease',
    mode: 'reverse',
    reverseType: 'after-decrease',
    inputs: { reverseValue: '80', reversePercent: '20' },
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

function getChangeLabel(value: number) {
  if (value > 0) return 'increase';
  if (value < 0) return 'decrease';
  return 'no change';
}

function buildPercentageCalculation(
  mode: PercentageMode,
  inputs: PercentageInputs,
  direction: PercentageAdjustmentDirection,
  reverseType: ReversePercentageType,
): PercentageCalculation {
  if (mode === 'of') {
    const percent = parseNumber(inputs.percent, 'Percentage');
    const value = parseNumber(inputs.value, 'Value');
    const result = calculatePercentageOf(percent, value);

    return {
      label: `${formatPercent(percent)} of ${formatCalculatorNumber(value)}`,
      result: formatCalculatorNumber(result),
      supporting: `${formatCalculatorNumber(value)} x ${formatCalculatorNumber(percent)} / 100`,
      steps: [
        `Turn ${formatPercent(percent)} into ${formatCalculatorNumber(percent / 100)}.`,
        `Multiply ${formatCalculatorNumber(value)} by ${formatCalculatorNumber(percent / 100)}.`,
        `The answer is ${formatCalculatorNumber(result)}.`,
      ],
    };
  }

  if (mode === 'part') {
    const part = parseNumber(inputs.part, 'Part');
    const whole = parseNumber(inputs.whole, 'Whole');
    const result = calculatePercentOf(part, whole);

    return {
      label: `${formatCalculatorNumber(part)} is what percent of ${formatCalculatorNumber(whole)}`,
      result: formatPercent(result),
      supporting: `${formatCalculatorNumber(part)} / ${formatCalculatorNumber(whole)} x 100`,
      steps: [
        `Divide the part by the whole: ${formatCalculatorNumber(part)} / ${formatCalculatorNumber(whole)}.`,
        'Multiply the result by 100.',
        `The answer is ${formatPercent(result)}.`,
      ],
    };
  }

  if (mode === 'change') {
    const originalValue = parseNumber(inputs.originalValue, 'Original value');
    const newValue = parseNumber(inputs.newValue, 'New value');
    const result = calculatePercentageChange(originalValue, newValue);
    const change = newValue - originalValue;
    const changeLabel = getChangeLabel(result);

    return {
      label: `${formatCalculatorNumber(originalValue)} to ${formatCalculatorNumber(newValue)}`,
      result: changeLabel === 'no change' ? '0%' : `${formatPercent(Math.abs(result))} ${changeLabel}`,
      supporting: `${formatCalculatorNumber(change)} / ${formatCalculatorNumber(Math.abs(originalValue))} x 100`,
      steps: [
        `Find the change: ${formatCalculatorNumber(newValue)} - ${formatCalculatorNumber(originalValue)} = ${formatCalculatorNumber(change)}.`,
        `Divide by the original value: ${formatCalculatorNumber(change)} / ${formatCalculatorNumber(Math.abs(originalValue))}.`,
        `Convert to a percentage: ${formatPercent(result)}.`,
      ],
    };
  }

  if (mode === 'adjust') {
    const baseValue = parseNumber(inputs.baseValue, 'Base value');
    const percent = parseNumber(inputs.adjustPercent, 'Percentage');
    const result = applyPercentageAdjustment(baseValue, percent, direction);
    const amount = calculatePercentageOf(percent, baseValue);
    const operator = direction === 'increase' ? '+' : '-';

    return {
      label: `${direction === 'increase' ? 'Increase' : 'Decrease'} ${formatCalculatorNumber(baseValue)} by ${formatPercent(percent)}`,
      result: formatCalculatorNumber(result),
      supporting: `${formatCalculatorNumber(baseValue)} ${operator} ${formatCalculatorNumber(amount)}`,
      steps: [
        `Find ${formatPercent(percent)} of ${formatCalculatorNumber(baseValue)}: ${formatCalculatorNumber(amount)}.`,
        `${direction === 'increase' ? 'Add' : 'Subtract'} that amount from the base value.`,
        `The final value is ${formatCalculatorNumber(result)}.`,
      ],
    };
  }

  const value = parseNumber(inputs.reverseValue, reverseType === 'part-of-whole' ? 'Known part' : 'Final value');
  const percent = parseNumber(inputs.reversePercent, 'Percentage');

  if (reverseType === 'part-of-whole') {
    const result = reversePercentageValue(value, percent);

    return {
      label: `${formatCalculatorNumber(value)} is ${formatPercent(percent)} of what`,
      result: formatCalculatorNumber(result),
      supporting: `${formatCalculatorNumber(value)} / ${formatCalculatorNumber(percent / 100)}`,
      steps: [
        `Turn ${formatPercent(percent)} into ${formatCalculatorNumber(percent / 100)}.`,
        `Divide ${formatCalculatorNumber(value)} by ${formatCalculatorNumber(percent / 100)}.`,
        `The original whole is ${formatCalculatorNumber(result)}.`,
      ],
    };
  }

  const reverseDirection = reverseType === 'after-increase' ? 'increase' : 'decrease';
  const result = reversePercentageAdjustment(value, percent, reverseDirection);
  const finalPercent = reverseDirection === 'increase' ? 100 + percent : 100 - percent;
  const multiplier = finalPercent / 100;
  const directionLabel = reverseDirection === 'increase' ? 'increase' : 'decrease';

  return {
    label: `${formatCalculatorNumber(value)} after a ${formatPercent(percent)} ${directionLabel}`,
    result: formatCalculatorNumber(result),
    supporting: `${formatCalculatorNumber(value)} / ${formatCalculatorNumber(multiplier)}`,
    steps: [
      `After a ${formatPercent(percent)} ${directionLabel}, the final value is ${formatPercent(finalPercent)} of the original.`,
      `Turn ${formatPercent(finalPercent)} into the multiplier ${formatCalculatorNumber(multiplier)}.`,
      `Divide the final value by the multiplier: ${formatCalculatorNumber(value)} / ${formatCalculatorNumber(multiplier)} = ${formatCalculatorNumber(result)}.`,
      `The value before the ${directionLabel} was ${formatCalculatorNumber(result)}.`,
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
    <label className="percentage-field">
      <span>{label}</span>
      <input
        inputMode="decimal"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

export default function PercentageCalculator() {
  const [mode, setMode] = useState<PercentageMode>('of');
  const [direction, setDirection] = useState<PercentageAdjustmentDirection>('increase');
  const [reverseType, setReverseType] = useState<ReversePercentageType>('part-of-whole');
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<PercentageCalculation>(() =>
    buildPercentageCalculation('of', defaultInputs, 'increase', 'part-of-whole'),
  );
  const [history, setHistory] = useState<PercentageCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const activeMode = useMemo(() => modeLabels[mode], [mode]);

  const updateInput = (key: keyof PercentageInputs, value: string) => {
    setInputs((current) => ({ ...current, [key]: value }));
    setCopied(false);
  };

  const calculate = () => {
    try {
      const nextCalculation = buildPercentageCalculation(mode, inputs, direction, reverseType);
      setCalculation(nextCalculation);
      setHistory((items) => [nextCalculation, ...items].slice(0, 6));
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the percentage inputs');
      setCopied(false);
    }
  };

  const loadExample = (example: PercentageExample) => {
    const nextInputs = { ...inputs, ...example.inputs };
    const nextDirection = example.direction ?? direction;
    const nextReverseType = example.reverseType ?? reverseType;
    const nextCalculation = buildPercentageCalculation(example.mode, nextInputs, nextDirection, nextReverseType);

    setMode(example.mode);
    setInputs(nextInputs);
    setDirection(nextDirection);
    setReverseType(nextReverseType);
    setCalculation(nextCalculation);
    setHistory((items) => [nextCalculation, ...items].slice(0, 6));
    setError('');
    setCopied(false);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(calculation.result);
    setCopied(true);
  };

  return (
    <section className="percentage-calculator" aria-label="Percentage calculator">
      <div className="percentage-panel">
        <div className="percentage-mode-grid" aria-label="Percentage calculation type">
          {(Object.keys(modeLabels) as PercentageMode[]).map((item) => (
            <button
              aria-pressed={mode === item}
              key={item}
              onClick={() => {
                setMode(item);
                setError('');
                setCopied(false);
              }}
              type="button"
            >
              <strong>{modeLabels[item].label}</strong>
              <span>{modeLabels[item].description}</span>
            </button>
          ))}
        </div>

        <div className="percentage-input-card">
          <div>
            <h2>{activeMode.label}</h2>
            <p>{activeMode.description}</p>
          </div>

          <div className="percentage-fields">
            {mode === 'of' && (
              <>
                <NumberField label="Percentage" value={inputs.percent} onChange={(value) => updateInput('percent', value)} />
                <NumberField label="Of value" value={inputs.value} onChange={(value) => updateInput('value', value)} />
              </>
            )}

            {mode === 'part' && (
              <>
                <NumberField label="Part" value={inputs.part} onChange={(value) => updateInput('part', value)} />
                <NumberField label="Whole" value={inputs.whole} onChange={(value) => updateInput('whole', value)} />
              </>
            )}

            {mode === 'change' && (
              <>
                <NumberField
                  label="Original value"
                  value={inputs.originalValue}
                  onChange={(value) => updateInput('originalValue', value)}
                />
                <NumberField label="New value" value={inputs.newValue} onChange={(value) => updateInput('newValue', value)} />
              </>
            )}

            {mode === 'adjust' && (
              <>
                <NumberField label="Base value" value={inputs.baseValue} onChange={(value) => updateInput('baseValue', value)} />
                <NumberField
                  label="Percentage"
                  value={inputs.adjustPercent}
                  onChange={(value) => updateInput('adjustPercent', value)}
                />
                <div className="percentage-direction-toggle" aria-label="Adjustment direction">
                  <button
                    aria-pressed={direction === 'increase'}
                    onClick={() => setDirection('increase')}
                    type="button"
                  >
                    Increase
                  </button>
                  <button
                    aria-pressed={direction === 'decrease'}
                    onClick={() => setDirection('decrease')}
                    type="button"
                  >
                    Decrease
                  </button>
                </div>
              </>
            )}

            {mode === 'reverse' && (
              <>
                <div className="percentage-reverse-type" aria-label="Reverse percentage question type">
                  <button
                    aria-pressed={reverseType === 'part-of-whole'}
                    onClick={() => {
                      setReverseType('part-of-whole');
                      setError('');
                      setCopied(false);
                    }}
                    type="button"
                  >
                    Part is % of whole
                  </button>
                  <button
                    aria-pressed={reverseType === 'after-increase'}
                    onClick={() => {
                      setReverseType('after-increase');
                      setError('');
                      setCopied(false);
                    }}
                    type="button"
                  >
                    After increase
                  </button>
                  <button
                    aria-pressed={reverseType === 'after-decrease'}
                    onClick={() => {
                      setReverseType('after-decrease');
                      setError('');
                      setCopied(false);
                    }}
                    type="button"
                  >
                    After decrease
                  </button>
                </div>
                <NumberField
                  label={reverseType === 'part-of-whole' ? 'Known part' : 'Final value'}
                  value={inputs.reverseValue}
                  onChange={(value) => updateInput('reverseValue', value)}
                />
                <NumberField
                  label={
                    reverseType === 'after-increase'
                      ? 'Increase percentage'
                      : reverseType === 'after-decrease'
                        ? 'Decrease percentage'
                        : 'Percentage of whole'
                  }
                  value={inputs.reversePercent}
                  onChange={(value) => updateInput('reversePercent', value)}
                />
              </>
            )}
          </div>

          <div className="percentage-actions">
            <button className="button-primary" onClick={calculate} type="button">
              Calculate percentage
            </button>
            <button className="button-secondary" onClick={copyAnswer} type="button" disabled={Boolean(error)}>
              {copied ? 'Copied' : 'Copy answer'}
            </button>
          </div>
        </div>

        <div className="percentage-result-card" aria-live="polite">
          <span>{error ? 'Check inputs' : calculation.label}</span>
          <strong>{error || calculation.result}</strong>
          {!error && <p>{calculation.supporting}</p>}
        </div>

        {!error && (
          <div className="percentage-steps">
            <h2>Steps</h2>
            <ol>
              {calculation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <section className="percentage-side-panel" aria-label="Percentage examples and history">
        <section>
          <h2>Examples</h2>
          <div className="percentage-example-list">
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
                  <strong>{item.result}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent percentage answers will appear here.</p>
          )}
        </section>
      </section>
    </section>
  );
}
