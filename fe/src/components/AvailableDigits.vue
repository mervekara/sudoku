<template>
  <div class="grid grid-cols-9 gap-2 xl:grid-cols-3">
    <v-btn
      v-for="digit in 9"
      :key="digit"
      :variant="isLarge ? 'tonal' : 'text'"
      class="!min-w-0 !h-15"
      color="#517bb3"
      @click="() => handleDigitClick(digit)"
      :disabled="!isEditMode && usedDigits[digit]"
      hide-details
    >
      <span class="text-2xl text-[#517bb3]">{{ digit }}</span>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits } from "vue";
import { useDisplay } from "vuetify";
import { useSudokuStore } from "@/src/stores/sudoku";
import { isGridComplete } from "@/src/utils/sudokuGenerator";

const store = useSudokuStore();
const { lgAndUp } = useDisplay();

const emit = defineEmits<{
  (e: "show-modal", value: boolean): void;
}>();

const grid = computed(() => store.grid);
const isEditMode = computed(() => store.isEditMode);
const selectedCell = computed(() => store.selectedCell);
const isLarge = computed(() => lgAndUp.value);

const usedDigits = computed(() => {
  const map = Array(10).fill(0);
  grid.value.forEach((row) =>
    row.forEach((cell) => {
      if (cell.value) map[cell.value]++;
    })
  );
  return map.map((count) => count === 9);
});

const handleDigitClick = (digit: number) => {
  const cellPos = selectedCell.value;
  if (!cellPos) return;

  const { row, col } = cellPos;
  const cell = grid.value[row][col];

  if (cell.isInitial) return;

  if (isEditMode.value) {
    store.addOrRemoveDraft(row, col, digit);
  } else {
    store.inputCell(row, col, digit);

    if (isGridComplete(grid.value)) {
      store.stopTimer();
      setTimeout(() => emit("show-modal", true), 2000);
    }
  }
};
</script>
