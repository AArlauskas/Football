<script setup lang="ts">
import { Card, Tag } from 'primevue';

import FEmptyMessage from '@/components/FEmptyMessage.vue';
import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';
import { translateTeamName } from '@/lib/teamName';
import type { GameWithGuess, GuessOutcome } from '@/models';
import { GameState, GuessOutcome as GuessOutcomeValue } from '@/models/game';

defineProps<{
  games: GameWithGuess[];
}>();

const emit = defineEmits<{
  selectMatch: [item: GameWithGuess];
}>();

const { t } = useTranslations();

const stateLabelMap: Record<GameState, TranslationKey> = {
  [GameState.CLOSED]: 'v1.admin.state.closed',
  [GameState.FINISHED]: 'v1.admin.state.finished',
  [GameState.OPEN]: 'v1.admin.state.open',
};

const getStateSeverity = (state: GameState) => {
  if (state === GameState.OPEN) {
    return 'success';
  }

  if (state === GameState.CLOSED) {
    return 'warn';
  }

  return 'secondary';
};

const getMatchTitle = (item: GameWithGuess) =>
  `${translateTeamName(item.game.t1, t)} - ${translateTeamName(item.game.t2, t)}`;

const getMatchScore = (item: GameWithGuess) => {
  if (!item.game.result) {
    return '- : -';
  }

  return `${item.game.result.goals1} : ${item.game.result.goals2}`;
};

const getGuessLabel = (item: GameWithGuess) => {
  if (!item.guess?.result) {
    return t('v1.overview.no.guess');
  }

  return `${item.guess.result.goals1} : ${item.guess.result.goals2}`;
};

const getGuessPoints = (item: GameWithGuess) => {
  if (item.guess?.points === null || item.guess?.points === undefined) {
    return '';
  }

  return `${item.guess.points > 0 ? '+' : ''}${item.guess.points}`;
};

const getOutcomeClass = (outcome?: GuessOutcome | null) => ({
  'overview-recent-matches__points--success':
    outcome === GuessOutcomeValue.CORRECT ||
    outcome === GuessOutcomeValue.CORRECT_ALONE,
  'overview-recent-matches__points--warning':
    outcome === GuessOutcomeValue.OUTCOME_ONLY,
  'overview-recent-matches__points--danger':
    outcome === GuessOutcomeValue.OUTCOME_INCORRECT ||
    outcome === GuessOutcomeValue.NOT_GIVEN,
});
</script>

<template>
  <Card>
    <template #title>
      <div class="overview-recent-matches__title">
        <FText as="span" variant="body-1-bold">
          {{ t('v1.overview.matches') }}
        </FText>
      </div>
    </template>
    <template #content>
      <div v-if="games.length" class="overview-recent-matches">
        <button
          v-for="item in games"
          :key="item.game.id"
          class="overview-recent-matches__card"
          type="button"
          @click="emit('selectMatch', item)"
        >
          <div class="overview-recent-matches__header">
            <FText as="span" color="--p-text-muted-color" variant="body-3">
              {{ item.game.date }} · {{ item.game.time }}
            </FText>
            <Tag
              :severity="getStateSeverity(item.game.state)"
              :value="t(stateLabelMap[item.game.state])"
            />
          </div>

          <div class="overview-recent-matches__main">
            <FText as="span" variant="body-2-bold">
              {{ getMatchTitle(item) }}
            </FText>
            <FText as="span" variant="heading-3">
              {{ getMatchScore(item) }}
            </FText>
          </div>

          <div class="overview-recent-matches__footer">
            <FText as="span" color="--p-text-muted-color" variant="body-3">
              {{ t('v1.guess') }}:
              <strong>{{ getGuessLabel(item) }}</strong>
            </FText>
            <Tag
              v-if="getGuessPoints(item)"
              class="overview-recent-matches__points"
              :class="getOutcomeClass(item.guess?.outcome)"
              severity="secondary"
              :value="getGuessPoints(item)"
            />
          </div>
        </button>
      </div>

      <FEmptyMessage v-else message="v1.overview.no.matches" />
    </template>
  </Card>
</template>

<style scoped lang="scss">
.overview-recent-matches__title {
  display: grid;
  gap: 2px;
}

.overview-recent-matches {
  display: grid;
  gap: 10px;
}

.overview-recent-matches__card {
  display: grid;
  width: 100%;
  gap: 10px;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--p-surface-card) 82%, transparent);
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.2s;

  &:hover,
  &:focus-visible {
    border-color: var(--p-primary-color);
    box-shadow: var(--f-card-hover-shadow);
    transform: translateY(-1px);
  }
}

.overview-recent-matches__header,
.overview-recent-matches__main,
.overview-recent-matches__footer {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.overview-recent-matches__main {
  align-items: flex-start;
}

.overview-recent-matches__footer {
  padding-top: 8px;
  border-top: 1px solid color-mix(in srgb, var(--p-text-color) 10%, transparent);
}

.overview-recent-matches__points--success {
  background: var(--f-outcome-success-background);
}

.overview-recent-matches__points--warning {
  background: var(--f-outcome-warning-background);
}

.overview-recent-matches__points--danger {
  background: var(--f-outcome-danger-background);
}

@media (width <= 640px) {
  .overview-recent-matches__card {
    gap: 8px;
    padding: 10px;
  }

  .overview-recent-matches__header {
    align-items: flex-start;
    gap: 8px;
  }

  .overview-recent-matches__header :deep(.p-tag) {
    flex: 0 0 auto;
  }

  .overview-recent-matches__main {
    display: grid;
    align-items: center;
    gap: 10px;
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .overview-recent-matches__main :deep(.f-text--heading-3) {
    font-size: 1.35rem;
    line-height: 1;
    white-space: nowrap;
  }

  .overview-recent-matches__footer {
    display: grid;
    align-items: center;
    gap: 8px;
    grid-template-columns: minmax(0, 1fr) auto;
    padding-top: 6px;
  }

  .overview-recent-matches__footer :deep(.p-tag) {
    justify-self: end;
  }
}
</style>
