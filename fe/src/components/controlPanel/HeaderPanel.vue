<template>
  <div class="flex flex-col gap-6 w-full">
    <div class="flex items-center justify-between w-full">
      <div class="w-full sm:w-1/3"></div>

      <div
        class="w-full sm:w-1/3 text-center text-2xl md:text-4xl font-semibold"
        :class="{
          'text-green-500': score > 0,
          'text-red-500': score < 0,
          'text-[#517bb3]': score === 0,
        }"
      >
        {{ score }}
      </div>

      <div class="w-full sm:w-1/3 flex justify-end items-center gap-2">
        <div class="text-sm font-digital text-[#517bb3]">{{ time }}</div>

        <ControlButton
          size="small"
          variant="tonal"
          color="#94a3b7"
          :icon="isPaused ? 'mdi-play' : 'mdi-pause'"
          :iconOnly="true"
          @click="togglePause"
        />
      </div>
    </div>

    <ControlPanel
      :can-undo="canUndo"
      :can-redo="canRedo"
      :is-edit-mode="isEditMode"
      :hint-count="hintCount"
      :can-clear="!!selectedCell && !selectedCellIsInitial"
      :on-undo="onUndo"
      :on-redo="onRedo"
      :toggle-edit-mode="toggleEditMode"
      :on-hint="useHint"
      :on-clear-cell="clearSelectedCell"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, defineEmits } from "vue";
import { useWindowFocus } from "@vueuse/core";
import ControlPanel from "@/src/components/controlPanel/ControlPanel.vue";
import ControlButton from "@/src/components/controlPanel/ControlButton.vue";
import { isGridComplete } from "@/src/utils/sudokuGenerator";
import { useSudokuStore } from "@/src/stores/sudoku";

const sudokuStore = useSudokuStore();
const isFocused = useWindowFocus();

// Focus handling
// Resume timer when focused, pause when not focused
watch(isFocused, (focused) => {
  if (focused && sudokuStore.pauseReason === "focus") {
    sudokuStore.resumeTimer();
    sudokuStore.pauseReason = null;
  } else if (!focused && !sudokuStore.isPaused) {
    sudokuStore.pauseReason = "focus";
    sudokuStore.pauseTimer();
  }
});
const isPaused = computed(() => sudokuStore.isPaused);

// Timer
const time = computed(() => {
  const minutes = Math.floor(sudokuStore.timer / 60);
  const seconds = sudokuStore.timer % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
});

function togglePause() {
  if (sudokuStore.isPaused) {
    sudokuStore.pauseReason = null;
    sudokuStore.resumeTimer();
  } else {
    sudokuStore.pauseReason = "manual";
    sudokuStore.pauseTimer();
  }
}

// Skor
const score = computed(() => sudokuStore.score);

// Undo/Redo
const canUndo = computed(() => sudokuStore.history.length > 0);
const canRedo = computed(() => sudokuStore.future.length > 0);
const onUndo = () => sudokuStore.undo();
const onRedo = () => sudokuStore.redo();

// Edit Mode
const isEditMode = computed(() => sudokuStore.isEditMode);
const toggleEditMode = () => sudokuStore.toggleEditMode();
const selectedCell = computed(() => sudokuStore.selectedCell);
const selectedCellIsInitial = computed(() => {
  const cell = selectedCell.value;
  return cell ? sudokuStore.grid[cell.row][cell.col].isInitial : true;
});

function clearSelectedCell() {
  const cell = selectedCell.value;
  if (cell && !selectedCellIsInitial.value) {
    sudokuStore.clearCell(cell.row, cell.col);
  }
}

// Hint
const emit = defineEmits(["show-modal"]);
const hintCount = computed(() => sudokuStore.hintsLeft);
const useHint = () => {
  if (sudokuStore.hintsLeft > 0) {
    sudokuStore.useHint();
    if (isGridComplete(sudokuStore.grid)) {
      sudokuStore.stopTimer();
      emit("show-modal", true);
    }
  }
};
</script>

<style scoped>
.font-digital {
  font-family: "Share Tech Mono", monospace;
  letter-spacing: 1px;
}
</style>
