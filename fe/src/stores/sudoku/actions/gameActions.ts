import { Difficulty, SudokuGrid } from "@/src/types/type";
import { visibleMap } from "@/src/stores/sudoku/utils";
import { SudokuState } from "@/src/stores/sudoku/types/shared";
import { generateSudoku } from "@/src/utils/sudokuGenerator";
import { GameActions } from "@/src/stores/sudoku/types/types";

export const useGameActions = (state: SudokuState): GameActions => {
  const resetGameState = (grid: SudokuGrid, solution: number[][]): void => {
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
    grid.forEach((row) =>
      row.forEach((cell) => {
        cell.drafts = [];
      })
    );
  };

  const newGame = (difficulty: Difficulty): void => {
    state.difficulty.value = difficulty;

    const visibleCount: number = visibleMap[difficulty]();
    const { grid, solution } = generateSudoku(visibleCount);

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
  } as const;
};
