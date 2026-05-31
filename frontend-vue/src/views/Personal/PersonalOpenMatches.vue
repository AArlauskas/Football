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

const props = defineProps<{
  groups: Array<{
    date: string;
    items: GameWithGuess[];
  }>;
  isSaving: boolean;
}>();

const emit = defineEmits<{
  saveGuess: [gameId: number, result: GameResult];
}>();

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
    draft.goals1 !== undefined &&
    draft.goals2 !== undefined &&
    (draft.goals1 !== item.guess?.result?.goals1 ||
      draft.goals2 !== item.guess?.result?.goals2)
  );
};

const saveGuess = (item: GameWithGuess) => {
  const draft = getDraft(item);

  if (draft.goals1 === undefined || draft.goals2 === undefined) {
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
    <FText as="h2" variant="heading-3">
      {{ t('v1.upcoming.games') }}
    </FText>

    <div v-if="groups.length" class="personal-open-matches__list">
      <section
        v-for="group in groups"
        :key="group.date"
        class="personal-open-matches__group"
      >
        <Card>
          <template #title>{{ group.date }}</template>
          <template #content>
            <div class="personal-open-matches__day-games">
              <article
                v-for="item in group.items"
                :key="item.game.id"
                class="personal-open-matches__match-card"
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
  gap: 12px;
}

.personal-open-matches__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.personal-open-matches__day-games {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.personal-open-matches__match-card {
  display: grid;
  overflow: hidden;
  border: var(--f-card-border);
  border-radius: var(--f-card-radius);
  background: var(--p-surface-card);
  box-shadow: var(--f-card-shadow);
}

.personal-open-matches__match-time {
  width: 100%;
  padding: 10px 12px;
  border-bottom: var(--f-match-time-border);
  background: var(--f-match-time-background);
  text-align: center;
}

.personal-open-matches__match-main {
  display: grid;
  align-items: center;
  gap: 12px;
  grid-template-areas: 'team-home guess-home separator guess-away team-away';
  grid-template-columns: minmax(0, 1fr) 72px 12px 72px minmax(0, 1fr);
  padding: 14px 12px;
  text-align: center;
}

.personal-open-matches__team-button {
  min-width: 0;
  padding: 0;
  color: var(--p-text-color);

  :deep(.p-button-label) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.personal-open-matches__team-button--home {
  grid-area: team-home;
}

.personal-open-matches__team-button--away {
  grid-area: team-away;
}

.personal-open-matches__score-input--home {
  grid-area: guess-home;
}

.personal-open-matches__score-input--away {
  grid-area: guess-away;
}

.personal-open-matches__score-separator {
  grid-area: separator;
}

.personal-open-matches__score-input {
  min-width: 0;

  :deep(.personal-open-matches__score-input-field) {
    width: 100%;
    text-align: center;
  }
}

.personal-open-matches__save-button {
  width: 100%;
  border-radius: 0;
}

@media (width <= 760px) {
  .personal-open-matches__match-main {
    gap: 12px 8px;
    grid-template-areas:
      'team-home team-home team-home team-away team-away'
      '. guess-home separator guess-away .';
    grid-template-columns: minmax(0, 1fr) 56px 8px 56px minmax(0, 1fr);
    padding: 12px;
  }

  .personal-open-matches__team-button {
    justify-content: center;
  }

  .personal-open-matches__team-button :deep(.p-button-label) {
    white-space: normal;
  }

  .personal-open-matches__score-input {
    width: 56px;
  }
}
</style>
