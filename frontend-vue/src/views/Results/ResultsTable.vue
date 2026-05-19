<script setup lang="ts">
import { Button, Card, Column, DataTable, Tag } from 'primevue';

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
  'results-table__row--current': player.id === props.currentUserId,
});
</script>

<template>
  <DataTable
    class="results-table"
    data-key="id"
    :row-class="getRowClass"
    row-hover
    :value="results"
  >
    <Column
      :header="t('v1.place')"
      body-class="results-table__place"
      header-class="results-table__place"
    >
      <template #body="{ data }">
        {{ data.points.place }}
      </template>
    </Column>

    <Column :header="t('v1.full.name')">
      <template #body="{ data }">
        <Button
          class="results-table__player-button"
          link
          @click="emit('selectPlayer', data.id)"
        >
          <FText as="span" clickable variant="body-2-bold">
            {{ getFullName(data) }}
          </FText>
        </Button>
      </template>
    </Column>

    <Column
      field="points.total"
      :header="t('v1.points')"
      body-class="results-table__number"
      header-class="results-table__number"
      sortable
    />
    <Column
      field="points.correctGuesses"
      :header="t('v1.correct.guesses')"
      body-class="results-table__number"
      header-class="results-table__number"
      sortable
    />
    <Column
      field="points.correctOutcomes"
      :header="t('v1.correct.outcomes')"
      body-class="results-table__number"
      header-class="results-table__number"
      sortable
    />
  </DataTable>

  <ol class="results-list" :aria-label="t('v1.results')">
    <li v-for="player in results" :key="player.id" class="results-list__item">
      <Card
        class="results-list__card"
        :class="{
          'results-list__card--current': player.id === currentUserId,
        }"
      >
        <template #content>
          <div class="results-list__header">
            <Tag
              class="results-list__place"
              :value="player.points.place"
              rounded
            />

            <Button
              class="results-list__player-button"
              link
              @click="emit('selectPlayer', player.id)"
            >
              <FText as="span" clickable variant="body-2-bold">
                {{ getFullName(player) }}
              </FText>
            </Button>
          </div>

          <dl class="results-list__stats">
            <div class="results-list__stat">
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

            <div class="results-list__stat">
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

            <div class="results-list__stat">
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

  :deep(.results-table__player-button) {
    padding: 0;
    color: var(--p-text-color);
  }

  :deep(.results-table__row--current > td) {
    background: var(--f-current-background);
  }
}

.results-list {
  display: none;
}

@media (width <= 760px) {
  .results-table {
    display: none;
  }

  .results-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .results-list__item {
    min-width: 0;
  }

  .results-list__card {
    overflow: hidden;
    border: var(--f-card-border);
  }

  .results-list__card--current {
    :deep(.p-card-body) {
      background: var(--f-current-background);
    }
  }

  .results-list__card :deep(.p-card-body) {
    padding: 12px;
  }

  .results-list__card :deep(.p-card-content) {
    padding: 0;
  }

  .results-list__header {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .results-list__place {
    flex: 0 0 36px;
    width: 36px;
    height: 36px;
    font-weight: 700;
  }

  .results-list__player-button {
    min-width: 0;
    padding: 0;
    color: var(--p-text-color);

    :deep(.p-button-label) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .results-list__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    margin: 12px 0 0;
  }

  .results-list__stat {
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

  .results-list__stat dt {
    margin: 0;
  }

  .results-list__stat dd {
    margin: 4px 0 0;
  }
}
</style>
