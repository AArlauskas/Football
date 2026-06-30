<script setup lang="ts">
import { storeToRefs } from 'pinia';
import {
  Button,
  Card,
  Column,
  DataTable,
  InputText,
  Skeleton,
  Tag,
} from 'primevue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import FEmptyMessage from '@/components/FEmptyMessage.vue';
import FPageFeedback from '@/components/FPageFeedback.vue';
import FText from '@/components/FText.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { useTranslations } from '@/composables/useTranslations';
import { teamFlags } from '@/constants/teamFlags';
import { RouteName } from '@/enums';
import { translateTeamName } from '@/lib/teamName';
import type { TeamsStatistics } from '@/models/game';
import { useTeamsStatisticsStore } from '@/stores/teamsStatisticsStore';

const router = useRouter();
const { t } = useTranslations();
const teamsStatisticsStore = useTeamsStatisticsStore();
const { isLoading, requestError, sortedStatistics } =
  storeToRefs(teamsStatisticsStore);
const search = ref('');

const pageTitle = computed(() => t('v1.teams.statistics'));

const normalizedSearch = computed(() =>
  search.value.trim().toLocaleLowerCase(),
);

const filteredStatistics = computed(() => {
  if (!normalizedSearch.value) {
    return sortedStatistics.value;
  }

  return sortedStatistics.value.filter((item) => {
    const teamName = getTeamName(item).toLocaleLowerCase();
    const teamCode = item.team.code.toLocaleLowerCase();

    return (
      teamName.includes(normalizedSearch.value) ||
      teamCode.includes(normalizedSearch.value)
    );
  });
});

const getGamesPlayed = (item: TeamsStatistics) =>
  item.won + item.lost + item.ties;
const getFlagUrl = (teamCode: string) => teamFlags[teamCode];
const getTeamName = (item: TeamsStatistics) => translateTeamName(item.team, t);

const handleTeamSelect = async (teamId: string) => {
  await router.push({ name: RouteName.Team, params: { teamId } });
};

onMounted(() => {
  void teamsStatisticsStore.loadStatistics();
});

usePageTitle(pageTitle);
</script>

<template>
  <main class="teams-statistics-page">
    <FPageFeedback :error="requestError" />

    <Card class="teams-statistics-page__content-card">
      <template #content>
        <div v-if="isLoading" class="teams-statistics-page__skeleton">
          <Skeleton v-for="item in 8" :key="item" height="40px" />
        </div>

        <div v-if="!isLoading" class="teams-statistics-page__search">
          <label for="teams-statistics-search">
            <FText as="span" color="--p-text-muted-color" variant="body-3-bold">
              {{ t('v1.search') }}
            </FText>
          </label>
          <InputText
            id="teams-statistics-search"
            v-model="search"
            fluid
            type="search"
            :placeholder="t('v1.teams.statistics.search.placeholder')"
          />
        </div>

        <DataTable
          v-if="!isLoading"
          class="teams-statistics-page__table"
          data-key="team.code"
          row-hover
          :value="filteredStatistics"
        >
          <Column :header="t('v1.team')">
            <template #body="{ data }">
              <Button
                class="teams-statistics-page__team-button"
                link
                @click="handleTeamSelect(data.team.code)"
              >
                <img
                  v-if="getFlagUrl(data.team.code)"
                  class="teams-statistics-page__flag"
                  :alt="getTeamName(data)"
                  :src="getFlagUrl(data.team.code)"
                />
                <span v-else class="teams-statistics-page__flag-fallback">
                  {{ data.team.code }}
                </span>
                <FText as="span" clickable variant="body-2-bold">
                  {{ getTeamName(data) }}
                </FText>
              </Button>
            </template>
          </Column>

          <Column
            :header="t('v1.team.games.played')"
            body-class="teams-statistics-page__number"
            header-class="teams-statistics-page__number"
            sortable
          >
            <template #body="{ data }">
              {{ getGamesPlayed(data) }}
            </template>
          </Column>

          <Column
            field="won"
            :header="t('v1.team.wins')"
            body-class="teams-statistics-page__number"
            header-class="teams-statistics-page__number"
            sortable
          />

          <Column
            field="lost"
            :header="t('v1.team.losses')"
            body-class="teams-statistics-page__number"
            header-class="teams-statistics-page__number"
            sortable
          />

          <Column
            field="ties"
            :header="t('v1.team.ties')"
            body-class="teams-statistics-page__number"
            header-class="teams-statistics-page__number"
            sortable
          />
        </DataTable>

        <ol
          v-if="!isLoading && filteredStatistics.length"
          class="teams-statistics-page__list"
          :aria-label="t('v1.teams.statistics')"
        >
          <li
            v-for="(item, index) in filteredStatistics"
            :key="item.team.code"
            class="teams-statistics-page__list-item"
          >
            <Card class="teams-statistics-page__card">
              <template #content>
                <div class="teams-statistics-page__card-header">
                  <Tag
                    class="teams-statistics-page__rank"
                    rounded
                    :value="index + 1"
                  />

                  <img
                    v-if="getFlagUrl(item.team.code)"
                    class="teams-statistics-page__flag"
                    :alt="getTeamName(item)"
                    :src="getFlagUrl(item.team.code)"
                  />
                  <span v-else class="teams-statistics-page__flag-fallback">
                    {{ item.team.code }}
                  </span>

                  <Button
                    class="teams-statistics-page__team-button"
                    link
                    @click="handleTeamSelect(item.team.code)"
                  >
                    <FText as="span" clickable variant="body-2-bold">
                      {{ getTeamName(item) }}
                    </FText>
                  </Button>
                </div>

                <dl class="teams-statistics-page__stats">
                  <div class="teams-statistics-page__stat">
                    <dt>
                      <FText
                        as="span"
                        color="--p-text-muted-color"
                        variant="body-3"
                      >
                        {{ t('v1.team.games.played') }}
                      </FText>
                    </dt>
                    <dd>
                      <FText as="span" variant="body-2-bold">
                        {{ getGamesPlayed(item) }}
                      </FText>
                    </dd>
                  </div>

                  <div class="teams-statistics-page__stat">
                    <dt>
                      <FText
                        as="span"
                        color="--p-text-muted-color"
                        variant="body-3"
                      >
                        {{ t('v1.team.wins') }}
                      </FText>
                    </dt>
                    <dd>
                      <FText as="span" variant="body-2-bold">
                        {{ item.won }}
                      </FText>
                    </dd>
                  </div>

                  <div class="teams-statistics-page__stat">
                    <dt>
                      <FText
                        as="span"
                        color="--p-text-muted-color"
                        variant="body-3"
                      >
                        {{ t('v1.team.losses') }}
                      </FText>
                    </dt>
                    <dd>
                      <FText as="span" variant="body-2-bold">
                        {{ item.lost }}
                      </FText>
                    </dd>
                  </div>

                  <div class="teams-statistics-page__stat">
                    <dt>
                      <FText
                        as="span"
                        color="--p-text-muted-color"
                        variant="body-3"
                      >
                        {{ t('v1.team.ties') }}
                      </FText>
                    </dt>
                    <dd>
                      <FText as="span" variant="body-2-bold">
                        {{ item.ties }}
                      </FText>
                    </dd>
                  </div>
                </dl>
              </template>
            </Card>
          </li>
        </ol>

        <FEmptyMessage
          v-if="!isLoading && filteredStatistics.length === 0"
          message="v1.teams.statistics.no.results"
        />
      </template>
    </Card>
  </main>
</template>

<style scoped lang="scss">
.teams-statistics-page {
  display: flex;
  width: min(100%, var(--f-page-empty-content-width, 1280px));
  flex-direction: column;
  gap: 16px;
  margin: 0 auto;
}

.teams-statistics-page__skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.teams-statistics-page__content-card :deep(.p-card-content) {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.teams-statistics-page__search {
  display: flex;
  max-width: 360px;
  flex-direction: column;
  gap: 4px;
}

.teams-statistics-page__table {
  overflow: hidden;
  border: 1px solid var(--p-surface-border);
  border-radius: var(--p-content-border-radius);

  :deep(.teams-statistics-page__number) {
    width: 152px;
    text-align: center;
    white-space: nowrap;
  }

  :deep(.teams-statistics-page__number .p-column-header-content) {
    justify-content: center;
  }

  :deep(.teams-statistics-page__team-button) {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 0;
    color: var(--p-text-color);
  }
}

.teams-statistics-page__flag,
.teams-statistics-page__flag-fallback {
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
}

.teams-statistics-page__flag {
  object-fit: contain;
}

.teams-statistics-page__flag-fallback {
  display: inline-grid;
  place-items: center;
  border-radius: 50%;
  background: var(--p-content-hover-background);
  color: var(--p-text-muted-color);
  font-size: 11px;
  font-weight: 700;
}

.teams-statistics-page__list {
  display: none;
}

@media (width <= 760px) {
  .teams-statistics-page__search {
    max-width: none;
  }

  .teams-statistics-page__table {
    display: none;
  }

  .teams-statistics-page__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .teams-statistics-page__list-item {
    min-width: 0;
  }

  .teams-statistics-page__card {
    overflow: hidden;
    border: var(--f-card-border);
  }

  .teams-statistics-page__card :deep(.p-card-body) {
    padding: 12px;
  }

  .teams-statistics-page__card :deep(.p-card-content) {
    padding: 0;
  }

  .teams-statistics-page__card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .teams-statistics-page__rank {
    flex: 0 0 36px;
    width: 36px;
    height: 36px;
    font-weight: 700;
  }

  .teams-statistics-page__team-button {
    min-width: 0;
    padding: 0;
    color: var(--p-text-color);

    :deep(.p-button-label) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .teams-statistics-page__flag,
  .teams-statistics-page__flag-fallback {
    width: 32px;
    height: 32px;
  }

  .teams-statistics-page__stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin: 12px 0 0;
  }

  .teams-statistics-page__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
    padding: 8px;
    border-radius: var(--p-content-border-radius);
    background: var(--p-content-hover-background);
    text-align: center;
  }

  .teams-statistics-page__stat dt {
    margin: 0;
  }

  .teams-statistics-page__stat dd {
    margin: 4px 0 0;
  }
}
</style>
