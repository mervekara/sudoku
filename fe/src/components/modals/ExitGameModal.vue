<template>
  <AppModal :show="show" :width="400" :height="150">
    <template #body>
      <div class="flex pt-8 px-3 justify-center">
        <div class="text-center text-lg font-bold text-[#7091d5]">
          {{ text }}
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2 px-3 pb-3">
        <v-btn
          variant="plain"
          class="text-[#517bb3] hover:bg-[#e0e8f7] hover:text-[#5a77b8]"
          @click="cancel"
        >
          {{ t("game.cancel") }}
        </v-btn>

        <v-btn
          variant="flat"
          class="text-white hover:bg-[#5a77b8]"
          color="#517bb3"
          @click="confirm"
        >
          {{ t("game.confirm") }}
        </v-btn>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from "@/src/components/modals/AppModal.vue";
import { defineProps, defineEmits, toRefs } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps<{
  show: boolean;
  text: string;
}>();
const { show } = toRefs(props);
const emit = defineEmits(["confirm", "cancel"]);
const confirm = () => emit("confirm");
const cancel = () => emit("cancel");
</script>
