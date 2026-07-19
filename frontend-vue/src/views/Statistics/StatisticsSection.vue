<script setup lang="ts">
import { Card, Column, DataTable, Tag } from 'primevue';
import { ref, useId } from 'vue';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';
import type {
  StatisticsColumn,
  StatisticsRow,
} from '@/views/Statistics/statisticsSectionTypes';

type Props = {
  columns: StatisticsColumn[];
  description: TranslationKey;
  rows: StatisticsRow[];
  title: TranslationKey;
};

defineProps<Props>();

const { t } = useTranslations();
const contentId = `statistics-section-${useId()}`;
const isExpanded = ref(false);

const getValue = (row: StatisticsRow, field: string) =>
  row.values[field] ?? '-';
</script>

<template>
  <Card class="statistics-section">
    <template #content>
      <header class="statistics-section__header">
        <button
          class="statistics-section__toggle"
          :aria-controls="contentId"
          :aria-expanded="isExpanded"
          type="button"
          @click="isExpanded = !isExpanded"
        >
          <span class="statistics-section__heading">
            <FText as="span" role="heading" aria-level="2" variant="heading-3">
              {{ t(title) }}
            </FText>
            <FText as="span" color="--p-text-muted-color" variant="body-2">
              {{ t(description) }}
            </FText>
          </span>
          <i
            aria-hidden="true"
            class="pi statistics-section__chevron"
            :class="isExpanded ? 'pi-chevron-up' : 'pi-chevron-down'"
          />
        </button>
      </header>

      <div v-show="isExpanded" :id="contentId">
        <DataTable
          class="statistics-section__table"
          data-key="id"
          row-hover
          :value="rows"
        >
          <Column :header="t('v1.statistics.column.name')" field="title">
            <template #body="{ data }">
              <FText as="span" variant="body-2-bold">{{ data.title }}</FText>
            </template>
          </Column>

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
              <FText as="span" variant="body-2">
                {{ getValue(data, column.field) }}
              </FText>
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
      </div>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.statistics-section {
  overflow: hidden;

  &__header {
    display: block;
  }

  &__toggle {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: var(--f-space-md);
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font: inherit;
    text-align: left;
  }

  &__heading {
    display: flex;
    flex-direction: column;
    gap: var(--f-space-2xs);
  }

  &__chevron {
    flex: 0 0 auto;
    font-size: 1rem;
  }

  &__table {
    overflow: hidden;
    margin-top: var(--f-space-lg);
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

  &__list {
    display: none;
  }
}

@media (width <= 760px) {
  .statistics-section {
    &__table {
      display: none;
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: var(--f-space-md);
      padding: 0;
      margin: var(--f-space-lg) 0 0;
      list-style: none;
    }

    &__card {
      border: var(--f-card-border);

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

      dt,
      dd {
        margin: 0;
      }

      dd {
        margin-top: var(--f-space-2xs);
      }
    }
  }
}
</style>
