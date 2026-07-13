import {
  BoardBase,
  BoardPiece,
  PlayerAi,
  getMockPlayerAction,
} from '@kenrick95/c4';

export const FOUR_IN_A_ROW_ROWS = BoardBase.ROWS;
export const FOUR_IN_A_ROW_COLUMNS = BoardBase.COLUMNS;

export type FourInARowPlayer = 'one' | 'two';
export type FourInARowCell = FourInARowPlayer | null;

export interface FourInARowMove {
  column: number;
  player: FourInARowPlayer;
}

export interface FourInARowCoordinate {
  row: number;
  column: number;
}

export interface FourInARowState {
  board: FourInARowCell[][];
  currentPlayer: FourInARowPlayer;
  winner: FourInARowPlayer | null;
  isDraw: boolean;
  isComplete: boolean;
  playableColumns: number[];
  winningCells: FourInARowCoordinate[];
}

const playerPiece: Record<FourInARowPlayer, BoardPiece> = {
  one: BoardPiece.PLAYER_1,
  two: BoardPiece.PLAYER_2,
};

function fromBoardPiece(piece: BoardPiece): FourInARowCell {
  if (piece === BoardPiece.PLAYER_1) return 'one';
  if (piece === BoardPiece.PLAYER_2) return 'two';
  return null;
}

function findWinningCells(
  board: FourInARowCell[][],
  winner: FourInARowPlayer | null,
): FourInARowCoordinate[] {
  if (!winner) return [];

  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ] as const;

  for (let row = 0; row < FOUR_IN_A_ROW_ROWS; row += 1) {
    for (let column = 0; column < FOUR_IN_A_ROW_COLUMNS; column += 1) {
      if (board[row]?.[column] !== winner) continue;

      for (const [rowStep, columnStep] of directions) {
        const cells = Array.from({ length: 4 }, (_, index) => ({
          row: row + rowStep * index,
          column: column + columnStep * index,
        }));
        const isWinningLine = cells.every(
          (cell) =>
            cell.row >= 0 &&
            cell.row < FOUR_IN_A_ROW_ROWS &&
            cell.column >= 0 &&
            cell.column < FOUR_IN_A_ROW_COLUMNS &&
            board[cell.row]?.[cell.column] === winner,
        );
        if (isWinningLine) return cells;
      }
    }
  }

  return [];
}

export function replayFourInARowMoves(moves: FourInARowMove[]): FourInARowState {
  const engineBoard = new BoardBase();
  let expectedPlayer: FourInARowPlayer = 'one';

  moves.forEach((move, index) => {
    if (move.player !== expectedPlayer) {
      throw new Error(`Move ${index + 1} is out of turn.`);
    }
    if (!Number.isInteger(move.column) || move.column < 0 || move.column >= FOUR_IN_A_ROW_COLUMNS) {
      throw new Error(`Move ${index + 1} uses an invalid column.`);
    }
    if (engineBoard.getWinner() !== BoardPiece.EMPTY) {
      throw new Error(`Move ${index + 1} was made after the round ended.`);
    }

    const result = getMockPlayerAction(
      engineBoard.map,
      playerPiece[move.player],
      move.column,
    );
    if (!result.success) {
      throw new Error(`Move ${index + 1} uses a full column.`);
    }

    engineBoard.map = result.map;
    expectedPlayer = expectedPlayer === 'one' ? 'two' : 'one';
  });

  const resultPiece = engineBoard.getWinner();
  const winner =
    resultPiece === BoardPiece.PLAYER_1
      ? 'one'
      : resultPiece === BoardPiece.PLAYER_2
        ? 'two'
        : null;
  const board = engineBoard.map.map((row) => row.map(fromBoardPiece));

  return {
    board,
    currentPlayer: expectedPlayer,
    winner,
    isDraw: resultPiece === BoardPiece.DRAW,
    isComplete: resultPiece !== BoardPiece.EMPTY,
    playableColumns: Array.from(
      { length: FOUR_IN_A_ROW_COLUMNS },
      (_, column) => column,
    ).filter((column) => engineBoard.map[0]?.[column] === BoardPiece.EMPTY),
    winningCells: findWinningCells(board, winner),
  };
}

export async function getFourInARowComputerMove(
  state: FourInARowState,
): Promise<number> {
  if (state.isComplete || state.currentPlayer !== 'two') {
    throw new Error('The computer can only move on player two\'s active turn.');
  }

  const engineBoard = new BoardBase();
  engineBoard.map = state.board.map((row) =>
    row.map((cell) => (cell ? playerPiece[cell] : BoardPiece.EMPTY)),
  );
  const computer = new PlayerAi(BoardPiece.PLAYER_2, 'Computer');
  const column = await computer.getAction(engineBoard);

  if (!state.playableColumns.includes(column)) {
    throw new Error('The computer returned an illegal move.');
  }

  return column;
}
