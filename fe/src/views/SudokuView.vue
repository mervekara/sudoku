<template>
  <SudokuGameLayout>
    <template #header>
      <AppHeader />
    </template>

    <template #difficulty-tabs>
      <DifficultyTabs />
    </template>

    <template #sudoku-game>
      <SudokuBoard @show-modal="showEndGameModal = $event" />
    </template>

    <template #sudoku-control>
      <HeaderPanel @show-modal="showEndGameModal = $event" />
    </template>

    <template #available-digits>
      <AvailableDigits @show-modal="showEndGameModal = $event" />

      <NewGameButton
        :label="t('game.newGame')"
        color="#517bb3"
        variant="flat"
        :iconOnly="false"
        btnClass="!w-full !text-lg rounded-full"
        :text="t('game.exitGame')"
      />
    </template>

    <template #leader-board>
      <LeaderBoard />
    </template>
  </SudokuGameLayout>

  <Teleport to="body">
    <EndGameModal
      v-if="showEndGameModal"
      :show="showEndGameModal"
      @cancel="cancel"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSudokuStore } from "../stores/sudoku";

import SudokuGameLayout from "../layouts/SudokuLayout.vue";
import AppHeader from "../components/AppHeader.vue";
import DifficultyTabs from "../components/DifficultyTabs.vue";
import SudokuBoard from "../components/SudokuBoard.vue";
import HeaderPanel from "../components/HeaderPanel.vue";
import AvailableDigits from "../components/AvailableDigits.vue";
import NewGameButton from "../components/NewGameButton.vue";
import LeaderBoard from "../components/LeaderBoard.vue";
import EndGameModal from "../components/modals/EndGameModal.vue";
import { useI18n } from "vue-i18n";

const sudokuStore = useSudokuStore();
const { t } = useI18n();
const showEndGameModal = ref(false);

const cancel = () => {
  showEndGameModal.value = false;
  sudokuStore.newGame(sudokuStore.difficulty);
};
</script>
