<template>
  <div
    class="text-2xl font-bold text-[#517bb3] flex w-full gap-2 items-center justify-center pt-9"
  >
    <v-icon size="30" color="#517bb3">mdi-trophy</v-icon>
    {{ t("game.leaderboard") }}
  </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
