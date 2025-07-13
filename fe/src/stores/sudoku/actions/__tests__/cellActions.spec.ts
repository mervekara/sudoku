import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCellActions } from "@/src/stores/sudoku/actions/cellActions";
import { SudokuCell } from "@/src/types/type";
import { SudokuState } from "@/src/stores/sudoku/types/shared";

describe("useCellActions", () => {
  let mockState: SudokuState;
  let mockSaveToHistory: ReturnType<typeof vi.fn>;
  let mockCell: SudokuCell;
  let mockSolutionCell: SudokuCell;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSaveToHistory = vi.fn();

    mockCell = {
      value: null,
      isInitial: false,
      isError: false,
      drafts: [],
      wasCorrectOnce: false,
      isHint: false,
    };

    mockSolutionCell = {
      value: 5,
      isInitial: true,
      isError: false,
      drafts: [],
      wasCorrectOnce: false,
      isHint: false,
    };

    mockState = {
      grid: {
        value: Array(9)
          .fill(null)
          .map(() => Array(9).fill(null)),
      },
      solution: {
        value: Array(9)
          .fill(null)
          .map(() => Array(9).fill(null)),
      },
      score: { value: 0 },
      future: { value: ["some-future-move"] },
    } as SudokuState;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        mockState.grid.value[i][j] = {
          value: null,
          isInitial: false,
          isError: false,
          drafts: [],
          wasCorrectOnce: false,
        };
        mockState.solution.value[i][j] = 5;
      }
    }

    mockState.solution.value[0][0] = 7;
  });

  describe("inputCell", () => {
    it("should input correct value and update score", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;
      const correctValue = 7;

      cellActions.inputCell(row, col, correctValue);

      expect(mockSaveToHistory).toHaveBeenCalledOnce();
      expect(mockState.grid.value[row][col].value).toBe(correctValue);
      expect(mockState.grid.value[row][col].isError).toBe(false);
      expect(mockState.grid.value[row][col].drafts).toEqual([]);
      expect(mockState.score.value).toBe(5);
      expect(mockState.grid.value[row][col].wasCorrectOnce).toBe(true);
      expect(mockState.future.value).toEqual([]);
    });

    it("should input incorrect value and decrease score", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;
      const incorrectValue = 3;

      cellActions.inputCell(row, col, incorrectValue);

      expect(mockSaveToHistory).toHaveBeenCalledOnce();
      expect(mockState.grid.value[row][col].value).toBe(incorrectValue);
      expect(mockState.grid.value[row][col].isError).toBe(true);
      expect(mockState.grid.value[row][col].drafts).toEqual([]);
      expect(mockState.score.value).toBe(-1);
      expect(mockState.grid.value[row][col].wasCorrectOnce).toBe(false);
      expect(mockState.future.value).toEqual([]);
    });

    it("should not input value if cell is initial", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;
      mockState.grid.value[row][col].isInitial = true;
      const originalValue = mockState.grid.value[row][col].value;

      cellActions.inputCell(row, col, 9);

      expect(mockSaveToHistory).not.toHaveBeenCalled();
      expect(mockState.grid.value[row][col].value).toBe(originalValue);
      expect(mockState.score.value).toBe(0);
    });

    it("should clear existing drafts when inputting value", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;
      mockState.grid.value[row][col].drafts = [1, 2, 3];

      cellActions.inputCell(row, col, 7);

      expect(mockState.grid.value[row][col].drafts).toEqual([]);
    });

    it("should not award points twice for same correct cell", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;
      mockState.grid.value[row][col].wasCorrectOnce = true;
      mockState.score.value = 10;

      cellActions.inputCell(row, col, 7);

      expect(mockState.score.value).toBe(10);
    });

    it("should clear future moves when inputting", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;
      mockState.future.value = ["move1", "move2"];

      cellActions.inputCell(row, col, 7);

      expect(mockState.future.value).toEqual([]);
    });
  });

  describe("clearCell", () => {
    it("should clear cell value and reset error state", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;

      mockState.grid.value[row][col] = {
        value: 5,
        isInitial: false,
        isError: true,
        drafts: [1, 2, 3],
        wasCorrectOnce: false,
      };

      cellActions.clearCell(row, col);

      expect(mockSaveToHistory).toHaveBeenCalledOnce();
      expect(mockState.grid.value[row][col].value).toBeNull();
      expect(mockState.grid.value[row][col].isError).toBe(false);
      expect(mockState.grid.value[row][col].drafts).toEqual([]);
    });

    it("should not clear cell if it is initial", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;

      mockState.grid.value[row][col] = {
        value: 5,
        isInitial: true,
        isError: false,
        drafts: [1, 2],
        wasCorrectOnce: false,
      };

      cellActions.clearCell(row, col);

      expect(mockSaveToHistory).not.toHaveBeenCalled();
      expect(mockState.grid.value[row][col].value).toBe(5);
      expect(mockState.grid.value[row][col].drafts).toEqual([1, 2]);
    });

    it("should clear cell with null value", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;

      mockState.grid.value[row][col] = {
        value: null,
        isInitial: false,
        isError: true,
        drafts: [4, 5, 6],
        wasCorrectOnce: false,
      };

      cellActions.clearCell(row, col);

      expect(mockSaveToHistory).toHaveBeenCalledOnce();
      expect(mockState.grid.value[row][col].value).toBeNull();
      expect(mockState.grid.value[row][col].isError).toBe(false);
      expect(mockState.grid.value[row][col].drafts).toEqual([]);
    });
  });

  describe("addOrRemoveDraft", () => {
    it("should add draft to empty drafts array", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;
      mockState.grid.value[row][col].drafts = [];

      cellActions.addOrRemoveDraft(row, col, 5);

      expect(mockState.grid.value[row][col].drafts).toEqual([5]);
    });

    it("should add draft and keep sorted order", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;
      mockState.grid.value[row][col].drafts = [1, 3, 7];

      cellActions.addOrRemoveDraft(row, col, 5);

      expect(mockState.grid.value[row][col].drafts).toEqual([1, 3, 5, 7]);
    });

    it("should remove existing draft", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;
      mockState.grid.value[row][col].drafts = [1, 3, 5, 7];

      cellActions.addOrRemoveDraft(row, col, 3);

      expect(mockState.grid.value[row][col].drafts).toEqual([1, 5, 7]);
    });

    it("should not modify drafts if cell is initial", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;
      mockState.grid.value[row][col].isInitial = true;
      mockState.grid.value[row][col].drafts = [1, 2, 3];

      cellActions.addOrRemoveDraft(row, col, 5);

      expect(mockState.grid.value[row][col].drafts).toEqual([1, 2, 3]);
    });

    it("should not modify drafts if cell has value", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;
      mockState.grid.value[row][col].value = 8;
      mockState.grid.value[row][col].drafts = [1, 2, 3];

      cellActions.addOrRemoveDraft(row, col, 5);

      expect(mockState.grid.value[row][col].drafts).toEqual([1, 2, 3]);
    });

    it("should handle adding and removing same draft multiple times", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;
      mockState.grid.value[row][col].drafts = [];

      cellActions.addOrRemoveDraft(row, col, 5);
      expect(mockState.grid.value[row][col].drafts).toEqual([5]);

      cellActions.addOrRemoveDraft(row, col, 5);
      expect(mockState.grid.value[row][col].drafts).toEqual([]);

      cellActions.addOrRemoveDraft(row, col, 5);
      expect(mockState.grid.value[row][col].drafts).toEqual([5]);
    });

    it("should maintain sort order when adding multiple drafts", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;
      mockState.grid.value[row][col].drafts = [];

      cellActions.addOrRemoveDraft(row, col, 9);
      cellActions.addOrRemoveDraft(row, col, 1);
      cellActions.addOrRemoveDraft(row, col, 5);
      cellActions.addOrRemoveDraft(row, col, 3);

      expect(mockState.grid.value[row][col].drafts).toEqual([1, 3, 5, 9]);
    });
  });

  describe("updateScore function (internal)", () => {
    it("should handle score updates correctly through inputCell", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;
      mockState.score.value = 10;

      cellActions.inputCell(row, col, 7);
      expect(mockState.score.value).toBe(15);
      expect(mockState.grid.value[row][col].wasCorrectOnce).toBe(true);

      cellActions.clearCell(row, col);
      expect(mockState.grid.value[row][col].wasCorrectOnce).toBe(true);

      cellActions.inputCell(row, col, 3);
      expect(mockState.score.value).toBe(14);

      cellActions.clearCell(row, col);
      cellActions.inputCell(row, col, 7);
      expect(mockState.score.value).toBe(14);
    });
  });

  describe("return value structure", () => {
    it("should return object with correct methods", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);

      expect(cellActions).toHaveProperty("inputCell");
      expect(cellActions).toHaveProperty("clearCell");
      expect(cellActions).toHaveProperty("addOrRemoveDraft");

      expect(typeof cellActions.inputCell).toBe("function");
      expect(typeof cellActions.clearCell).toBe("function");
      expect(typeof cellActions.addOrRemoveDraft).toBe("function");
    });

    it("should return a const object", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);

      expect(() => {
        const { inputCell, clearCell, addOrRemoveDraft } = cellActions;
      }).not.toThrow();
    });
  });

  describe("integration behavior", () => {
    it("should work correctly when methods are called in sequence", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);
      const row = 0,
        col = 0;

      cellActions.addOrRemoveDraft(row, col, 3);
      cellActions.addOrRemoveDraft(row, col, 7);
      cellActions.addOrRemoveDraft(row, col, 9);
      expect(mockState.grid.value[row][col].drafts).toEqual([3, 7, 9]);

      cellActions.inputCell(row, col, 7);
      expect(mockState.grid.value[row][col].drafts).toEqual([]);
      expect(mockState.grid.value[row][col].value).toBe(7);

      cellActions.clearCell(row, col);
      expect(mockState.grid.value[row][col].value).toBeNull();
      expect(mockState.grid.value[row][col].isError).toBe(false);

      cellActions.addOrRemoveDraft(row, col, 1);
      cellActions.addOrRemoveDraft(row, col, 5);
      expect(mockState.grid.value[row][col].drafts).toEqual([1, 5]);
    });

    it("should handle edge cases with grid boundaries", () => {
      const cellActions = useCellActions(mockState, mockSaveToHistory);

      cellActions.inputCell(0, 0, 1);
      cellActions.inputCell(8, 8, 9);
      cellActions.clearCell(0, 8);
      cellActions.clearCell(8, 0);
      cellActions.addOrRemoveDraft(4, 4, 5);

      expect(mockSaveToHistory).toHaveBeenCalledTimes(4);
    });
  });
});
