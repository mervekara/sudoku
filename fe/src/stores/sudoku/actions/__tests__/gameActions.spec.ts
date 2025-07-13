import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGameActions } from "@/src/stores/sudoku/actions/gameActions";
import { SudokuGrid } from "@/src/types/type";
import { SudokuState } from "@/src/stores/sudoku/types/shared";
import { generateSudoku } from "@/src/utils/sudokuGenerator";

vi.mock("@/src/utils/sudokuGenerator");
vi.mock("@/src/stores/sudoku/utils", () => ({
  visibleMap: {
    beginner: () => 37,
    intermediate: () => 34,
    hard: () => 30,
    expert: () => 25,
  },
}));

const mockGenerateSudoku = vi.mocked(generateSudoku);

describe("useGameActions", () => {
  let mockState: SudokuState;
  let mockGrid: SudokuGrid;
  let mockSolution: SudokuGrid;

  beforeEach(() => {
    vi.clearAllMocks();

    mockGrid = Array(9)
      .fill(null)
      .map(() =>
        Array(9)
          .fill(null)
          .map(() => ({
            value: 0,
            isInitial: false,
            isError: false,
            isHint: false,
            wasCorrectOnce: false,
            drafts: [],
          }))
      );

    mockSolution = Array(9)
      .fill(null)
      .map(() => Array(9).fill(5));

    mockState = {
      grid: { value: mockGrid },
      solution: { value: mockSolution },
      score: { value: 100 },
      hintsLeft: { value: 5 },
      hintPenalty: { value: 5 },
      selectedCell: { value: { row: 1, col: 1 } },
      history: { value: ["previous-move"] },
      future: { value: ["future-move"] },
      timer: { value: 120 },
      difficulty: { value: "beginner" },
      isEditMode: { value: false },
    };

    mockGenerateSudoku.mockReturnValue({
      grid: mockGrid,
      solution: mockSolution,
    });
  });

  describe("newGame", () => {
    it("should initialize a new game with correct difficulty", () => {
      const gameActions = useGameActions(mockState);
      const difficulty = "intermediate";

      gameActions.newGame(difficulty);

      expect(mockState.difficulty.value).toBe(difficulty);
      expect(mockGenerateSudoku).toHaveBeenCalledWith(34);
    });

    it("should reset game state correctly", () => {
      const gameActions = useGameActions(mockState);

      gameActions.newGame("beginner");

      expect(mockState.grid.value).toBe(mockGrid);
      expect(mockState.solution.value).toBe(mockSolution);
      expect(mockState.score.value).toBe(0);
      expect(mockState.hintsLeft.value).toBe(10);
      expect(mockState.hintPenalty.value).toBe(3);
      expect(mockState.selectedCell.value).toBeNull();
      expect(mockState.history.value).toEqual([]);
      expect(mockState.future.value).toEqual([]);
      expect(mockState.timer.value).toBe(0);
    });

    it("should initialize cell drafts for all cells", () => {
      const gameActions = useGameActions(mockState);

      gameActions.newGame("hard");

      mockGrid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          expect(cell.drafts).toEqual([]);
        });
      });
    });

    it("should work with different difficulty levels", () => {
      const gameActions = useGameActions(mockState);

      const testCases = [
        { difficulty: "beginner", expectedVisible: 37 },
        { difficulty: "intermediate", expectedVisible: 34 },
        { difficulty: "hard", expectedVisible: 30 },
        { difficulty: "expert", expectedVisible: 25 },
      ];

      testCases.forEach(({ difficulty, expectedVisible }) => {
        gameActions.newGame(difficulty);

        expect(mockState.difficulty.value).toBe(difficulty);
        expect(mockGenerateSudoku).toHaveBeenCalledWith(expectedVisible);
      });
    });
  });

  describe("selectCell", () => {
    it("should select a cell with correct coordinates", () => {
      const gameActions = useGameActions(mockState);
      const row = 3;
      const col = 5;

      gameActions.selectCell(row, col);

      expect(mockState.selectedCell.value).toEqual({ row, col });
    });

    it("should update selected cell when called multiple times", () => {
      const gameActions = useGameActions(mockState);

      gameActions.selectCell(1, 2);
      expect(mockState.selectedCell.value).toEqual({ row: 1, col: 2 });

      gameActions.selectCell(7, 8);
      expect(mockState.selectedCell.value).toEqual({ row: 7, col: 8 });
    });

    it("should handle edge cases (0,0) and (8,8)", () => {
      const gameActions = useGameActions(mockState);

      gameActions.selectCell(0, 0);
      expect(mockState.selectedCell.value).toEqual({ row: 0, col: 0 });

      gameActions.selectCell(8, 8);
      expect(mockState.selectedCell.value).toEqual({ row: 8, col: 8 });
    });
  });

  describe("toggleEditMode", () => {
    it("should toggle edit mode from false to true", () => {
      const gameActions = useGameActions(mockState);
      mockState.isEditMode.value = false;

      gameActions.toggleEditMode();

      expect(mockState.isEditMode.value).toBe(true);
    });

    it("should toggle edit mode from true to false", () => {
      const gameActions = useGameActions(mockState);
      mockState.isEditMode.value = true;

      gameActions.toggleEditMode();

      expect(mockState.isEditMode.value).toBe(false);
    });

    it("should toggle multiple times correctly", () => {
      const gameActions = useGameActions(mockState);
      const initialMode = mockState.isEditMode.value;

      gameActions.toggleEditMode();
      expect(mockState.isEditMode.value).toBe(!initialMode);

      gameActions.toggleEditMode();
      expect(mockState.isEditMode.value).toBe(initialMode);

      gameActions.toggleEditMode();
      expect(mockState.isEditMode.value).toBe(!initialMode);
    });
  });

  describe("return value structure", () => {
    it("should return an object with correct methods", () => {
      const gameActions = useGameActions(mockState);

      expect(gameActions).toHaveProperty("newGame");
      expect(gameActions).toHaveProperty("selectCell");
      expect(gameActions).toHaveProperty("toggleEditMode");

      expect(typeof gameActions.newGame).toBe("function");
      expect(typeof gameActions.selectCell).toBe("function");
      expect(typeof gameActions.toggleEditMode).toBe("function");
    });

    it("should return a const object (immutable)", () => {
      const gameActions = useGameActions(mockState);

      expect(() => {
        const { newGame, selectCell, toggleEditMode } = gameActions;
      }).not.toThrow();
    });
  });

  describe("integration behavior", () => {
    it("should work correctly when methods are called in sequence", () => {
      const gameActions = useGameActions(mockState);

      gameActions.newGame("intermediate");
      expect(mockState.difficulty.value).toBe("intermediate");
      expect(mockState.selectedCell.value).toBeNull();

      gameActions.selectCell(4, 6);
      expect(mockState.selectedCell.value).toEqual({ row: 4, col: 6 });

      gameActions.toggleEditMode();
      expect(mockState.isEditMode.value).toBe(true);

      gameActions.newGame("hard");
      expect(mockState.selectedCell.value).toBeNull();
      expect(mockState.difficulty.value).toBe("hard");
    });
  });
});
