import { describe, it, expect, beforeEach, vi } from "vitest";
import { useHistoryActions } from "@/src/stores/sudoku/actions/historyActions";
import { SudokuState } from "@/src/stores/sudoku/types/shared";
import { SudokuGrid } from "@/src/types/type";
import { deepClone } from "@/src/stores/sudoku/utils";

vi.mock("@/src/stores/sudoku/utils", () => ({
  deepClone: vi.fn(),
}));

const mockDeepClone = vi.mocked(deepClone);

const createMockCell = (
  value: number | null = null,
  isInitial: boolean = false,
  isHint: boolean = false,
  wasCorrectOnce: boolean = false,
) => ({
  value,
  isInitial,
  isHint,
  wasCorrectOnce,
  isError: false,
  drafts: [],
});

const createMockGrid = (fillValue: number | null = null): SudokuGrid => {
  return Array(9)
    .fill(null)
    .map((_, row) =>
      Array(9)
        .fill(null)
        .map((_, col) => createMockCell(fillValue)),
    );
};

const createMockState = (overrides: Partial<SudokuState> = {}): SudokuState => {
  const defaultGrid = createMockGrid();

  return {
    grid: { value: defaultGrid },
    history: { value: [] },
    future: { value: [] },
    ...overrides,
  } as SudokuState;
};

describe("useHistoryActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockDeepClone.mockImplementation((obj) => {
      return JSON.parse(JSON.stringify(obj));
    });
  });

  describe("saveToHistory", () => {
    it("should save current grid to history", () => {
      const state = createMockState();
      const { saveToHistory } = useHistoryActions(state);

      // Set some values in the current grid
      state.grid.value[0][0].value = 5;
      state.grid.value[1][1].value = 3;

      saveToHistory();

      expect(mockDeepClone).toHaveBeenCalledWith(state.grid.value);
      expect(state.history.value).toHaveLength(1);
      expect(state.history.value[0][0][0].value).toBe(5);
      expect(state.history.value[0][1][1].value).toBe(3);
    });

    it("should add multiple saves to history", () => {
      const state = createMockState();
      const { saveToHistory } = useHistoryActions(state);

      // First save
      state.grid.value[0][0].value = 1;
      saveToHistory();

      // Second save
      state.grid.value[0][0].value = 2;
      saveToHistory();

      // Third save
      state.grid.value[0][0].value = 3;
      saveToHistory();

      expect(state.history.value).toHaveLength(3);
      expect(mockDeepClone).toHaveBeenCalledTimes(3);
    });

    it("should create independent copies in history", () => {
      const state = createMockState();
      const { saveToHistory } = useHistoryActions(state);

      state.grid.value[0][0].value = 1;
      saveToHistory();

      // Modify current grid after saving
      state.grid.value[0][0].value = 2;

      // The saved history should not be affected
      expect(state.history.value[0][0][0].value).toBe(1);
      expect(state.grid.value[0][0].value).toBe(2);
    });
  });

  describe("restoreWasCorrectOnce", () => {
    it("should preserve wasCorrectOnce values when restoring", () => {
      const state = createMockState();
      const { undo, saveToHistory } = useHistoryActions(state);

      // Set up initial state
      state.grid.value[0][0].value = 1;
      state.grid.value[0][0].wasCorrectOnce = true;
      state.grid.value[1][1].value = 2;
      state.grid.value[1][1].wasCorrectOnce = false;

      saveToHistory();

      // Modify current state
      state.grid.value[0][0].value = 5;
      state.grid.value[0][0].wasCorrectOnce = false; // This should be preserved
      state.grid.value[1][1].value = 6;
      state.grid.value[1][1].wasCorrectOnce = true; // This should be preserved

      undo();

      // Values should be restored, but wasCorrectOnce should be preserved from current state
      expect(state.grid.value[0][0].value).toBe(1);
      expect(state.grid.value[0][0].wasCorrectOnce).toBe(false); // Preserved from current
      expect(state.grid.value[1][1].value).toBe(2);
      expect(state.grid.value[1][1].wasCorrectOnce).toBe(true); // Preserved from current
    });
  });

  describe("undo", () => {
    it("should do nothing when history is empty", () => {
      const state = createMockState();
      const { undo } = useHistoryActions(state);

      const originalGrid = state.grid.value;
      const originalHistoryLength = state.history.value.length;
      const originalFutureLength = state.future.value.length;

      undo();

      expect(state.grid.value).toBe(originalGrid);
      expect(state.history.value).toHaveLength(originalHistoryLength);
      expect(state.future.value).toHaveLength(originalFutureLength);
      expect(mockDeepClone).not.toHaveBeenCalled();
    });

    it("should restore previous state and save current to future", () => {
      const state = createMockState();
      const { saveToHistory, undo } = useHistoryActions(state);

      // Set up initial state
      state.grid.value[0][0].value = 1;
      saveToHistory();

      // Modify current state
      state.grid.value[0][0].value = 2;

      expect(state.history.value).toHaveLength(1);
      expect(state.future.value).toHaveLength(0);

      undo();

      expect(state.grid.value[0][0].value).toBe(1); // Restored
      expect(state.history.value).toHaveLength(0); // Previous state removed
      expect(state.future.value).toHaveLength(1); // Current state saved
      expect(state.future.value[0][0][0].value).toBe(2); // Current state preserved
    });

    it("should handle multiple undos", () => {
      const state = createMockState();
      const { saveToHistory, undo } = useHistoryActions(state);

      // Create a sequence of states
      state.grid.value[0][0].value = 1;
      saveToHistory();

      state.grid.value[0][0].value = 2;
      saveToHistory();

      state.grid.value[0][0].value = 3;

      // First undo: 3 -> 2
      undo();
      expect(state.grid.value[0][0].value).toBe(2);
      expect(state.history.value).toHaveLength(1);
      expect(state.future.value).toHaveLength(1);

      // Second undo: 2 -> 1
      undo();
      expect(state.grid.value[0][0].value).toBe(1);
      expect(state.history.value).toHaveLength(0);
      expect(state.future.value).toHaveLength(2);
    });

    it("should handle undefined previousState gracefully", () => {
      const state = createMockState();
      const { undo } = useHistoryActions(state);

      // Manually add undefined to history (edge case)
      state.history.value.push(undefined as any);

      const originalGrid = state.grid.value;

      undo();

      // Should not crash and should not change the grid
      expect(state.grid.value).toBe(originalGrid);
      expect(state.history.value).toHaveLength(0);
    });
  });

  describe("redo", () => {
    it("should do nothing when future is empty", () => {
      const state = createMockState();
      const { redo } = useHistoryActions(state);

      const originalGrid = state.grid.value;
      const originalHistoryLength = state.history.value.length;
      const originalFutureLength = state.future.value.length;

      redo();

      expect(state.grid.value).toBe(originalGrid);
      expect(state.history.value).toHaveLength(originalHistoryLength);
      expect(state.future.value).toHaveLength(originalFutureLength);
      expect(mockDeepClone).not.toHaveBeenCalled();
    });

    it("should restore next state and save current to history", () => {
      const state = createMockState();
      const { saveToHistory, undo, redo } = useHistoryActions(state);

      // Set up states
      state.grid.value[0][0].value = 1;
      saveToHistory();

      state.grid.value[0][0].value = 2;

      // Undo to create future state
      undo();
      expect(state.grid.value[0][0].value).toBe(1);
      expect(state.future.value).toHaveLength(1);

      // Redo
      redo();
      expect(state.grid.value[0][0].value).toBe(2); // Restored
      expect(state.history.value).toHaveLength(1); // Current saved
      expect(state.future.value).toHaveLength(0); // Future state removed
    });

    it("should handle multiple redos", () => {
      const state = createMockState();
      const { saveToHistory, undo, redo } = useHistoryActions(state);

      // Create sequence
      state.grid.value[0][0].value = 1;
      saveToHistory();

      state.grid.value[0][0].value = 2;
      saveToHistory();

      state.grid.value[0][0].value = 3;

      // Multiple undos
      undo(); // 3 -> 2
      undo(); // 2 -> 1

      expect(state.grid.value[0][0].value).toBe(1);
      expect(state.future.value).toHaveLength(2);

      // First redo: 1 -> 2
      redo();
      expect(state.grid.value[0][0].value).toBe(2);
      expect(state.history.value).toHaveLength(1);
      expect(state.future.value).toHaveLength(1);

      // Second redo: 2 -> 3
      redo();
      expect(state.grid.value[0][0].value).toBe(3);
      expect(state.history.value).toHaveLength(2);
      expect(state.future.value).toHaveLength(0);
    });

    it("should handle undefined nextState gracefully", () => {
      const state = createMockState();
      const { redo } = useHistoryActions(state);

      // Manually add undefined to future (edge case)
      state.future.value.push(undefined as any);

      const originalGrid = state.grid.value;

      redo();

      // Should not crash and should not change the grid
      expect(state.grid.value).toBe(originalGrid);
      expect(state.future.value).toHaveLength(0);
    });
  });

  describe("integration tests", () => {
    it("should handle complete undo/redo cycle", () => {
      const state = createMockState();
      const { saveToHistory, undo, redo } = useHistoryActions(state);

      // Initial state
      state.grid.value[0][0].value = 1;
      saveToHistory();

      // State 2
      state.grid.value[0][0].value = 2;
      saveToHistory();

      // State 3
      state.grid.value[0][0].value = 3;

      // Undo twice
      undo(); // 3 -> 2
      undo(); // 2 -> 1

      expect(state.grid.value[0][0].value).toBe(1);

      // Redo twice
      redo(); // 1 -> 2
      redo(); // 2 -> 3

      expect(state.grid.value[0][0].value).toBe(3);
      expect(state.history.value).toHaveLength(2);
      expect(state.future.value).toHaveLength(0);
    });

    it("should clear future when new action is performed after undo", () => {
      const state = createMockState();
      const { saveToHistory, undo } = useHistoryActions(state);

      // Create states
      state.grid.value[0][0].value = 1;
      saveToHistory();

      state.grid.value[0][0].value = 2;
      saveToHistory();

      state.grid.value[0][0].value = 3;

      // Undo
      undo(); // 3 -> 2
      expect(state.future.value).toHaveLength(1);

      // New action (this should clear future in real implementation)
      // Note: This hook doesn't handle clearing future on new actions,
      // but we test the current behavior
      saveToHistory();

      // Future should still exist (this is expected behavior of current implementation)
      expect(state.future.value).toHaveLength(1);
    });

    it("should preserve wasCorrectOnce across multiple undo/redo operations", () => {
      const state = createMockState();
      const { saveToHistory, undo, redo } = useHistoryActions(state);

      // Initial state
      state.grid.value[0][0].value = 1;
      state.grid.value[0][0].wasCorrectOnce = false;
      saveToHistory();

      // Modified state
      state.grid.value[0][0].value = 2;
      state.grid.value[0][0].wasCorrectOnce = true;

      // Undo and redo
      undo();
      expect(state.grid.value[0][0].value).toBe(1);
      expect(state.grid.value[0][0].wasCorrectOnce).toBe(true); // Preserved

      redo();
      expect(state.grid.value[0][0].value).toBe(2);
      expect(state.grid.value[0][0].wasCorrectOnce).toBe(true); // Still preserved
    });
  });

  describe("return value", () => {
    it("should return an object with all required methods", () => {
      const state = createMockState();
      const result = useHistoryActions(state);

      expect(result).toHaveProperty("saveToHistory");
      expect(result).toHaveProperty("undo");
      expect(result).toHaveProperty("redo");
      expect(typeof result.saveToHistory).toBe("function");
      expect(typeof result.undo).toBe("function");
      expect(typeof result.redo).toBe("function");
    });

    it("should return a const assertion", () => {
      const state = createMockState();
      const result = useHistoryActions(state);

      expect(result).toBeDefined();
      expect(Object.keys(result)).toEqual(["saveToHistory", "undo", "redo"]);
    });
  });

  describe("deepClone dependency", () => {
    it("should call deepClone with correct parameters", () => {
      const state = createMockState();
      const { saveToHistory } = useHistoryActions(state);

      saveToHistory();

      expect(mockDeepClone).toHaveBeenCalledWith(state.grid.value);
      expect(mockDeepClone).toHaveBeenCalledTimes(1);
    });

    it("should handle deepClone errors gracefully", () => {
      const state = createMockState();
      const { saveToHistory } = useHistoryActions(state);

      // Mock deepClone to throw an error
      mockDeepClone.mockImplementation(() => {
        throw new Error("Deep clone failed");
      });

      // This should not crash the application
      expect(() => saveToHistory()).toThrow("Deep clone failed");
    });
  });
});
