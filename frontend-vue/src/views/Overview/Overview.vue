<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Skeleton } from 'primevue';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import FPageFeedback from '@/components/FPageFeedback.vue';
import { useExperiment } from '@/composables/useExperiment';
import { useOngoingMatchesPolling } from '@/composables/useOngoingMatchesPolling';
import { usePageTitle } from '@/composables/usePageTitle';
import { useTranslations } from '@/composables/useTranslations';
import { Experiment, RouteName } from '@/enums';
import type { TranslationKey } from '@/i18n';
import type { GameWithGuess, UserDetails } from '@/models';
import { useAuthStore } from '@/stores/authStore';
import { useOverviewStore } from '@/stores/overviewStore';
import OverviewHero from '@/views/Overview/OverviewHero.vue';
import OverviewNearbyLeaderboard from '@/views/Overview/OverviewNearbyLeaderboard.vue';
import OverviewRecentMatches from '@/views/Overview/OverviewRecentMatches.vue';

const LEADERBOARD_WINDOW_SIZE = 5;

const authStore = useAuthStore();
const overviewStore = useOverviewStore();
const route = useRoute();
const router = useRouter();
const { setActive: setOverviewExperimentActive } = useExperiment(
  Experiment.Overview,
);
const { t } = useTranslations();
const { games, isLoading, requestError, results } = storeToRefs(overviewStore);

const pageTitle = computed(() => t('v1.overview'));
const currentUser = computed(() => authStore.user);
const currentUserName = computed(() => {
  if (!currentUser.value) {
    return '';
  }

  return `${currentUser.value.firstName} ${currentUser.value.lastName}`;
});
const currentUserInitials = computed(() => {
  if (!currentUser.value) {
    return '';
  }

  return `${currentUser.value.firstName.at(0) ?? ''}${currentUser.value.lastName.at(0) ?? ''}`;
});
const currentUserRankIndex = computed(() =>
  results.value.findIndex((item) => item.id === currentUser.value?.id),
);
const nearbyPlayers = computed(() => {
  if (results.value.length <= LEADERBOARD_WINDOW_SIZE) {
    return results.value;
  }

  const activeIndex =
    currentUserRankIndex.value === -1 ? 0 : currentUserRankIndex.value;
  const maxStart = results.value.length - LEADERBOARD_WINDOW_SIZE;
  const start = Math.min(Math.max(activeIndex - 2, 0), maxStart);

  return results.value.slice(start, start + LEADERBOARD_WINDOW_SIZE);
});
const summaryCards = computed<
  Array<{
    icon: string;
    label: TranslationKey;
    value: number | string;
  }>
>(() => [
  {
    icon: 'pi pi-trophy',
    label: 'v1.place',
    value: currentUser.value?.points.place ?? '-',
  },
  {
    icon: 'pi pi-chart-line',
    label: 'v1.points',
    value: currentUser.value?.points.total ?? '-',
  },
  {
    icon: 'pi pi-check-circle',
    label: 'v1.correct.guesses',
    value: currentUser.value?.points.correctGuesses ?? '-',
  },
]);

const selectPlayer = async (player: UserDetails) => {
  if (player.id === currentUser.value?.id) {
    await router.push({ name: RouteName.Personal });

    return;
  }

  await router.push({ name: RouteName.Player, params: { userId: player.id } });
};

const openMatch = async (item: GameWithGuess) => {
  await router.push({
    name: RouteName.Match,
    params: { gameId: item.game.id },
  });
};

const makeGuesses = async () => {
  await router.push({ name: RouteName.Games });
};

const openResults = async () => {
  await router.push({ name: RouteName.Results });
};

onMounted(() => {
  if (route.query.activate === 'true') {
    setOverviewExperimentActive(true);
  }

  void authStore.refreshPersonalPoints();
  void overviewStore.loadOverview();
});

usePageTitle(pageTitle);
useOngoingMatchesPolling();
</script>

<template>
  <main class="overview">
    <FPageFeedback :error="requestError" />

    <template v-if="isLoading">
      <section class="overview__loading">
        <Skeleton height="9rem" />
        <div class="overview__grid">
          <Skeleton height="18rem" />
          <Skeleton height="18rem" />
        </div>
      </section>
    </template>

    <template v-else>
      <OverviewHero
        :initials="currentUserInitials"
        :name="currentUserName"
        :summary-cards="summaryCards"
      />

      <section class="overview__grid">
        <OverviewRecentMatches
          :games="games"
          @make-guesses="makeGuesses"
          @select-match="openMatch"
        />
        <OverviewNearbyLeaderboard
          :current-user-id="currentUser?.id"
          :players="nearbyPlayers"
          @open-results="openResults"
          @select-player="selectPlayer"
        />
      </section>
    </template>
  </main>
</template>

<style scoped lang="scss">
.overview {
  display: flex;
  width: min(100%, var(--f-page-empty-content-width, 1280px));
  flex-direction: column;
  gap: var(--f-space-md);
  margin: 0 auto;

  &__loading,
  &__grid {
    display: grid;
    gap: var(--f-space-md);
  }

  &__grid {
    align-items: start;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }
}

@media (width <= 1060px) {
  .overview {
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
