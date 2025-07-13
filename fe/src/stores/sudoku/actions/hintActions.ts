import { SudokuState } from "@/src/stores/sudoku/types/shared";
import { CellPosition, HintActions } from "@/src/stores/sudoku/types/types";

export const useHintActions = (state: SudokuState): HintActions => {
  const getEmptyCells = (): CellPosition[] => {
    return state.grid.value.flatMap((row, rowIndex) =>
      row.flatMap((cell, colIndex) => {
        return !cell.isInitial && cell.value === null
          ? [{ row: rowIndex, col: colIndex }]
          : [];
      })
    );
  };

  const useHint = (): void => {
    if (state.hintsLeft.value <= 0) return;

    const emptyCells: CellPosition[] = getEmptyCells();
    if (emptyCells.length === 0) return;

    const randomIndex: number = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    const cell = state.grid.value[row][col];

    cell.value = state.solution.value[row][col];
    cell.isHint = true;
    cell.wasCorrectOnce = true;

    state.score.value -= state.hintPenalty.value;
    state.hintPenalty.value++;
    state.hintsLeft.value--;
  };

  return {
    useHint,
  } as const;
};
