import { useMemo, useState } from 'react';
import {
  calculateMatrixOperation,
  formatCalculatorNumber,
  type MatrixCalculationResult,
  type MatrixOperation,
} from '../lib/calculator';

type MatrixSize = 2 | 3;

interface MatrixExample {
  label: string;
  size: MatrixSize;
  operation: MatrixOperation;
  left: string[][];
  right: string[][];
}

const operations: Array<{ value: MatrixOperation; label: string }> = [
  { value: 'add', label: 'Add' },
  { value: 'subtract', label: 'Subtract' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'determinant', label: 'Determinant' },
  { value: 'transpose', label: 'Transpose' },
];

const defaultLeft = [
  ['1', '2', '0'],
  ['3', '4', '0'],
  ['0', '0', '1'],
];

const defaultRight = [
  ['2', '0', '0'],
  ['1', '2', '0'],
  ['0', '0', '1'],
];

const examples: MatrixExample[] = [
  {
    label: '2x2 multiply',
    size: 2,
    operation: 'multiply',
    left: [
      ['1', '2', '0'],
      ['3', '4', '0'],
      ['0', '0', '1'],
    ],
    right: [
      ['2', '0', '0'],
      ['1', '2', '0'],
      ['0', '0', '1'],
    ],
  },
  {
    label: '2x2 determinant',
    size: 2,
    operation: 'determinant',
    left: [
      ['3', '4', '0'],
      ['2', '5', '0'],
      ['0', '0', '1'],
    ],
    right: defaultRight,
  },
  {
    label: '3x3 determinant',
    size: 3,
    operation: 'determinant',
    left: [
      ['6', '1', '1'],
      ['4', '-2', '5'],
      ['2', '8', '7'],
    ],
    right: defaultRight,
  },
];

function parseMatrix(values: string[][], size: MatrixSize, label: string) {
  return values.slice(0, size).map((row, rowIndex) =>
    row.slice(0, size).map((cell, columnIndex) => {
      const parsed = Number(cell.trim());

      if (!Number.isFinite(parsed)) {
        throw new Error(`${label} row ${rowIndex + 1}, column ${columnIndex + 1} must be a number`);
      }

      return parsed;
    }),
  );
}

function formatMatrix(matrix: number[][]) {
  return matrix.map((row) => `[${row.map((value) => formatCalculatorNumber(value)).join(', ')}]`).join(' ');
}

function formatResult(result: number[][] | number) {
  return Array.isArray(result) ? formatMatrix(result) : formatCalculatorNumber(result);
}

function getSteps(operation: MatrixOperation, result: MatrixCalculationResult) {
  const answer = formatResult(result.result);

  if (operation === 'add') {
    return ['Add matching entries from Matrix A and Matrix B.', 'Keep each sum in the same row and column position.', `The result is ${answer}.`];
  }

  if (operation === 'subtract') {
    return ['Subtract each Matrix B entry from the matching Matrix A entry.', 'Keep each difference in the same row and column position.', `The result is ${answer}.`];
  }

  if (operation === 'multiply') {
    return ['Multiply each row of Matrix A by each column of Matrix B.', 'Add each row-column product to fill the matching result entry.', `The result is ${answer}.`];
  }

  if (operation === 'transpose') {
    return ['Swap rows and columns of Matrix A.', 'Entry row 1, column 2 becomes row 2, column 1.', `The transpose is ${answer}.`];
  }

  return ['Use the determinant formula for the selected square matrix.', 'For 2x2, det = ad - bc. For 3x3, expand by minors.', `The determinant is ${answer}.`];
}

function buildCalculation(
  operation: MatrixOperation,
  size: MatrixSize,
  leftValues: string[][],
  rightValues: string[][],
) {
  const left = parseMatrix(leftValues, size, 'Matrix A');
  const right = parseMatrix(rightValues, size, 'Matrix B');
  const result = calculateMatrixOperation(operation, left, right);

  return {
    result,
    expression: `${operations.find((item) => item.value === operation)?.label ?? 'Matrix'} ${size}x${size}`,
    answer: formatResult(result.result),
    steps: getSteps(operation, result),
  };
}

export default function MatrixCalculator() {
  const [size, setSize] = useState<MatrixSize>(2);
  const [operation, setOperation] = useState<MatrixOperation>('multiply');
  const [left, setLeft] = useState(defaultLeft);
  const [right, setRight] = useState(defaultRight);
  const [calculation, setCalculation] = useState(() => buildCalculation('multiply', 2, defaultLeft, defaultRight));
  const [history, setHistory] = useState<typeof calculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const resultText = useMemo(() => calculation.answer, [calculation]);
  const needsMatrixB = operation === 'add' || operation === 'subtract' || operation === 'multiply';

  const updateCell = (target: 'left' | 'right', rowIndex: number, columnIndex: number, value: string) => {
    const setter = target === 'left' ? setLeft : setRight;
    setter((current) =>
      current.map((row, nextRowIndex) =>
        row.map((cell, nextColumnIndex) =>
          nextRowIndex === rowIndex && nextColumnIndex === columnIndex ? value : cell,
        ),
      ),
    );
    setCopied(false);
  };

  const calculate = (
    nextOperation = operation,
    nextSize = size,
    nextLeft = left,
    nextRight = right,
    saveHistory = true,
  ) => {
    try {
      const nextCalculation = buildCalculation(nextOperation, nextSize, nextLeft, nextRight);
      setCalculation(nextCalculation);
      if (saveHistory) {
        setHistory((items) => [nextCalculation, ...items].slice(0, 6));
      }
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the matrix inputs');
      setCopied(false);
    }
  };

  const changeOperation = (nextOperation: MatrixOperation) => {
    setOperation(nextOperation);
    calculate(nextOperation, size, left, right, false);
  };

  const changeSize = (nextSize: MatrixSize) => {
    setSize(nextSize);
    calculate(operation, nextSize, left, right, false);
  };

  const loadExample = (example: MatrixExample) => {
    setSize(example.size);
    setOperation(example.operation);
    setLeft(example.left);
    setRight(example.right);
    calculate(example.operation, example.size, example.left, example.right);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`${calculation.expression}: ${resultText}`);
    setCopied(true);
  };

  const renderMatrix = (target: 'left' | 'right', values: string[][], label: string) => (
    <section className="matrix-input-block">
      <h2>{label}</h2>
      <div className={`matrix-grid matrix-grid-${size}`}>
        {values.slice(0, size).map((row, rowIndex) =>
          row.slice(0, size).map((cell, columnIndex) => (
            <label key={`${label}-${rowIndex}-${columnIndex}`}>
              <span>{`${rowIndex + 1},${columnIndex + 1}`}</span>
              <input
                inputMode="decimal"
                onChange={(event) => updateCell(target, rowIndex, columnIndex, event.target.value)}
                value={cell}
              />
            </label>
          )),
        )}
      </div>
    </section>
  );

  return (
    <section className="advanced-calculator advanced-calculator-matrix" aria-label="Matrix calculator">
      <div className="advanced-panel">
        <div className="advanced-mode-grid" aria-label="Matrix size">
          <button aria-pressed={size === 2} onClick={() => changeSize(2)} type="button">
            2x2
          </button>
          <button aria-pressed={size === 3} onClick={() => changeSize(3)} type="button">
            3x3
          </button>
        </div>

        <div className="advanced-mode-grid matrix-operation-grid" aria-label="Matrix operations">
          {operations.map((item) => (
            <button
              aria-pressed={operation === item.value}
              key={item.value}
              onClick={() => changeOperation(item.value)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="matrix-inputs">
          {renderMatrix('left', left, 'Matrix A')}
          {needsMatrixB && renderMatrix('right', right, 'Matrix B')}
        </div>

        <div className="advanced-quick-grid" aria-label="Matrix examples">
          {examples.map((example) => (
            <button key={example.label} onClick={() => loadExample(example)} type="button">
              {example.label}
            </button>
          ))}
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            Calculate matrix
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
              <strong>{resultText}</strong>
              <dl>
                <div>
                  <dt>Operation</dt>
                  <dd>{operations.find((item) => item.value === operation)?.label}</dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>{size}x{size}</dd>
                </div>
                <div>
                  <dt>Uses Matrix B</dt>
                  <dd>{needsMatrixB ? 'Yes' : 'No'}</dd>
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

      <section className="advanced-side-panel" aria-label="Matrix calculator history">
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
            <p>Recent matrix answers will appear here.</p>
          )}
        </section>

        <section className="advanced-note">
          <h2>Input tips</h2>
          <p>Add and subtract need Matrix A and Matrix B to be the same size.</p>
          <p>Matrix multiplication uses rows of Matrix A and columns of Matrix B, so order matters.</p>
          <p>Determinant and transpose only use Matrix A on this page.</p>
        </section>
      </section>
    </section>
  );
}
