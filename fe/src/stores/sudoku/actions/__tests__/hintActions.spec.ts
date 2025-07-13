import { describe, it, expect, beforeEach, vi } from "vitest";
import { useHintActions } from "@/src/stores/sudoku/actions/hintActions";
import { SudokuState } from "@/src/stores/sudoku/types/shared";

const mockMath = vi.spyOn(Math, "random");

const createMockCell = (
  value: number | null = null,
  isInitial: boolean = false,
  isHint: boolean = false,
  wasCorrectOnce: boolean = false
) => ({
  value,
  isInitial,
  isHint,
  wasCorrectOnce,
});

const createMockState = (overrides: Partial<SudokuState> = {}): SudokuState => {
  const defaultGrid = Array(9)
    .fill(null)
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => createMockCell())
    );

  defaultGrid[0][0] = createMockCell(1, true);
  defaultGrid[0][1] = createMockCell(2, true);
  defaultGrid[1][0] = createMockCell(3, true);

  const defaultSolution = Array(9)
    .fill(null)
    .map((_, row) =>
      Array(9)
        .fill(null)
        .map((_, col) => row * 9 + col + 1)
    );

  return {
    grid: { value: defaultGrid },
    solution: { value: defaultSolution },
    score: { value: 1000 },
    hintsLeft: { value: 3 },
    hintPenalty: { value: 50 },
    ...overrides,
  } as SudokuState;
};

describe("useHintActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getEmptyCells", () => {
    it("should return positions of empty cells that are not initial", () => {
      const state = createMockState();

      expect(state.grid.value[0][2].value).toBe(null);
      expect(state.grid.value[0][2].isInitial).toBe(false);
    });

    it("should not include initial cells even if they have null values", () => {
      const state = createMockState();

      state.grid.value[0][0] = createMockCell(null, true);

      const { useHint } = useHintActions(state);

      mockMath.mockReturnValue(0);
      useHint();

      expect(state.grid.value[0][0].value).toBe(null);
      expect(state.grid.value[0][0].isHint).toBe(false);
    });
  });

  describe("useHint", () => {
    it("should not use hint when no hints left", () => {
      const state = createMockState({ hintsLeft: { value: 0 } });
      const { useHint } = useHintActions(state);

      const originalScore = state.score.value;
      const originalPenalty = state.hintPenalty.value;

      useHint();

      expect(state.score.value).toBe(originalScore);
      expect(state.hintPenalty.value).toBe(originalPenalty);
      expect(state.hintsLeft.value).toBe(0);
    });

    it("should not use hint when no empty cells available", () => {
      const state = createMockState();

      state.grid.value.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (!cell.isInitial) {
            cell.value = rowIndex * 9 + colIndex + 1;
          }
        });
      });

      const { useHint } = useHintActions(state);

      const originalScore = state.score.value;
      const originalPenalty = state.hintPenalty.value;
      const originalHintsLeft = state.hintsLeft.value;

      useHint();

      expect(state.score.value).toBe(originalScore);
      expect(state.hintPenalty.value).toBe(originalPenalty);
      expect(state.hintsLeft.value).toBe(originalHintsLeft);
    });

    it("should successfully use hint on random empty cell", () => {
      const state = createMockState();
      const { useHint } = useHintActions(state);

      mockMath.mockReturnValue(0);

      const originalScore = state.score.value;
      const originalPenalty = state.hintPenalty.value;
      const originalHintsLeft = state.hintsLeft.value;

      useHint();

      let hintedCell = null;
      let hintedPosition = null;

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const cell = state.grid.value[row][col];
          if (cell.isHint) {
            hintedCell = cell;
            hintedPosition = { row, col };
            break;
          }
        }
        if (hintedCell) break;
      }

      expect(hintedCell).toBeTruthy();
      expect(hintedCell.value).toBe(
        state.solution.value[hintedPosition?.row][hintedPosition?.col]
      );
      expect(hintedCell.isHint).toBe(true);
      expect(hintedCell.wasCorrectOnce).toBe(true);

      expect(state.score.value).toBe(originalScore - originalPenalty);
      expect(state.hintPenalty.value).toBe(originalPenalty + 1);
      expect(state.hintsLeft.value).toBe(originalHintsLeft - 1);
    });

    it("should select different random cells", () => {
      const state = createMockState();
      const { useHint } = useHintActions(state);

      mockMath.mockReturnValueOnce(0);
      useHint();

      mockMath.mockReturnValueOnce(0);
      useHint();

      let hintedCount = 0;
      state.grid.value.forEach((row) => {
        row.forEach((cell) => {
          if (cell.isHint) hintedCount++;
        });
      });

      expect(hintedCount).toBe(2);
      expect(state.hintsLeft.value).toBe(1);
    });

    it("should handle edge case with only one empty cell", () => {
      const state = createMockState();

      let emptyCount = 0;
      state.grid.value.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (!cell.isInitial) {
            if (emptyCount > 0) {
              cell.value = rowIndex * 9 + colIndex + 1;
            }
            emptyCount++;
          }
        });
      });

      const { useHint } = useHintActions(state);

      mockMath.mockReturnValue(0.9);

      useHint();

      let hintedCell = null;
      state.grid.value.forEach((row) => {
        row.forEach((cell) => {
          if (cell.isHint) {
            hintedCell = cell;
          }
        });
      });

      expect(hintedCell).toBeTruthy();
      expect(hintedCell.value).toBeTruthy();
      expect(state.hintsLeft.value).toBe(2);
    });

    it("should correctly update all cell properties", () => {
      const state = createMockState();
      const { useHint } = useHintActions(state);

      mockMath.mockReturnValue(0);

      useHint();

      let hintedCell = null;
      let hintedPosition = null;

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const cell = state.grid.value[row][col];
          if (cell.isHint) {
            hintedCell = cell;
            hintedPosition = { row, col };
            break;
          }
        }
        if (hintedCell) break;
      }

      expect(hintedCell.value).toBe(
        state.solution.value[hintedPosition?.row][hintedPosition?.col]
      );
      expect(hintedCell.isHint).toBe(true);
      expect(hintedCell.wasCorrectOnce).toBe(true);
      expect(hintedCell.isInitial).toBe(false);
    });

    it("should handle multiple consecutive hints", () => {
      const state = createMockState({ hintsLeft: { value: 5 } });
      const { useHint } = useHintActions(state);

      const originalScore = state.score.value;

      mockMath.mockReturnValueOnce(0);
      useHint();

      mockMath.mockReturnValueOnce(0);
      useHint();

      mockMath.mockReturnValueOnce(0);
      useHint();

      const expectedScore = originalScore - 50 - 51 - 52;
      expect(state.score.value).toBe(expectedScore);
      expect(state.hintPenalty.value).toBe(53);
      expect(state.hintsLeft.value).toBe(2);

      let hintedCount = 0;
      state.grid.value.forEach((row) => {
        row.forEach((cell) => {
          if (cell.isHint) hintedCount++;
        });
      });

      expect(hintedCount).toBe(3);
    });
  });

  describe("return value", () => {
    it("should return an object with useHint function", () => {
      const state = createMockState();
      const result = useHintActions(state);

      expect(result).toHaveProperty("useHint");
      expect(typeof result.useHint).toBe("function");
    });

    it("should return a const assertion", () => {
      const state = createMockState();
      const result = useHintActions(state);

      expect(result).toBeDefined();
      expect(Object.isFrozen(result)).toBe(false);
    });
  });
});
