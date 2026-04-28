import { useMemo, useState } from 'react';
import {
  calculateBinaryIntegerOperation,
  formatBinaryInteger,
  groupBinaryDigits,
  parseBinaryInteger,
  parseDecimalInteger,
  type BinaryIntegerOperationResult,
  type CalculatorOperator,
} from '../lib/calculator';

interface BinaryInputs {
  left: string;
  operator: CalculatorOperator;
  right: string;
}

interface BinaryCalculation {
  expression: string;
  result: BinaryIntegerOperationResult;
  binaryAnswer: string;
  decimalAnswer: string;
  steps: string[];
}

interface BinaryExample {
  label: string;
  inputs: BinaryInputs;
}

const defaultInputs: BinaryInputs = {
  left: '1011',
  operator: '+',
  right: '110',
};

const examples: BinaryExample[] = [
  {
    label: 'Add binary numbers',
    inputs: { left: '1011', operator: '+', right: '110' },
  },
  {
    label: 'Subtract one',
    inputs: { left: '10000', operator: '-', right: '1' },
  },
  {
    label: 'Multiply bits',
    inputs: { left: '101', operator: '*', right: '11' },
  },
  {
    label: 'Divide with remainder',
    inputs: { left: '1101', operator: '/', right: '10' },
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

function formatDecimalInteger(value: bigint) {
  return value.toString();
}

function formatBinaryForDisplay(value: bigint) {
  return formatBinaryInteger(value);
}

function formatOperationAnswer(result: BinaryIntegerOperationResult) {
  if (result.operator !== '/') {
    return {
      binaryAnswer: formatBinaryForDisplay(result.result),
      decimalAnswer: formatDecimalInteger(result.result),
    };
  }

  const quotient = result.quotient ?? result.result;
  const remainder = result.remainder ?? 0n;

  if (remainder === 0n) {
    return {
      binaryAnswer: formatBinaryForDisplay(quotient),
      decimalAnswer: formatDecimalInteger(quotient),
    };
  }

  return {
    binaryAnswer: `${formatBinaryForDisplay(quotient)} remainder ${formatBinaryForDisplay(remainder)}`,
    decimalAnswer: `${formatDecimalInteger(quotient)} remainder ${formatDecimalInteger(remainder)}`,
  };
}

function getSteps(result: BinaryIntegerOperationResult, binaryAnswer: string) {
  const leftBinary = formatBinaryForDisplay(result.left);
  const rightBinary = formatBinaryForDisplay(result.right);
  const leftDecimal = formatDecimalInteger(result.left);
  const rightDecimal = formatDecimalInteger(result.right);

  if (result.operator === '/') {
    const quotient = result.quotient ?? result.result;
    const remainder = result.remainder ?? 0n;

    return [
      `${leftBinary} is ${leftDecimal} in decimal.`,
      `${rightBinary} is ${rightDecimal} in decimal.`,
      remainder === 0n
        ? `${leftDecimal} / ${rightDecimal} = ${formatDecimalInteger(quotient)}.`
        : `${leftDecimal} / ${rightDecimal} = ${formatDecimalInteger(quotient)} remainder ${formatDecimalInteger(remainder)}.`,
      `The binary answer is ${binaryAnswer}.`,
    ];
  }

  const action = result.operator === '+'
    ? 'Add'
    : result.operator === '-'
      ? 'Subtract'
      : 'Multiply';

  return [
    `${leftBinary} is ${leftDecimal} in decimal.`,
    `${rightBinary} is ${rightDecimal} in decimal.`,
    `${action} the decimal values: ${leftDecimal} ${operatorSymbols[result.operator]} ${rightDecimal} = ${formatDecimalInteger(result.result)}.`,
    `Convert the answer back to binary: ${binaryAnswer}.`,
  ];
}

function buildCalculation(inputs: BinaryInputs): BinaryCalculation {
  const left = parseBinaryInteger(inputs.left, 'Left binary number');
  const right = parseBinaryInteger(inputs.right, 'Right binary number');
  const result = calculateBinaryIntegerOperation(left, inputs.operator, right);
  const { binaryAnswer, decimalAnswer } = formatOperationAnswer(result);

  return {
    expression: `${formatBinaryForDisplay(left)} ${operatorSymbols[inputs.operator]} ${formatBinaryForDisplay(right)}`,
    result,
    binaryAnswer,
    decimalAnswer,
    steps: getSteps(result, binaryAnswer),
  };
}

function BinaryField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="binary-field">
      <span>{label}</span>
      <input
        autoCapitalize="off"
        autoCorrect="off"
        inputMode="numeric"
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        value={value}
      />
    </label>
  );
}

export default function BinaryCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<BinaryCalculation>(() => buildCalculation(defaultInputs));
  const [history, setHistory] = useState<BinaryCalculation[]>([]);
  const [binaryConversionInput, setBinaryConversionInput] = useState('101010');
  const [decimalConversionInput, setDecimalConversionInput] = useState('42');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const binaryToDecimal = useMemo(() => {
    try {
      return parseBinaryInteger(binaryConversionInput).toString();
    } catch {
      return 'Enter a binary whole number';
    }
  }, [binaryConversionInput]);

  const decimalToBinary = useMemo(() => {
    try {
      return groupBinaryDigits(parseDecimalInteger(decimalConversionInput));
    } catch {
      return 'Enter a whole decimal number';
    }
  }, [decimalConversionInput]);

  const updateInput = (key: keyof BinaryInputs, value: string | CalculatorOperator) => {
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
      setError(caughtError instanceof Error ? caughtError.message : 'Check the binary inputs');
      setCopied(false);
    }
  };

  const loadExample = (example: BinaryExample) => {
    setInputs(example.inputs);
    calculate(example.inputs);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(
      `${calculation.expression} = ${calculation.binaryAnswer} binary (${calculation.decimalAnswer} decimal)`,
    );
    setCopied(true);
  };

  return (
    <section className="binary-calculator" aria-label="Binary calculator">
      <div className="binary-panel">
        <div className="binary-fields">
          <BinaryField label="First binary number" value={inputs.left} onChange={(value) => updateInput('left', value)} />

          <div className="binary-operator-grid" aria-label="Binary operation">
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

          <BinaryField label="Second binary number" value={inputs.right} onChange={(value) => updateInput('right', value)} />
        </div>

        <div className="binary-quick-grid" aria-label="Quick binary examples">
          {examples.map((example) => (
            <button key={example.label} onClick={() => loadExample(example)} type="button">
              {example.label}
            </button>
          ))}
        </div>

        <div className="binary-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Calculate binary
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="binary-result-card" aria-live="polite">
          <span>{error ? 'Check inputs' : calculation.expression}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{calculation.binaryAnswer}</strong>
              <dl>
                <div>
                  <dt>Decimal answer</dt>
                  <dd>{calculation.decimalAnswer}</dd>
                </div>
                <div>
                  <dt>First decimal</dt>
                  <dd>{formatDecimalInteger(calculation.result.left)}</dd>
                </div>
                <div>
                  <dt>Second decimal</dt>
                  <dd>{formatDecimalInteger(calculation.result.right)}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="binary-steps">
            <h2>Steps</h2>
            <ol>
              {calculation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <aside className="binary-side-panel" aria-label="Binary conversions and history">
        <section className="binary-converter-card">
          <h2>Quick conversions</h2>
          <label className="binary-field">
            <span>Binary to decimal</span>
            <input
              autoCapitalize="off"
              autoCorrect="off"
              inputMode="numeric"
              onChange={(event) => setBinaryConversionInput(event.target.value)}
              spellCheck={false}
              value={binaryConversionInput}
            />
          </label>
          <strong>{binaryToDecimal}</strong>

          <label className="binary-field">
            <span>Decimal to binary</span>
            <input
              inputMode="numeric"
              onChange={(event) => setDecimalConversionInput(event.target.value)}
              value={decimalConversionInput}
            />
          </label>
          <strong>{decimalToBinary}</strong>
        </section>

        <section>
          <h2>Recent answers</h2>
          {history.length > 0 ? (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <span>{item.expression}</span>
                  <strong>{item.binaryAnswer}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent binary answers will appear here.</p>
          )}
        </section>

        <section className="binary-note">
          <h2>Input tips</h2>
          <p>Use only 0 and 1. Spaces are allowed for readability, such as 1111 0000.</p>
          <p>Division shows a quotient and remainder when the binary numbers do not divide evenly.</p>
        </section>
      </aside>
    </section>
  );
}
