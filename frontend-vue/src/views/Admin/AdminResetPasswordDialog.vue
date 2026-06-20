<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Button, Dialog, InputText, Select } from 'primevue';
import { computed } from 'vue';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import { useAdminStore } from '@/stores/adminStore';

const { t } = useTranslations();
const adminStore = useAdminStore();
const {
  isResetPasswordDialogVisible,
  isResetPasswordFormValid,
  isResettingPassword,
  resetPasswordResult,
  selectedUserEmail,
  users,
} = storeToRefs(adminStore);

const userOptions = computed(() =>
  users.value.map((user) => ({
    label: `${user.firstName} ${user.lastName} (${user.email})`,
    value: user.email,
  })),
);

const copyPassword = async () => {
  if (!resetPasswordResult.value) {
    return;
  }

  await navigator.clipboard.writeText(resetPasswordResult.value.password);
};
</script>

<template>
  <Dialog
    v-model:visible="isResetPasswordDialogVisible"
    modal
    :header="t('v1.admin.reset.password')"
    class="admin-reset-password-dialog"
  >
    <form
      class="admin-reset-password-dialog__form"
      @submit.prevent="adminStore.submitPasswordReset"
    >
      <div class="admin-reset-password-dialog__field">
        <label for="admin-reset-password-user">
          <FText as="span" color="--p-text-muted-color" variant="body-3-bold">
            {{ t('v1.admin.reset.password.select.user') }}
          </FText>
        </label>
        <Select
          id="admin-reset-password-user"
          v-model="selectedUserEmail"
          :disabled="isResettingPassword"
          filter
          fluid
          option-label="label"
          option-value="value"
          :options="userOptions"
          :placeholder="t('v1.admin.reset.password.select.user')"
        />
      </div>

      <div
        v-if="resetPasswordResult"
        class="admin-reset-password-dialog__field"
      >
        <label for="admin-reset-password-result">
          <FText as="span" color="--p-text-muted-color" variant="body-3-bold">
            {{ t('v1.admin.reset.password.generated') }}
          </FText>
        </label>
        <div class="admin-reset-password-dialog__password">
          <InputText
            id="admin-reset-password-result"
            :model-value="resetPasswordResult.password"
            readonly
            fluid
          />
          <Button
            icon="pi pi-copy"
            :label="t('v1.copy')"
            severity="secondary"
            type="button"
            @click="copyPassword"
          />
        </div>
        <FText as="span" color="--p-text-muted-color" variant="body-3">
          {{
            t('v1.admin.reset.password.generated.for', {
              email: resetPasswordResult.email,
            })
          }}
        </FText>
      </div>

      <div class="admin-reset-password-dialog__actions">
        <Button
          :label="t('v1.cancel')"
          severity="secondary"
          text
          type="button"
          @click="adminStore.closeResetPasswordDialog"
        />
        <Button
          icon="pi pi-key"
          :label="t('v1.admin.reset.password.submit')"
          :disabled="!isResetPasswordFormValid || isResettingPassword"
          :loading="isResettingPassword"
          type="submit"
        />
      </div>
    </form>
  </Dialog>
</template>

<style scoped lang="scss">
.admin-reset-password-dialog {
  width: min(560px, calc(100vw - 32px));
}

.admin-reset-password-dialog__form,
.admin-reset-password-dialog__field {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-reset-password-dialog__form {
  gap: 16px;
}

.admin-reset-password-dialog__password {
  display: grid;
  gap: 8px;
  grid-template-columns: minmax(0, 1fr) auto;
}

.admin-reset-password-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@media (width <= 760px) {
  .admin-reset-password-dialog__password {
    grid-template-columns: 1fr;
  }

  .admin-reset-password-dialog__actions {
    flex-direction: column-reverse;

    :deep(.p-button) {
      width: 100%;
    }
  }
}
</style>
