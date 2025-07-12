import { SudokuState } from "../types/shared";

export const useTimerActions = (state: SudokuState) => {
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  const startTimer = (): void => {
    if (state.timerActive.value || state.isPaused.value) return;

    state.timerActive.value = true;
    timerInterval = setInterval(() => {
      state.timer.value++;
    }, 1000);
  };

  const stopTimer = (): void => {
    state.timerActive.value = false;

    if (timerInterval) {
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
  };
};
