import { Difficulty } from "@/src/types/type";

export interface GameActions {
  newGame: (difficulty: Difficulty) => void;
  selectCell: (row: number, col: number) => void;
  toggleEditMode: () => void;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface HintActions {
  useHint: () => void;
}

export interface HistoryActions {
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
}

export interface TimerActions {
  startTimer: () => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
}
