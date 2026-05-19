<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted, watch } from 'vue';

import FPageFeedback from '@/components/FPageFeedback.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { useToast } from '@/composables/useToast';
import { useTranslations } from '@/composables/useTranslations';
import type { GameResult } from '@/models';
import { useAuthStore } from '@/stores/authStore';
import { usePersonalStore } from '@/stores/personalStore';
import PersonalOpenMatches from '@/views/Personal/PersonalOpenMatches.vue';
import PlayerLoadingState from '@/views/Player/PlayerLoadingState.vue';
import PlayerMatchHistory from '@/views/Player/PlayerMatchHistory.vue';
import PlayerProfileCard from '@/views/Player/PlayerProfileCard.vue';

const authStore = useAuthStore();
const personalStore = usePersonalStore();
const toast = useToast();
const { t } = useTranslations();
const {
  isLoading,
  isSavingGuess,
  openGroups,
  player,
  previousGroups,
  requestError,
  successMessageKey,
} = storeToRefs(personalStore);

const pageTitle = computed(() => t('v1.personal'));

const handleSaveGuess = async (gameId: number, result: GameResult) => {
  await personalStore.saveGuess(gameId, result);
};

watch(successMessageKey, (messageKey) => {
  if (!messageKey) {
    return;
  }

  toast.success({
    summary: t('v1.confirm'),
    detail: t(messageKey),
  });
});

onMounted(() => {
  void personalStore.loadPersonal();
});

usePageTitle(pageTitle);
</script>

<template>
  <main class="personal-page">
    <FPageFeedback :error="requestError" />

    <template v-if="isLoading">
      <PlayerLoadingState />
    </template>

    <template v-else-if="player || authStore.user">
      <PlayerProfileCard :player="player ?? authStore.user!" />
      <PersonalOpenMatches
        :groups="openGroups"
        :is-saving="isSavingGuess"
        @save-guess="handleSaveGuess"
      />
      <PlayerMatchHistory :groups="previousGroups" />
    </template>
  </main>
</template>

<style scoped lang="scss">
.personal-page {
  display: flex;
  width: min(100%, var(--f-page-empty-content-width, 1280px));
  flex-direction: column;
  gap: 16px;
  margin: 0 auto;
}
</style>
