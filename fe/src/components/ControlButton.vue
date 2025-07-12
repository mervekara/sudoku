<template>
  <v-badge
    v-if="badgeContent !== undefined && badgeContent !== null"
    :content="badgeContent"
    :size="size"
    :color="badgeColor"
    offset-x="6"
    offset-y="4"
  >
    <v-btn
      :icon="iconOnly"
      :variant="variant"
      :color="color"
      :class="btnClass"
      :disabled="disabled"
      :size="size"
      @click="onClick"
    >
      <slot>
        <v-icon v-if="icon" :icon="icon" />
        <span v-if="label" class="ml-2">{{ label }}</span>
      </slot>
    </v-btn>
  </v-badge>

  <v-btn
    v-else
    :icon="iconOnly"
    :variant="variant"
    :color="color"
    :class="btnClass"
    :disabled="disabled"
    :size="size"
    @click="onClick"
  >
    <slot>
      <v-icon v-if="icon" :icon="icon" />
      <span v-if="label" class="ml-2">{{ label }}</span>
    </slot>
  </v-btn>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  icon?: string;
  label?: string;
  color?: string;
  variant?: "flat" | "tonal" | "outlined" | "text" | "elevated";
  disabled?: boolean;
  iconOnly?: boolean;
  badgeContent?: string | number;
  badgeColor?: string;
  btnClass?: string;
  onClick: () => void;
  size?: "small" | "medium" | "large";
}>();
</script>
