import { useMemo, useState } from 'react';
import {
  calculateQuadraticFormula,
  formatCalculatorNumber,
  type ComplexNumberValue,
  type QuadraticFormulaResult,
} from '../lib/calculator';

interface QuadraticInputs {
  a: string;
  b: string;
  c: string;
}

interface QuadraticExample {
  label: string;
  inputs: QuadraticInputs;
}

interface QuadraticCalculation {
  equation: string;
  result: QuadraticFormulaResult;
  rootsText: string;
  rootSummary: string;
  steps: string[];
}

const defaultInputs: QuadraticInputs = {
  a: '1',
  b: '-3',
  c: '2',
};

const examples: QuadraticExample[] = [
  {
    label: 'Two real roots',
    inputs: { a: '1', b: '-3', c: '2' },
  },
  {
    label: 'Repeated root',
    inputs: { a: '1', b: '-4', c: '4' },
  },
  {
    label: 'Complex roots',
    inputs: { a: '1', b: '2', c: '5' },
  },
  {
    label: 'Opens downward',
    inputs: { a: '-16', b: '64', c: '0' },
  },
];

function parseNumber(value: string, label: string) {
  const parsed = Number(value.trim());

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function formatCoefficient(value: number, variable: string, isFirst = false) {
  const absoluteValue = Math.abs(value);
  const sign = value < 0 ? '-' : '+';
  const coefficient =
    absoluteValue === 1 && variable ? variable : `${formatCalculatorNumber(absoluteValue)}${variable}`;

  if (isFirst) {
    return value < 0 ? `-${coefficient}` : coefficient;
  }

  return `${sign} ${coefficient}`;
}

function formatEquation(a: number, b: number, c: number) {
  const terms = [formatCoefficient(a, 'x^2', true)];

  if (b !== 0) {
    terms.push(formatCoefficient(b, 'x'));
  }

  if (c !== 0) {
    terms.push(formatCoefficient(c, ''));
  }

  return `${terms.join(' ')} = 0`;
}

function formatComplexRoot(root: ComplexNumberValue) {
  if (root.imaginary === 0) {
    return formatCalculatorNumber(root.real);
  }

  const sign = root.imaginary < 0 ? '-' : '+';
  const imaginaryValue = Math.abs(root.imaginary);

  return `${formatCalculatorNumber(root.real)} ${sign} ${formatCalculatorNumber(imaginaryValue)}i`;
}

function formatRoots(result: QuadraticFormulaResult) {
  if (result.rootType === 'one-real') {
    return `x = ${formatCalculatorNumber(result.roots[0].real)}`;
  }

  if (result.rootType === 'complex') {
    return `x = ${formatComplexRoot(result.roots[0])}, ${formatComplexRoot(result.roots[1])}`;
  }

  return `x = ${formatCalculatorNumber(result.roots[0].real)}, ${formatCalculatorNumber(result.roots[1].real)}`;
}

function getRootSummary(result: QuadraticFormulaResult) {
  if (result.rootType === 'two-real') {
    return 'The discriminant is positive, so the equation has two real roots.';
  }

  if (result.rootType === 'one-real') {
    return 'The discriminant is zero, so the equation has one repeated real root.';
  }

  return 'The discriminant is negative, so the equation has two complex conjugate roots.';
}

function getSteps(result: QuadraticFormulaResult, equation: string, rootsText: string) {
  const a = formatCalculatorNumber(result.a);
  const b = formatCalculatorNumber(result.b);
  const c = formatCalculatorNumber(result.c);
  const discriminant = formatCalculatorNumber(result.discriminant);
  const denominator = formatCalculatorNumber(2 * result.a);

  return [
    `Start with standard form: ${equation}.`,
    `Use a = ${a}, b = ${b}, and c = ${c}.`,
    `Find the discriminant: b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${discriminant}.`,
    `Use the quadratic formula: x = (-b +/- sqrt(discriminant)) / 2a, with 2a = ${denominator}.`,
    `The roots are ${rootsText}.`,
  ];
}

function buildCalculation(inputs: QuadraticInputs): QuadraticCalculation {
  const a = parseNumber(inputs.a, 'Coefficient a');
  const b = parseNumber(inputs.b, 'Coefficient b');
  const c = parseNumber(inputs.c, 'Coefficient c');
  const result = calculateQuadraticFormula(a, b, c);
  const equation = formatEquation(a, b, c);
  const rootsText = formatRoots(result);

  return {
    equation,
    result,
    rootsText,
    rootSummary: getRootSummary(result),
    steps: getSteps(result, equation, rootsText),
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
    <label className="quadratic-field">
      <span>{label}</span>
      <input inputMode="decimal" onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}

export default function QuadraticFormulaCalculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState<QuadraticCalculation>(() => buildCalculation(defaultInputs));
  const [history, setHistory] = useState<QuadraticCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const vertexText = useMemo(
    () =>
      `(${formatCalculatorNumber(calculation.result.vertex.x)}, ${formatCalculatorNumber(calculation.result.vertex.y)})`,
    [calculation],
  );

  const updateInput = (key: keyof QuadraticInputs, value: string) => {
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
      setError(caughtError instanceof Error ? caughtError.message : 'Check the quadratic inputs');
      setCopied(false);
    }
  };

  const loadExample = (example: QuadraticExample) => {
    setInputs(example.inputs);
    calculate(example.inputs);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`${calculation.equation}; ${calculation.rootsText}`);
    setCopied(true);
  };

  return (
    <section className="quadratic-calculator" aria-label="Quadratic formula calculator">
      <div className="quadratic-panel">
        <div className="quadratic-equation-preview" aria-live="polite">
          <span>Standard form</span>
          <strong>{error ? 'ax^2 + bx + c = 0' : calculation.equation}</strong>
        </div>

        <div className="quadratic-fields">
          <NumberField label="Coefficient a" value={inputs.a} onChange={(value) => updateInput('a', value)} />
          <NumberField label="Coefficient b" value={inputs.b} onChange={(value) => updateInput('b', value)} />
          <NumberField label="Coefficient c" value={inputs.c} onChange={(value) => updateInput('c', value)} />
        </div>

        <div className="quadratic-quick-grid" aria-label="Quick quadratic examples">
          {examples.map((example) => (
            <button key={example.label} onClick={() => loadExample(example)} type="button">
              {example.label}
            </button>
          ))}
        </div>

        <div className="quadratic-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Calculate roots
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="quadratic-result-card" aria-live="polite">
          <span>{error ? 'Check inputs' : calculation.rootSummary}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{calculation.rootsText}</strong>
              <dl>
                <div>
                  <dt>Discriminant</dt>
                  <dd>{formatCalculatorNumber(calculation.result.discriminant)}</dd>
                </div>
                <div>
                  <dt>Vertex</dt>
                  <dd>{vertexText}</dd>
                </div>
                <div>
                  <dt>Axis</dt>
                  <dd>x = {formatCalculatorNumber(calculation.result.axisOfSymmetry)}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="quadratic-steps">
            <h2>Steps</h2>
            <ol>
              {calculation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <section className="quadratic-side-panel" aria-label="Quadratic examples and history">
        <section>
          <h2>Graph details</h2>
          <div className="quadratic-detail-list">
            <p>
              <span>Opens</span>
              <strong>{calculation.result.opens}</strong>
            </p>
            <p>
              <span>Y-intercept</span>
              <strong>{formatCalculatorNumber(calculation.result.yIntercept)}</strong>
            </p>
            <p>
              <span>Root type</span>
              <strong>{calculation.result.rootType.replace('-', ' ')}</strong>
            </p>
          </div>
        </section>

        <section>
          <h2>Recent answers</h2>
          {history.length > 0 ? (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.equation}-${index}`}>
                  <span>{item.equation}</span>
                  <strong>{item.rootsText}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>Recent quadratic answers will appear here.</p>
          )}
        </section>

        <section className="quadratic-note">
          <h2>Input tips</h2>
          <p>Enter the equation in standard form ax^2 + bx + c = 0.</p>
          <p>Coefficient a cannot be zero. If a is zero, the equation is linear instead of quadratic.</p>
        </section>
      </section>
    </section>
  );
}
