<script setup lang="ts">
import { Button, Card, InputNumber } from 'primevue';
import { reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

import FEmptyMessage from '@/components/FEmptyMessage.vue';
import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import { RouteName } from '@/enums';
import { translateTeamName } from '@/lib/teamName';
import type { GameResult, GameWithGuess } from '@/models';
import {
  getInputNumberValue,
  hasInputNumberValue,
  type InputNumberEvent,
} from '@/utils/inputNumber';

type Props = {
  groups: Array<{
    date: string;
    items: GameWithGuess[];
  }>;
  hideTitle?: boolean;
  isSaving: boolean;
};

const props = defineProps<Props>();

type Emits = {
  saveGuess: [gameId: number, result: GameResult];
};

const emit = defineEmits<Emits>();

const router = useRouter();
const { t } = useTranslations();
const draftGuesses = reactive<Record<number, Partial<GameResult>>>({});

const getDraft = (item: GameWithGuess) => {
  draftGuesses[item.game.id] ??= {
    goals1: item.guess?.result?.goals1,
    goals2: item.guess?.result?.goals2,
  };

  return draftGuesses[item.game.id];
};

const hasChanged = (item: GameWithGuess) => {
  const draft = getDraft(item);

  return (
    hasInputNumberValue(draft.goals1) &&
    hasInputNumberValue(draft.goals2) &&
    (draft.goals1 !== item.guess?.result?.goals1 ||
      draft.goals2 !== item.guess?.result?.goals2)
  );
};

const setDraftGoal = (
  item: GameWithGuess,
  side: keyof GameResult,
  event: InputNumberEvent,
) => {
  getDraft(item)[side] = getInputNumberValue(event);
};

const saveGuess = (item: GameWithGuess) => {
  const draft = getDraft(item);

  if (
    !hasInputNumberValue(draft.goals1) ||
    !hasInputNumberValue(draft.goals2)
  ) {
    return;
  }

  emit('saveGuess', item.game.id, {
    goals1: draft.goals1,
    goals2: draft.goals2,
  });
};

const goToTeam = async (teamId: string) => {
  await router.push({ name: RouteName.Team, params: { teamId } });
};

watch(
  () => props.groups,
  (groups) => {
    for (const group of groups) {
      for (const item of group.items) {
        draftGuesses[item.game.id] = {
          goals1: item.guess?.result?.goals1,
          goals2: item.guess?.result?.goals2,
        };
      }
    }
  },
  { immediate: true },
);
</script>

<template>
  <section class="personal-open-matches">
    <FText v-if="!hideTitle" as="h2" variant="heading-3">
      {{ t('v1.upcoming.games') }}
    </FText>

    <div v-if="groups.length" class="personal-open-matches__list">
      <section
        v-for="group in groups"
        :key="group.date"
        class="personal-open-matches__group"
      >
        <Card>
          <template #title>
            <FText as="span" variant="body-1-bold">{{ group.date }}</FText>
          </template>
          <template #content>
            <div class="personal-open-matches__day-games">
              <article
                v-for="item in group.items"
                :key="item.game.id"
                class="personal-open-matches__match-card f-card-surface"
              >
                <FText
                  as="span"
                  class="personal-open-matches__match-time"
                  variant="body-2-bold"
                >
                  {{ item.game.time }}
                </FText>

                <div class="personal-open-matches__match-main">
                  <Button
                    class="personal-open-matches__team-button personal-open-matches__team-button--home"
                    link
                    @click="goToTeam(item.game.t1.code)"
                  >
                    <FText as="span" clickable variant="body-2-bold">
                      {{ translateTeamName(item.game.t1, t) }}
                    </FText>
                  </Button>

                  <InputNumber
                    v-model="getDraft(item).goals1"
                    class="personal-open-matches__score-input personal-open-matches__score-input--home"
                    input-class="personal-open-matches__score-input-field"
                    :max="99"
                    :min="0"
                    :use-grouping="false"
                    @input="setDraftGoal(item, 'goals1', $event)"
                  />
                  <FText
                    as="span"
                    class="personal-open-matches__score-separator"
                    color="--p-text-muted-color"
                    variant="body-2-bold"
                  >
                    :
                  </FText>
                  <InputNumber
                    v-model="getDraft(item).goals2"
                    class="personal-open-matches__score-input personal-open-matches__score-input--away"
                    input-class="personal-open-matches__score-input-field"
                    :max="99"
                    :min="0"
                    :use-grouping="false"
                    @input="setDraftGoal(item, 'goals2', $event)"
                  />

                  <Button
                    class="personal-open-matches__team-button personal-open-matches__team-button--away"
                    link
                    @click="goToTeam(item.game.t2.code)"
                  >
                    <FText as="span" clickable variant="body-2-bold">
                      {{ translateTeamName(item.game.t2, t) }}
                    </FText>
                  </Button>
                </div>

                <Button
                  v-if="hasChanged(item)"
                  class="personal-open-matches__save-button"
                  icon="pi pi-check"
                  :label="t('v1.confirm')"
                  :loading="isSaving"
                  @click="saveGuess(item)"
                />
              </article>
            </div>
          </template>
        </Card>
      </section>
    </div>

    <FEmptyMessage v-else message="v1.personal.no.upcoming.matches" />
  </section>
</template>

<style scoped lang="scss">
.personal-open-matches {
  display: flex;
  flex-direction: column;
  gap: var(--f-space-md);

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--f-space-lg);
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
    border-bottom: var(--f-match-time-border);
    background: var(--f-match-time-background);
    text-align: center;
  }

  &__match-main {
    display: grid;
    align-items: center;
    gap: var(--f-space-md);
    grid-template-areas: 'team-home guess-home separator guess-away team-away';
    grid-template-columns: minmax(0, 1fr) 72px 12px 72px minmax(0, 1fr);
    padding: var(--f-space-sm) var(--f-space-md);
    text-align: center;
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

  &__score-input {
    min-width: 0;

    &--home {
      grid-area: guess-home;
    }

    &--away {
      grid-area: guess-away;
    }

    :deep(.personal-open-matches__score-input-field) {
      width: 100%;
      text-align: center;
    }
  }

  &__score-separator {
    grid-area: separator;
  }

  &__save-button {
    width: 100%;
    border-radius: 0;
  }
}

@media (width <= 760px) {
  .personal-open-matches {
    &__match-main {
      gap: var(--f-space-md) var(--f-space-xs);
      grid-template-areas:
        'team-home team-home team-home team-away team-away'
        '. guess-home separator guess-away .';
      grid-template-columns: minmax(0, 1fr) 56px 8px 56px minmax(0, 1fr);
      padding: var(--f-space-md);
    }

    &__team-button {
      justify-content: center;

      :deep(.p-button-label) {
        white-space: normal;
      }
    }

    &__score-input {
      width: 56px;
    }
  }
}
</style>
