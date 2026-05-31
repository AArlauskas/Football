<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Button, Card, Column, DataTable, Select, Tag } from 'primevue';
import { computed } from 'vue';

import FEmptyMessage from '@/components/FEmptyMessage.vue';
import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import type {
  GameStateFilter as GameStateFilterType,
  GameState as GameStateType,
} from '@/models';
import { GameState, GameStateFilter } from '@/models/game';
import { useAdminStore } from '@/stores/adminStore';

const { t } = useTranslations();
const adminStore = useAdminStore();
const { isLoading, stateFilter, visibleGames } = storeToRefs(adminStore);

const stateOptions = [
  { label: 'v1.admin.state.open', value: GameState.OPEN },
  { label: 'v1.admin.state.closed', value: GameState.CLOSED },
  { label: 'v1.admin.state.finished', value: GameState.FINISHED },
] as const;

const stateFilterOptions = computed(
  () =>
    [
      {
        label: t('v1.admin.filter.state.all'),
        value: GameStateFilter.ALL,
      },
      ...stateOptions.map((option) => ({
        label: t(option.label),
        value: option.value,
      })),
    ] satisfies Array<{ label: string; value: GameStateFilterType }>,
);

const getStateLabel = (state: GameStateType) => {
  const option = stateOptions.find((item) => item.value === state);

  return option ? t(option.label) : state;
};

const getStateSeverity = (state: GameStateType) => {
  if (state === GameState.FINISHED) {
    return 'success';
  }

  if (state === GameState.CLOSED) {
    return 'warn';
  }

  return 'info';
};
</script>

<template>
  <Card>
    <template #title>
      <FText as="h2" variant="heading-3">
        {{ t('v1.admin.manage.games') }}
      </FText>
    </template>
    <template #content>
      <div class="admin-games-panel__toolbar">
        <div class="admin-games-panel__field admin-games-panel__filter">
          <label for="admin-state-filter">
            <FText as="span" color="--p-text-muted-color" variant="body-3-bold">
              {{ t('v1.admin.filter.state') }}
            </FText>
          </label>
          <Select
            id="admin-state-filter"
            v-model="stateFilter"
            :options="stateFilterOptions"
            option-label="label"
            option-value="value"
            fluid
          />
        </div>
      </div>

      <DataTable
        class="admin-games-panel__table"
        data-key="id"
        :loading="isLoading"
        row-hover
        :value="visibleGames"
      >
        <Column
          field="date"
          :header="t('v1.admin.table.title.date')"
          sortable
        />
        <Column
          field="time"
          :header="t('v1.admin.table.title.time')"
          sortable
        />
        <Column :header="t('v1.admin.table.title.team.1')">
          <template #body="{ data }">
            {{ data.t1.name }}
          </template>
        </Column>
        <Column :header="t('v1.admin.table.title.team.2')">
          <template #body="{ data }">
            {{ data.t2.name }}
          </template>
        </Column>
        <Column :header="t('v1.admin.table.title.goals.1')">
          <template #body="{ data }">
            {{ data.result?.goals1 ?? '-' }}
          </template>
        </Column>
        <Column :header="t('v1.admin.table.title.goals.2')">
          <template #body="{ data }">
            {{ data.result?.goals2 ?? '-' }}
          </template>
        </Column>
        <Column :header="t('v1.admin.table.title.state')">
          <template #body="{ data }">
            <Tag
              :severity="getStateSeverity(data.state)"
              :value="getStateLabel(data.state)"
            />
          </template>
        </Column>
        <Column body-class="admin-games-panel__actions-column">
          <template #body="{ data }">
            <div class="admin-games-panel__actions">
              <Button
                v-if="data.state !== GameState.FINISHED"
                icon="pi pi-flag"
                :aria-label="t('v1.admin.complete.game')"
                rounded
                severity="success"
                text
                @click="adminStore.openCompleteDialog(data)"
              />
              <Button
                icon="pi pi-pencil"
                :aria-label="t('v1.admin.edit.game')"
                rounded
                severity="secondary"
                text
                @click="adminStore.openEditDialog(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <div class="admin-games-panel__game-list">
        <Card
          v-for="game in visibleGames"
          :key="game.id"
          class="admin-games-panel__game-card"
        >
          <template #content>
            <div class="admin-games-panel__game-card-header">
              <div>
                <FText as="span" variant="body-2-bold">
                  {{ game.date }} {{ game.time }}
                </FText>
                <FText as="span" color="--p-text-muted-color" variant="body-2">
                  {{ game.t1.name }} - {{ game.t2.name }}
                </FText>
              </div>
              <Tag
                :severity="getStateSeverity(game.state)"
                :value="getStateLabel(game.state)"
              />
            </div>

            <dl class="admin-games-panel__game-card-details">
              <div>
                <dt>
                  <FText
                    as="span"
                    color="--p-text-muted-color"
                    variant="body-3"
                  >
                    {{ t('v1.admin.table.title.goals.1') }}
                  </FText>
                </dt>
                <dd>
                  <FText as="span" variant="body-2-bold">
                    {{ game.result?.goals1 ?? '-' }}
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
                    {{ t('v1.admin.table.title.goals.2') }}
                  </FText>
                </dt>
                <dd>
                  <FText as="span" variant="body-2-bold">
                    {{ game.result?.goals2 ?? '-' }}
                  </FText>
                </dd>
              </div>
            </dl>

            <div class="admin-games-panel__game-card-actions">
              <Button
                v-if="game.state !== GameState.FINISHED"
                class="admin-games-panel__game-card-action"
                icon="pi pi-flag"
                :label="t('v1.admin.complete.game')"
                severity="success"
                outlined
                @click="adminStore.openCompleteDialog(game)"
              />
              <Button
                class="admin-games-panel__game-card-action"
                icon="pi pi-pencil"
                :label="t('v1.admin.edit.game')"
                severity="secondary"
                outlined
                @click="adminStore.openEditDialog(game)"
              />
            </div>
          </template>
        </Card>

        <FEmptyMessage
          v-if="!isLoading && visibleGames.length === 0"
          message="v1.admin.no.games"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.admin-games-panel__field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.admin-games-panel__toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.admin-games-panel__filter {
  width: min(100%, 240px);
}

.admin-games-panel__table {
  overflow: hidden;
  border: 1px solid var(--p-surface-border);
  border-radius: var(--p-content-border-radius);

  :deep(.admin-games-panel__actions-column) {
    width: 96px;
    text-align: center;
  }
}

.admin-games-panel__actions {
  display: inline-flex;
  width: 100%;
  justify-content: flex-end;
  gap: 4px;
}

.admin-games-panel__game-list {
  display: none;
}

@media (width <= 760px) {
  .admin-games-panel__toolbar {
    justify-content: stretch;
  }

  .admin-games-panel__filter {
    width: 100%;
  }

  .admin-games-panel__table {
    display: none;
  }

  .admin-games-panel__game-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .admin-games-panel__game-card {
    overflow: hidden;
    border: var(--f-card-border);
  }

  .admin-games-panel__game-card :deep(.p-card-body) {
    padding: 12px;
  }

  .admin-games-panel__game-card :deep(.p-card-content) {
    padding: 0;
  }

  .admin-games-panel__game-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap-reverse;

    div {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: 4px;
    }
  }

  .admin-games-panel__game-card-details {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin: 12px 0;

    div {
      padding: 8px;
      border-radius: var(--p-content-border-radius);
      background: var(--p-content-hover-background);
      text-align: center;
    }

    dt {
      margin: 0;
    }

    dd {
      margin: 4px 0 0;
    }
  }

  .admin-games-panel__game-card-actions {
    display: grid;
    gap: 8px;
  }

  .admin-games-panel__game-card-action {
    width: 100%;
  }
}
</style>
