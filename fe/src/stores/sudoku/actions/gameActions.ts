import { Difficulty, SudokuGrid } from "@/src/types/type";
import { visibleMap } from "../utils";
import { SudokuState } from "../types/shared";
import { generateSudoku } from "../../../utils/sudokuGenerator";

export const useGameActions = (state: SudokuState) => {
  const resetGameState = (grid: SudokuGrid, solution: SudokuGrid): void => {
    state.grid.value = grid;
    state.solution.value = solution;
    state.score.value = 0;
    state.hintsLeft.value = 10;
    state.hintPenalty.value = 3;
    state.selectedCell.value = null;
    state.history.value = [];
    state.future.value = [];
    state.timer.value = 0;
  };

  const initializeCellDrafts = (grid: SudokuGrid): void => {
    grid.forEach((row) => row.forEach((cell) => (cell.drafts = [])));
  };

  const newGame = (difficulty: Difficulty): void => {
    state.difficulty.value = difficulty;
    const visible = visibleMap[difficulty]();
    const { grid, solution } = generateSudoku(visible);

    initializeCellDrafts(grid);
    resetGameState(grid, solution);
  };

  const selectCell = (row: number, col: number): void => {
    state.selectedCell.value = { row, col };
  };

  const toggleEditMode = (): void => {
    state.isEditMode.value = !state.isEditMode.value;
  };

  return {
    newGame,
    selectCell,
    toggleEditMode,
  };
};
