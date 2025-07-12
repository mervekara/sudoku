export type SudokuCell = {
  value: number | null;
  isInitial: boolean;
  isError: boolean;
  isHint: boolean;
  wasCorrectOnce: boolean;
  drafts: number[];
};

export type SudokuGrid = SudokuCell[][];

export type Difficulty = "beginner" | "intermediate" | "hard" | "expert";

export type Score = {
  _id: string;
  name: string;
  score: number;
  level: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
