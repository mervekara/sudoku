import { Difficulty } from "@/src/types/type";
import { useCellActions } from "./actions/cellActions";
import { useGameActions } from "./actions/gameActions";
import { useHintActions } from "./actions/hintActions";
import { useHistoryActions } from "./actions/historyActions";
import { useTimerActions } from "./actions/timerActions";
import { SudokuState } from "./types/shared";

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
