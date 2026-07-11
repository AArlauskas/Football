<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Button, Card, DatePicker, InputText, Select } from 'primevue';
import { computed } from 'vue';

import FFormField from '@/components/FFormField.vue';
import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import { translateTeamName } from '@/lib/teamName';
import { useAdminStore } from '@/stores/adminStore';

const { t } = useTranslations();
const adminStore = useAdminStore();
const { createForm, isCreateFormValid, isLoading, isSaving, teams } =
  storeToRefs(adminStore);

const teamOptions = computed(() =>
  teams.value.map((team) => ({
    label: translateTeamName(team, t),
    value: team.code,
  })),
);
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
        <FFormField
          class="admin-create-game-form__field"
          input-id="admin-create-date"
          :label="t('v1.admin.table.title.date')"
          label-color="--p-text-muted-color"
          label-variant="body-3-bold"
        >
          <DatePicker
            id="admin-create-date"
            v-model="createForm.date"
            date-format="yy-mm-dd"
            fluid
            show-icon
          />
        </FFormField>

        <FFormField
          class="admin-create-game-form__field"
          input-id="admin-create-time"
          :label="t('v1.admin.table.title.time')"
          label-color="--p-text-muted-color"
          label-variant="body-3-bold"
        >
          <InputText
            id="admin-create-time"
            v-model="createForm.time"
            fluid
            type="time"
          />
        </FFormField>

        <FFormField
          class="admin-create-game-form__field"
          input-id="admin-create-team-1"
          :label="t('v1.admin.table.title.team.1')"
          label-color="--p-text-muted-color"
          label-variant="body-3-bold"
        >
          <Select
            id="admin-create-team-1"
            v-model="createForm.t1"
            :options="teamOptions"
            filter
            option-label="label"
            option-value="value"
            fluid
          />
        </FFormField>

        <FFormField
          class="admin-create-game-form__field"
          input-id="admin-create-team-2"
          :label="t('v1.admin.table.title.team.2')"
          label-color="--p-text-muted-color"
          label-variant="body-3-bold"
        >
          <Select
            id="admin-create-team-2"
            v-model="createForm.t2"
            :options="teamOptions"
            filter
            option-label="label"
            option-value="value"
            fluid
          />
        </FFormField>

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
  gap: var(--f-space-md);
  grid-template-columns: repeat(4, minmax(0, 1fr)) auto;

  &__submit {
    white-space: nowrap;
  }
}

@media (width <= 1040px) {
  .admin-create-game-form {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    &__submit {
      grid-column: 1 / -1;
    }
  }
}

@media (width <= 760px) {
  .admin-create-game-form {
    grid-template-columns: 1fr;
  }
}
</style>
