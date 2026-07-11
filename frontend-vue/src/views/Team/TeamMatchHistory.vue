<script setup lang="ts">
import { Button, Card, Select } from 'primevue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import FEmptyMessage from '@/components/FEmptyMessage.vue';
import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import { RouteName } from '@/enums';
import { translateTeamName } from '@/lib/teamName';
import type { Game } from '@/models';

const TeamMatchHistoryFilter = {
  ALL: 'all',
  LOSSES: 'losses',
  TIES: 'ties',
  WINS: 'wins',
} as const;

type TeamMatchHistoryFilterValue =
  (typeof TeamMatchHistoryFilter)[keyof typeof TeamMatchHistoryFilter];

type Props = {
  groups: Array<{
    date: string;
    items: Game[];
  }>;
  teamId: string;
};

const props = defineProps<Props>();

const router = useRouter();
const { t } = useTranslations();
const activeFilter = ref<TeamMatchHistoryFilterValue>(
  TeamMatchHistoryFilter.ALL,
);

const filterOptions = computed(() => [
  {
    label: t('v1.team.match.history.filter.all'),
    value: TeamMatchHistoryFilter.ALL,
  },
  {
    label: t('v1.team.wins'),
    value: TeamMatchHistoryFilter.WINS,
  },
  {
    label: t('v1.team.ties'),
    value: TeamMatchHistoryFilter.TIES,
  },
  {
    label: t('v1.team.losses'),
    value: TeamMatchHistoryFilter.LOSSES,
  },
]);

const getGoalDifference = (game: Game) => {
  if (!game.result) {
    return null;
  }

  const isHomeTeam = game.t1.code === props.teamId;
  const teamGoals = isHomeTeam ? game.result.goals1 : game.result.goals2;
  const opponentGoals = isHomeTeam ? game.result.goals2 : game.result.goals1;

  return teamGoals - opponentGoals;
};

const matchesFilter = (game: Game) => {
  if (activeFilter.value === TeamMatchHistoryFilter.ALL) {
    return true;
  }

  const goalDifference = getGoalDifference(game);

  if (goalDifference === null) {
    return false;
  }

  if (activeFilter.value === TeamMatchHistoryFilter.WINS) {
    return goalDifference > 0;
  }

  if (activeFilter.value === TeamMatchHistoryFilter.LOSSES) {
    return goalDifference < 0;
  }

  return goalDifference === 0;
};

const filteredGroups = computed(() =>
  props.groups
    .map((group) => ({
      ...group,
      items: group.items.filter(matchesFilter),
    }))
    .filter((group) => group.items.length > 0),
);

const goToMatch = async (gameId: number) => {
  await router.push({ name: RouteName.Match, params: { gameId } });
};

const goToTeam = async (teamId: string) => {
  await router.push({ name: RouteName.Team, params: { teamId } });
};
</script>

<template>
  <section class="team-match-history">
    <div class="team-match-history__toolbar">
      <FText as="h2" variant="heading-3">
        {{ t('v1.team.match.history') }}
      </FText>

      <Select
        v-model="activeFilter"
        :aria-label="t('v1.team.match.history.filter')"
        class="team-match-history__filter"
        option-label="label"
        option-value="value"
        :options="filterOptions"
      />
    </div>

    <div v-if="filteredGroups.length" class="team-match-history__list">
      <section
        v-for="group in filteredGroups"
        :key="group.date"
        class="team-match-history__group"
      >
        <Card>
          <template #title>
            <FText as="span" variant="body-1-bold">{{ group.date }}</FText>
          </template>
          <template #content>
            <div class="team-match-history__day-games">
              <article
                v-for="game in group.items"
                :key="game.id"
                class="team-match-history__match-card f-card-surface"
              >
                <button
                  class="team-match-history__match-time"
                  type="button"
                  @click="goToMatch(game.id)"
                >
                  <FText as="span" variant="body-2-bold">
                    {{ game.time }}
                  </FText>
                </button>

                <div class="team-match-history__match-main">
                  <Button
                    class="team-match-history__team-button team-match-history__team-button--home"
                    link
                    @click="goToTeam(game.t1.code)"
                  >
                    <FText as="span" clickable variant="body-2-bold">
                      {{ translateTeamName(game.t1, t) }}
                    </FText>
                  </Button>
                  <FText
                    as="span"
                    class="team-match-history__score team-match-history__score--home"
                    variant="heading-3"
                  >
                    {{ game.result?.goals1 ?? '-' }}
                  </FText>
                  <FText
                    as="span"
                    class="team-match-history__score-separator"
                    color="--p-text-muted-color"
                    variant="body-2-bold"
                  >
                    :
                  </FText>
                  <FText
                    as="span"
                    class="team-match-history__score team-match-history__score--away"
                    variant="heading-3"
                  >
                    {{ game.result?.goals2 ?? '-' }}
                  </FText>
                  <Button
                    class="team-match-history__team-button team-match-history__team-button--away"
                    link
                    @click="goToTeam(game.t2.code)"
                  >
                    <FText as="span" clickable variant="body-2-bold">
                      {{ translateTeamName(game.t2, t) }}
                    </FText>
                  </Button>
                </div>

                <button
                  class="team-match-history__details-button"
                  type="button"
                  @click="goToMatch(game.id)"
                >
                  <FText
                    as="span"
                    color="--p-primary-contrast-color"
                    variant="body-2-bold"
                  >
                    {{ t('v1.match') }}
                  </FText>
                  <i class="pi pi-arrow-right" />
                </button>
              </article>
            </div>
          </template>
        </Card>
      </section>
    </div>

    <FEmptyMessage v-else message="v1.team.no.matches" />
  </section>
</template>

<style scoped lang="scss">
.team-match-history {
  display: flex;
  flex-direction: column;
  gap: var(--f-space-md);

  &__toolbar {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: space-between;
    gap: var(--f-space-md);
  }

  &__filter {
    width: min(100%, 260px);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--f-space-lg);
  }

  &__group {
    min-width: 0;
  }

  &__day-games {
    display: flex;
    flex-direction: column;
    gap: var(--f-space-xl);
  }

  &__match-card {
    display: grid;
    overflow: hidden;
  }

  &__match-time {
    width: 100%;
    padding: var(--f-space-sm) var(--f-space-md);
    border: 0;
    border-bottom: var(--f-match-time-border);
    background: var(--f-match-time-background);
    cursor: pointer;
    font: inherit;
    text-align: center;
  }

  &__match-main {
    display: grid;
    align-items: center;
    gap: var(--f-space-md);
    grid-template-areas: 'team-home score-home separator score-away team-away';
    grid-template-columns: minmax(0, 1fr) 32px 12px 32px minmax(0, 1fr);
    padding: var(--f-space-sm) var(--f-space-md);
    text-align: center;
  }

  &__score {
    display: block;

    &--home {
      grid-area: score-home;
    }

    &--away {
      grid-area: score-away;
    }
  }

  &__score-separator {
    grid-area: separator;
  }

  &__team-button {
    min-width: 0;
    padding: 0;
    color: var(--p-text-color);

    &--home {
      grid-area: team-home;
    }

    &--away {
      grid-area: team-away;
    }

    :deep(.p-button-label) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__details-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--f-space-xs);
    width: 100%;
    padding: var(--f-space-sm) var(--f-space-md);
    border: 0;
    border-top: 1px solid var(--p-primary-color);
    border-radius: 0;
    background: var(--p-primary-color);
    cursor: pointer;
    font: inherit;
    transition:
      background-color 0.2s,
      border-color 0.2s;

    &:hover,
    &:focus-visible {
      border-top-color: var(--p-primary-hover-color);
      background: var(--p-primary-hover-color);
    }
  }
}

@media (width <= 760px) {
  .team-match-history {
    &__toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    &__filter {
      width: 100%;
    }

    &__match-main {
      gap: var(--f-space-sm);
      grid-template-areas:
        'team-home team-home team-home'
        'score-home separator score-away'
        'team-away team-away team-away';
      grid-template-columns: minmax(0, 1fr) 8px minmax(0, 1fr);
      padding: var(--f-space-md);
    }

    &__score {
      &--home {
        justify-self: end;
      }

      &--away {
        justify-self: start;
      }
    }

    &__team-button {
      justify-content: center;

      :deep(.p-button-label) {
        white-space: normal;
      }
    }
  }
}
</style>
