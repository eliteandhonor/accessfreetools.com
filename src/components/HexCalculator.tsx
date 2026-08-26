import { useMemo, useState } from 'react';
import {
  calculateHexIntegerOperation,
  formatBinaryInteger,
  formatHexInteger,
  groupBinaryDigits,
  groupHexDigits,
  parseDecimalInteger,
  parseHexInteger,
  type CalculatorOperator,
} from '../lib/calculator';
import {
  calculateHexBitwiseOperation,
  isHexBitwiseOperator,
  type HexBitwiseOperator,
} from '../lib/hexCalculator';

type HexOperator = CalculatorOperator | HexBitwiseOperator;

interface HexOperationResult {
  left: bigint;
  operator: HexOperator;
  right: bigint;
  result: bigint;
  quotient?: bigint;
  remainder?: bigint;
}

interface HexInputs {
  left: string;
  operator: HexOperator;
  right: string;
}

interface HexCalculation {
  expression: string;
  result: HexOperationResult;
  hexAnswer: string;
  decimalAnswer: string;
  binaryAnswer: string;
  steps: string[];
}

interface HexExample {
  label: string;
  inputs: HexInputs;
}

const defaultInputs: HexInputs = {
  left: 'A3',
  operator: '+',
  right: '1F',
};

const examples: HexExample[] = [
  {
    label: 'Add hex values',
    inputs: { left: 'A3', operator: '+', right: '1F' },
  },
  {
    label: 'Subtract hex values',
    inputs: { left: 'FF', operator: '-', right: '2A' },
  },
  {
    label: 'Multiply by 3',
    inputs: { left: '1A', operator: '*', right: '3' },
  },
  {
    label: 'Divide with remainder',
    inputs: { left: '2F', operator: '/', right: 'A' },
  },
  {
    label: 'Bitwise AND',
    inputs: { left: 'F0', operator: '&', right: 'CC' },
  },
  {
    label: 'Bitwise XOR',
    inputs: { left: 'AA', operator: '^', right: 'FF' },
  },
];

const operatorLabels: Record<HexOperator, string> = {
  '+': 'Add',
  '-': 'Subtract',
  '*': 'Multiply',
  '/': 'Divide',
  '&': 'AND',
  '|': 'OR',
  '^': 'XOR',
};

const operatorSymbols: Record<HexOperator, string> = {
  '+': '+',
  '-': '-',
  '*': 'x',
  '/': '/',
  '&': '&',
  '|': '|',
  '^': '^',
};

function formatDecimalInteger(value: bigint) {
  return value.toString();
}

function formatHexForDisplay(value: bigint) {
  return formatHexInteger(value);
}

function formatOperationAnswer(result: HexOperationResult) {
  if (result.operator !== '/') {
    return {
      hexAnswer: formatHexForDisplay(result.result),
      decimalAnswer: formatDecimalInteger(result.result),
      binaryAnswer: formatBinaryInteger(result.result),
    };
  }

  const quotient = result.quotient ?? result.result;
  const remainder = result.remainder ?? 0n;

  if (remainder === 0n) {
    return {
      hexAnswer: formatHexForDisplay(quotient),
      decimalAnswer: formatDecimalInteger(quotient),
      binaryAnswer: formatBinaryInteger(quotient),
    };
  }

  return {
    hexAnswer: `${formatHexForDisplay(quotient)} remainder ${formatHexForDisplay(remainder)}`,
    decimalAnswer: `${formatDecimalInteger(quotient)} remainder ${formatDecimalInteger(remainder)}`,
    binaryAnswer: `${formatBinaryInteger(quotient)} remainder ${formatBinaryInteger(remainder)}`,
  };
}

function getSteps(result: HexOperationResult, hexAnswer: string) {
  const leftHex = formatHexForDisplay(result.left);
  const rightHex = formatHexForDisplay(result.right);
  const leftDecimal = formatDecimalInteger(result.left);
  const rightDecimal = formatDecimalInteger(result.right);

  if (isHexBitwiseOperator(result.operator)) {
    const action = result.operator === '&'
      ? 'AND keeps a 1 only where both inputs have a 1.'
      : result.operator === '|'
        ? 'OR keeps a 1 where either input has a 1.'
        : 'XOR keeps a 1 where the input bits are different.';

    return [
      `${leftHex} is ${groupBinaryDigits(result.left)} in binary.`,
      `${rightHex} is ${groupBinaryDigits(result.right)} in binary.`,
      `${action} The binary result is ${groupBinaryDigits(result.result)}.`,
      `Convert the result back to hex: ${hexAnswer}.`,
    ];
  }

  if (result.operator === '/') {
    const quotient = result.quotient ?? result.result;
    const remainder = result.remainder ?? 0n;

    return [
      `${leftHex} is ${leftDecimal} in decimal.`,
      `${rightHex} is ${rightDecimal} in decimal.`,
      remainder === 0n
        ? `${leftDecimal} / ${rightDecimal} = ${formatDecimalInteger(quotient)}.`
        : `${leftDecimal} / ${rightDecimal} = ${formatDecimalInteger(quotient)} remainder ${formatDecimalInteger(remainder)}.`,
      `Convert the result back to hex: ${hexAnswer}.`,
    ];
  }

  const action = result.operator === '+'
    ? 'Add'
    : result.operator === '-'
      ? 'Subtract'
      : 'Multiply';

  return [
    `${leftHex} is ${leftDecimal} in decimal.`,
    `${rightHex} is ${rightDecimal} in decimal.`,
    `${action} the decimal values: ${leftDecimal} ${operatorSymbols[result.operator]} ${rightDecimal} = ${formatDecimalInteger(result.result)}.`,
    `Convert the answer back to hex: ${hexAnswer}.`,
  ];
}

function buildCalculation(inputs: HexInputs): HexCalculation {
  const left = parseHexInteger(inputs.left, 'Left hex number');
  const right = parseHexInteger(inputs.right, 'Right hex number');
  const result = isHexBitwiseOperator(inputs.operator)
    ? calculateHexBitwiseOperation(left, inputs.operator, right)
    : calculateHexIntegerOperation(left, inputs.operator, right);
  const { hexAnswer, decimalAnswer, binaryAnswer } = formatOperationAnswer(result);

  return {
    expression: `${formatHexForDisplay(left)} ${operatorSymbols[inputs.operator]} ${formatHexForDisplay(right)}`,
    result,
    hexAnswer,
    decimalAnswer,
    binaryAnswer,
    steps: getSteps(result, hexAnswer),
  };
}

function HexField({
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
        autoCapitalize="characters"
        autoCorrect="off"
        inputMode="text"
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        value={value}
      />
    </label>
  );
}

export default function HexCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<HexCalculation>(() => buildCalculation(defaultInputs));
  const [history, setHistory] = useState<HexCalculation[]>([]);
  const [hexConversionInput, setHexConversionInput] = useState('2A');
  const [decimalConversionInput, setDecimalConversionInput] = useState('42');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const hexToDecimal = useMemo(() => {
    try {
      return parseHexInteger(hexConversionInput).toString();
    } catch {
      return 'Enter a hex whole number';
    }
  }, [hexConversionInput]);

  const decimalToHex = useMemo(() => {
    try {
      return groupHexDigits(parseDecimalInteger(decimalConversionInput));
    } catch {
      return 'Enter a whole decimal number';
    }
  }, [decimalConversionInput]);

  const hexToBinary = useMemo(() => {
    try {
      return groupBinaryDigits(parseHexInteger(hexConversionInput));
    } catch {
      return 'Enter a hex whole number';
    }
  }, [hexConversionInput]);

  const updateInput = (key: keyof HexInputs, value: string | HexOperator) => {
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
      setError(caughtError instanceof Error ? caughtError.message : 'Check the hex inputs');
      setCopied(false);
    }
  };

  const loadExample = (example: HexExample) => {
    setInputs(example.inputs);
    calculate(example.inputs);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(
      `${calculation.expression} = ${calculation.hexAnswer} hex (${calculation.decimalAnswer} decimal, ${calculation.binaryAnswer} binary)`,
    );
    setCopied(true);
  };

  return (
    <section className="binary-calculator hex-calculator" aria-label="Hex calculator">
      <div className="binary-panel">
        <div className="binary-fields">
          <HexField label="First hex number" value={inputs.left} onChange={(value) => updateInput('left', value)} />

          <div className="binary-operator-grid" aria-label="Hex operation">
            {(Object.keys(operatorLabels) as HexOperator[]).map((operator) => (
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

          <HexField label="Second hex number" value={inputs.right} onChange={(value) => updateInput('right', value)} />
        </div>

        <div className="binary-quick-grid" aria-label="Quick hex examples">
          {examples.map((example) => (
            <button key={example.label} onClick={() => loadExample(example)} type="button">
              {example.label}
            </button>
          ))}
        </div>

        <div className="binary-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Calculate hex
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
              <strong>{calculation.hexAnswer}</strong>
              <dl>
                <div>
                  <dt>Decimal answer</dt>
                  <dd>{calculation.decimalAnswer}</dd>
                </div>
                <div>
                  <dt>Binary answer</dt>
                  <dd>{calculation.binaryAnswer}</dd>
                </div>
                <div>
                  <dt>Input values</dt>
                  <dd>
                    {formatDecimalInteger(calculation.result.left)} and {formatDecimalInteger(calculation.result.right)}
                  </dd>
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

      <section className="binary-side-panel" aria-label="Hex conversions and history">
        <section className="binary-converter-card">
          <h2>Quick conversions</h2>
          <label className="binary-field">
            <span>Hex to decimal</span>
            <input
              autoCapitalize="characters"
              autoCorrect="off"
              inputMode="text"
              onChange={(event) => setHexConversionInput(event.target.value)}
              spellCheck={false}
              value={hexConversionInput}
            />
          </label>
          <strong>{hexToDecimal}</strong>

          <label className="binary-field">
            <span>Decimal to hex</span>
            <input
              inputMode="numeric"
              onChange={(event) => setDecimalConversionInput(event.target.value)}
              value={decimalConversionInput}
            />
          </label>
          <strong>{decimalToHex}</strong>

          <div className="hex-binary-preview">
            <span>Hex to binary</span>
            <strong>{hexToBinary}</strong>
          </div>
        </section>

        <section>
          <h2>Recent answers</h2>
          {history.length > 0 ? (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <span>{item.expression}</span>
                  <strong>{item.hexAnswer}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent hex answers will appear here.</p>
          )}
        </section>

        <section className="binary-note">
          <h2>Input tips</h2>
          <p>Use 0-9 and A-F. Optional 0x prefixes, spaces, and underscores are accepted.</p>
          <p>Division shows a quotient and remainder when the hex values do not divide evenly.</p>
          <p>AND, OR, and XOR accept zero or positive values. They do not apply a fixed 8-bit, 16-bit, or 32-bit width.</p>
        </section>
      </section>
    </section>
  );
}
