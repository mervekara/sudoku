<template>
  <div class="flex flex-col gap-5 h-full items-center pt-1 bg-gray-100 pb-10">
    <LeaderboardHeader />

    <AppLoader v-if="isLoading" />
    <AppError v-else-if="isError" :message="errorMessage" />

    <v-card
      v-else
      class="rounded-lg shadow-none bg-transparent"
      max-width="900"
      height="240"
    >
      <v-tabs
        v-model="selectedLevel"
        color="#517bb3"
        align-tabs="center"
        density="comfortable"
        class="level-tabs"
      >
        <v-tab
          v-for="level in levels"
          :key="level"
          :value="level"
          class="text-xs font-semibold lowercase"
        >
          {{ levelLabels[level] }}
        </v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="selectedLevel">
          <v-window-item v-for="level in levels" :key="level" :value="level">
            <LeaderboardTable
              :entries="leaderboardData?.[level] || []"
              :level="level"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";

import LeaderboardHeader from "@/src/components/leaderBoard/LeaderboardHeader.vue";
import LeaderboardTable from "@/src/components/leaderBoard/LeaderboardTable.vue";
import AppLoader from "@/src/components/app/AppLoader.vue";
import AppError from "@/src/components/app/AppError.vue";
import { useI18n } from "vue-i18n";
import { getLeaderboard } from "@/src/services/leaderboard.service";
import { Difficulty } from "@/src/types/type";

const { t, tm } = useI18n();

const levelOrder: Difficulty[] = ["beginner", "intermediate", "hard", "expert"];

const levelLabels = tm("game.difficulties") as Record<Difficulty, string>;

const selectedLevel = ref<Difficulty>("beginner");

const {
  data: leaderboardData,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ["leaderboard"],
  queryFn: getLeaderboard,
});

const errorMessage =
  (error.value as Error)?.message ?? t("game.error.fetchingScores");

const levels = computed(() => {
  const allLevels = Object.keys(leaderboardData.value || {}) as Difficulty[];
  return levelOrder.filter((level) => allLevels.includes(level));
});
</script>

<style scoped>
.level-tabs :deep(.v-tab) {
  color: #6e7c8c;
  text-transform: none;
  transition: color 0.2s ease;
}

.level-tabs :deep(.v-tab:hover),
.level-tabs :deep(.v-tab--selected) {
  color: #517bb3 !important;
}
</style>
