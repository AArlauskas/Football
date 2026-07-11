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

import FFormField from '@/components/FFormField.vue';
import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';
import { translateTeamName } from '@/lib/teamName';
import type { GameState as GameStateType } from '@/models';
import { GameState } from '@/models/game';
import { useAdminStore } from '@/stores/adminStore';
import {
  getNullableInputNumberValue,
  type InputNumberEvent,
} from '@/utils/inputNumber';

const { t } = useTranslations();
const adminStore = useAdminStore();
const { editForm, isEditDialogVisible, isEditFormValid, isSaving, teams } =
  storeToRefs(adminStore);

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
const teamOptions = computed(() =>
  teams.value.map((team) => ({
    label: translateTeamName(team, t),
    value: team.code,
  })),
);

const setEditGoal = (side: 'goals1' | 'goals2', event: InputNumberEvent) => {
  editForm.value[side] = getNullableInputNumberValue(event);
};
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
      <FFormField
        class="admin-edit-game-dialog__field"
        input-id="admin-edit-date"
        :label="t('v1.admin.table.title.date')"
        label-color="--p-text-muted-color"
        label-variant="body-3-bold"
      >
        <DatePicker
          id="admin-edit-date"
          v-model="editForm.date"
          date-format="yy-mm-dd"
          fluid
          show-icon
        />
      </FFormField>

      <FFormField
        class="admin-edit-game-dialog__field"
        input-id="admin-edit-time"
        :label="t('v1.admin.table.title.time')"
        label-color="--p-text-muted-color"
        label-variant="body-3-bold"
      >
        <InputText
          id="admin-edit-time"
          v-model="editForm.time"
          fluid
          type="time"
        />
      </FFormField>

      <FFormField
        class="admin-edit-game-dialog__field"
        input-id="admin-edit-team-1"
        :label="t('v1.admin.table.title.team.1')"
        label-color="--p-text-muted-color"
        label-variant="body-3-bold"
      >
        <Select
          id="admin-edit-team-1"
          v-model="editForm.t1"
          :options="teamOptions"
          filter
          option-label="label"
          option-value="value"
          fluid
        />
      </FFormField>

      <FFormField
        class="admin-edit-game-dialog__field"
        input-id="admin-edit-team-2"
        :label="t('v1.admin.table.title.team.2')"
        label-color="--p-text-muted-color"
        label-variant="body-3-bold"
      >
        <Select
          id="admin-edit-team-2"
          v-model="editForm.t2"
          :options="teamOptions"
          filter
          option-label="label"
          option-value="value"
          fluid
        />
      </FFormField>

      <FFormField
        class="admin-edit-game-dialog__field admin-edit-game-dialog__state"
        input-id="admin-edit-state"
        :label="t('v1.admin.table.title.state')"
        label-color="--p-text-muted-color"
        label-variant="body-3-bold"
      >
        <Select
          id="admin-edit-state"
          v-model="editForm.state"
          :options="stateSelectOptions"
          option-label="label"
          option-value="value"
          fluid
        />
      </FFormField>

      <template v-if="editForm.state === GameState.FINISHED">
        <FFormField
          class="admin-edit-game-dialog__field"
          input-id="admin-edit-goals-1"
          :label="t('v1.admin.table.title.goals.1')"
          label-color="--p-text-muted-color"
          label-variant="body-3-bold"
        >
          <InputNumber
            id="admin-edit-goals-1"
            v-model="editForm.goals1"
            :min="0"
            fluid
            @input="setEditGoal('goals1', $event)"
          />
        </FFormField>

        <FFormField
          class="admin-edit-game-dialog__field"
          input-id="admin-edit-goals-2"
          :label="t('v1.admin.table.title.goals.2')"
          label-color="--p-text-muted-color"
          label-variant="body-3-bold"
        >
          <InputNumber
            id="admin-edit-goals-2"
            v-model="editForm.goals2"
            :min="0"
            fluid
            @input="setEditGoal('goals2', $event)"
          />
        </FFormField>
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

  &__form {
    display: grid;
    gap: var(--f-space-md);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__state {
    grid-column: 1 / -1;
  }

  &__actions {
    display: flex;
    grid-column: 1 / -1;
    justify-content: flex-end;
    gap: var(--f-space-xs);
  }
}

@media (width <= 760px) {
  .admin-edit-game-dialog {
    &__form {
      grid-template-columns: 1fr;
    }

    &__actions {
      grid-column: auto;
      flex-direction: column-reverse;

      :deep(.p-button) {
        width: 100%;
      }
    }
  }
}
</style>
