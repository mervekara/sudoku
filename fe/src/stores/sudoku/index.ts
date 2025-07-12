import { defineStore } from "pinia";
import { useSudokuState } from "./state";
import { useSudokuActions } from "./useSudokuActions";

export const useSudokuStore = defineStore("sudoku", () => {
  const state = useSudokuState();
  const actions = useSudokuActions(state);

  return {
    ...state,
    ...actions,
  };
});
