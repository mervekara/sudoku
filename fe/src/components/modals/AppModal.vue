<template>
  <transition name="modal" appear>
    <div v-if="show" class="modal-mask">
      <div class="fixed inset-0 flex justify-center items-center">
        <div
          ref="modal"
          class="bg-white rounded-md shadow-xl relative overflow-hidden flex flex-col"
          :style="{ width: `${width}px`, minHeight: `${height}px` }"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex-1 overflow-y-auto p-6">
            <slot name="body" />
          </div>

          <div class="px-6 py-3 bg-white">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  show: boolean;
  width: number;
  height: number;
}>();
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.3);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
