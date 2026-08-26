export type HexBitwiseOperator = '&' | '|' | '^';

export interface HexBitwiseOperationResult {
  left: bigint;
  operator: HexBitwiseOperator;
  right: bigint;
  result: bigint;
}

export function isHexBitwiseOperator(operator: string): operator is HexBitwiseOperator {
  return operator === '&' || operator === '|' || operator === '^';
}

export function calculateHexBitwiseOperation(
  left: bigint,
  operator: HexBitwiseOperator,
  right: bigint,
): HexBitwiseOperationResult {
  if (left < 0n || right < 0n) {
    throw new Error('Bitwise operations need zero or positive hex numbers');
  }

  const result = operator === '&' ? left & right : operator === '|' ? left | right : left ^ right;

  return { left, operator, right, result };
}
