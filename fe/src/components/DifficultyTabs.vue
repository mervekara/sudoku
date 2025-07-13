<template>
  <v-card flat class="w-full bg-transparent">
    <div class="flex items-center">
      <span class="text-sm font-semibold text-[#517bb3]">
        {{ t("game.difficulty") }}
      </span>

      <v-tabs
        v-model="selectedDifficulty"
        color="#517bb3"
        grow
        align-tabs="start"
        density="comfortable"
        slider-color="transparent"
        @update:model-value="onDifficultyChange"
        class="flex-1 custom-tab-style"
      >
        <v-tab
          v-for="item in difficulties"
          :key="item.value"
          :value="item.value"
          class="text-sm font-bold"
        >
          {{ item.title }}
        </v-tab>
      </v-tabs>
    </div>
  </v-card>
  <div class="w-full flex justify-center">
    <Teleport to="body">
      <ExitGameModal
        v-if="showExitModal"
        :show="showExitModal"
        :text="t('game.exitGame')"
        @confirm="confirmExit"
        @cancel="cancelExit"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useExitGameModal } from "@/src/composables/useExitGameModal";
import { Difficulty } from "@/src/types/type";
import ExitGameModal from "@/src/components/modals/ExitGameModal.vue";

const { t } = useI18n();
const {
  showExitModal,
  selectedDifficulty,
  prevDifficulty,
  openModal,
  confirmExit,
  cancelExit,
} = useExitGameModal();

const difficulties = computed(() => {
  return [
    { title: t("game.difficulties.beginner"), value: "beginner" },
    { title: t("game.difficulties.intermediate"), value: "intermediate" },
    { title: t("game.difficulties.hard"), value: "hard" },
    { title: t("game.difficulties.expert"), value: "expert" },
  ];
});

function onDifficultyChange(newDiff: Difficulty) {
  if (newDiff !== prevDifficulty.value) {
    openModal(newDiff);
  }
}
</script>

<style scoped>
.custom-tab-style :deep(.v-tab) {
  color: #6e7c8c;
  transition: color 0.2s ease;
  text-transform: none;
}

.custom-tab-style :deep(.v-tab:hover) {
  color: #517bb3 !important;
}

.custom-tab-style :deep(.v-tab.v-tab--selected) {
  color: #517bb3 !important;
  font-weight: bold;
}
</style>
