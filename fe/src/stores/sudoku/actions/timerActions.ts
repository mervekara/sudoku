import { SudokuState } from "@/src/stores/sudoku/types/shared";
import { TimerActions } from "@/src/stores/sudoku/types/types";

export const useTimerActions = (state: SudokuState): TimerActions => {
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  const startTimer = (): void => {
    const isAlreadyRunning = state.timerActive.value;
    const isPaused = state.isPaused.value;

    if (isAlreadyRunning || isPaused) return;

    state.timerActive.value = true;

    timerInterval = setInterval(() => {
      state.timer.value++;
    }, 1000);
  };

  const stopTimer = (): void => {
    state.timerActive.value = false;

    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  const pauseTimer = (): void => {
    if (state.timerActive.value) {
      state.isPaused.value = true;
      stopTimer();
    }
  };

  const resumeTimer = (): void => {
    if (state.isPaused.value) {
      state.isPaused.value = false;
      startTimer();
    }
  };

  return {
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
  } as const;
};
