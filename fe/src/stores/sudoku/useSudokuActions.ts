import { Difficulty } from "@/src/types/type";
import { useGameActions } from "@/src/stores/sudoku/actions/gameActions";
import { useHintActions } from "@/src/stores/sudoku//actions/hintActions";
import { useHistoryActions } from "@/src/stores/sudoku/actions/historyActions";
import { useTimerActions } from "@/src/stores/sudoku/actions/timerActions";
import { useCellActions } from "@/src/stores/sudoku/actions/cellActions";
import { SudokuState } from "@/src/stores/sudoku/types/shared";

export const useSudokuActions = (state: SudokuState) => {
  const historyActions = useHistoryActions(state);
  const gameActions = useGameActions(state);
  const cellActions = useCellActions(state, historyActions.saveToHistory);
  const hintActions = useHintActions(state);
  const timerActions = useTimerActions(state);

  const newGame = (difficulty: Difficulty) => {
    gameActions.newGame(difficulty);
    timerActions.stopTimer();
    timerActions.startTimer();
  };

  return {
    newGame,
    selectCell: gameActions.selectCell,
    toggleEditMode: gameActions.toggleEditMode,

    inputCell: cellActions.inputCell,
    clearCell: cellActions.clearCell,
    addOrRemoveDraft: cellActions.addOrRemoveDraft,

    useHint: hintActions.useHint,

    undo: historyActions.undo,
    redo: historyActions.redo,

    startTimer: timerActions.startTimer,
    stopTimer: timerActions.stopTimer,
    pauseTimer: timerActions.pauseTimer,
    resumeTimer: timerActions.resumeTimer,
  };
};
