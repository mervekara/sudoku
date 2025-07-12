import { SudokuState } from "../types/shared";

export const useHintActions = (state: SudokuState) => {
  const getEmptyCells = () => {
    return state.grid.value.flatMap((row, i) =>
      row.flatMap((cell, j) =>
        !cell.isInitial && cell.value === null ? [{ row: i, col: j }] : []
      )
    );
  };

  const useHint = (): void => {
    if (state.hintsLeft.value <= 0) return;

    const emptyCells = getEmptyCells();
    if (emptyCells.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
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
  };
};
