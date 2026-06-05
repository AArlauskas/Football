<script setup lang="ts">
import { Button, Card, Divider, InputNumber, Tag } from 'primevue';
import { computed, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import { RouteName } from '@/enums';
import type { TranslationKey } from '@/i18n';
import { translateTeamName } from '@/lib/teamName';
import type { GameResult, GameWithGuess, GuessOutcome } from '@/models';
import { GameState, GuessOutcome as GuessOutcomeValue } from '@/models/game';
import {
  getInputNumberValue,
  hasInputNumberValue,
  type InputNumberEvent,
} from '@/utils/inputNumber';

const props = defineProps<{
  isSaving: boolean;
  item: GameWithGuess;
}>();

const emit = defineEmits<{
  saveGuess: [gameId: number, result: GameResult];
}>();

const router = useRouter();
const { t } = useTranslations();
const draftGuess = reactive<Partial<GameResult>>({});

const isStarted = computed(() => props.item.game.state !== GameState.OPEN);
const stateLabelMap: Record<GameState, TranslationKey> = {
  [GameState.CLOSED]: 'v1.admin.state.closed',
  [GameState.FINISHED]: 'v1.admin.state.finished',
  [GameState.OPEN]: 'v1.admin.state.open',
};
const hasResult = computed(
  () =>
    props.item.game.result?.goals1 !== undefined &&
    props.item.game.result?.goals2 !== undefined,
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
    props.item.guess?.points !== null &&
    props.item.guess?.points !== undefined &&
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
  'games-card__points--success':
    outcome === GuessOutcomeValue.CORRECT ||
    outcome === GuessOutcomeValue.CORRECT_ALONE,
  'games-card__points--warning': outcome === GuessOutcomeValue.OUTCOME_ONLY,
  'games-card__points--danger':
    outcome === GuessOutcomeValue.OUTCOME_INCORRECT ||
    outcome === GuessOutcomeValue.NOT_GIVEN,
});

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
    class="games-card"
    :class="{ 'games-card--clickable': isStarted }"
    @click="goToMatch"
  >
    <template #content>
      <div class="games-card__content">
        <button
          class="games-card__time"
          :class="{ 'games-card__time--clickable': isStarted }"
          type="button"
          @click.stop="goToMatch"
        >
          <FText as="span" variant="heading-3">
            {{ item.game.time }}
          </FText>
        </button>

        <Tag
          class="games-card__state"
          :severity="getStateSeverity(item.game.state)"
          :value="t(stateLabelMap[item.game.state])"
        />

        <Divider class="games-card__divider" />

        <div class="games-card__teams">
          <Button
            class="games-card__team-button"
            link
            @click.stop="goToTeam(item.game.t1.code)"
          >
            <FText as="span" clickable variant="body-1-bold">
              {{ translateTeamName(item.game.t1, t) }}
            </FText>
          </Button>

          <button
            class="games-card__score"
            :class="{ 'games-card__score--clickable': isStarted }"
            type="button"
            @click.stop="goToMatch"
          >
            <FText as="span" variant="heading-3">
              {{
                hasResult
                  ? `${item.game.result?.goals1} : ${item.game.result?.goals2}`
                  : '- : -'
              }}
            </FText>
          </button>

          <Button
            class="games-card__team-button"
            link
            @click.stop="goToTeam(item.game.t2.code)"
          >
            <FText as="span" clickable variant="body-1-bold">
              {{ translateTeamName(item.game.t2, t) }}
            </FText>
          </Button>
        </div>

        <section class="games-card__guess" @click.stop>
          <FText as="span" class="games-card__guess-title" variant="body-2">
            {{ t('v1.guess') }}
          </FText>
          <Divider class="games-card__divider" />

          <FText
            v-if="item.guess?.outcome === GuessOutcomeValue.NOT_GIVEN"
            as="span"
            class="games-card__not-given"
            color="--p-text-muted-color"
            variant="body-2"
          >
            {{ t('v1.not.given.guess') }}
          </FText>

          <div v-else class="games-card__guess-inputs">
            <InputNumber
              v-model="draftGuess.goals1"
              class="games-card__guess-input"
              :disabled="isStarted"
              input-class="games-card__guess-input-field"
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
              class="games-card__guess-input"
              :disabled="isStarted"
              input-class="games-card__guess-input-field"
              :max="9"
              :min="0"
              :use-grouping="false"
              @input="setDraftGoal('goals2', $event)"
            />
          </div>

          <div v-if="shouldShowPoints" class="games-card__points">
            <FText as="span" variant="body-2">
              {{ t('v1.points') }}
            </FText>
            <Tag
              :class="getOutcomeClass(item.guess?.outcome)"
              :severity="getOutcomeSeverity(item.guess?.outcome)"
              :value="String(item.guess?.points)"
            />
          </div>

          <div v-else-if="hasChanged" class="games-card__actions">
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
.games-card {
  height: 100%;
  overflow: hidden;
  border: var(--f-card-border);
  border-radius: var(--f-card-radius);
  background: var(--p-surface-card);
  box-shadow: var(--f-card-shadow);
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.2s;

  :deep(.p-card-body),
  :deep(.p-card-content) {
    height: 100%;
  }
}

.games-card--clickable {
  cursor: pointer;

  &:hover,
  &:focus-within {
    border-color: var(--p-primary-color);
    box-shadow: var(--f-card-hover-shadow);
    transform: translateY(-1px);
  }
}

.games-card__content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.games-card__time,
.games-card__score {
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: center;
  white-space: nowrap;
}

.games-card__time {
  padding: 0;
}

.games-card__state {
  justify-self: center;
}

.games-card__time--clickable,
.games-card__score--clickable {
  cursor: pointer;
}

.games-card__divider {
  margin: 0;
}

.games-card__teams {
  display: grid;
  align-items: center;
  gap: 8px;
  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);
  text-align: center;
  height: 100%;
}

.games-card__team-button {
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

.games-card__score {
  min-height: 36px;
  padding: 0;
}

.games-card__guess {
  display: grid;
  gap: 12px;
}

.games-card__guess-title,
.games-card__not-given {
  text-align: center;
}

.games-card__not-given {
  padding-block: 10px;
}

.games-card__guess-inputs {
  display: grid;
  align-items: center;
  gap: 8px;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
}

.games-card__guess-input {
  min-width: 0;

  :deep(.games-card__guess-input-field) {
    width: 100%;
    text-align: center;
  }
}

.games-card__points {
  display: grid;
  gap: 8px;
  justify-items: center;
  padding-top: 2px;
}

.games-card__points--success {
  background: var(--f-outcome-success-background);
}

.games-card__points--warning {
  background: var(--f-outcome-warning-background);
}

.games-card__points--danger {
  background: var(--f-outcome-danger-background);
}

.games-card__actions {
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

@media (width <= 560px) {
  .games-card__teams {
    grid-template-columns: minmax(0, 1fr);
  }

  .games-card__team-button {
    justify-content: center;
  }
}
</style>
