import { useMemo, useState } from 'react';
import {
  calculateBigIntegerOperation,
  formatBigInteger,
  parseBigInteger,
  type BigIntegerOperationResult,
  type CalculatorOperator,
} from '../lib/calculator';

interface BigNumberInputs {
  left: string;
  operator: CalculatorOperator;
  right: string;
}

interface BigNumberCalculation {
  expression: string;
  result: BigIntegerOperationResult;
  answer: string;
  steps: string[];
}

interface BigNumberExample {
  label: string;
  inputs: BigNumberInputs;
}

const defaultInputs: BigNumberInputs = {
  left: '9007199254740993',
  operator: '+',
  right: '7',
};

const examples: BigNumberExample[] = [
  {
    label: 'Beyond safe integer',
    inputs: { left: '9007199254740993', operator: '+', right: '7' },
  },
  {
    label: 'Large multiply',
    inputs: { left: '12345678901234567890', operator: '*', right: '10' },
  },
  {
    label: 'Divide with remainder',
    inputs: { left: '100000000000000000000', operator: '/', right: '9' },
  },
];

const operatorLabels: Record<CalculatorOperator, string> = {
  '+': 'Add',
  '-': 'Subtract',
  '*': 'Multiply',
  '/': 'Divide',
};

const operatorSymbols: Record<CalculatorOperator, string> = {
  '+': '+',
  '-': '-',
  '*': 'x',
  '/': '/',
};

function digitCount(value: bigint) {
  const absolute = value < 0n ? -value : value;
  return absolute.toString().length;
}

function formatOperationAnswer(result: BigIntegerOperationResult) {
  if (result.operator !== '/') {
    return formatBigInteger(result.result);
  }

  const quotient = result.quotient ?? result.result;
  const remainder = result.remainder ?? 0n;

  if (remainder === 0n) {
    return formatBigInteger(quotient);
  }

  return `${formatBigInteger(quotient)} remainder ${formatBigInteger(remainder)}`;
}

function getSteps(result: BigIntegerOperationResult, answer: string) {
  const left = formatBigInteger(result.left);
  const right = formatBigInteger(result.right);

  if (result.operator === '/') {
    const quotient = result.quotient ?? result.result;
    const remainder = result.remainder ?? 0n;

    return [
      `Start with ${left} divided by ${right}.`,
      'Use exact whole-number division.',
      remainder === 0n
        ? `The quotient is ${formatBigInteger(quotient)}.`
        : `The quotient is ${formatBigInteger(quotient)} and the remainder is ${formatBigInteger(remainder)}.`,
      `The answer is ${answer}.`,
    ];
  }

  const action =
    result.operator === '+' ? 'Add' : result.operator === '-' ? 'Subtract' : 'Multiply';

  return [
    `${action} ${left} and ${right}.`,
    'Keep every digit exact with BigInt integer arithmetic.',
    `The answer is ${answer}.`,
  ];
}

function buildCalculation(inputs: BigNumberInputs): BigNumberCalculation {
  const left = parseBigInteger(inputs.left, 'Left value');
  const right = parseBigInteger(inputs.right, 'Right value');
  const result = calculateBigIntegerOperation(left, inputs.operator, right);
  const answer = formatOperationAnswer(result);

  return {
    expression: `${formatBigInteger(left)} ${operatorSymbols[inputs.operator]} ${formatBigInteger(right)}`,
    result,
    answer,
    steps: getSteps(result, answer),
  };
}

export default function BigNumberCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<BigNumberCalculation>(() => buildCalculation(defaultInputs));
  const [history, setHistory] = useState<BigNumberCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const resultDigits = useMemo(() => digitCount(calculation.result.result), [calculation]);
  const hasRemainder = calculation.result.operator === '/' && (calculation.result.remainder ?? 0n) !== 0n;

  const updateInput = (key: keyof BigNumberInputs, value: string | CalculatorOperator) => {
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
      setError(caughtError instanceof Error ? caughtError.message : 'Check the big number inputs');
      setCopied(false);
    }
  };

  const loadExample = (example: BigNumberExample) => {
    setInputs(example.inputs);
    calculate(example.inputs);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`${calculation.expression} = ${calculation.answer}`);
    setCopied(true);
  };

  return (
    <section className="advanced-calculator advanced-calculator-big-number" aria-label="Big number calculator">
      <div className="advanced-panel">
        <div className="advanced-fields">
          <label className="advanced-field">
            <span>Left whole number</span>
            <input
              autoCapitalize="off"
              autoCorrect="off"
              inputMode="numeric"
              onChange={(event) => updateInput('left', event.target.value)}
              spellCheck={false}
              value={inputs.left}
            />
          </label>
          <label className="advanced-field">
            <span>Right whole number</span>
            <input
              autoCapitalize="off"
              autoCorrect="off"
              inputMode="numeric"
              onChange={(event) => updateInput('right', event.target.value)}
              spellCheck={false}
              value={inputs.right}
            />
          </label>
        </div>

        <div className="advanced-mode-grid" aria-label="Big number operation">
          {(Object.keys(operatorLabels) as CalculatorOperator[]).map((operator) => (
            <button
              aria-pressed={inputs.operator === operator}
              key={operator}
              onClick={() => updateInput('operator', operator)}
              type="button"
            >
              <span>{operatorLabels[operator]}</span>
              <strong>{operatorSymbols[operator]}</strong>
            </button>
          ))}
        </div>

        <div className="advanced-quick-grid" aria-label="Big number examples">
          {examples.map((example) => (
            <button key={example.label} onClick={() => loadExample(example)} type="button">
              {example.label}
            </button>
          ))}
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Calculate big number
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="advanced-result-card" aria-live="polite">
          <span>{error ? 'Check inputs' : calculation.expression}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{calculation.answer}</strong>
              <dl>
                <div>
                  <dt>Operation</dt>
                  <dd>{operatorLabels[calculation.result.operator]}</dd>
                </div>
                <div>
                  <dt>Result digits</dt>
                  <dd>{resultDigits}</dd>
                </div>
                <div>
                  <dt>Remainder</dt>
                  <dd>{hasRemainder ? formatBigInteger(calculation.result.remainder ?? 0n) : 'None'}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="advanced-steps">
            <h2>Steps</h2>
            <ol>
              {calculation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <aside className="advanced-side-panel" aria-label="Big number calculator history">
        <section>
          <h2>Recent answers</h2>
          {history.length > 0 ? (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <span>{item.expression}</span>
                  <strong>{item.answer}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent exact integer answers will appear here.</p>
          )}
        </section>

        <section className="advanced-note">
          <h2>Input tips</h2>
          <p>Use whole numbers only. Commas, spaces, and underscores are accepted for readability.</p>
          <p>Division returns an exact integer quotient and a remainder when needed.</p>
        </section>
      </aside>
    </section>
  );
}
