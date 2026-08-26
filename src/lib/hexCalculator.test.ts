import { describe, expect, it } from 'vitest';
import { calculateHexBitwiseOperation, isHexBitwiseOperator } from './hexCalculator';

describe('hex bitwise operations', () => {
  it('calculates AND, OR, and XOR with arbitrary-size non-negative integers', () => {
    expect(calculateHexBitwiseOperation(0xF0n, '&', 0xCCn).result).toBe(0xC0n);
    expect(calculateHexBitwiseOperation(0xF0n, '|', 0x0Fn).result).toBe(0xFFn);
    expect(calculateHexBitwiseOperation(0xAAn, '^', 0xFFn).result).toBe(0x55n);
    expect(calculateHexBitwiseOperation(0xFFFFFFFFn, '^', 0xFFFF0000n).result).toBe(0x0000FFFFn);
  });

  it('rejects negative operands because no fixed bit width is selected', () => {
    expect(() => calculateHexBitwiseOperation(-1n, '&', 0xFFn)).toThrow(
      'Bitwise operations need zero or positive hex numbers',
    );
  });

  it('recognizes only the supported bitwise operators', () => {
    expect(isHexBitwiseOperator('&')).toBe(true);
    expect(isHexBitwiseOperator('|')).toBe(true);
    expect(isHexBitwiseOperator('^')).toBe(true);
    expect(isHexBitwiseOperator('+')).toBe(false);
  });
});
