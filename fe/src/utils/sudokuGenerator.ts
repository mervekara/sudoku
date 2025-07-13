import type { SudokuGrid, SudokuCell } from "@/src/types/type";

const SIZE = 9 as const;
const BOX = 3 as const;
const VALID_NUMBERS = Array.from(
  { length: SIZE },
  (_, i) => i + 1,
) as ReadonlyArray<number>;
const MAX_ATTEMPTS = 100;

type Board = number[][];

function createEmptyCell(): SudokuCell {
  return {
    value: null,
    isInitial: false,
    isError: false,
    isHint: false,
    wasCorrectOnce: false,
    drafts: [],
  };
}

export function createEmptyGrid(): SudokuGrid {
  return Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, createEmptyCell),
  );
}

export function generateSudoku(visibleCount: number): {
  grid: SudokuGrid;
  solution: Board;
} {
  let solution: Board = [];
  let puzzle: SudokuGrid = [];

  for (let attempts = 0; attempts < MAX_ATTEMPTS; attempts++) {
    solution = generateSolvedBoard();
    puzzle = createEmptyGrid();
    revealRandomCells(puzzle, solution, visibleCount);

    const visibleBoard = extractVisibleCells(puzzle, solution);
    if (countSolutions(visibleBoard) === 1) {
      return { grid: puzzle, solution };
    }
  }

  console.warn("Could not generate a unique puzzle after many attempts.");
  return { grid: puzzle, solution };
}

export function isGridComplete(grid: SudokuGrid): boolean {
  return grid.every((row) =>
    row.every((cell) => cell.value !== null && !cell.isError),
  );
}

function generateSolvedBoard(): Board {
  const board: Board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

  function fill(index = 0): boolean {
    if (index === SIZE * SIZE) return true;

    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const shuffled = shuffle([...VALID_NUMBERS]);

    for (const num of shuffled) {
      if (isValidPlacement(board, row, col, num)) {
        board[row][col] = num;
        if (fill(index + 1)) return true;
        board[row][col] = 0;
      }
    }

    return false;
  }

  fill();
  return board;
}

function isValidPlacement(
  board: Board,
  row: number,
  col: number,
  num: number,
): boolean {
  for (let i = 0; i < SIZE; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }

  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;

  for (let i = 0; i < BOX; i++) {
    for (let j = 0; j < BOX; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function revealRandomCells(
  grid: SudokuGrid,
  solution: Board,
  count: number,
): void {
  const indices = shuffle(Array.from({ length: SIZE * SIZE }, (_, i) => i));
  let revealed = 0;

  for (const idx of indices) {
    if (revealed >= count) break;
    const row = Math.floor(idx / SIZE);
    const col = idx % SIZE;

    grid[row][col].value = solution[row][col];
    grid[row][col].isInitial = true;
    revealed++;
  }
}

function extractVisibleCells(grid: SudokuGrid, solution: Board): Board {
  return grid.map((row, i) =>
    row.map((cell, j) => (cell.isInitial ? solution[i][j] : 0)),
  );
}

function countSolutions(board: Board, max = 2): number {
  let count = 0;

  function solve(index = 0): boolean {
    if (count >= max) return true;
    if (index === SIZE * SIZE) {
      count++;
      return false;
    }

    const row = Math.floor(index / SIZE);
    const col = index % SIZE;

    if (board[row][col] !== 0) return solve(index + 1);

    for (const num of VALID_NUMBERS) {
      if (isValidPlacement(board, row, col, num)) {
        board[row][col] = num;
        if (solve(index + 1)) return true;
        board[row][col] = 0;
      }
    }

    return false;
  }

  solve();
  return count;
}
