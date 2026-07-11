<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Card, Column, DataTable, InputText, Skeleton, Tag } from 'primevue';
import type { DataTableRowClickEvent } from 'primevue/datatable';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import FEmptyMessage from '@/components/FEmptyMessage.vue';
import FFormField from '@/components/FFormField.vue';
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

const getRowClass = () => 'teams-statistics__row';

const handleRowClick = (event: DataTableRowClickEvent<TeamsStatistics>) => {
  void handleTeamSelect(event.data.team.code);
};

onMounted(() => {
  void teamsStatisticsStore.loadStatistics();
});

usePageTitle(pageTitle);
</script>

<template>
  <main class="teams-statistics">
    <FPageFeedback :error="requestError" />

    <Card class="teams-statistics__content-card">
      <template #content>
        <div v-if="isLoading" class="teams-statistics__skeleton">
          <Skeleton v-for="item in 8" :key="item" height="40px" />
        </div>

        <FFormField
          v-if="!isLoading"
          class="teams-statistics__field teams-statistics__search"
          input-id="teams-statistics-search"
          :label="t('v1.search')"
          label-color="--p-text-muted-color"
          label-variant="body-3-bold"
        >
          <InputText
            id="teams-statistics-search"
            v-model="search"
            fluid
            type="search"
            :placeholder="t('v1.teams.statistics.search.placeholder')"
          />
        </FFormField>

        <DataTable
          v-if="!isLoading"
          class="teams-statistics__table"
          data-key="team.code"
          :row-class="getRowClass"
          row-hover
          :value="filteredStatistics"
          @row-click="handleRowClick"
        >
          <Column :header="t('v1.team')">
            <template #body="{ data }">
              <div class="teams-statistics__team">
                <img
                  v-if="getFlagUrl(data.team.code)"
                  class="teams-statistics__flag"
                  :alt="getTeamName(data)"
                  :src="getFlagUrl(data.team.code)"
                />
                <span v-else class="teams-statistics__flag-fallback">
                  <FText
                    as="span"
                    color="--p-text-muted-color"
                    variant="body-3-bold"
                  >
                    {{ data.team.code }}
                  </FText>
                </span>
                <FText
                  class="teams-statistics__team-name"
                  as="span"
                  clickable
                  variant="body-2-bold"
                >
                  {{ getTeamName(data) }}
                </FText>
              </div>
            </template>
          </Column>

          <Column
            :header="t('v1.team.games.played')"
            body-class="teams-statistics__number"
            header-class="teams-statistics__number"
            sortable
          >
            <template #body="{ data }">
              <FText as="span" variant="body-2">
                {{ getGamesPlayed(data) }}
              </FText>
            </template>
          </Column>

          <Column
            field="won"
            :header="t('v1.team.wins')"
            body-class="teams-statistics__number"
            header-class="teams-statistics__number"
            sortable
          >
            <template #body="{ data }">
              <FText as="span" variant="body-2">{{ data.won }}</FText>
            </template>
          </Column>

          <Column
            field="lost"
            :header="t('v1.team.losses')"
            body-class="teams-statistics__number"
            header-class="teams-statistics__number"
            sortable
          >
            <template #body="{ data }">
              <FText as="span" variant="body-2">{{ data.lost }}</FText>
            </template>
          </Column>

          <Column
            field="ties"
            :header="t('v1.team.ties')"
            body-class="teams-statistics__number"
            header-class="teams-statistics__number"
            sortable
          >
            <template #body="{ data }">
              <FText as="span" variant="body-2">{{ data.ties }}</FText>
            </template>
          </Column>
        </DataTable>

        <ol
          v-if="!isLoading && filteredStatistics.length"
          class="teams-statistics__list"
          :aria-label="t('v1.teams.statistics')"
        >
          <li
            v-for="(item, index) in filteredStatistics"
            :key="item.team.code"
            class="teams-statistics__list-item"
          >
            <Card
              class="teams-statistics__card"
              role="link"
              tabindex="0"
              :aria-label="getTeamName(item)"
              @click="handleTeamSelect(item.team.code)"
              @keydown.enter="handleTeamSelect(item.team.code)"
            >
              <template #content>
                <div class="teams-statistics__card-header">
                  <Tag
                    class="teams-statistics__rank"
                    rounded
                    :value="index + 1"
                  />

                  <img
                    v-if="getFlagUrl(item.team.code)"
                    class="teams-statistics__flag"
                    :alt="getTeamName(item)"
                    :src="getFlagUrl(item.team.code)"
                  />
                  <span v-else class="teams-statistics__flag-fallback">
                    <FText
                      as="span"
                      color="--p-text-muted-color"
                      variant="body-3-bold"
                    >
                      {{ item.team.code }}
                    </FText>
                  </span>

                  <FText
                    class="teams-statistics__team-name"
                    as="span"
                    clickable
                    variant="body-2-bold"
                  >
                    {{ getTeamName(item) }}
                  </FText>
                </div>

                <dl class="teams-statistics__stats">
                  <div class="teams-statistics__stat">
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

                  <div class="teams-statistics__stat">
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

                  <div class="teams-statistics__stat">
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

                  <div class="teams-statistics__stat">
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
.teams-statistics {
  display: flex;
  width: min(100%, var(--f-page-empty-content-width, 1280px));
  flex-direction: column;
  gap: var(--f-space-md);
  margin: 0 auto;

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--f-space-xs);
  }

  &__content-card :deep(.p-card-content) {
    display: flex;
    flex-direction: column;
    gap: var(--f-space-xl);
  }

  &__search {
    max-width: 360px;
  }

  &__table {
    overflow: hidden;
    border: 1px solid var(--p-surface-border);
    border-radius: var(--p-content-border-radius);

    :deep(.teams-statistics__number) {
      width: 152px;
      text-align: center;
      white-space: nowrap;
    }

    :deep(.teams-statistics__number .p-column-header-content) {
      justify-content: center;
    }

    :deep(.teams-statistics__row) {
      cursor: pointer;
    }
  }

  &__team {
    display: inline-flex;
    min-width: 0;
    align-items: center;
    gap: var(--f-space-sm);
    color: var(--p-text-color);
  }

  &__team-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__flag,
  &__flag-fallback {
    width: 28px;
    height: 28px;
    flex: 0 0 auto;
  }

  &__flag {
    object-fit: contain;
  }

  &__flag-fallback {
    display: inline-grid;
    place-items: center;
    border-radius: 50%;
    background: var(--p-content-hover-background);
    color: var(--p-text-muted-color);
  }

  &__list {
    display: none;
  }
}

@media (width <= 760px) {
  .teams-statistics {
    &__search {
      max-width: none;
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

    &__list-item {
      min-width: 0;
    }

    &__card {
      overflow: hidden;
      border: var(--f-card-border);
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

      :deep(.p-card-content) {
        padding: 0;
      }
    }

    &__card-header {
      display: flex;
      align-items: center;
      gap: var(--f-space-sm);
      min-width: 0;
    }

    &__rank {
      flex: 0 0 36px;
      width: 36px;
      height: 36px;
      font-weight: 700;
    }

    &__flag,
    &__flag-fallback {
      width: 32px;
      height: 32px;
    }

    &__stats {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--f-space-xs);
      margin: var(--f-space-md) 0 0;
    }

    &__stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      min-width: 0;
      padding: var(--f-space-xs);
      border-radius: var(--p-content-border-radius);
      background: var(--p-content-hover-background);
      text-align: center;

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
