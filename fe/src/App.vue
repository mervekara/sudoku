<template>
  <div class="w-screen h-screen">
    <SudokuView />
  </div>
</template>
<script setup lang="ts">
import SudokuView from "@/src/views/SudokuView.vue";
</script>
<style>
body {
  min-height: 100vh;
  min-width: 100vw;
}
</style>
