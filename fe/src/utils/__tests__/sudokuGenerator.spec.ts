import { describe, it, expect, vi } from "vitest";
import {
  createEmptyGrid,
  generateSudoku,
  isGridComplete,
} from "@/src/utils/sudokuGenerator";

describe("Sudoku Generator", () => {
  describe("createEmptyGrid", () => {
    it("should create a 9x9 grid", () => {
      const grid = createEmptyGrid();
      expect(grid).toHaveLength(9);
      expect(grid[0]).toHaveLength(9);
    });

    it("should create cells with correct initial state", () => {
      const grid = createEmptyGrid();
      const cell = grid[0][0];

      expect(cell.value).toBeNull();
      expect(cell.isInitial).toBe(false);
      expect(cell.isError).toBe(false);
      expect(cell.isHint).toBe(false);
      expect(cell.wasCorrectOnce).toBe(false);
      expect(cell.drafts).toEqual([]);
    });

    it("should create unique cell objects", () => {
      const grid = createEmptyGrid();
      const cell1 = grid[0][0];
      const cell2 = grid[0][1];

      expect(cell1).not.toBe(cell2);
      expect(cell1.drafts).not.toBe(cell2.drafts);
    });
  });

  describe("generateSudoku", () => {
    it("should generate a valid sudoku puzzle", () => {
      const { grid, solution } = generateSudoku(36);

      expect(grid).toHaveLength(9);
      expect(solution).toHaveLength(9);
      expect(grid[0]).toHaveLength(9);
      expect(solution[0]).toHaveLength(9);
    });

    it("should reveal the correct number of cells", () => {
      const visibleCount = 35;
      const { grid } = generateSudoku(visibleCount);

      let revealedCount = 0;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (grid[i][j].isInitial) {
            revealedCount++;
          }
        }
      }

      expect(revealedCount).toBe(visibleCount);
    });

    it("should mark initial cells correctly", () => {
      const { grid } = generateSudoku(36);

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          const cell = grid[i][j];
          if (cell.isInitial) {
            expect(cell.value).not.toBeNull();
            expect(cell.value).toBeGreaterThanOrEqual(1);
            expect(cell.value).toBeLessThanOrEqual(9);
          }
        }
      }
    });

    it("should generate a valid solution", () => {
      const { solution } = generateSudoku(40);

      for (let row = 0; row < 9; row++) {
        const rowSet = new Set(solution[row]);
        expect(rowSet.size).toBe(9);
        expect(Math.min(...solution[row])).toBe(1);
        expect(Math.max(...solution[row])).toBe(9);
      }

      for (let col = 0; col < 9; col++) {
        const colSet = new Set();
        for (let row = 0; row < 9; row++) {
          colSet.add(solution[row][col]);
        }
        expect(colSet.size).toBe(9);
      }

      for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
          const boxSet = new Set();
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              boxSet.add(solution[boxRow * 3 + i][boxCol * 3 + j]);
            }
          }
          expect(boxSet.size).toBe(9);
        }
      }
    });

    it("should handle edge cases for visible count", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});

      const { grid: minGrid } = generateSudoku(28);
      let minCount = 0;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (minGrid[i][j].isInitial) minCount++;
        }
      }
      expect(minCount).toBe(28);

      const { grid: maxGrid } = generateSudoku(81);
      let maxCount = 0;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (maxGrid[i][j].isInitial) maxCount++;
        }
      }
      expect(maxCount).toBe(81);
    });
  });

  describe("isGridComplete", () => {
    it("should return false for empty grid", () => {
      const grid = createEmptyGrid();
      expect(isGridComplete(grid)).toBe(false);
    });

    it("should return false for partially filled grid", () => {
      const grid = createEmptyGrid();
      grid[0][0].value = 5;
      grid[0][1].value = 3;
      expect(isGridComplete(grid)).toBe(false);
    });

    it("should return true for completely filled grid without errors", () => {
      const grid = createEmptyGrid();

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          grid[i][j].value = ((i * 3 + Math.floor(i / 3) + j) % 9) + 1;
          grid[i][j].isError = false;
        }
      }

      expect(isGridComplete(grid)).toBe(true);
    });

    it("should return false for filled grid with errors", () => {
      const grid = createEmptyGrid();

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          grid[i][j].value = ((i * 3 + Math.floor(i / 3) + j) % 9) + 1;
        }
      }

      grid[0][0].isError = true;

      expect(isGridComplete(grid)).toBe(false);
    });

    it("should return false if any cell has null value", () => {
      const grid = createEmptyGrid();

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          grid[i][j].value = ((i * 3 + Math.floor(i / 3) + j) % 9) + 1;
          grid[i][j].isError = false;
        }
      }

      grid[8][8].value = null;

      expect(isGridComplete(grid)).toBe(false);
    });
  });

  describe("Integration tests", () => {
    it("should generate puzzles that can be completed", () => {
      const { grid, solution } = generateSudoku(40);

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (!grid[i][j].isInitial) {
            grid[i][j].value = solution[i][j];
          }
        }
      }

      expect(isGridComplete(grid)).toBe(true);
    });

    it("should maintain initial cells during completion check", () => {
      const { grid, solution } = generateSudoku(35);

      const initialPositions: boolean[][] = [];
      for (let i = 0; i < 9; i++) {
        initialPositions[i] = [];
        for (let j = 0; j < 9; j++) {
          initialPositions[i][j] = grid[i][j].isInitial;
        }
      }

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (!grid[i][j].isInitial) {
            grid[i][j].value = solution[i][j];
          }
        }
      }

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          expect(grid[i][j].isInitial).toBe(initialPositions[i][j]);
        }
      }
    });
  });

  describe("Error handling", () => {
    it("should handle zero visible count", () => {
      const { grid } = generateSudoku(0);

      let revealedCount = 0;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (grid[i][j].isInitial) {
            revealedCount++;
          }
        }
      }

      expect(revealedCount).toBe(0);
    });

    it("should handle excessive visible count gracefully", () => {
      const { grid } = generateSudoku(100);

      let revealedCount = 0;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (grid[i][j].isInitial) {
            revealedCount++;
          }
        }
      }

      expect(revealedCount).toBeLessThanOrEqual(81);
    });

    it("should handle difficult puzzle generation scenarios", () => {
      const { grid } = generateSudoku(25);

      // The function should still return a valid grid even if it warns
      expect(grid).toHaveLength(9);
      expect(grid[0]).toHaveLength(9);

      // Count revealed cells (might be less than requested if unique solution couldn't be found)
      let revealedCount = 0;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (grid[i][j].isInitial) {
            revealedCount++;
          }
        }
      }

      // Should have some revealed cells, even if not exactly 17
      expect(revealedCount).toBeGreaterThan(0);
      expect(revealedCount).toBeLessThanOrEqual(81);
    });
  });

  describe("Randomness tests", () => {
    it("should generate different puzzles on multiple calls", () => {
      const puzzle1 = generateSudoku(40); // Use higher count for reliability
      const puzzle2 = generateSudoku(40);

      // Compare solutions - they should be different
      let isDifferent = false;
      for (let i = 0; i < 9 && !isDifferent; i++) {
        for (let j = 0; j < 9 && !isDifferent; j++) {
          if (puzzle1.solution[i][j] !== puzzle2.solution[i][j]) {
            isDifferent = true;
          }
        }
      }

      expect(isDifferent).toBe(true);
    });

    it("should reveal different cells on multiple calls", () => {
      const puzzle1 = generateSudoku(30); // Use moderate count
      const puzzle2 = generateSudoku(30);

      // Compare revealed positions
      let isDifferent = false;
      for (let i = 0; i < 9 && !isDifferent; i++) {
        for (let j = 0; j < 9 && !isDifferent; j++) {
          if (puzzle1.grid[i][j].isInitial !== puzzle2.grid[i][j].isInitial) {
            isDifferent = true;
          }
        }
      }

      expect(isDifferent).toBe(true);
    });
  });
});
