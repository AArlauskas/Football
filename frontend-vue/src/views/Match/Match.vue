<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Button, Card, Column, DataTable, Skeleton, Tag } from 'primevue';
import type { DataTableRowClickEvent } from 'primevue/datatable';
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import FEmptyMessage from '@/components/FEmptyMessage.vue';
import FOutcomeTag from '@/components/FOutcomeTag.vue';
import FPageFeedback from '@/components/FPageFeedback.vue';
import FText from '@/components/FText.vue';
import { useOngoingMatches } from '@/composables/useOngoingMatches';
import { useOngoingMatchesPolling } from '@/composables/useOngoingMatchesPolling';
import { usePageTitle } from '@/composables/usePageTitle';
import { useTranslations } from '@/composables/useTranslations';
import { RouteName } from '@/enums';
import { translateTeamName } from '@/lib/teamName';
import type { GuessWithUser } from '@/models';
import { useAuthStore } from '@/stores/authStore';
import { useMatchStore } from '@/stores/matchStore';

const authStore = useAuthStore();
const matchStore = useMatchStore();
const route = useRoute();
const router = useRouter();
const { t } = useTranslations();
const { game, guesses, isLoading, requestError } = storeToRefs(matchStore);
const {
  formatResult,
  getMatchTime,
  getVisibleGuesses,
  getVisibleResult,
  hasEstimatedGuesses,
  hasLiveResult,
} = useOngoingMatches();

const gameId = computed(() => Number(route.params.gameId));

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

const getRowClass = (item: GuessWithUser) => ({
  match__row: true,
  'match__row--current': isCurrentUser(item),
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

const handleRowClick = (event: DataTableRowClickEvent<GuessWithUser>) => {
  void goToPlayer(event.data);
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
  <main class="match">
    <FPageFeedback :error="requestError" />

    <template v-if="isLoading">
      <Card>
        <template #content>
          <div class="match__loading">
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
          <section class="match__hero">
            <div class="match__meta">
              <Tag :value="game.date" />
              <Tag severity="secondary" :value="game.time" />
              <Tag
                v-if="getMatchTime(game)"
                class="match__live-time"
                severity="success"
                :value="getMatchTime(game)"
              />
            </div>

            <div class="match__scoreboard">
              <Button
                class="match__team-button match__team-button--home"
                link
                @click="goToTeam(game.t1.code)"
              >
                <FText
                  as="span"
                  class="match__team-name"
                  clickable
                  variant="heading-3"
                >
                  {{ translateTeamName(game.t1, t) }}
                </FText>
              </Button>
              <FText
                as="span"
                class="match__score"
                :class="{ 'f-live-score': isShowingLiveResult }"
                variant="heading-2"
              >
                {{ formatResult(visibleResult) }}
              </FText>
              <Button
                class="match__team-button match__team-button--away"
                link
                @click="goToTeam(game.t2.code)"
              >
                <FText
                  as="span"
                  class="match__team-name"
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
              class="match__table"
              data-key="user.id"
              :row-class="getRowClass"
              row-hover
              :value="displayedGuesses"
              @row-click="handleRowClick"
            >
              <Column :header="t('v1.full.name')">
                <template #body="{ data }">
                  <FText
                    as="span"
                    class="match__player-name"
                    clickable
                    variant="body-2-bold"
                  >
                    {{ getFullName(data) }}
                  </FText>
                </template>
              </Column>

              <Column
                :header="t('v1.guess')"
                body-class="match__table-center"
                header-class="match__table-center"
              >
                <template #body="{ data }">
                  <FText as="span" variant="body-2">
                    {{ formatGuess(data) }}
                  </FText>
                </template>
              </Column>

              <Column
                field="guess.points"
                :header="pointsHeader"
                body-class="match__table-center"
                header-class="match__table-center"
                sortable
              >
                <template #body="{ data }">
                  <FOutcomeTag
                    :outcome="data.guess?.outcome ?? null"
                    :value="String(data.guess?.points ?? '-')"
                  />
                </template>
              </Column>
            </DataTable>

            <ol class="match__list" :aria-label="t('v1.guesses')">
              <li
                v-for="item in displayedGuesses"
                :key="item.user.id"
                class="match__list-item"
              >
                <Card
                  class="match__guess-card"
                  :class="{
                    'match__guess-card--current': isCurrentUser(item),
                  }"
                  role="link"
                  tabindex="0"
                  :aria-label="getFullName(item)"
                  @click="goToPlayer(item)"
                  @keydown.enter="goToPlayer(item)"
                >
                  <template #content>
                    <FText
                      as="span"
                      class="match__player-name"
                      clickable
                      variant="body-2-bold"
                    >
                      {{ getFullName(item) }}
                    </FText>

                    <dl class="match__guess-stats">
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
                          <FOutcomeTag
                            :outcome="item.guess?.outcome ?? null"
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
.match {
  display: flex;
  width: min(100%, var(--f-page-empty-content-width, 1280px));
  flex-direction: column;
  gap: var(--f-space-md);
  margin: 0 auto;

  &__loading {
    display: grid;
    gap: var(--f-space-md);
  }

  &__hero {
    display: grid;
    gap: var(--f-space-md);
    text-align: center;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--f-space-xs);
  }

  &__scoreboard {
    display: grid;
    align-items: center;
    gap: var(--f-space-md);
    grid-template-areas: 'team-home score team-away';
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  }

  &__team-button {
    min-width: 0;
    padding: 0;
    color: var(--p-text-color);

    :deep(.p-button-label) {
      min-width: 0;
    }
  }

  &__team-name {
    display: block;
    min-width: 0;
  }

  &__team-button {
    &--home {
      grid-area: team-home;
      justify-content: flex-end;
      text-align: right;
    }

    &--away {
      grid-area: team-away;
      justify-content: flex-start;
      text-align: left;
    }
  }

  &__score {
    grid-area: score;
    min-width: 80px;
    white-space: nowrap;
  }

  &__table {
    overflow: hidden;
    border: 1px solid var(--p-surface-border);
    border-radius: var(--p-content-border-radius);

    :deep(.match__table-center) {
      width: 128px;
      text-align: center;
    }

    :deep(.match__table-center .p-column-header-content) {
      justify-content: center;
    }

    :deep(.match__row) {
      cursor: pointer;
    }

    :deep(.match__row--current > td) {
      background: color-mix(in srgb, var(--p-primary-color) 12%, transparent);
    }
  }

  &__player-name {
    display: block;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__list {
    display: none;
  }
}

@media (width <= 760px) {
  .match {
    &__scoreboard {
      gap: var(--f-space-sm);
      grid-template-areas:
        'team-home'
        'score'
        'team-away';
      grid-template-columns: minmax(0, 1fr);
    }

    &__team-button {
      justify-content: center;
      text-align: center;
    }

    &__score {
      min-width: 0;
    }

    &__table {
      display: none;
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: var(--f-space-md);
      padding: 0;
      margin: 0;
      list-style: none;
    }

    &__guess-card {
      overflow: hidden;
      cursor: pointer;
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

      &--current {
        :deep(.p-card-body) {
          background: var(--f-current-background);
          border-radius: var(--f-card-radius);
        }
      }
    }

    &__guess-card {
      border: var(--f-card-border);
      border-radius: var(--f-card-radius);

      :deep(.p-card-content) {
        display: grid;
        gap: var(--f-space-md);
        padding: 0;
      }
    }

    &__guess-stats {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--f-space-xs);
      margin: 0;

      div {
        padding: var(--f-space-xs);
        border-radius: var(--p-content-border-radius);
        background: var(--p-content-hover-background);
        text-align: center;
      }

      dt {
        margin: 0;
      }

      dd {
        margin: var(--f-space-2xs) 0 0;
      }
    }
  }
}
</style>
