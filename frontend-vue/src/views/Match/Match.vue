<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Button, Card, Column, DataTable, Skeleton, Tag } from 'primevue';
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import FEmptyMessage from '@/components/FEmptyMessage.vue';
import FPageFeedback from '@/components/FPageFeedback.vue';
import FText from '@/components/FText.vue';
import { useOngoingMatches } from '@/composables/useOngoingMatches';
import { useOngoingMatchesPolling } from '@/composables/useOngoingMatchesPolling';
import { usePageTitle } from '@/composables/usePageTitle';
import { useTranslations } from '@/composables/useTranslations';
import { RouteName } from '@/enums';
import { translateTeamName } from '@/lib/teamName';
import type { GuessOutcome, GuessWithUser } from '@/models';
import { GuessOutcome as GuessOutcomeValue } from '@/models/game';
import { useAuthStore } from '@/stores/authStore';
import { useMatchStore } from '@/stores/matchStore';
import { useOngoingMatchesStore } from '@/stores/ongoingMatchesStore';

const authStore = useAuthStore();
const matchStore = useMatchStore();
const ongoingMatchesStore = useOngoingMatchesStore();
const route = useRoute();
const router = useRouter();
const { t } = useTranslations();
const {
  game,
  guesses,
  isLoading: isMatchLoading,
  requestError,
} = storeToRefs(matchStore);
const { isLoading: isOngoingMatchesLoading } = storeToRefs(ongoingMatchesStore);
const {
  formatResult,
  getMatchTime,
  getVisibleGuesses,
  getVisibleResult,
  hasEstimatedGuesses,
  hasLiveResult,
} = useOngoingMatches();

const gameId = computed(() => Number(route.params.gameId));
const isLoading = computed(
  () => isMatchLoading.value || isOngoingMatchesLoading.value,
);
const pageTitle = computed(() =>
  game.value
    ? `${translateTeamName(game.value.t1, t)} - ${translateTeamName(game.value.t2, t)}`
    : t('v1.match'),
);

const formatGuess = (item: GuessWithUser) => formatResult(item.guess?.result);
const visibleResult = computed(() =>
  game.value ? getVisibleResult(game.value) : null,
);
const isShowingLiveResult = computed(() =>
  game.value ? hasLiveResult(game.value) : false,
);
const hasLiveEstimates = computed(() =>
  game.value ? hasEstimatedGuesses(game.value.id) : false,
);
const displayedGuesses = computed(() =>
  game.value ? getVisibleGuesses(game.value.id, guesses.value) : guesses.value,
);
const pointsHeader = computed(() =>
  hasLiveEstimates.value ? t('v1.estimated.points') : t('v1.points'),
);

const getFullName = (item: GuessWithUser) =>
  `${item.user.firstName} ${item.user.lastName}`;

const isCurrentUser = (item: GuessWithUser) =>
  item.user.id === authStore.user?.id;

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

  if (
    outcome === GuessOutcomeValue.OUTCOME_INCORRECT ||
    outcome === GuessOutcomeValue.NOT_GIVEN
  ) {
    return 'danger';
  }

  return 'secondary';
};

const getOutcomeClass = (outcome?: GuessOutcome | null) => ({
  'match-page__points--success':
    outcome === GuessOutcomeValue.CORRECT ||
    outcome === GuessOutcomeValue.CORRECT_ALONE,
  'match-page__points--warning': outcome === GuessOutcomeValue.OUTCOME_ONLY,
  'match-page__points--danger':
    outcome === GuessOutcomeValue.OUTCOME_INCORRECT ||
    outcome === GuessOutcomeValue.NOT_GIVEN,
});

const getRowClass = (item: GuessWithUser) => ({
  'match-page__row--current': isCurrentUser(item),
});

const goToTeam = async (teamId: string) => {
  await router.push({ name: RouteName.Team, params: { teamId } });
};

const goToPlayer = async (item: GuessWithUser) => {
  if (isCurrentUser(item)) {
    await router.push({ name: RouteName.Personal });

    return;
  }

  await router.push({
    name: RouteName.Player,
    params: { userId: item.user.id },
  });
};

watch(
  gameId,
  (id) => {
    if (!Number.isFinite(id)) {
      requestError.value = t('v1.general.error');

      return;
    }

    void matchStore.loadMatch(id);
  },
  { immediate: true },
);

usePageTitle(pageTitle);
useOngoingMatchesPolling();
</script>

<template>
  <main class="match-page">
    <FPageFeedback :error="requestError" />

    <template v-if="isLoading">
      <Card>
        <template #content>
          <div class="match-page__loading">
            <Skeleton height="1.25rem" width="8rem" />
            <Skeleton height="3rem" />
            <Skeleton height="14rem" />
          </div>
        </template>
      </Card>
    </template>

    <template v-else-if="game">
      <Card>
        <template #content>
          <section class="match-page__hero">
            <div class="match-page__meta">
              <Tag :value="game.date" />
              <Tag severity="secondary" :value="game.time" />
              <Tag
                v-if="getMatchTime(game)"
                class="match-page__live-time"
                severity="success"
                :value="getMatchTime(game)"
              />
            </div>

            <div class="match-page__scoreboard">
              <Button
                class="match-page__team-button match-page__team-button--home"
                link
                @click="goToTeam(game.t1.code)"
              >
                <FText
                  as="span"
                  class="match-page__team-name"
                  clickable
                  variant="heading-3"
                >
                  {{ translateTeamName(game.t1, t) }}
                </FText>
              </Button>
              <FText
                as="span"
                class="match-page__score"
                :class="{ 'f-live-score': isShowingLiveResult }"
                variant="heading-2"
              >
                {{ formatResult(visibleResult) }}
              </FText>
              <Button
                class="match-page__team-button match-page__team-button--away"
                link
                @click="goToTeam(game.t2.code)"
              >
                <FText
                  as="span"
                  class="match-page__team-name"
                  clickable
                  variant="heading-3"
                >
                  {{ translateTeamName(game.t2, t) }}
                </FText>
              </Button>
            </div>
          </section>
        </template>
      </Card>

      <Card>
        <template #content>
          <FEmptyMessage
            v-if="!displayedGuesses.length"
            message="v1.match.no.guesses"
          />

          <template v-else>
            <DataTable
              class="match-page__table"
              data-key="user.id"
              :row-class="getRowClass"
              row-hover
              :value="displayedGuesses"
            >
              <Column :header="t('v1.full.name')">
                <template #body="{ data }">
                  <Button
                    class="match-page__player-button"
                    link
                    @click="goToPlayer(data)"
                  >
                    <FText as="span" clickable variant="body-2-bold">
                      {{ getFullName(data) }}
                    </FText>
                  </Button>
                </template>
              </Column>

              <Column
                :header="t('v1.guess')"
                body-class="match-page__table-center"
                header-class="match-page__table-center"
              >
                <template #body="{ data }">
                  {{ formatGuess(data) }}
                </template>
              </Column>

              <Column
                field="guess.points"
                :header="pointsHeader"
                body-class="match-page__table-center"
                header-class="match-page__table-center"
                sortable
              >
                <template #body="{ data }">
                  <Tag
                    :class="getOutcomeClass(data.guess?.outcome)"
                    :severity="getOutcomeSeverity(data.guess?.outcome)"
                    :value="String(data.guess?.points ?? '-')"
                  />
                </template>
              </Column>
            </DataTable>

            <ol class="match-page__list" :aria-label="t('v1.guesses')">
              <li
                v-for="item in displayedGuesses"
                :key="item.user.id"
                class="match-page__list-item"
              >
                <Card
                  class="match-page__guess-card"
                  :class="{
                    'match-page__guess-card--current': isCurrentUser(item),
                  }"
                >
                  <template #content>
                    <Button
                      class="match-page__player-button"
                      link
                      @click="goToPlayer(item)"
                    >
                      <FText as="span" clickable variant="body-2-bold">
                        {{ getFullName(item) }}
                      </FText>
                    </Button>

                    <dl class="match-page__guess-stats">
                      <div>
                        <dt>
                          <FText
                            as="span"
                            color="--p-text-muted-color"
                            variant="body-3"
                          >
                            {{ t('v1.guess') }}
                          </FText>
                        </dt>
                        <dd>
                          <FText as="span" variant="body-2-bold">
                            {{ formatGuess(item) }}
                          </FText>
                        </dd>
                      </div>
                      <div>
                        <dt>
                          <FText
                            as="span"
                            color="--p-text-muted-color"
                            variant="body-3"
                          >
                            {{ pointsHeader }}
                          </FText>
                        </dt>
                        <dd>
                          <Tag
                            :class="getOutcomeClass(item.guess?.outcome)"
                            :severity="getOutcomeSeverity(item.guess?.outcome)"
                            :value="String(item.guess?.points ?? '-')"
                          />
                        </dd>
                      </div>
                    </dl>
                  </template>
                </Card>
              </li>
            </ol>
          </template>
        </template>
      </Card>
    </template>
  </main>
</template>

<style scoped lang="scss">
.match-page {
  display: flex;
  width: min(100%, var(--f-page-empty-content-width, 1280px));
  flex-direction: column;
  gap: 16px;
  margin: 0 auto;
}

.match-page__loading {
  display: grid;
  gap: 16px;
}

.match-page__hero {
  display: grid;
  gap: 16px;
  text-align: center;
}

.match-page__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.match-page__scoreboard {
  display: grid;
  align-items: center;
  gap: 16px;
  grid-template-areas: 'team-home score team-away';
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
}

.match-page__team-button {
  min-width: 0;
  padding: 0;
  color: var(--p-text-color);

  :deep(.p-button-label) {
    min-width: 0;
  }
}

.match-page__team-name {
  display: block;
  min-width: 0;
}

.match-page__team-button--home {
  grid-area: team-home;
  justify-content: flex-end;
  text-align: right;
}

.match-page__team-button--away {
  grid-area: team-away;
  justify-content: flex-start;
  text-align: left;
}

.match-page__score {
  grid-area: score;
  min-width: 80px;
  white-space: nowrap;
}

.match-page__table {
  overflow: hidden;
  border: 1px solid var(--p-surface-border);
  border-radius: var(--p-content-border-radius);

  :deep(.match-page__table-center) {
    width: 128px;
    text-align: center;
  }

  :deep(.match-page__table-center .p-column-header-content) {
    justify-content: center;
  }

  :deep(.match-page__row--current > td) {
    background: color-mix(in srgb, var(--p-primary-color) 12%, transparent);
  }
}

.match-page__player-button {
  max-width: 100%;
  padding: 0;
  color: var(--p-text-color);

  :deep(.p-button-label) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.match-page__points--success {
  background: var(--f-outcome-success-background);
}

.match-page__points--warning {
  background: var(--f-outcome-warning-background);
}

.match-page__points--danger {
  background: var(--f-outcome-danger-background);
}

.match-page__list {
  display: none;
}

@media (width <= 760px) {
  .match-page__scoreboard {
    gap: 10px;
    grid-template-areas:
      'team-home'
      'score'
      'team-away';
    grid-template-columns: minmax(0, 1fr);
  }

  .match-page__team-button {
    justify-content: center;
    text-align: center;
  }

  .match-page__team-name {
    font-size: clamp(1.125rem, 5vw, 1.5rem);
    line-height: 1.15;
  }

  .match-page__score {
    min-width: 0;
  }

  .match-page__table {
    display: none;
  }

  .match-page__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .match-page__guess-card--current {
    :deep(.p-card-body) {
      background: var(--f-current-background);
      border-radius: var(--f-card-radius);
    }
  }

  .match-page__guess-card {
    border: var(--f-card-border);
    border-radius: var(--f-card-radius);
  }

  .match-page__guess-card :deep(.p-card-body) {
    padding: 12px;
  }

  .match-page__guess-card :deep(.p-card-content) {
    display: grid;
    gap: 12px;
    padding: 0;
  }

  .match-page__guess-stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin: 0;
  }

  .match-page__guess-stats div {
    padding: 8px;
    border-radius: var(--p-content-border-radius);
    background: var(--p-content-hover-background);
    text-align: center;
  }

  .match-page__guess-stats dt {
    margin: 0;
  }

  .match-page__guess-stats dd {
    margin: 4px 0 0;
  }
}
</style>
