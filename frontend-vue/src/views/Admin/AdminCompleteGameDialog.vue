<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Button, Dialog, InputNumber } from 'primevue';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import { useAdminStore } from '@/stores/adminStore';

const { t } = useTranslations();
const adminStore = useAdminStore();
const { completeForm, isCompleteDialogVisible, isCompleteFormValid, isSaving } =
  storeToRefs(adminStore);
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
      <div class="admin-complete-game-dialog__field">
        <label for="admin-complete-goals-1">
          <FText
            as="span"
            color="--p-text-muted-color"
            variant="body-3-bold"
          >
            {{ t('v1.admin.table.title.goals.1') }}
          </FText>
        </label>
        <InputNumber
          id="admin-complete-goals-1"
          v-model="completeForm.goals1"
          :min="0"
          fluid
        />
      </div>

      <div class="admin-complete-game-dialog__field">
        <label for="admin-complete-goals-2">
          <FText
            as="span"
            color="--p-text-muted-color"
            variant="body-3-bold"
          >
            {{ t('v1.admin.table.title.goals.2') }}
          </FText>
        </label>
        <InputNumber
          id="admin-complete-goals-2"
          v-model="completeForm.goals2"
          :min="0"
          fluid
        />
      </div>

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
}

.admin-complete-game-dialog__form {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.admin-complete-game-dialog__field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.admin-complete-game-dialog__actions {
  display: flex;
  grid-column: 1 / -1;
  justify-content: flex-end;
  gap: 8px;
}

@media (width <= 760px) {
  .admin-complete-game-dialog__form {
    grid-template-columns: 1fr;
  }

  .admin-complete-game-dialog__actions {
    grid-column: auto;
    flex-direction: column-reverse;

    :deep(.p-button) {
      width: 100%;
    }
  }
}
</style>
