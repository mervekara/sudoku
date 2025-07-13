import { defineStore } from "pinia";
import { useSudokuState } from "@/src/stores/sudoku/state";
import { useSudokuActions } from "@/src/stores/sudoku/useSudokuActions";

export const useSudokuStore = defineStore("sudoku", () => {
  const state = useSudokuState();
  const actions = useSudokuActions(state);

  return {
    ...state,
    ...actions,
  };
});
