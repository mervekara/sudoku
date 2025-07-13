<template>
  <div class="w-full h-10 bg-[#7091d5] flex items-center justify-center">
    <span class="text-white text-lg">
      {{ t("game.title") }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<style scoped></style>
