<template>
  <div class="flex flex-col justify-center items-center gap-4">
    <div
      v-show="isGamePaused"
      class="sudoku-canvas bg-white flex justify-center items-center"
    >
      <v-icon size="100" color="#517bb3" class="bg-[#dce4f7] rounded-full p-4">
        mdi-play
      </v-icon>
    </div>

    <div
      class="canvas-wrapper"
      :class="{ 'border-animate': isGridComplete(grid) }"
    >
      <canvas
        v-show="!isGamePaused"
        ref="canvasRef"
        class="sudoku-canvas"
        tabindex="0"
        @click="handleCanvasClick"
        @keydown="onKeyDown"
        @touchstart="handleTouchStart"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from "vue";
import { useWindowFocus } from "@vueuse/core";
import { useSudokuStore } from "@/src/stores/sudoku";
import { useSudokuCanvas } from "@/src/composables/useSudokuCanvas";
import { isGridComplete } from "@/src/utils/sudokuGenerator";

const emit = defineEmits(["show-modal"]);

const canvasRef = ref<HTMLCanvasElement | null>(null);

const sudokuStore = useSudokuStore();

const grid = computed(() => sudokuStore.grid);
const selectedCell = computed(() => sudokuStore.selectedCell);
const isEditMode = computed(() => sudokuStore.isEditMode);
const isPaused = computed(() => sudokuStore.isPaused);
const isFocused = useWindowFocus();
const isGamePaused = computed(() => {
  return (
    isPaused.value || (!isFocused.value && sudokuStore.pauseReason !== "manual")
  );
});

function handleCellSelect(row: number, col: number) {
  sudokuStore.selectCell(row, col);
}

const { handleCanvasClick, handleTouchStart } = useSudokuCanvas(
  canvasRef,
  grid,
  selectedCell,
  handleCellSelect,
  isFocused
);

function onKeyDown(e: KeyboardEvent) {
  const cell = selectedCell.value;
  if (!cell) return;

  const { row, col } = cell;

  if (e.key >= "1" && e.key <= "9") {
    const value = parseInt(e.key);
    if (isEditMode.value) {
      sudokuStore.addOrRemoveDraft(row, col, value);
    } else {
      sudokuStore.inputCell(row, col, value);
      if (isGridComplete(grid.value)) {
        sudokuStore.stopTimer();
        setTimeout(() => emit("show-modal", true), 2000);
      }
    }
  } else if (["Backspace", "Delete"].includes(e.key)) {
    if (!grid.value[row][col].isInitial) {
      sudokuStore.clearCell(row, col);
    }
  }
}

sudokuStore.newGame("beginner");
</script>

<style scoped>
.sudoku-canvas {
  width: min(430px, calc(100vw - 40px));
  height: min(430px, calc(100vw - 40px));
  border: 1px solid #9dbbed;
  outline: none;
  aspect-ratio: 1;
  max-width: 430px;
  max-height: 430px;
}

.canvas-wrapper {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

@keyframes borderLight {
  0% {
    box-shadow: 0 0 0 0 rgba(112, 145, 213, 0.4);
  }
  25% {
    box-shadow: 0 0 0 10px rgba(112, 145, 213, 0.4);
  }
  50% {
    box-shadow: 0 0 0 0 rgba(112, 145, 213, 0.4);
  }
  75% {
    box-shadow: 0 0 0 10px rgba(112, 145, 213, 0.4);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(112, 145, 213, 0.4);
  }
}

.border-animate {
  animation: borderLight 2s ease-in-out infinite;
}
</style>
