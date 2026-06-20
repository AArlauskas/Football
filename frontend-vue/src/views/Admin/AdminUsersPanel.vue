<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Button, Card } from 'primevue';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import { useAdminStore } from '@/stores/adminStore';

const { t } = useTranslations();
const adminStore = useAdminStore();
const { isLoading, users } = storeToRefs(adminStore);
</script>

<template>
  <Card>
    <template #title>
      <FText as="h2" variant="heading-3">
        {{ t('v1.admin.manage.users') }}
      </FText>
    </template>
    <template #content>
      <div class="admin-users-panel">
        <FText as="p" color="--p-text-muted-color" variant="body-2">
          {{ t('v1.admin.reset.password.description') }}
        </FText>
        <Button
          icon="pi pi-key"
          :label="t('v1.admin.reset.password')"
          :disabled="isLoading || users.length === 0"
          @click="adminStore.openResetPasswordDialog"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.admin-users-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

@media (width <= 760px) {
  .admin-users-panel {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
