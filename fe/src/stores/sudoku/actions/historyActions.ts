import { SudokuGrid } from "@/src/types/type";
import { deepClone } from "../utils";
import { SudokuState } from "../types/shared";

export const useHistoryActions = (state: SudokuState) => {
  const saveToHistory = (): void => {
    state.history.value.push(deepClone(state.grid.value));
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

    state.future.value.push(deepClone(state.grid.value));
    const previousState = state.history.value.pop()!;

    restoreWasCorrectOnce(previousState);
    state.grid.value = previousState;
  };

  const redo = (): void => {
    if (state.future.value.length === 0) return;

    state.history.value.push(deepClone(state.grid.value));
    const nextState = state.future.value.pop()!;

    restoreWasCorrectOnce(nextState);
    state.grid.value = nextState;
  };

  return {
    saveToHistory,
    undo,
    redo,
  };
};
