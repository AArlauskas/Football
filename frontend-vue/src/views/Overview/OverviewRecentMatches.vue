<script setup lang="ts">
import { Button, Card, Tag } from 'primevue';

import FEmptyMessage from '@/components/FEmptyMessage.vue';
import FOutcomeTag from '@/components/FOutcomeTag.vue';
import FText from '@/components/FText.vue';
import { useOngoingMatches } from '@/composables/useOngoingMatches';
import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';
import { translateTeamName } from '@/lib/teamName';
import type { GameWithGuess } from '@/models';
import { GameState } from '@/models/game';

type Props = {
  games: GameWithGuess[];
};

defineProps<Props>();

type Emits = {
  makeGuesses: [];
  selectMatch: [item: GameWithGuess];
};

const emit = defineEmits<Emits>();

const { t } = useTranslations();
const { getEstimatedGuess, getMatchTime, getVisibleResult, hasLiveResult } =
  useOngoingMatches();

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
  const result = getVisibleResult(item.game);
  if (!result) {
    return '- : -';
  }

  return `${result.goals1} : ${result.goals2}`;
};

const getGuessLabel = (item: GameWithGuess) => {
  if (!item.guess?.result) {
    return t('v1.overview.no.guess');
  }

  return `${item.guess.result.goals1} : ${item.guess.result.goals2}`;
};

const getVisiblePointsGuess = (item: GameWithGuess) =>
  getEstimatedGuess(item.game.id) ?? item.guess;

const hasEstimatedPoints = (item: GameWithGuess) =>
  Boolean(getEstimatedGuess(item.game.id));

const getGuessPoints = (item: GameWithGuess) => {
  const guess = getVisiblePointsGuess(item);
  if (guess?.points === null || guess?.points === undefined) {
    return '';
  }

  return `${guess.points > 0 ? '+' : ''}${guess.points}`;
};

const getPointsLabel = (item: GameWithGuess) =>
  hasEstimatedPoints(item) ? t('v1.estimated.points') : t('v1.points');
</script>

<template>
  <Card class="overview-recent-matches">
    <template #title>
      <div class="overview-recent-matches__title">
        <FText
          as="span"
          class="overview-recent-matches__title-label"
          variant="body-1-bold"
        >
          {{ t('v1.overview.matches') }}
        </FText>
        <Button
          class="overview-recent-matches__guess-button"
          icon="pi pi-calendar"
          :aria-label="t('v1.games')"
          severity="secondary"
          size="small"
          @click="emit('makeGuesses')"
        />
      </div>
    </template>
    <template #content>
      <div v-if="games.length" class="overview-recent-matches__list">
        <button
          v-for="item in games"
          :key="item.game.id"
          class="overview-recent-matches__card"
          type="button"
          @click="emit('selectMatch', item)"
        >
          <div class="overview-recent-matches__header">
            <FText
              as="span"
              class="overview-recent-matches__time"
              color="--p-text-muted-color"
              variant="body-3"
            >
              <span>{{ item.game.date }} · {{ item.game.time }}</span>
              <span v-if="getMatchTime(item.game)" class="f-live-score">
                {{ getMatchTime(item.game) }}
              </span>
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
            <FText
              as="span"
              :class="{
                'f-live-score': hasLiveResult(item.game),
              }"
              variant="heading-3"
            >
              {{ getMatchScore(item) }}
            </FText>
          </div>

          <div class="overview-recent-matches__footer">
            <FText as="span" color="--p-text-muted-color" variant="body-3">
              {{ t('v1.guess') }}:
              <FText
                as="span"
                color="--p-text-muted-color"
                variant="body-3-bold"
              >
                {{ getGuessLabel(item) }}
              </FText>
            </FText>
            <div
              v-if="getGuessPoints(item)"
              class="overview-recent-matches__points"
            >
              <FText as="span" color="--p-text-muted-color" variant="body-3">
                {{ getPointsLabel(item) }}
              </FText>
              <FOutcomeTag
                :outcome="getVisiblePointsGuess(item)?.outcome ?? null"
                severity="secondary"
                :value="getGuessPoints(item)"
              />
            </div>
          </div>
        </button>
      </div>

      <FEmptyMessage v-else message="v1.overview.no.matches" />
    </template>
  </Card>
</template>

<style scoped lang="scss">
.overview-recent-matches {
  &__title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--f-space-md);
  }

  &__title-label {
    min-width: 0;
    flex: 1 1 10rem;
  }

  &__guess-button.p-button {
    flex: 0 0 auto;
    margin-inline-start: auto;
  }

  &__list {
    display: grid;
    gap: var(--f-space-sm);
  }

  &__card {
    display: grid;
    width: 100%;
    gap: var(--f-space-sm);
    padding: var(--f-space-md);
    border: 1px solid color-mix(in srgb, var(--p-text-color) 10%, transparent);
    border-radius: var(--f-radius-md);
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

  &__header,
  &__main,
  &__footer {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: space-between;
    gap: var(--f-space-md);
  }

  &__main {
    align-items: flex-start;
  }

  &__time {
    display: inline-flex;
    align-items: center;
    gap: var(--f-space-2xs);
  }

  &__footer {
    padding-top: var(--f-space-sm);
    border-top: 1px solid
      color-mix(in srgb, var(--p-text-color) 10%, transparent);
  }

  &__points {
    display: flex;
    align-items: center;
    gap: var(--f-space-xs);
  }
}

@media (width <= 640px) {
  .overview-recent-matches {
    &__card {
      gap: var(--f-space-xs);
      padding: var(--f-space-sm);
    }

    &__header {
      align-items: flex-start;
      gap: var(--f-space-xs);

      :deep(.p-tag) {
        flex: 0 0 auto;
      }
    }

    &__main {
      display: grid;
      align-items: center;
      gap: var(--f-space-sm);
      grid-template-columns: minmax(0, 1fr) auto;

      :deep(.f-text--heading-3) {
        white-space: nowrap;
      }
    }

    &__footer {
      display: grid;
      align-items: center;
      gap: var(--f-space-xs);
      grid-template-columns: minmax(0, 1fr) auto;
      padding-top: var(--f-space-2xs);

      :deep(.p-tag) {
        justify-self: end;
      }
    }

    &__points {
      justify-self: end;
    }
  }
}
</style>
