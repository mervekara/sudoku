<template>
  <div
    class="flex flex-row items-center justify-between bg-slate-50 h-full !px-4 md:!px-10 border-b border-slate-300 border-solid"
  >
    <div
      class="text-2xl md:text-5xl font-bold text-[#517bb3] text-900 text-center md:text-left !pl-[5%] flex items-center gap-3"
    >
      <h1 class="">{{ t("game.title") }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
