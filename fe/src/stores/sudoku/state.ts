import { Difficulty, SudokuGrid } from "@/src/types/type";
import { createEmptyGrid } from "@/src/utils/sudokuGenerator";
import { ref } from "vue";

export const useSudokuState = () => ({
  grid: ref<SudokuGrid>(createEmptyGrid()),
  solution: ref<number[][]>([]),
  selectedCell: ref<{ row: number; col: number } | null>(null),
  difficulty: ref<Difficulty>("beginner"),
  isEditMode: ref(false),
  timer: ref(0),
  timerActive: ref(false),
  isPaused: ref(false),
  pauseReason: ref<null | "manual" | "focus">(null),
  score: ref(0),
  hintsLeft: ref(10),
  hintPenalty: ref(3),
  history: ref<SudokuGrid[]>([]),
  future: ref<SudokuGrid[]>([]),
});
