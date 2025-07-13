import { SudokuCell } from "@/src/types/type";
import { SudokuState } from "@/src/stores/sudoku/types/shared";

export const useCellActions = (
  state: SudokuState,
  saveToHistory: () => void,
): {
  inputCell: (row: number, col: number, value: number) => void;
  clearCell: (row: number, col: number) => void;
  addOrRemoveDraft: (row: number, col: number, value: number) => void;
} => {
  const updateScore = (cell: SudokuCell, isCorrect: boolean): void => {
    if (isCorrect) {
      if (!cell.wasCorrectOnce) {
        state.score.value += 5;
        cell.wasCorrectOnce = true;
      }
    } else {
      state.score.value -= 1;
    }
  };

  const inputCell = (row: number, col: number, value: number): void => {
    const cell = state.grid.value[row][col];
    if (cell.isInitial) return;

    saveToHistory();

    const isCorrect: boolean = state.solution.value[row][col] === value;

    cell.value = value;
    cell.drafts = [];
    cell.isError = !isCorrect;

    updateScore(cell, isCorrect);
    state.future.value = [];
  };

  const clearCell = (row: number, col: number): void => {
    const cell = state.grid.value[row][col];
    if (cell.isInitial) return;

    saveToHistory();

    cell.value = null;
    cell.isError = false;
    cell.drafts = [];
  };

  const addOrRemoveDraft = (row: number, col: number, value: number): void => {
    const cell = state.grid.value[row][col];
    if (cell.isInitial || cell.value !== null) return;

    const draftIndex: number = cell.drafts.indexOf(value);

    if (draftIndex === -1) {
      cell.drafts.push(value);
      cell.drafts.sort((a, b) => a - b);
    } else {
      cell.drafts.splice(draftIndex, 1);
    }
  };

  return {
    inputCell,
    clearCell,
    addOrRemoveDraft,
  } as const;
};
