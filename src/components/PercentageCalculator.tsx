import { useId, useMemo, useRef, useState } from 'react';
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

class PercentageInputError extends Error {
  constructor(readonly field: keyof PercentageInputs, message: string) {
    super(message);
  }
}

function parseNumber(value: string, label: string, field: keyof PercentageInputs) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new PercentageInputError(field, `${label} is required.`);
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    throw new PercentageInputError(field, `${label} must be a finite number.`);
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
    const percent = parseNumber(inputs.percent, 'Percentage', 'percent');
    const value = parseNumber(inputs.value, 'Of value', 'value');
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
    const part = parseNumber(inputs.part, 'Part', 'part');
    const whole = parseNumber(inputs.whole, 'Whole', 'whole');
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
    const originalValue = parseNumber(inputs.originalValue, 'Original value', 'originalValue');
    const newValue = parseNumber(inputs.newValue, 'New value', 'newValue');
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
    const baseValue = parseNumber(inputs.baseValue, 'Base value', 'baseValue');
    const percent = parseNumber(inputs.adjustPercent, 'Percentage', 'adjustPercent');
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

  const value = parseNumber(inputs.reverseValue, reverseType === 'part-of-whole' ? 'Known part' : 'Final value', 'reverseValue');
  const percentLabel = reverseType === 'after-increase'
    ? 'Increase percentage'
    : reverseType === 'after-decrease' ? 'Decrease percentage' : 'Percentage of whole';
  const percent = parseNumber(inputs.reversePercent, percentLabel, 'reversePercent');

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
  id,
  label,
  value,
  onChange,
  invalid,
  errorId,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  errorId: string;
}) {
  return (
    <label className="percentage-field">
      <span>{label}</span>
      <input
        id={id}
        aria-describedby={invalid ? errorId : undefined}
        aria-invalid={invalid || undefined}
        inputMode="decimal"
        onChange={(event) => onChange(event.target.value)}
        required
        value={value}
      />
    </label>
  );
}

export default function PercentageCalculator() {
  const id = useId();
  const questionId = `${id}-question`;
  const errorId = `${id}-error`;
  const [mode, setMode] = useState<PercentageMode>('of');
  const [direction, setDirection] = useState<PercentageAdjustmentDirection>('increase');
  const [reverseType, setReverseType] = useState<ReversePercentageType>('part-of-whole');
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<PercentageCalculation>(() =>
    buildPercentageCalculation('of', defaultInputs, 'increase', 'part-of-whole'),
  );
  const [history, setHistory] = useState<PercentageCalculation[]>([]);
  const [error, setError] = useState('');
  const [invalidField, setInvalidField] = useState<keyof PercentageInputs | null>(null);
  const [copied, setCopied] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [manualCopyAvailable, setManualCopyAvailable] = useState(false);
  const answerElement = useRef<HTMLElement>(null);
  const answerVersion = useRef(0);

  const activeMode = useMemo(() => modeLabels[mode], [mode]);

  const resetCopyFeedback = () => {
    answerVersion.current += 1;
    setCopied(false);
    setCopyFeedback('');
    setManualCopyAvailable(false);
  };

  const invalidateAnswer = () => {
    setIsStale(true);
    resetCopyFeedback();
  };

  const updateInput = (key: keyof PercentageInputs, value: string) => {
    setInputs((current) => ({ ...current, [key]: value }));
    invalidateAnswer();
  };

  const numberField = (key: keyof PercentageInputs, label: string) => (
    <NumberField
      id={`${id}-${key}`}
      label={label}
      value={inputs[key]}
      onChange={(value) => updateInput(key, value)}
      invalid={invalidField === key}
      errorId={errorId}
    />
  );

  const calculate = () => {
    resetCopyFeedback();
    try {
      const nextCalculation = buildPercentageCalculation(mode, inputs, direction, reverseType);
      setCalculation(nextCalculation);
      setHistory((items) => [nextCalculation, ...items].slice(0, 6));
      setError('');
      setInvalidField(null);
      setIsStale(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the percentage inputs');
      setInvalidField(caughtError instanceof PercentageInputError ? caughtError.field : null);
      setIsStale(true);
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
    setInvalidField(null);
    setIsStale(false);
    resetCopyFeedback();
  };

  const copyAnswer = async () => {
    if (error || isStale) return;
    const copyingVersion = answerVersion.current;
    setCopied(false);
    setCopyFeedback('');
    setManualCopyAvailable(false);
    try {
      if (!navigator.clipboard?.writeText) {
        setCopyFeedback("Copy is not available in this browser. Select the answer, then use your device's Copy command.");
        setManualCopyAvailable(true);
        return;
      }
      await navigator.clipboard.writeText(calculation.result);
      if (copyingVersion !== answerVersion.current) return;
      setCopied(true);
      setCopyFeedback('Answer copied.');
    } catch {
      if (copyingVersion !== answerVersion.current) return;
      setCopyFeedback("Copy was blocked. Select the answer, then use your device's Copy command.");
      setManualCopyAvailable(true);
    }
  };

  const selectAnswer = () => {
    if (error || isStale || !answerElement.current) return;
    const selection = window.getSelection();
    if (!selection) return;
    answerElement.current.focus();
    const range = document.createRange();
    range.selectNodeContents(answerElement.current);
    selection.removeAllRanges();
    selection.addRange(range);
    setCopyFeedback("Answer selected. Use your device's Copy command.");
  };

  const changeDirection = (nextDirection: PercentageAdjustmentDirection) => {
    if (nextDirection === direction) return;
    setDirection(nextDirection);
    setError('');
    setInvalidField(null);
    invalidateAnswer();
  };

  const changeReverseType = (nextType: ReversePercentageType) => {
    if (nextType !== reverseType) invalidateAnswer();
    setReverseType(nextType);
    setError('');
    setInvalidField(null);
  };

  return (
    <section className="percentage-calculator" aria-label="Percentage calculator">
      <div className="percentage-panel">
        <div className="percentage-mode-grid" role="group" aria-label="Percentage calculation type">
          {(Object.keys(modeLabels) as PercentageMode[]).map((item) => (
            <button
              aria-pressed={mode === item}
              key={item}
              onClick={() => {
                if (item !== mode) invalidateAnswer();
                setMode(item);
                setError('');
                setInvalidField(null);
              }}
              type="button"
            >
              <strong>{modeLabels[item].label}</strong>
              <span>{modeLabels[item].description}</span>
            </button>
          ))}
        </div>

        <div className="percentage-input-card" role="group" aria-labelledby={questionId} aria-describedby={error ? errorId : undefined}>
          <div>
            <h2 id={questionId}>{activeMode.label}</h2>
            <p>{activeMode.description}</p>
          </div>

          <div className="percentage-fields">
            {mode === 'of' && (
              <>
                {numberField('percent', 'Percentage')}
                {numberField('value', 'Of value')}
              </>
            )}

            {mode === 'part' && (
              <>
                {numberField('part', 'Part')}
                {numberField('whole', 'Whole')}
              </>
            )}

            {mode === 'change' && (
              <>
                {numberField('originalValue', 'Original value')}
                {numberField('newValue', 'New value')}
              </>
            )}

            {mode === 'adjust' && (
              <>
                {numberField('baseValue', 'Base value')}
                {numberField('adjustPercent', 'Percentage')}
                <div className="percentage-direction-toggle" role="group" aria-label="Adjustment direction">
                  <button
                    aria-pressed={direction === 'increase'}
                    onClick={() => changeDirection('increase')}
                    type="button"
                  >
                    Increase
                  </button>
                  <button
                    aria-pressed={direction === 'decrease'}
                    onClick={() => changeDirection('decrease')}
                    type="button"
                  >
                    Decrease
                  </button>
                </div>
              </>
            )}

            {mode === 'reverse' && (
              <>
                <div className="percentage-reverse-type" role="group" aria-label="Reverse percentage question type">
                  <button
                    aria-pressed={reverseType === 'part-of-whole'}
                    onClick={() => changeReverseType('part-of-whole')}
                    type="button"
                  >
                    Part is % of whole
                  </button>
                  <button
                    aria-pressed={reverseType === 'after-increase'}
                    onClick={() => changeReverseType('after-increase')}
                    type="button"
                  >
                    After increase
                  </button>
                  <button
                    aria-pressed={reverseType === 'after-decrease'}
                    onClick={() => changeReverseType('after-decrease')}
                    type="button"
                  >
                    After decrease
                  </button>
                </div>
                {numberField('reverseValue', reverseType === 'part-of-whole' ? 'Known part' : 'Final value')}
                {numberField('reversePercent',
                    reverseType === 'after-increase'
                      ? 'Increase percentage'
                      : reverseType === 'after-decrease'
                        ? 'Decrease percentage'
                        : 'Percentage of whole'
                )}
              </>
            )}
          </div>

          <div className="percentage-actions">
            <button className="button-primary" onClick={calculate} type="button">
              Calculate percentage
            </button>
            <button className="button-secondary" onClick={copyAnswer} type="button" disabled={Boolean(error) || isStale}>
              {copied ? 'Copied' : 'Copy answer'}
            </button>
            {manualCopyAvailable && !error && !isStale && (
              <button className="button-secondary" onClick={selectAnswer} type="button">Select answer</button>
            )}
          </div>
          <p className={copyFeedback ? undefined : 'sr-only'} role="status">{copyFeedback}</p>
        </div>

        <div className="percentage-result-card" aria-live={error ? undefined : 'polite'}>
          <span>{error ? 'Check inputs' : isStale ? 'Inputs changed' : calculation.label}</span>
          <strong ref={answerElement} tabIndex={!error && !isStale ? -1 : undefined} id={error ? errorId : undefined} role={error ? 'alert' : undefined}>
            {error || (isStale ? 'Calculate to update the answer.' : calculation.result)}
          </strong>
          {!error && !isStale && <p>{calculation.supporting}</p>}
        </div>

        {!error && !isStale && (
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
