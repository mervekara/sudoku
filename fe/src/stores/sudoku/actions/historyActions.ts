import { SudokuGrid } from "@/src/types/type";
import { deepClone } from "@/src/stores/sudoku/utils";
import { SudokuState } from "@/src/stores/sudoku/types/shared";
import { HistoryActions } from "@/src/stores/sudoku/types/types";

export const useHistoryActions = (state: SudokuState): HistoryActions => {
  const saveToHistory = (): void => {
    const clonedGrid: SudokuGrid = deepClone(state.grid.value);
    state.history.value.push(clonedGrid);
  };

  const restoreWasCorrectOnce = (targetGrid: SudokuGrid): void => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        targetGrid[row][col].wasCorrectOnce =
          state.grid.value[row][col].wasCorrectOnce;
      }
    }
  };

  const undo = (): void => {
    if (state.history.value.length === 0) return;

    const currentGrid: SudokuGrid = deepClone(state.grid.value);
    state.future.value.push(currentGrid);

    const previousState: SudokuGrid | undefined = state.history.value.pop();
    if (!previousState) return;

    restoreWasCorrectOnce(previousState);
    state.grid.value = previousState;
  };

  const redo = (): void => {
    if (state.future.value.length === 0) return;

    const currentGrid: SudokuGrid = deepClone(state.grid.value);
    state.history.value.push(currentGrid);

    const nextState: SudokuGrid | undefined = state.future.value.pop();
    if (!nextState) return;

    restoreWasCorrectOnce(nextState);
    state.grid.value = nextState;
  };

  return {
    saveToHistory,
    undo,
    redo,
  } as const;
};
