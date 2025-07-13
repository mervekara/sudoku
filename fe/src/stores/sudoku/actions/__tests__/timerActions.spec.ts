import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useTimerActions } from "@/src/stores/sudoku/actions/timerActions";
import { SudokuState } from "@/src/stores/sudoku/types/shared";

vi.useFakeTimers();

const createMockState = (overrides: Partial<SudokuState> = {}): SudokuState => {
  return {
    timer: { value: 0 },
    timerActive: { value: false },
    isPaused: { value: false },
    ...overrides,
  } as SudokuState;
};

describe("useTimerActions", () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("startTimer", () => {
    it("should start the timer when not running and not paused", () => {
      const state = createMockState();
      const { startTimer } = useTimerActions(state);

      startTimer();

      expect(state.timerActive.value).toBe(true);
      expect(state.timer.value).toBe(0);

      vi.advanceTimersByTime(1000);
      expect(state.timer.value).toBe(1);

      vi.advanceTimersByTime(2000);
      expect(state.timer.value).toBe(3);
    });

    it("should not start timer when already running", () => {
      const state = createMockState({
        timerActive: { value: true },
      });
      const { startTimer } = useTimerActions(state);

      const initialTimerValue = state.timer.value;
      startTimer();

      expect(state.timerActive.value).toBe(true);
      expect(state.timer.value).toBe(initialTimerValue);

      vi.advanceTimersByTime(1000);
      expect(state.timer.value).toBe(initialTimerValue);
    });

    it("should not start timer when paused", () => {
      const state = createMockState({
        isPaused: { value: true },
      });
      const { startTimer } = useTimerActions(state);

      startTimer();

      expect(state.timerActive.value).toBe(false);
      expect(state.isPaused.value).toBe(true);

      vi.advanceTimersByTime(1000);
      expect(state.timer.value).toBe(0);
    });

    it("should not start timer when both running and paused", () => {
      const state = createMockState({
        timerActive: { value: true },
        isPaused: { value: true },
      });
      const { startTimer } = useTimerActions(state);

      startTimer();

      expect(state.timerActive.value).toBe(true);
      expect(state.isPaused.value).toBe(true);

      vi.advanceTimersByTime(1000);
      expect(state.timer.value).toBe(0);
    });

    it("should increment timer every second", () => {
      const state = createMockState({ timer: { value: 10 } });
      const { startTimer } = useTimerActions(state);

      startTimer();

      expect(state.timer.value).toBe(10);

      vi.advanceTimersByTime(1000);
      expect(state.timer.value).toBe(11);

      vi.advanceTimersByTime(1000);
      expect(state.timer.value).toBe(12);

      vi.advanceTimersByTime(5000);
      expect(state.timer.value).toBe(17);
    });
  });

  describe("stopTimer", () => {
    it("should stop the timer and clear interval", () => {
      const state = createMockState();
      const { startTimer, stopTimer } = useTimerActions(state);

      startTimer();
      expect(state.timerActive.value).toBe(true);

      vi.advanceTimersByTime(2000);
      expect(state.timer.value).toBe(2);

      stopTimer();
      expect(state.timerActive.value).toBe(false);

      vi.advanceTimersByTime(3000);
      expect(state.timer.value).toBe(2);
    });

    it("should handle stopping when timer is not running", () => {
      const state = createMockState();
      const { stopTimer } = useTimerActions(state);

      stopTimer();

      expect(state.timerActive.value).toBe(false);
      expect(state.timer.value).toBe(0);
    });

    it("should clear interval when stopping", () => {
      const state = createMockState();
      const { startTimer, stopTimer } = useTimerActions(state);

      startTimer();
      vi.advanceTimersByTime(1000);
      expect(state.timer.value).toBe(1);

      stopTimer();

      vi.advanceTimersByTime(5000);
      expect(state.timer.value).toBe(1);
    });
  });

  describe("pauseTimer", () => {
    it("should pause active timer", () => {
      const state = createMockState();
      const { startTimer, pauseTimer } = useTimerActions(state);

      startTimer();
      expect(state.timerActive.value).toBe(true);
      expect(state.isPaused.value).toBe(false);

      vi.advanceTimersByTime(2000);
      expect(state.timer.value).toBe(2);

      pauseTimer();
      expect(state.timerActive.value).toBe(false);
      expect(state.isPaused.value).toBe(true);

      vi.advanceTimersByTime(3000);
      expect(state.timer.value).toBe(2);
    });

    it("should not pause when timer is not active", () => {
      const state = createMockState();
      const { pauseTimer } = useTimerActions(state);

      pauseTimer();

      expect(state.timerActive.value).toBe(false);
      expect(state.isPaused.value).toBe(false);
    });

    it("should not affect already paused timer", () => {
      const state = createMockState({
        timerActive: { value: false },
        isPaused: { value: true },
      });
      const { pauseTimer } = useTimerActions(state);

      pauseTimer();

      expect(state.timerActive.value).toBe(false);
      expect(state.isPaused.value).toBe(true);
    });
  });

  describe("resumeTimer", () => {
    it("should resume paused timer", () => {
      const state = createMockState();
      const { startTimer, pauseTimer, resumeTimer } = useTimerActions(state);

      startTimer();
      vi.advanceTimersByTime(3000);
      expect(state.timer.value).toBe(3);

      pauseTimer();
      expect(state.timerActive.value).toBe(false);
      expect(state.isPaused.value).toBe(true);

      resumeTimer();
      expect(state.timerActive.value).toBe(true);
      expect(state.isPaused.value).toBe(false);

      vi.advanceTimersByTime(2000);
      expect(state.timer.value).toBe(5);
    });

    it("should not resume when timer is not paused", () => {
      const state = createMockState();
      const { resumeTimer } = useTimerActions(state);

      resumeTimer();

      expect(state.timerActive.value).toBe(false);
      expect(state.isPaused.value).toBe(false);
    });

    it("should not resume when timer is active but not paused", () => {
      const state = createMockState({
        timerActive: { value: true },
        isPaused: { value: false },
      });
      const { resumeTimer } = useTimerActions(state);

      resumeTimer();

      expect(state.timerActive.value).toBe(true);
      expect(state.isPaused.value).toBe(false);
    });
  });

  describe("integration tests", () => {
    it("should handle complete start-pause-resume-stop cycle", () => {
      const state = createMockState();
      const { startTimer, stopTimer, pauseTimer, resumeTimer } =
        useTimerActions(state);

      startTimer();
      vi.advanceTimersByTime(5000);
      expect(state.timer.value).toBe(5);
      expect(state.timerActive.value).toBe(true);
      expect(state.isPaused.value).toBe(false);

      pauseTimer();
      expect(state.timerActive.value).toBe(false);
      expect(state.isPaused.value).toBe(true);

      vi.advanceTimersByTime(3000);
      expect(state.timer.value).toBe(5);

      resumeTimer();
      expect(state.timerActive.value).toBe(true);
      expect(state.isPaused.value).toBe(false);

      vi.advanceTimersByTime(2000);
      expect(state.timer.value).toBe(7);

      stopTimer();
      expect(state.timerActive.value).toBe(false);
      expect(state.isPaused.value).toBe(false);

      vi.advanceTimersByTime(1000);
      expect(state.timer.value).toBe(7);
    });

    it("should handle multiple pause-resume cycles", () => {
      const state = createMockState();
      const { startTimer, pauseTimer, resumeTimer } = useTimerActions(state);

      startTimer();

      vi.advanceTimersByTime(2000);
      expect(state.timer.value).toBe(2);

      pauseTimer();
      vi.advanceTimersByTime(1000);
      expect(state.timer.value).toBe(2);

      resumeTimer();
      vi.advanceTimersByTime(3000);
      expect(state.timer.value).toBe(5);

      pauseTimer();
      vi.advanceTimersByTime(2000);
      expect(state.timer.value).toBe(5);

      resumeTimer();
      vi.advanceTimersByTime(1000);
      expect(state.timer.value).toBe(6);
    });

    it("should handle edge case of stopping paused timer", () => {
      const state = createMockState();
      const { startTimer, pauseTimer, stopTimer } = useTimerActions(state);

      startTimer();
      vi.advanceTimersByTime(2000);
      expect(state.timer.value).toBe(2);

      pauseTimer();
      expect(state.timerActive.value).toBe(false);
      expect(state.isPaused.value).toBe(true);

      stopTimer();
      expect(state.timerActive.value).toBe(false);
      expect(state.isPaused.value).toBe(true);

      vi.advanceTimersByTime(1000);
      expect(state.timer.value).toBe(2);
    });

    it("should handle rapid start-stop operations", () => {
      const state = createMockState();
      const { startTimer, stopTimer } = useTimerActions(state);

      for (let i = 0; i < 3; i++) {
        startTimer();
        expect(state.timerActive.value).toBe(true);

        stopTimer();
        expect(state.timerActive.value).toBe(false);
      }

      vi.advanceTimersByTime(5000);
      expect(state.timer.value).toBe(0);
    });
  });

  describe("timer interval management", () => {
    it("should not create multiple intervals when starting multiple times", () => {
      const state = createMockState();
      const { startTimer } = useTimerActions(state);

      startTimer();
      startTimer();
      startTimer();

      vi.advanceTimersByTime(1000);
      expect(state.timer.value).toBe(1);
    });

    it("should properly clean up intervals on stop", () => {
      const state = createMockState();
      const { startTimer, stopTimer } = useTimerActions(state);

      startTimer();
      stopTimer();

      startTimer();
      stopTimer();

      vi.advanceTimersByTime(5000);
      expect(state.timer.value).toBe(0);
    });
  });

  describe("state consistency", () => {
    it("should maintain consistent state when paused", () => {
      const state = createMockState();
      const { startTimer, pauseTimer } = useTimerActions(state);

      startTimer();
      pauseTimer();

      expect(state.timerActive.value).toBe(false);
      expect(state.isPaused.value).toBe(true);

      vi.advanceTimersByTime(1000);
      expect(state.timerActive.value).toBe(false);
      expect(state.isPaused.value).toBe(true);
    });

    it("should maintain consistent state when resumed", () => {
      const state = createMockState({
        isPaused: { value: true },
      });
      const { resumeTimer } = useTimerActions(state);

      resumeTimer();

      expect(state.timerActive.value).toBe(true);
      expect(state.isPaused.value).toBe(false);

      vi.advanceTimersByTime(1000);
      expect(state.timerActive.value).toBe(true);
      expect(state.isPaused.value).toBe(false);
      expect(state.timer.value).toBe(1);
    });
  });

  describe("return value", () => {
    it("should return an object with all required methods", () => {
      const state = createMockState();
      const result = useTimerActions(state);

      expect(result).toHaveProperty("startTimer");
      expect(result).toHaveProperty("stopTimer");
      expect(result).toHaveProperty("pauseTimer");
      expect(result).toHaveProperty("resumeTimer");
      expect(typeof result.startTimer).toBe("function");
      expect(typeof result.stopTimer).toBe("function");
      expect(typeof result.pauseTimer).toBe("function");
      expect(typeof result.resumeTimer).toBe("function");
    });

    it("should return a const assertion", () => {
      const state = createMockState();
      const result = useTimerActions(state);

      expect(result).toBeDefined();
      expect(Object.keys(result)).toEqual([
        "startTimer",
        "stopTimer",
        "pauseTimer",
        "resumeTimer",
      ]);
    });
  });
});
