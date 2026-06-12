<script setup lang="ts">
import { Button, Card, Tag } from 'primevue';
import { useRouter } from 'vue-router';

import FEmptyMessage from '@/components/FEmptyMessage.vue';
import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import { RouteName } from '@/enums';
import { translateTeamName } from '@/lib/teamName';
import type { GameWithGuess, GuessOutcome } from '@/models';
import { GameState, GuessOutcome as GuessOutcomeValue } from '@/models/game';

defineProps<{
  groups: Array<{
    date: string;
    items: GameWithGuess[];
  }>;
  hideTitle?: boolean;
}>();

const router = useRouter();
const { t } = useTranslations();

const getOutcomeSeverity = (outcome?: GuessOutcome | null) => {
  if (
    outcome === GuessOutcomeValue.CORRECT ||
    outcome === GuessOutcomeValue.CORRECT_ALONE
  ) {
    return 'success';
  }

  if (outcome === GuessOutcomeValue.OUTCOME_ONLY) {
    return 'warn';
  }

  return 'danger';
};

const getOutcomeClass = (outcome?: GuessOutcome | null) => ({
  'player-match-history__points-row--success':
    outcome === GuessOutcomeValue.CORRECT ||
    outcome === GuessOutcomeValue.CORRECT_ALONE,
  'player-match-history__points-row--warning':
    outcome === GuessOutcomeValue.OUTCOME_ONLY,
  'player-match-history__points-row--danger':
    outcome === GuessOutcomeValue.OUTCOME_INCORRECT ||
    outcome === GuessOutcomeValue.NOT_GIVEN,
});

const formatGuess = (item: GameWithGuess) => {
  if (!item.guess?.result) {
    return '-';
  }

  return `${item.guess.result.goals1} : ${item.guess.result.goals2}`;
};

const isMatchVisitable = (item: GameWithGuess) =>
  item.game.state !== GameState.OPEN;

const goToMatch = async (gameId: number) => {
  await router.push({ name: RouteName.Match, params: { gameId } });
};

const goToMatchClosedOrFinishedMatch = async (item: GameWithGuess) => {
  if (!isMatchVisitable(item)) {
    return;
  }

  await goToMatch(item.game.id);
};

const goToTeam = async (teamId: string) => {
  await router.push({ name: RouteName.Team, params: { teamId } });
};
</script>

<template>
  <section class="player-match-history">
    <FText v-if="!hideTitle" as="h2" variant="heading-3">
      {{ t('v1.player.match.history') }}
    </FText>

    <div v-if="groups.length" class="player-match-history__list">
      <section
        v-for="group in groups"
        :key="group.date"
        class="player-match-history__group"
      >
        <Card>
          <template #title>{{ group.date }}</template>
          <template #content>
            <div class="player-match-history__day-games">
              <article
                v-for="item in group.items"
                :key="item.game.id"
                class="player-match-history__match-card"
                :class="{
                  'player-match-history__match-card--clickable':
                    isMatchVisitable(item),
                }"
                @click="goToMatchClosedOrFinishedMatch(item)"
              >
                <FText
                  as="span"
                  class="player-match-history__match-time"
                  variant="body-2-bold"
                >
                  {{ item.game.time }}
                </FText>

                <div class="player-match-history__match-main">
                  <Button
                    class="player-match-history__team-button player-match-history__team-button--home"
                    link
                    @click.stop="goToTeam(item.game.t1.code)"
                  >
                    <FText as="span" clickable variant="body-2-bold">
                      {{ translateTeamName(item.game.t1, t) }}
                    </FText>
                  </Button>
                  <FText
                    as="span"
                    class="player-match-history__score player-match-history__score--home"
                    variant="heading-3"
                  >
                    {{ item.game.result?.goals1 ?? '-' }}
                  </FText>
                  <FText
                    as="span"
                    class="player-match-history__score-separator"
                    color="--p-text-muted-color"
                    variant="body-2-bold"
                  >
                    :
                  </FText>
                  <FText
                    as="span"
                    class="player-match-history__score player-match-history__score--away"
                    variant="heading-3"
                  >
                    {{ item.game.result?.goals2 ?? '-' }}
                  </FText>
                  <Button
                    class="player-match-history__team-button player-match-history__team-button--away"
                    link
                    @click.stop="goToTeam(item.game.t2.code)"
                  >
                    <FText as="span" clickable variant="body-2-bold">
                      {{ translateTeamName(item.game.t2, t) }}
                    </FText>
                  </Button>

                  <div class="player-match-history__guess-score">
                    <FText
                      as="span"
                      color="--p-text-muted-color"
                      variant="body-3"
                    >
                      {{ t('v1.player.guess') }}
                    </FText>
                    <FText as="span" variant="body-1-bold">
                      {{ formatGuess(item) }}
                    </FText>
                  </div>
                </div>

                <div
                  v-if="item.guess && item.game.state === GameState.FINISHED"
                  class="player-match-history__points-row"
                  :class="getOutcomeClass(item.guess.outcome)"
                >
                  <FText as="span" variant="body-2">
                    {{ t('v1.points') }}
                  </FText>
                  <Tag
                    :severity="getOutcomeSeverity(item.guess.outcome)"
                    :value="String(item.guess.points ?? '-')"
                  />
                </div>
              </article>
            </div>
          </template>
        </Card>
      </section>
    </div>

    <FEmptyMessage v-else message="v1.player.no.matches" />
  </section>
</template>

<style scoped lang="scss">
.player-match-history {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.player-match-history__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.player-match-history__group {
  min-width: 0;
}

.player-match-history__day-games {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.player-match-history__match-card {
  display: grid;
  overflow: hidden;
  border: var(--f-card-border);
  border-radius: var(--f-card-radius);
  background: var(--p-surface-card);
  box-shadow: var(--f-card-shadow);
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.2s;
}

.player-match-history__match-card--clickable {
  cursor: pointer;

  &:hover,
  &:focus-within {
    border-color: var(--p-primary-color);
    box-shadow: var(--f-card-hover-shadow);
    transform: translateY(-1px);
  }
}

.player-match-history__match-time {
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-bottom: var(--f-match-time-border);
  background: var(--f-match-time-background);
  text-align: center;
}

.player-match-history__match-main {
  display: grid;
  align-items: center;
  gap: 12px;
  grid-template-areas:
    'team-home score-home separator score-away team-away'
    'guess guess guess guess guess';
  grid-template-columns: minmax(0, 1fr) 32px 12px 32px minmax(0, 1fr);
  padding-top: 12px;
  text-align: center;
}

.player-match-history__score {
  display: block;
}

.player-match-history__score--home {
  grid-area: score-home;
}

.player-match-history__score--away {
  grid-area: score-away;
}

.player-match-history__score-separator {
  grid-area: separator;
}

.player-match-history__team-button--home {
  grid-area: team-home;
}

.player-match-history__team-button--away {
  grid-area: team-away;
}

.player-match-history__team-button {
  min-width: 0;
  padding: 0;
  color: var(--p-text-color);

  :deep(.p-button-label) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.player-match-history__guess-score {
  display: grid;
  grid-area: guess;
  gap: 4px;
  padding: 10px;
  border-radius: var(--p-content-border-radius);
  background: var(--p-content-hover-background);
}

.player-match-history__points-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-top: 1px solid var(--p-surface-border);
  background: var(--p-content-hover-background);
}

.player-match-history__points-row--success {
  background: var(--f-outcome-success-background);
}

.player-match-history__points-row--warning {
  background: var(--f-outcome-warning-background);
}

.player-match-history__points-row--danger {
  background: var(--f-outcome-danger-background);
}

@media (width <= 760px) {
  .player-match-history__match-main {
    gap: 10px;
    grid-template-areas:
      'team-home score-home separator score-away team-away'
      'guess guess guess guess guess';
    grid-template-columns: minmax(0, 1fr) 24px 8px 24px minmax(0, 1fr);
    text-align: center;
  }

  .player-match-history__score {
    text-align: center;
  }

  .player-match-history__team-button {
    justify-content: center;

    :deep(.p-button-label) {
      white-space: nowrap;
    }
  }

  .player-match-history__guess-score {
    text-align: center;
  }
}
</style>
