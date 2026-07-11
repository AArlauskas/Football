<script setup lang="ts">
import { Button, Card } from 'primevue';
import { useRouter } from 'vue-router';

import FEmptyMessage from '@/components/FEmptyMessage.vue';
import FOutcomeTag from '@/components/FOutcomeTag.vue';
import FText from '@/components/FText.vue';
import { useOngoingMatches } from '@/composables/useOngoingMatches';
import { useTranslations } from '@/composables/useTranslations';
import { RouteName } from '@/enums';
import { getOutcomeModifierClass } from '@/lib/outcome';
import { translateTeamName } from '@/lib/teamName';
import type { GameWithGuess, Guess } from '@/models';
import { GameState } from '@/models/game';

const props = defineProps<{
  groups: Array<{
    date: string;
    items: GameWithGuess[];
  }>;
  hideTitle?: boolean;
  playerId?: number;
}>();

const router = useRouter();
const { t } = useTranslations();
const { getEstimatedGuess, getMatchTime, getVisibleResult, hasLiveResult } =
  useOngoingMatches();

const formatGuess = (item: GameWithGuess) => {
  if (!item.guess?.result) {
    return '-';
  }

  return `${item.guess.result.goals1} : ${item.guess.result.goals2}`;
};

const getVisibleScore = (item: GameWithGuess, side: 'goals1' | 'goals2') =>
  getVisibleResult(item.game)?.[side] ?? '-';

const getEstimatedPointsGuess = (item: GameWithGuess) =>
  getEstimatedGuess(item.game.id, props.playerId);

const getVisiblePointsGuess = (item: GameWithGuess): Guess | null =>
  getEstimatedPointsGuess(item) ?? item.guess ?? null;

const shouldShowPoints = (item: GameWithGuess) =>
  getVisiblePointsGuess(item)?.points !== null &&
  getVisiblePointsGuess(item)?.points !== undefined &&
  item.game.state !== GameState.OPEN;

const getPointsLabel = (item: GameWithGuess) =>
  getEstimatedPointsGuess(item) ? t('v1.estimated.points') : t('v1.points');

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
          <template #title>
            <FText as="span" variant="body-1-bold">{{ group.date }}</FText>
          </template>
          <template #content>
            <div class="player-match-history__day-games">
              <article
                v-for="item in group.items"
                :key="item.game.id"
                class="player-match-history__match-card f-card-surface"
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
                  <span>{{ item.game.time }}</span>
                  <span v-if="getMatchTime(item.game)" class="f-live-score">
                    {{ getMatchTime(item.game) }}
                  </span>
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
                    :class="{ 'f-live-score': hasLiveResult(item.game) }"
                    variant="heading-3"
                  >
                    {{ getVisibleScore(item, 'goals1') }}
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
                    :class="{ 'f-live-score': hasLiveResult(item.game) }"
                    variant="heading-3"
                  >
                    {{ getVisibleScore(item, 'goals2') }}
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
                  v-if="shouldShowPoints(item)"
                  class="player-match-history__points-row"
                  :class="
                    getOutcomeModifierClass(
                      getVisiblePointsGuess(item)?.outcome,
                    )
                  "
                >
                  <FText as="span" variant="body-2">
                    {{ getPointsLabel(item) }}
                  </FText>
                  <FOutcomeTag
                    fallback-severity="danger"
                    :outcome="getVisiblePointsGuess(item)?.outcome ?? null"
                    :value="String(getVisiblePointsGuess(item)?.points ?? '-')"
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
  gap: var(--f-space-md);

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
    transition:
      border-color 0.2s,
      box-shadow 0.2s,
      transform 0.2s;

    &--clickable {
      cursor: pointer;

      &:hover,
      &:focus-within {
        border-color: var(--p-primary-color);
        box-shadow: var(--f-card-hover-shadow);
        transform: translateY(-1px);
      }
    }
  }

  &__match-time {
    display: inline-flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: var(--f-space-2xs);
    padding: var(--f-space-sm) var(--f-space-md);
    border: 0;
    border-bottom: var(--f-match-time-border);
    background: var(--f-match-time-background);
    text-align: center;
  }

  &__match-main {
    display: grid;
    align-items: center;
    gap: var(--f-space-md);
    grid-template-areas:
      'team-home score-home separator score-away team-away'
      'guess guess guess guess guess';
    grid-template-columns: minmax(0, 1fr) 32px 12px 32px minmax(0, 1fr);
    padding-top: var(--f-space-md);
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

  &__guess-score {
    display: grid;
    grid-area: guess;
    gap: var(--f-space-2xs);
    padding: var(--f-space-sm);
    border-radius: var(--p-content-border-radius);
    background: var(--p-content-hover-background);
  }

  &__points-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--f-space-xs);
    width: 100%;
    padding: var(--f-space-sm) var(--f-space-md);
    border: 0;
    border-top: 1px solid var(--p-surface-border);
    background: var(--p-content-hover-background);

    &:has(.f-outcome-tag--success) {
      background: var(--f-outcome-success-background);
    }

    &:has(.f-outcome-tag--warning) {
      background: var(--f-outcome-warning-background);
    }

    &:has(.f-outcome-tag--danger) {
      background: var(--f-outcome-danger-background);
    }
  }
}

@media (width <= 760px) {
  .player-match-history {
    &__match-main {
      gap: var(--f-space-sm);
      grid-template-areas:
        'team-home team-home team-home'
        'score-home separator score-away'
        'team-away team-away team-away'
        'guess guess guess';
      grid-template-columns: minmax(0, 1fr) 8px minmax(0, 1fr);
      text-align: center;
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

    &__guess-score {
      text-align: center;
    }
  }
}
</style>
