<template>
  <div class="w-full flex justify-center">
    <ControlButton
      size="large"
      :label="label"
      :icon="icon"
      :color="color"
      :variant="(variant as 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | undefined) || 'flat'"
      :iconOnly="iconOnly"
      :btnClass="btnClass"
      :onClick="onNewGameClick"
    />

    <Teleport to="body">
      <ExitGameModal
        v-if="showExitModal"
        :show="showExitModal"
        :text="text ?? ''"
        @confirm="confirmExit"
        @cancel="cancelExit"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import ControlButton from "./ControlButton.vue";
import ExitGameModal from "./modals/ExitGameModal.vue";
import { useExitGameModal } from "../composables/useExitGameModal";
import { useSudokuStore } from "../stores/sudoku";

defineProps<{
  label?: string;
  icon?: string;
  color?: string;
  variant?: string;
  iconOnly?: boolean;
  btnClass?: string;
  text?: string;
}>();

const { showExitModal, openModal, confirmExit, cancelExit } =
  useExitGameModal();
const sudokuStore = useSudokuStore();

function onNewGameClick() {
  openModal(sudokuStore.difficulty);
}
</script>
