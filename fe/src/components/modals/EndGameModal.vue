<template>
  <AppModal :show="show" :width="500" :height="320">
    <template #body>
      <div class="flex flex-col items-center justify-center h-full px-6 pt-6">
        <div class="text-xl font-semibold text-[#7091d5] mb-4 text-center">
          {{ t("game.congratulations") }}
        </div>

        <div class="text-lg font-medium mb-2 text-[#6e7c8c]">
          {{ t("game.yourScore") }}
          <span class="text-2xl font-bold text-[#6e7c8c]">{{
            totalScore
          }}</span>
        </div>

        <v-text-field
          v-model="name"
          :label="t('game.enterName')"
          :placeholder="t('game.enterName')"
          variant="underlined"
          hide-details
          base-color="#7091d5"
          color="#7091d5"
          bg-color="white"
          maxlength="12"
          class="w-full max-w-sm"
        />

        <AppLoader v-if="isLoading" />
        <AppError v-else-if="errorMessage" :message="errorMessage" />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 px-6 pb-4">
        <v-btn variant="plain" @click="cancel">{{ t("game.cancel") }}</v-btn>
        <v-btn
          variant="tonal"
          color="#7091d5"
          @click="save"
          :disabled="!name.trim()"
        >
          {{ t("game.save") }}
        </v-btn>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, defineProps, defineEmits } from "vue";
import AppModal from "./AppModal.vue";
import AppLoader from "../AppLoader.vue";
import AppError from "../AppError.vue";

import { useSudokuStore } from "../../stores/sudoku";
import { addToLeaderboard } from "../../services/leaderboard.service";
import { useQueryClient } from "@tanstack/vue-query";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const store = useSudokuStore();
const queryClient = useQueryClient();

const props = defineProps<{ show: boolean }>();
const { show } = toRefs(props);

const emit = defineEmits(["save", "cancel"]);
const name = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

const totalScore = computed(() => store.score + (500 - store.timer));

const cancel = () => {
  if (isLoading.value) return;
  emit("cancel");
};

const save = async () => {
  const trimmedName = name.value.trim();
  if (!trimmedName) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    await addToLeaderboard({
      level: store.difficulty,
      name: trimmedName,
      score: totalScore.value,
    });
    await queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
  } catch (error) {
    console.error("Error saving score:", error);
    errorMessage.value =
      (error as Error)?.message || t("game.error.savingScore");
  } finally {
    isLoading.value = false;
  }

  emit("cancel");
};
</script>
