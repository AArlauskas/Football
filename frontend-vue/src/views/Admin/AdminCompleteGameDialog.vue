<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Button, Dialog, InputNumber } from 'primevue';

import FFormField from '@/components/FFormField.vue';
import { useTranslations } from '@/composables/useTranslations';
import { useAdminStore } from '@/stores/adminStore';
import {
  getNullableInputNumberValue,
  type InputNumberEvent,
} from '@/utils/inputNumber';

const { t } = useTranslations();
const adminStore = useAdminStore();
const { completeForm, isCompleteDialogVisible, isCompleteFormValid, isSaving } =
  storeToRefs(adminStore);

const setCompleteGoal = (
  side: 'goals1' | 'goals2',
  event: InputNumberEvent,
) => {
  completeForm.value[side] = getNullableInputNumberValue(event);
};
</script>

<template>
  <Dialog
    v-model:visible="isCompleteDialogVisible"
    modal
    :header="t('v1.admin.complete.game')"
    class="admin-complete-game-dialog"
  >
    <form
      class="admin-complete-game-dialog__form"
      @submit.prevent="adminStore.completeGame"
    >
      <FFormField
        class="admin-complete-game-dialog__field"
        input-id="admin-complete-goals-1"
        :label="t('v1.admin.table.title.goals.1')"
        label-color="--p-text-muted-color"
        label-variant="body-3-bold"
      >
        <InputNumber
          id="admin-complete-goals-1"
          v-model="completeForm.goals1"
          :min="0"
          fluid
          @input="setCompleteGoal('goals1', $event)"
        />
      </FFormField>

      <FFormField
        class="admin-complete-game-dialog__field"
        input-id="admin-complete-goals-2"
        :label="t('v1.admin.table.title.goals.2')"
        label-color="--p-text-muted-color"
        label-variant="body-3-bold"
      >
        <InputNumber
          id="admin-complete-goals-2"
          v-model="completeForm.goals2"
          :min="0"
          fluid
          @input="setCompleteGoal('goals2', $event)"
        />
      </FFormField>

      <div class="admin-complete-game-dialog__actions">
        <Button
          :label="t('v1.cancel')"
          severity="secondary"
          text
          type="button"
          @click="adminStore.closeCompleteDialog"
        />
        <Button
          icon="pi pi-flag"
          :label="t('v1.admin.complete.game')"
          :disabled="!isCompleteFormValid || isSaving"
          :loading="isSaving"
          type="submit"
        />
      </div>
    </form>
  </Dialog>
</template>

<style scoped lang="scss">
.admin-complete-game-dialog {
  width: min(520px, calc(100vw - 32px));

  &__form {
    display: grid;
    gap: var(--f-space-md);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__actions {
    display: flex;
    grid-column: 1 / -1;
    justify-content: flex-end;
    gap: var(--f-space-xs);
  }
}

@media (width <= 760px) {
  .admin-complete-game-dialog {
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
