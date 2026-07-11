<script setup lang="ts">
import { Card, Column, DataTable, Tag } from 'primevue';
import type { DataTableRowClickEvent } from 'primevue/datatable';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import type { UserDetails } from '@/models';

const props = defineProps<{
  currentUserId?: number;
  results: UserDetails[];
}>();

const emit = defineEmits<{
  selectPlayer: [id: number];
}>();

const { t } = useTranslations();

const getFullName = (player: UserDetails) =>
  `${player.firstName} ${player.lastName}`;

const getRowClass = (player: UserDetails) => ({
  'results-table__row': true,
  'results-table__row--current': player.id === props.currentUserId,
});

const handleRowClick = (event: DataTableRowClickEvent<UserDetails>) => {
  emit('selectPlayer', event.data.id);
};
</script>

<template>
  <DataTable
    class="results-table"
    data-key="id"
    :row-class="getRowClass"
    row-hover
    :value="results"
    @row-click="handleRowClick"
  >
    <Column
      :header="t('v1.place')"
      body-class="results-table__place"
      header-class="results-table__place"
    >
      <template #body="{ data }">
        <FText as="span" variant="body-2">
          {{ data.points.place }}
        </FText>
      </template>
    </Column>

    <Column :header="t('v1.full.name')">
      <template #body="{ data }">
        <FText
          class="results-table__player-name"
          as="span"
          clickable
          variant="body-2-bold"
        >
          {{ getFullName(data) }}
        </FText>
      </template>
    </Column>

    <Column
      field="points.total"
      :header="t('v1.points')"
      body-class="results-table__number"
      header-class="results-table__number"
      sortable
    >
      <template #body="{ data }">
        <FText as="span" variant="body-2">{{ data.points.total }}</FText>
      </template>
    </Column>
    <Column
      field="points.correctGuesses"
      :header="t('v1.correct.guesses')"
      body-class="results-table__number"
      header-class="results-table__number"
      sortable
    >
      <template #body="{ data }">
        <FText as="span" variant="body-2">
          {{ data.points.correctGuesses }}
        </FText>
      </template>
    </Column>
    <Column
      field="points.correctOutcomes"
      :header="t('v1.correct.outcomes')"
      body-class="results-table__number"
      header-class="results-table__number"
      sortable
    >
      <template #body="{ data }">
        <FText as="span" variant="body-2">
          {{ data.points.correctOutcomes }}
        </FText>
      </template>
    </Column>
  </DataTable>

  <ol class="results-table__list" :aria-label="t('v1.results')">
    <li v-for="player in results" :key="player.id" class="results-table__item">
      <Card
        class="results-table__card"
        :class="{
          'results-table__card--current': player.id === currentUserId,
        }"
        role="link"
        tabindex="0"
        :aria-label="getFullName(player)"
        @click="emit('selectPlayer', player.id)"
        @keydown.enter="emit('selectPlayer', player.id)"
      >
        <template #content>
          <div class="results-table__header">
            <Tag
              class="results-table__place"
              :value="player.points.place"
              rounded
            />

            <FText
              class="results-table__player-name"
              as="span"
              clickable
              variant="body-2-bold"
            >
              {{ getFullName(player) }}
            </FText>
          </div>

          <dl class="results-table__stats">
            <div class="results-table__stat">
              <dt>
                <FText as="span" color="--p-text-muted-color" variant="body-3">
                  {{ t('v1.points') }}
                </FText>
              </dt>
              <dd>
                <FText as="span" variant="body-2-bold">
                  {{ player.points.total }}
                </FText>
              </dd>
            </div>

            <div class="results-table__stat">
              <dt>
                <FText as="span" color="--p-text-muted-color" variant="body-3">
                  {{ t('v1.correct.guesses') }}
                </FText>
              </dt>
              <dd>
                <FText as="span" variant="body-2-bold">
                  {{ player.points.correctGuesses }}
                </FText>
              </dd>
            </div>

            <div class="results-table__stat">
              <dt>
                <FText as="span" color="--p-text-muted-color" variant="body-3">
                  {{ t('v1.correct.outcomes') }}
                </FText>
              </dt>
              <dd>
                <FText as="span" variant="body-2-bold">
                  {{ player.points.correctOutcomes }}
                </FText>
              </dd>
            </div>
          </dl>
        </template>
      </Card>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.results-table {
  overflow: hidden;
  border: 1px solid var(--p-surface-border);
  border-radius: var(--p-content-border-radius);

  :deep(.results-table__place) {
    width: 88px;
    text-align: center;
  }

  :deep(.results-table__number) {
    width: 152px;
    text-align: center;
    white-space: nowrap;
  }

  :deep(.results-table__place .p-column-header-content),
  :deep(.results-table__number .p-column-header-content) {
    justify-content: center;
  }

  :deep(.results-table__row) {
    cursor: pointer;
  }

  :deep(.results-table__row--current > td) {
    background: var(--f-current-background);
  }

  &__list {
    display: none;
  }
}

@media (width <= 760px) {
  .results-table {
    display: none;

    &__list {
      display: flex;
      flex-direction: column;
      gap: var(--f-space-md);
      padding: 0;
      margin: 0;
      list-style: none;
    }

    &__item {
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

      &--current {
        :deep(.p-card-body) {
          background: var(--f-current-background);
        }
      }

      :deep(.p-card-content) {
        padding: 0;
      }
    }

    &__header {
      display: flex;
      align-items: center;
      gap: var(--f-space-sm);
      min-width: 0;
    }

    &__place {
      flex: 0 0 36px;
      width: 36px;
      height: 36px;
      font-weight: 700;
    }

    &__player-name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
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
