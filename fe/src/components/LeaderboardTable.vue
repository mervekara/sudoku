<template>
  <v-table density="compact" class="w-full bg-transparent">
    <thead>
      <tr>
        <th class="text-left">#</th>
        <th class="text-left">{{ t("game.player") }}</th>
        <th class="text-right">{{ t("game.score") }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(entry, index) in entries" :key="entry._id">
        <td class="font-bold text-[#517bb3]">{{ index + 1 }}.</td>
        <td class="font-bold text-[#6e7c8c]">{{ entry.name }}</td>
        <td class="font-bold text-[#6e7c8c] text-right">{{ entry.score }}</td>
      </tr>
      <tr v-if="!entries.length">
        <td colspan="3" class="text-center text-gray-500">
          {{ t("game.noScores") }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import type { Difficulty } from "../types/type";
import { defineProps } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

defineProps<{
  entries: { _id: string; name: string; score: number }[];
  level: Difficulty;
}>();
</script>

<style scoped>
.v-table th {
  background-color: transparent;
  color: #517bb3;
  font-weight: 1000;
}
.v-table td {
  padding: 8px 16px;
}
</style>
