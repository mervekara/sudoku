import type { SudokuGrid, SudokuCell } from "../types/type";

const SIZE = 9;
const BOX = 3;

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
    Array.from({ length: SIZE }, createEmptyCell)
  );
}

export function generateSudoku(visibleCount: number): {
  grid: SudokuGrid;
  solution: Board;
} {
  let solution: Board = [];
  let puzzle: SudokuGrid = [];

  const MAX_ATTEMPTS = 100;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    solution = generateSolvedBoard();
    puzzle = createEmptyGrid();
    revealRandomCells(puzzle, solution, visibleCount);

    const temp = extractVisibleCells(puzzle, solution);
    const unique = countSolutions(temp);

    if (unique === 1) break;
  }

  if (attempts === MAX_ATTEMPTS) {
    console.warn("Could not generate a unique puzzle after many attempts.");
  }

  return { grid: puzzle, solution };
}

export function isGridComplete(grid: SudokuGrid): boolean {
  return grid.every((row) =>
    row.every((cell) => cell.value !== null && !cell.isError)
  );
}

function generateSolvedBoard(): Board {
  const board: Board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

  function fill(index = 0): boolean {
    if (index === SIZE * SIZE) return true;

    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of nums) {
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
  num: number
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
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function revealRandomCells(
  grid: SudokuGrid,
  solution: Board,
  count: number
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
    row.map((cell, j) => (cell.isInitial ? solution[i][j] : 0))
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

    for (let num = 1; num <= 9; num++) {
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
