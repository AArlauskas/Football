<script setup lang="ts">
import { Button, Card, Divider, InputNumber, Tag } from 'primevue';
import { computed, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

import FOutcomeTag from '@/components/FOutcomeTag.vue';
import FText from '@/components/FText.vue';
import { useOngoingMatches } from '@/composables/useOngoingMatches';
import { useTranslations } from '@/composables/useTranslations';
import { RouteName } from '@/enums';
import type { TranslationKey } from '@/i18n';
import { translateTeamName } from '@/lib/teamName';
import type { GameResult, GameWithGuess } from '@/models';
import { GameState, GuessOutcome } from '@/models/game';
import {
  getInputNumberValue,
  hasInputNumberValue,
  type InputNumberEvent,
} from '@/utils/inputNumber';

type Props = {
  isSaving: boolean;
  item: GameWithGuess;
};

const props = defineProps<Props>();

type Emits = {
  saveGuess: [gameId: number, result: GameResult];
};

const emit = defineEmits<Emits>();

const router = useRouter();
const { t } = useTranslations();
const {
  getEstimatedGuess,
  getMatchTime,
  getVisibleResult,
  getVisibleScore,
  hasLiveResult,
} = useOngoingMatches();
const draftGuess = reactive<Partial<GameResult>>({});

const isStarted = computed(() => props.item.game.state !== GameState.OPEN);
const stateLabelMap: Record<GameState, TranslationKey> = {
  [GameState.CLOSED]: 'v1.admin.state.closed',
  [GameState.FINISHED]: 'v1.admin.state.finished',
  [GameState.OPEN]: 'v1.admin.state.open',
};
const visibleResult = computed(() => getVisibleResult(props.item.game));
const hasResult = computed(
  () =>
    visibleResult.value?.goals1 !== undefined &&
    visibleResult.value?.goals2 !== undefined,
);
const isShowingLiveResult = computed(() => hasLiveResult(props.item.game));
const estimatedGuess = computed(() => getEstimatedGuess(props.item.game.id));
const visiblePointsGuess = computed(
  () => estimatedGuess.value ?? props.item.guess,
);
const pointsLabel = computed(() =>
  estimatedGuess.value ? t('v1.estimated.points') : t('v1.points'),
);
const hasChanged = computed(
  () =>
    !isStarted.value &&
    hasInputNumberValue(draftGuess.goals1) &&
    hasInputNumberValue(draftGuess.goals2) &&
    (draftGuess.goals1 !== props.item.guess?.result?.goals1 ||
      draftGuess.goals2 !== props.item.guess?.result?.goals2),
);
const shouldShowPoints = computed(
  () =>
    visiblePointsGuess.value?.points !== null &&
    visiblePointsGuess.value?.points !== undefined &&
    isStarted.value,
);

const syncDraftGuess = () => {
  draftGuess.goals1 = props.item.guess?.result?.goals1;
  draftGuess.goals2 = props.item.guess?.result?.goals2;
};

const setDraftGoal = (side: keyof GameResult, event: InputNumberEvent) => {
  draftGuess[side] = getInputNumberValue(event);
};

const cancelGuess = () => {
  syncDraftGuess();
};

const saveGuess = () => {
  if (
    !hasInputNumberValue(draftGuess.goals1) ||
    !hasInputNumberValue(draftGuess.goals2)
  ) {
    return;
  }

  emit('saveGuess', props.item.game.id, {
    goals1: draftGuess.goals1,
    goals2: draftGuess.goals2,
  });
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

const goToMatch = async () => {
  if (!isStarted.value) {
    return;
  }

  await router.push({
    name: RouteName.Match,
    params: { gameId: props.item.game.id },
  });
};

const goToTeam = async (teamId: string) => {
  await router.push({ name: RouteName.Team, params: { teamId } });
};

watch(() => props.item.guess, syncDraftGuess, { immediate: true });
</script>

<template>
  <Card
    class="games-game-card f-card-surface"
    :class="{ 'games-game-card--clickable': isStarted }"
    @click="goToMatch"
  >
    <template #content>
      <div class="games-game-card__content">
        <button
          class="games-game-card__time"
          :class="{ 'games-game-card__time--clickable': isStarted }"
          type="button"
          @click.stop="goToMatch"
        >
          <FText as="span" variant="heading-3">
            {{ item.game.time }}
          </FText>
          <FText
            v-if="getMatchTime(item.game)"
            as="span"
            class="f-live-score"
            variant="body-2-bold"
          >
            {{ getMatchTime(item.game) }}
          </FText>
        </button>

        <Tag
          class="games-game-card__state"
          :severity="getStateSeverity(item.game.state)"
          :value="t(stateLabelMap[item.game.state])"
        />

        <Divider class="games-game-card__divider" />

        <div class="games-game-card__teams">
          <Button
            class="games-game-card__team-button"
            link
            @click.stop="goToTeam(item.game.t1.code)"
          >
            <FText as="span" clickable variant="body-1-bold">
              {{ translateTeamName(item.game.t1, t) }}
            </FText>
          </Button>

          <button
            class="games-game-card__score"
            :class="{
              'games-game-card__score--clickable': isStarted,
              'f-live-score': isShowingLiveResult,
            }"
            type="button"
            @click.stop="goToMatch"
          >
            <FText as="span" variant="heading-3">
              {{ hasResult ? getVisibleScore(item.game) : '- : -' }}
            </FText>
          </button>

          <Button
            class="games-game-card__team-button"
            link
            @click.stop="goToTeam(item.game.t2.code)"
          >
            <FText as="span" clickable variant="body-1-bold">
              {{ translateTeamName(item.game.t2, t) }}
            </FText>
          </Button>
        </div>

        <section class="games-game-card__guess" @click.stop>
          <FText
            as="span"
            class="games-game-card__guess-title"
            variant="body-2"
          >
            {{ t('v1.guess') }}
          </FText>
          <Divider class="games-game-card__divider" />

          <FText
            v-if="item.guess?.outcome === GuessOutcome.NOT_GIVEN"
            as="span"
            class="games-game-card__not-given"
            color="--p-text-muted-color"
            variant="body-2"
          >
            {{ t('v1.not.given.guess') }}
          </FText>

          <div v-else class="games-game-card__guess-inputs">
            <InputNumber
              v-model="draftGuess.goals1"
              class="games-game-card__guess-input"
              :disabled="isStarted"
              input-class="games-game-card__guess-input-field"
              :max="9"
              :min="0"
              :use-grouping="false"
              @input="setDraftGoal('goals1', $event)"
            />
            <FText as="span" color="--p-text-muted-color" variant="heading-3">
              :
            </FText>
            <InputNumber
              v-model="draftGuess.goals2"
              class="games-game-card__guess-input"
              :disabled="isStarted"
              input-class="games-game-card__guess-input-field"
              :max="9"
              :min="0"
              :use-grouping="false"
              @input="setDraftGoal('goals2', $event)"
            />
          </div>

          <div v-if="shouldShowPoints" class="games-game-card__points">
            <FText as="span" variant="body-2">
              {{ pointsLabel }}
            </FText>
            <FOutcomeTag
              fallback-severity="danger"
              :outcome="visiblePointsGuess?.outcome ?? null"
              :value="String(visiblePointsGuess?.points)"
            />
          </div>

          <div v-else-if="hasChanged" class="games-game-card__actions">
            <Button
              :disabled="isSaving"
              :label="t('v1.cancel')"
              severity="secondary"
              @click="cancelGuess"
            />
            <Button
              :label="t('v1.confirm')"
              :loading="isSaving"
              @click="saveGuess"
            />
          </div>
        </section>
      </div>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.games-game-card {
  height: 100%;
  overflow: hidden;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.2s;

  :deep(.p-card-body),
  :deep(.p-card-content) {
    height: 100%;
  }

  &--clickable {
    cursor: pointer;

    &:hover,
    &:focus-within {
      border-color: var(--p-primary-color);
      box-shadow: var(--f-card-hover-shadow);
      transform: translateY(-1px);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--f-space-md);
    height: 100%;
  }

  &__time,
  &__score {
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: center;
    white-space: nowrap;
  }

  &__time {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--f-space-2xs);
    padding: 0;
  }

  &__state {
    justify-self: center;
  }

  &__time,
  &__score {
    &--clickable {
      cursor: pointer;
    }
  }

  &__divider {
    margin: 0;
  }

  &__teams {
    display: grid;
    align-items: center;
    gap: var(--f-space-xs);
    grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);
    text-align: center;
    height: 100%;
  }

  &__team-button {
    justify-content: center;
    min-width: 0;
    padding: 0;
    color: var(--p-text-color);
    text-align: center;

    :deep(.p-button-label) {
      overflow: visible;
      white-space: normal;
    }
  }

  &__score {
    min-height: 36px;
    padding: 0;
  }

  &__guess {
    display: grid;
    gap: var(--f-space-md);
  }

  &__guess-title,
  &__not-given {
    text-align: center;
  }

  &__not-given {
    padding-block: var(--f-space-sm);
  }

  &__guess-inputs {
    display: grid;
    align-items: center;
    gap: var(--f-space-xs);
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  }

  &__guess-input {
    min-width: 0;

    :deep(.games-game-card__guess-input-field) {
      width: 100%;
      text-align: center;
    }
  }

  &__points {
    display: grid;
    gap: var(--f-space-xs);
    justify-items: center;
    padding-top: var(--f-space-2xs);
  }

  &__actions {
    display: grid;
    gap: var(--f-space-md);
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

@media (width <= 560px) {
  .games-game-card {
    &__teams {
      grid-template-columns: minmax(0, 1fr);
    }

    &__team-button {
      justify-content: center;
    }
  }
}
</style>
