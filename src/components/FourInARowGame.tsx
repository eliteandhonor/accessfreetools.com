import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Bot,
  CircleArrowDown,
  RotateCcw,
  Trophy,
  Undo2,
  Users,
} from 'lucide-react';
import {
  FOUR_IN_A_ROW_COLUMNS,
  getFourInARowComputerMove,
  replayFourInARowMoves,
  type FourInARowMove,
  type FourInARowPlayer,
  type FourInARowState,
} from '../lib/fourInARow';
import { emitAftToolAction } from '../lib/aftToolAnalytics';

type GameMode = 'computer' | 'friend';
type RecordedOutcome = FourInARowPlayer | 'draw' | null;

interface SessionScore {
  one: number;
  two: number;
  draws: number;
}

const emptyScore: SessionScore = { one: 0, two: 0, draws: 0 };

function emitGameMilestone(action: string, clarityEvent: string) {
  emitAftToolAction({
    action: `${action} (round-v2)`,
    category: 'everyday-tools',
    clarityEvent: `${clarityEvent}_v2`,
    toolName: 'Four in a Row Game',
    toolSlug: 'four-in-a-row-game',
  });
}

export default function FourInARowGame() {
  const [mode, setMode] = useState<GameMode>('computer');
  const [moves, setMoves] = useState<FourInARowMove[]>([]);
  const [score, setScore] = useState<SessionScore>(emptyScore);
  const [recordedOutcome, setRecordedOutcome] = useState<RecordedOutcome>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [focusedColumn, setFocusedColumn] = useState(3);
  const columnButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const milestones = useRef({ started: false, completed: false });
  const restoreBoardFocus = useRef(false);
  const state = useMemo(() => replayFourInARowMoves(moves), [moves]);
  const activeColumn = state.playableColumns.includes(focusedColumn) ? focusedColumn
    : state.playableColumns.find((column) => column > focusedColumn) ?? state.playableColumns[0] ?? 3;
  const boardDisabled = state.isComplete || isThinking || (mode === 'computer' && state.currentPlayer === 'two');

  useEffect(() => {
    const movedAway = (event: FocusEvent) => {
      if (!columnButtons.current.includes(event.target as HTMLButtonElement)) restoreBoardFocus.current = false;
    };
    document.addEventListener('focusin', movedAway);
    return () => document.removeEventListener('focusin', movedAway);
  }, []);

  useLayoutEffect(() => {
    if (boardDisabled || !restoreBoardFocus.current) return;
    // Disabling a filled column or the computer's turn can move native focus to body.
    if (document.activeElement === document.body || columnButtons.current.includes(document.activeElement as HTMLButtonElement)) {
      columnButtons.current[activeColumn]?.focus();
    }
    restoreBoardFocus.current = false;
  }, [boardDisabled, activeColumn, moves]);

  function recordRound(nextState: FourInARowState) {
    const outcome: RecordedOutcome = nextState.isDraw ? 'draw' : nextState.winner;
    if (!outcome) return;

    if (!milestones.current.completed) {
      milestones.current.completed = true;
      emitGameMilestone('Complete round', 'four_in_a_row_complete');
    }
    setRecordedOutcome(outcome);
    setScore((current) => ({
      one: current.one + (outcome === 'one' ? 1 : 0),
      two: current.two + (outcome === 'two' ? 1 : 0),
      draws: current.draws + (outcome === 'draw' ? 1 : 0),
    }));
  }

  function playColumn(column: number) {
    if (
      state.isComplete ||
      isThinking ||
      !state.playableColumns.includes(column) ||
      (mode === 'computer' && state.currentPlayer === 'two')
    ) {
      return;
    }

    restoreBoardFocus.current = document.activeElement === columnButtons.current[column];
    if (!milestones.current.started) {
      milestones.current.started = true;
      emitGameMilestone(`Start round: ${mode}`, `four_in_a_row_start_${mode}`);
    }

    const nextMoves = [...moves, { column, player: state.currentPlayer }];
    const nextState = replayFourInARowMoves(nextMoves);
    setMoves(nextMoves);
    recordRound(nextState);
  }

  useEffect(() => {
    if (
      mode !== 'computer' ||
      state.currentPlayer !== 'two' ||
      state.isComplete
    ) {
      return undefined;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setIsThinking(true);
      try {
        const column = await getFourInARowComputerMove(state);
        if (cancelled) return;

        const nextMoves = [...moves, { column, player: 'two' as const }];
        const nextState = replayFourInARowMoves(nextMoves);
        setMoves(nextMoves);
        recordRound(nextState);
      } finally {
        if (!cancelled) setIsThinking(false);
      }
    }, 240);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [mode, moves, state]);

  function startRound(trackReplay = false) {
    if (trackReplay && milestones.current.completed) {
      emitGameMilestone('Replay round', 'four_in_a_row_replay');
    }

    milestones.current = { started: false, completed: false };
    restoreBoardFocus.current = false;
    setFocusedColumn(3);
    setMoves([]);
    setRecordedOutcome(null);
    setIsThinking(false);
  }

  function changeMode(nextMode: GameMode) {
    if (nextMode === mode) return;
    setMode(nextMode);
    setScore(emptyScore);
    startRound(false);
  }

  function undo() {
    if (moves.length === 0) return;

    if (recordedOutcome) {
      setScore((current) => ({
        one: Math.max(0, current.one - (recordedOutcome === 'one' ? 1 : 0)),
        two: Math.max(0, current.two - (recordedOutcome === 'two' ? 1 : 0)),
        draws: Math.max(0, current.draws - (recordedOutcome === 'draw' ? 1 : 0)),
      }));
      setRecordedOutcome(null);
    }

    const removeCount =
      mode === 'computer' && moves.at(-1)?.player === 'two' ? 2 : 1;
    setMoves((current) => current.slice(0, Math.max(0, current.length - removeCount)));
    setIsThinking(false);
  }

  function moveColumnFocus(key: string) {
    if (boardDisabled || !state.playableColumns.length) return;
    const columns = state.playableColumns;
    const index = columns.indexOf(activeColumn);
    let nextColumn = activeColumn;
    if (key === 'ArrowLeft') nextColumn = columns[(index + columns.length - 1) % columns.length];
    if (key === 'ArrowRight') nextColumn = columns[(index + 1) % columns.length];
    if (key === 'Home') nextColumn = columns[0];
    if (key === 'End') nextColumn = columns.at(-1)!;

    setFocusedColumn(nextColumn);
    columnButtons.current[nextColumn]?.focus();
  }

  const status = state.isDraw
    ? 'Round drawn.'
    : state.winner === 'one'
      ? mode === 'computer'
        ? 'You win the round.'
        : 'Player 1 wins the round.'
      : state.winner === 'two'
        ? mode === 'computer'
          ? 'Computer wins the round.'
          : 'Player 2 wins the round.'
        : isThinking
          ? 'Computer is choosing a column.'
          : mode === 'computer'
            ? 'Your turn. Choose a column.'
            : `Player ${state.currentPlayer === 'one' ? '1' : '2'}'s turn.`;

  const winningKeys = new Set(
    state.winningCells.map((cell) => `${cell.row}-${cell.column}`),
  );
  return (
    <section className="four-row-game" aria-labelledby="four-row-heading">
      <div className="four-row-game__topline">
        <div>
          <p className="four-row-game__eyebrow">Local browser game</p>
          <h2 id="four-row-heading">Four in a Row</h2>
        </div>
        <div className="four-row-game__mode" role="group" aria-label="Game mode">
          <button
            type="button"
            className={mode === 'computer' ? 'is-active' : ''}
            aria-pressed={mode === 'computer'}
            onClick={() => changeMode('computer')}
          >
            <Bot aria-hidden="true" size={18} />
            Play computer
          </button>
          <button
            type="button"
            className={mode === 'friend' ? 'is-active' : ''}
            aria-pressed={mode === 'friend'}
            onClick={() => changeMode('friend')}
          >
            <Users aria-hidden="true" size={18} />
            Play a friend
          </button>
        </div>
      </div>

      <div className="four-row-game__score" role="group" aria-label="Session score">
        <span>
          <i className="four-row-piece four-row-piece--one" aria-hidden="true" />
          {mode === 'computer' ? 'You' : 'Player 1'} <strong>{score.one}</strong>
        </span>
        <span>
          <Trophy aria-hidden="true" size={17} /> Draws <strong>{score.draws}</strong>
        </span>
        <span>
          <i className="four-row-piece four-row-piece--two" aria-hidden="true" />
          {mode === 'computer' ? 'Computer' : 'Player 2'} <strong>{score.two}</strong>
        </span>
      </div>

      <p className="four-row-game__status" role="status" aria-live="polite">
        {status}
      </p>

      <div className="four-row-game__column-controls" role="group" aria-label="Choose a column">
        {Array.from({ length: FOUR_IN_A_ROW_COLUMNS }, (_, column) => {
          const isFull = !state.playableColumns.includes(column);
          return (
            <button
              key={column}
              type="button"
              ref={(button) => {
                columnButtons.current[column] = button;
              }}
              tabIndex={column === activeColumn ? 0 : -1}
              disabled={boardDisabled || isFull}
              aria-label={isFull ? `Column ${column + 1} is full` : `Drop in column ${column + 1}`}
              title={isFull ? `Column ${column + 1} is full` : `Drop in column ${column + 1}`}
              onFocus={() => setFocusedColumn(column)}
              onKeyDown={(event) => {
                if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                  event.preventDefault();
                  moveColumnFocus(event.key);
                }
              }}
              onClick={() => playColumn(column)}
            >
              <CircleArrowDown aria-hidden="true" size={21} />
              <span aria-hidden="true">{column + 1}</span>
            </button>
          );
        })}
      </div>

      <div
        className="four-row-game__board"
        role="grid"
        aria-label="Four in a Row board, 7 columns by 6 rows"
        aria-rowcount={6}
        aria-colcount={7}
      >
        {state.board.map((row, rowIndex) => (
          <span className="four-row-game__row" role="row" key={rowIndex}>
            {row.map((cell, columnIndex) => {
              const cellLabel = cell
                ? `${cell === 'one' ? (mode === 'computer' ? 'Your' : 'Player 1') : mode === 'computer' ? 'Computer' : 'Player 2'} piece`
                : 'Empty';
              const isWinning = winningKeys.has(`${rowIndex}-${columnIndex}`);
              return (
                <span
                  key={`${rowIndex}-${columnIndex}`}
                  className={`four-row-game__slot${cell ? ` has-${cell}` : ''}${isWinning ? ' is-winning' : ''}`}
                  role="gridcell"
                  aria-rowindex={rowIndex + 1}
                  aria-colindex={columnIndex + 1}
                  aria-label={`Row ${rowIndex + 1}, column ${columnIndex + 1}: ${cellLabel}`}
                >
                  <i aria-hidden="true" />
                </span>
              );
            })}
          </span>
        ))}
      </div>

      <div className="four-row-game__actions">
        <button type="button" onClick={undo} disabled={moves.length === 0}>
          <Undo2 aria-hidden="true" size={18} />
          Undo
        </button>
        <button
          type="button"
          className="primary"
          data-aft-analytics-manual="true"
          onClick={() => startRound(state.isComplete)}
        >
          <RotateCcw aria-hidden="true" size={18} />
          {state.isComplete ? 'Play again' : 'New round'}
        </button>
      </div>
    </section>
  );
}
