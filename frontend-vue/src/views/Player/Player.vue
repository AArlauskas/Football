<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';

import FPageFeedback from '@/components/FPageFeedback.vue';
import { useOngoingMatchesPolling } from '@/composables/useOngoingMatchesPolling';
import { usePageTitle } from '@/composables/usePageTitle';
import { useTranslations } from '@/composables/useTranslations';
import { usePlayerStore } from '@/stores/playerStore';
import PlayerLoadingState from '@/views/Player/PlayerLoadingState.vue';
import PlayerMatchHistory from '@/views/Player/PlayerMatchHistory.vue';
import PlayerProfileCard from '@/views/Player/PlayerProfileCard.vue';

const route = useRoute();
const { t } = useTranslations();
const playerStore = usePlayerStore();
const { groupedGames, isLoading, player, requestError } =
  storeToRefs(playerStore);

const playerId = computed(() => Number(route.params.userId));

const pageTitle = computed(() =>
  player.value
    ? `${player.value.firstName} ${player.value.lastName}`
    : t('v1.player'),
);

watch(
  playerId,
  (id) => {
    if (!Number.isFinite(id)) {
      requestError.value = t('v1.general.error');

      return;
    }

    void playerStore.loadPlayer(id);
  },
  { immediate: true },
);

usePageTitle(pageTitle);
useOngoingMatchesPolling();
</script>

<template>
  <main class="player">
    <FPageFeedback :error="requestError" />

    <template v-if="isLoading">
      <PlayerLoadingState />
    </template>

    <template v-else-if="player">
      <PlayerProfileCard :player="player" />
      <PlayerMatchHistory :groups="groupedGames" :player-id="player.id" />
    </template>
  </main>
</template>

<style scoped lang="scss">
.player {
  display: flex;
  width: min(100%, var(--f-page-empty-content-width, 1280px));
  flex-direction: column;
  gap: var(--f-space-md);
  margin: 0 auto;
}
</style>
