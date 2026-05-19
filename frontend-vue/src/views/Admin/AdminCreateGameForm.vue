<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Button, Card, DatePicker, InputText, Select } from 'primevue';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import { useAdminStore } from '@/stores/adminStore';

const { t } = useTranslations();
const adminStore = useAdminStore();
const { createForm, isCreateFormValid, isLoading, isSaving, teamOptions } =
  storeToRefs(adminStore);
</script>

<template>
  <Card>
    <template #title>
      <FText as="h2" variant="heading-3">
        {{ t('v1.admin.add.game') }}
      </FText>
    </template>
    <template #content>
      <form
        class="admin-create-game-form"
        @submit.prevent="adminStore.createGame"
      >
        <div class="admin-create-game-form__field">
          <label for="admin-create-date">
            <FText
              as="span"
              color="--p-text-muted-color"
              variant="body-3-bold"
            >
              {{ t('v1.admin.table.title.date') }}
            </FText>
          </label>
          <DatePicker
            id="admin-create-date"
            v-model="createForm.date"
            date-format="yy-mm-dd"
            fluid
            show-icon
          />
        </div>

        <div class="admin-create-game-form__field">
          <label for="admin-create-time">
            <FText
              as="span"
              color="--p-text-muted-color"
              variant="body-3-bold"
            >
              {{ t('v1.admin.table.title.time') }}
            </FText>
          </label>
          <InputText
            id="admin-create-time"
            v-model="createForm.time"
            fluid
            type="time"
          />
        </div>

        <div class="admin-create-game-form__field">
          <label for="admin-create-team-1">
            <FText
              as="span"
              color="--p-text-muted-color"
              variant="body-3-bold"
            >
              {{ t('v1.admin.table.title.team.1') }}
            </FText>
          </label>
          <Select
            id="admin-create-team-1"
            v-model="createForm.t1"
            :options="teamOptions"
            filter
            option-label="label"
            option-value="value"
            fluid
          />
        </div>

        <div class="admin-create-game-form__field">
          <label for="admin-create-team-2">
            <FText
              as="span"
              color="--p-text-muted-color"
              variant="body-3-bold"
            >
              {{ t('v1.admin.table.title.team.2') }}
            </FText>
          </label>
          <Select
            id="admin-create-team-2"
            v-model="createForm.t2"
            :options="teamOptions"
            filter
            option-label="label"
            option-value="value"
            fluid
          />
        </div>

        <Button
          class="admin-create-game-form__submit"
          icon="pi pi-plus"
          :label="t('v1.admin.add.game')"
          :disabled="!isCreateFormValid || isLoading || isSaving"
          :loading="isSaving"
          type="submit"
        />
      </form>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.admin-create-game-form {
  display: grid;
  align-items: end;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
}

.admin-create-game-form__field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.admin-create-game-form__submit {
  white-space: nowrap;
}

@media (width <= 1040px) {
  .admin-create-game-form {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .admin-create-game-form__submit {
    grid-column: 1 / -1;
  }
}

@media (width <= 760px) {
  .admin-create-game-form {
    grid-template-columns: 1fr;
  }
}
</style>
