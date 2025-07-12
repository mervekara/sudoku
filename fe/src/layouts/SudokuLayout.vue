<template>
  <div class="w-full min-h-screen flex flex-col pb-20">
    <div class="w-full h-24">
      <slot name="header"></slot>
    </div>

    <div class="flex flex-col lg:flex-row w-full flex-1">
      <div class="flex flex-col gap-6 p-6 pt-[5%] lg:p-8 lg:pt-[5%] lg:w-2/3">
        <div
          class="flex flex-col lg:flex-row justify-center gap-4 lg:gap-8 !p-6 !pt-[5%]"
        >
          <div class="lg:hidden flex flex-col gap-5 px-8 xl:px-0 order-1">
            <slot name="sudoku-control"></slot>
          </div>
          <div class="order-2 lg:order-1">
            <slot name="difficulty-tabs"></slot>
            <slot name="sudoku-game"></slot>
          </div>
          <div
            class="hidden lg:flex flex-col gap-5 lg:mt-0 px-8 xl:px-0 order-3"
          >
            <slot name="sudoku-control"></slot>
            <slot name="available-digits"></slot>
          </div>
          <div class="lg:hidden flex flex-col gap-5 px-8 xl:px-0 order-3">
            <slot name="available-digits"></slot>
          </div>
        </div>
      </div>
      <div class="right-side flex-1 p-4 border-l border-gray-200">
        <slot name="leader-board"></slot>
      </div>
    </div>
    <div class="w-full">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
