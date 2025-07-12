<template>
  <div class="flex gap-3 sm:gap-4 md:gap-4 lg:gap-5 w-full">
    <!-- Undo -->
    <ControlButton
      size="large"
      variant="tonal"
      icon="mdi-undo"
      color="#517bb3"
      :iconOnly="true"
      :disabled="!canUndo"
      :on-click="onUndo"
    />

    <!-- Redo -->
    <ControlButton
      size="large"
      variant="tonal"
      icon="mdi-redo"
      color="#517bb3"
      :iconOnly="true"
      :disabled="!canRedo"
      @click="onRedo"
    />

    <!-- Clear Selected Cell -->
    <ControlButton
      size="large"
      variant="tonal"
      icon="mdi-eraser"
      color="#517bb3"
      :iconOnly="true"
      @click="onClearCell"
      :disabled="!canClear"
    />

    <!-- Edit Mode Toggle -->
    <ControlButton
      size="large"
      variant="tonal"
      icon="mdi-pencil"
      color="#517bb3"
      :iconOnly="true"
      :badge-content="isEditMode ? t('game.on') : t('game.off')"
      :badge-color="isEditMode ? '#517bb3' : '#a5bfee'"
      @click="toggleEditMode"
    />

    <ControlButton
      size="large"
      variant="tonal"
      color="#517bb3"
      icon="mdi-lightbulb"
      badge-color="#517bb3"
      :badge-content="hintCount"
      :iconOnly="true"
      :disabled="hintCount <= 0"
      @click="onHint"
    />
  </div>
</template>

<script setup lang="ts">
import ControlButton from "./ControlButton.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { defineProps } from "vue";

defineProps<{
  canUndo: boolean;
  canRedo: boolean;
  isEditMode: boolean;
  hintCount: number;
  canClear: boolean;
  onUndo: () => void;
  onRedo: () => void;
  toggleEditMode: () => void;
  onHint: () => void;
  onClearCell: () => void;
}>();
</script>
