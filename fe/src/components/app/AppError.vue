<template>
  <div class="text-center text-red-500 py-4 px-2 text-sm w-full">
    <v-icon color="red" size="20" class="mr-1">mdi-alert-circle</v-icon>
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{ message: string }>();
</script>
