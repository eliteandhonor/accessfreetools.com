import { describe, expect, it } from 'vitest';
import {
  FOUR_IN_A_ROW_COLUMNS,
  getFourInARowComputerMove,
  replayFourInARowMoves,
  type FourInARowMove,
} from './fourInARow';

function moves(columns: number[]): FourInARowMove[] {
  return columns.map((column, index) => ({
    column,
    player: index % 2 === 0 ? 'one' : 'two',
  }));
}

describe('four in a row engine adapter', () => {
  it('drops pieces into legal columns and follows turn order', () => {
    const state = replayFourInARowMoves(moves([3, 4, 3]));

    expect(state.board[5]?.[3]).toBe('one');
    expect(state.board[4]?.[3]).toBe('one');
    expect(state.board[5]?.[4]).toBe('two');
    expect(state.currentPlayer).toBe('two');
    expect(state.isComplete).toBe(false);
  });

  it('rejects invalid, out-of-turn, and full-column moves', () => {
    expect(() => replayFourInARowMoves([{ column: 7, player: 'one' }])).toThrow(
      'invalid column',
    );
    expect(() => replayFourInARowMoves([{ column: 0, player: 'two' }])).toThrow(
      'out of turn',
    );
    expect(() => replayFourInARowMoves(moves([0, 0, 0, 0, 0, 0, 0]))).toThrow(
      'full column',
    );
  });

  it.each([
    ['horizontal', [0, 0, 1, 1, 2, 2, 3]],
    ['vertical', [0, 1, 0, 1, 0, 1, 0]],
    ['rising diagonal', [0, 1, 1, 2, 4, 2, 2, 3, 4, 3, 5, 3, 3]],
    ['falling diagonal', [3, 2, 2, 1, 5, 1, 1, 0, 5, 0, 6, 0, 0]],
  ])('detects a %s win and its four cells', (_label, columns) => {
    const state = replayFourInARowMoves(moves(columns as number[]));

    expect(state.winner).toBe('one');
    expect(state.winningCells).toHaveLength(4);
    expect(state.isComplete).toBe(true);
  });

  it('detects a full-board draw', () => {
    const drawColumns = [
      4, 0, 2, 3, 5, 0, 4, 0, 3, 5, 1, 3, 4, 6, 0, 5, 6, 6, 3, 1, 2,
      5, 2, 1, 6, 2, 2, 2, 5, 4, 3, 0, 5, 6, 0, 6, 3, 4, 4, 1, 1, 1,
    ];
    const state = replayFourInARowMoves(moves(drawColumns));

    expect(state.isDraw).toBe(true);
    expect(state.winner).toBeNull();
    expect(state.playableColumns).toHaveLength(0);
  });

  it('supports undo by replaying a shortened move history', () => {
    const history = moves([0, 1, 0, 1]);
    const beforeUndo = replayFourInARowMoves(history);
    const afterUndo = replayFourInARowMoves(history.slice(0, -2));

    expect(beforeUndo.board.flat().filter(Boolean)).toHaveLength(4);
    expect(afterUndo.board.flat().filter(Boolean)).toHaveLength(2);
    expect(afterUndo.currentPlayer).toBe('one');
  });

  it('returns a legal computer move', async () => {
    const state = replayFourInARowMoves(moves([3]));
    const column = await getFourInARowComputerMove(state);

    expect(column).toBeGreaterThanOrEqual(0);
    expect(column).toBeLessThan(FOUR_IN_A_ROW_COLUMNS);
    expect(state.playableColumns).toContain(column);
  });
});
