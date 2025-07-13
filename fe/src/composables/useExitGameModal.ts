import { ref } from "vue";
import { useSudokuStore } from "@/src/stores/sudoku";
import { Difficulty } from "@/src/types/type";

export function useExitGameModal() {
  const sudokuStore = useSudokuStore();

  const showExitModal = ref(false);
  const selectedDifficulty = ref<Difficulty>(sudokuStore.difficulty);
  const prevDifficulty = ref<Difficulty>(sudokuStore.difficulty);
  const pendingDifficulty = ref<Difficulty | null>(null);

  function openModal(newDiff: Difficulty) {
    pendingDifficulty.value = newDiff;
    showExitModal.value = true;
  }

  function confirmExit() {
    if (pendingDifficulty.value) {
      sudokuStore.newGame(pendingDifficulty.value);
      selectedDifficulty.value = pendingDifficulty.value;
      prevDifficulty.value = pendingDifficulty.value;
      pendingDifficulty.value = null;
      showExitModal.value = false;
    }
  }

  function cancelExit() {
    selectedDifficulty.value = prevDifficulty.value;
    showExitModal.value = false;
    pendingDifficulty.value = null;
  }

  return {
    showExitModal,
    selectedDifficulty,
    prevDifficulty,
    openModal,
    confirmExit,
    cancelExit,
  };
}
