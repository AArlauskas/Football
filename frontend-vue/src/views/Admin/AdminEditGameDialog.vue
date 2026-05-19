<script setup lang="ts">
import { storeToRefs } from 'pinia';
import {
  Button,
  DatePicker,
  Dialog,
  InputNumber,
  InputText,
  Select,
} from 'primevue';
import { computed } from 'vue';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';
import type { GameState as GameStateType } from '@/models';
import { GameState } from '@/models/game';
import { useAdminStore } from '@/stores/adminStore';

const { t } = useTranslations();
const adminStore = useAdminStore();
const {
  editForm,
  isEditDialogVisible,
  isEditFormValid,
  isSaving,
  teamOptions,
} = storeToRefs(adminStore);

const stateOptions: Array<{ label: TranslationKey; value: GameStateType }> = [
  { label: 'v1.admin.state.open', value: GameState.OPEN },
  { label: 'v1.admin.state.closed', value: GameState.CLOSED },
  { label: 'v1.admin.state.finished', value: GameState.FINISHED },
];
const stateSelectOptions = computed(() =>
  stateOptions.map((option) => ({
    label: t(option.label),
    value: option.value,
  })),
);
</script>

<template>
  <Dialog
    v-model:visible="isEditDialogVisible"
    modal
    :header="t('v1.admin.edit.game')"
    class="admin-edit-game-dialog"
  >
    <form
      class="admin-edit-game-dialog__form"
      @submit.prevent="adminStore.saveGame"
    >
      <div class="admin-edit-game-dialog__field">
        <label for="admin-edit-date">
          <FText
            as="span"
            color="--p-text-muted-color"
            variant="body-3-bold"
          >
            {{ t('v1.admin.table.title.date') }}
          </FText>
        </label>
        <DatePicker
          id="admin-edit-date"
          v-model="editForm.date"
          date-format="yy-mm-dd"
          fluid
          show-icon
        />
      </div>

      <div class="admin-edit-game-dialog__field">
        <label for="admin-edit-time">
          <FText
            as="span"
            color="--p-text-muted-color"
            variant="body-3-bold"
          >
            {{ t('v1.admin.table.title.time') }}
          </FText>
        </label>
        <InputText
          id="admin-edit-time"
          v-model="editForm.time"
          fluid
          type="time"
        />
      </div>

      <div class="admin-edit-game-dialog__field">
        <label for="admin-edit-team-1">
          <FText
            as="span"
            color="--p-text-muted-color"
            variant="body-3-bold"
          >
            {{ t('v1.admin.table.title.team.1') }}
          </FText>
        </label>
        <Select
          id="admin-edit-team-1"
          v-model="editForm.t1"
          :options="teamOptions"
          filter
          option-label="label"
          option-value="value"
          fluid
        />
      </div>

      <div class="admin-edit-game-dialog__field">
        <label for="admin-edit-team-2">
          <FText
            as="span"
            color="--p-text-muted-color"
            variant="body-3-bold"
          >
            {{ t('v1.admin.table.title.team.2') }}
          </FText>
        </label>
        <Select
          id="admin-edit-team-2"
          v-model="editForm.t2"
          :options="teamOptions"
          filter
          option-label="label"
          option-value="value"
          fluid
        />
      </div>

      <div class="admin-edit-game-dialog__field admin-edit-game-dialog__state">
        <label for="admin-edit-state">
          <FText
            as="span"
            color="--p-text-muted-color"
            variant="body-3-bold"
          >
            {{ t('v1.admin.table.title.state') }}
          </FText>
        </label>
        <Select
          id="admin-edit-state"
          v-model="editForm.state"
          :options="stateSelectOptions"
          option-label="label"
          option-value="value"
          fluid
        />
      </div>

      <template v-if="editForm.state === GameState.FINISHED">
        <div class="admin-edit-game-dialog__field">
          <label for="admin-edit-goals-1">
            <FText
              as="span"
              color="--p-text-muted-color"
              variant="body-3-bold"
            >
              {{ t('v1.admin.table.title.goals.1') }}
            </FText>
          </label>
          <InputNumber
            id="admin-edit-goals-1"
            v-model="editForm.goals1"
            :min="0"
            fluid
          />
        </div>

        <div class="admin-edit-game-dialog__field">
          <label for="admin-edit-goals-2">
            <FText
              as="span"
              color="--p-text-muted-color"
              variant="body-3-bold"
            >
              {{ t('v1.admin.table.title.goals.2') }}
            </FText>
          </label>
          <InputNumber
            id="admin-edit-goals-2"
            v-model="editForm.goals2"
            :min="0"
            fluid
          />
        </div>
      </template>

      <div class="admin-edit-game-dialog__actions">
        <Button
          :label="t('v1.cancel')"
          severity="secondary"
          text
          type="button"
          @click="adminStore.closeEditDialog"
        />
        <Button
          icon="pi pi-save"
          :label="t('v1.admin.save.game')"
          :disabled="!isEditFormValid || isSaving"
          :loading="isSaving"
          type="submit"
        />
      </div>
    </form>
  </Dialog>
</template>

<style scoped lang="scss">
.admin-edit-game-dialog {
  width: min(840px, calc(100vw - 32px));
}

.admin-edit-game-dialog__form {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.admin-edit-game-dialog__field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.admin-edit-game-dialog__state {
  grid-column: 1 / -1;
}

.admin-edit-game-dialog__actions {
  display: flex;
  grid-column: 1 / -1;
  justify-content: flex-end;
  gap: 8px;
}

@media (width <= 760px) {
  .admin-edit-game-dialog__form {
    grid-template-columns: 1fr;
  }

  .admin-edit-game-dialog__actions {
    grid-column: auto;
    flex-direction: column-reverse;

    :deep(.p-button) {
      width: 100%;
    }
  }
}
</style>
