<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

import FPageFeedback from '@/components/FPageFeedback.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { useTranslations } from '@/composables/useTranslations';
import { useAdminStore } from '@/stores/adminStore';
import AdminCompleteGameDialog from '@/views/Admin/AdminCompleteGameDialog.vue';
import AdminCreateGameForm from '@/views/Admin/AdminCreateGameForm.vue';
import AdminEditGameDialog from '@/views/Admin/AdminEditGameDialog.vue';
import AdminGamesPanel from '@/views/Admin/AdminGamesPanel.vue';

const { t } = useTranslations();
const adminStore = useAdminStore();
const { requestError, successMessageKey } = storeToRefs(adminStore);

const pageTitle = computed(() => t('v1.admin'));
const successMessage = computed(() =>
  successMessageKey.value ? t(successMessageKey.value) : '',
);

onMounted(() => {
  void adminStore.loadAdminData();
});

usePageTitle(pageTitle);
</script>

<template>
  <main class="admin-page">
    <FPageFeedback :error="requestError" :success="successMessage" />

    <AdminCreateGameForm />
    <AdminGamesPanel />
    <AdminEditGameDialog />
    <AdminCompleteGameDialog />
  </main>
</template>

<style scoped lang="scss">
.admin-page {
  display: flex;
  width: min(100%, var(--f-page-empty-content-width, 1280px));
  flex-direction: column;
  gap: 16px;
  margin: 0 auto;
}
</style>
