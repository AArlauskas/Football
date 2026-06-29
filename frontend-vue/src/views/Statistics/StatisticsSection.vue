<script setup lang="ts">
import { Card, Column, DataTable, Tag } from 'primevue';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';
import type {
  StatisticsColumn,
  StatisticsRow,
} from '@/views/Statistics/statisticsSectionTypes';

defineProps<{
  columns: StatisticsColumn[];
  description: TranslationKey;
  rows: StatisticsRow[];
  title: TranslationKey;
}>();

const { t } = useTranslations();

const getValue = (row: StatisticsRow, field: string) =>
  row.values[field] ?? '-';
</script>

<template>
  <Card class="statistics-section">
    <template #content>
      <header class="statistics-section__header">
        <FText as="h2" variant="heading-3">
          {{ t(title) }}
        </FText>
        <FText as="p" color="--p-text-muted-color" variant="body-2">
          {{ t(description) }}
        </FText>
      </header>

      <DataTable
        class="statistics-section__table"
        data-key="id"
        row-hover
        :value="rows"
      >
        <Column :header="t('v1.statistics.column.name')" field="title" />

        <Column
          v-for="column in columns"
          :key="column.field"
          body-class="statistics-section__number"
          :field="`values.${column.field}`"
          header-class="statistics-section__number"
          :header="t(column.label)"
          sortable
        >
          <template #body="{ data }">
            {{ getValue(data, column.field) }}
          </template>
        </Column>
      </DataTable>

      <ol class="statistics-section__list" :aria-label="t(title)">
        <li
          v-for="(row, index) in rows"
          :key="row.id"
          class="statistics-section__item"
        >
          <Card class="statistics-section__card">
            <template #content>
              <div class="statistics-section__card-header">
                <Tag
                  class="statistics-section__rank"
                  rounded
                  :value="index + 1"
                />
                <FText as="span" variant="body-2-bold">
                  {{ row.title }}
                </FText>
              </div>

              <dl class="statistics-section__stats">
                <div
                  v-for="column in columns"
                  :key="column.field"
                  class="statistics-section__stat"
                >
                  <dt>
                    <FText
                      as="span"
                      color="--p-text-muted-color"
                      variant="body-3"
                    >
                      {{ t(column.label) }}
                    </FText>
                  </dt>
                  <dd>
                    <FText as="span" variant="body-2-bold">
                      {{ getValue(row, column.field) }}
                    </FText>
                  </dd>
                </div>
              </dl>
            </template>
          </Card>
        </li>
      </ol>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.statistics-section {
  overflow: hidden;
}

.statistics-section__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
}

.statistics-section__table {
  overflow: hidden;
  border: 1px solid var(--p-surface-border);
  border-radius: var(--p-content-border-radius);

  :deep(.statistics-section__number) {
    width: 152px;
    text-align: center;
    white-space: nowrap;
  }

  :deep(.statistics-section__number .p-column-header-content) {
    justify-content: center;
  }
}

.statistics-section__list {
  display: none;
}

@media (width <= 760px) {
  .statistics-section__table {
    display: none;
  }

  .statistics-section__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .statistics-section__card {
    border: var(--f-card-border);
  }

  .statistics-section__card :deep(.p-card-body) {
    padding: 12px;
  }

  .statistics-section__card :deep(.p-card-content) {
    padding: 0;
  }

  .statistics-section__card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .statistics-section__rank {
    flex: 0 0 36px;
    width: 36px;
    height: 36px;
    font-weight: 700;
  }

  .statistics-section__stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin: 12px 0 0;
  }

  .statistics-section__stat {
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

  .statistics-section__stat dt,
  .statistics-section__stat dd {
    margin: 0;
  }

  .statistics-section__stat dd {
    margin-top: 4px;
  }
}
</style>
