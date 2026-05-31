<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';

import FPageFeedback from '@/components/FPageFeedback.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { useTranslations } from '@/composables/useTranslations';
import { translateTeamName } from '@/lib/teamName';
import { GameState } from '@/models/game';
import { useTeamStore } from '@/stores/teamStore';
import TeamLoadingState from '@/views/Team/TeamLoadingState.vue';
import TeamMatchHistory from '@/views/Team/TeamMatchHistory.vue';
import TeamProfileCard from '@/views/Team/TeamProfileCard.vue';

const route = useRoute();
const { t } = useTranslations();
const teamStore = useTeamStore();
const { games, groupedGames, isLoading, requestError, team } =
  storeToRefs(teamStore);

const teamId = computed(() => String(route.params.teamId ?? ''));
const pageTitle = computed(() =>
  team.value ? translateTeamName(team.value, t) : t('v1.team'),
);
const teamStats = computed(() =>
  games.value.reduce(
    (stats, game) => {
      if (game.state !== GameState.FINISHED || !game.result) {
        return stats;
      }

      stats.gamesPlayed += 1;

      const isTeam1 = game.t1.code === teamId.value;
      const teamGoals = isTeam1 ? game.result.goals1 : game.result.goals2;
      const opponentGoals = isTeam1 ? game.result.goals2 : game.result.goals1;

      if (teamGoals > opponentGoals) {
        stats.victories += 1;
      } else if (teamGoals < opponentGoals) {
        stats.losses += 1;
      } else {
        stats.ties += 1;
      }

      return stats;
    },
    {
      gamesPlayed: 0,
      losses: 0,
      ties: 0,
      victories: 0,
    },
  ),
);

watch(
  teamId,
  (id) => {
    if (!id) {
      requestError.value = t('v1.general.error');

      return;
    }

    void teamStore.loadTeam(id);
  },
  { immediate: true },
);

usePageTitle(pageTitle);
</script>

<template>
  <main class="team-page">
    <FPageFeedback :error="requestError" />

    <template v-if="isLoading">
      <TeamLoadingState />
    </template>

    <template v-else-if="team">
      <TeamProfileCard :stats="teamStats" :team="team" />
      <TeamMatchHistory :groups="groupedGames" />
    </template>
  </main>
</template>

<style scoped lang="scss">
.team-page {
  display: flex;
  width: min(100%, var(--f-page-empty-content-width, 1280px));
  flex-direction: column;
  gap: 16px;
  margin: 0 auto;
}
</style>
