<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Card } from 'primevue';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import FPageFeedback from '@/components/FPageFeedback.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { useTranslations } from '@/composables/useTranslations';
import { RouteName } from '@/enums';
import { useAuthStore } from '@/stores/authStore';
import { useResultsStore } from '@/stores/resultsStore';
import ResultsTable from '@/views/Results/ResultsTable.vue';
import ResultsTableSkeleton from '@/views/Results/ResultsTableSkeleton.vue';

const authStore = useAuthStore();
const resultsStore = useResultsStore();
const router = useRouter();
const { t } = useTranslations();
const { isLoading, requestError, results } = storeToRefs(resultsStore);

const pageTitle = computed(() => t('v1.results'));

const handlePlayerSelect = async (id: number) => {
  if (id === authStore.user?.id) {
    await router.push({ name: RouteName.Personal });

    return;
  }

  await router.push({ name: RouteName.Player, params: { userId: id } });
};

onMounted(() => {
  void resultsStore.loadResults();
});

usePageTitle(pageTitle);
</script>

<template>
  <main class="results-page">
    <FPageFeedback :error="requestError" />

    <Card>
      <template #content>
        <ResultsTableSkeleton v-if="isLoading" />
        <ResultsTable
          v-else
          :current-user-id="authStore.user?.id"
          :results="results"
          @select-player="handlePlayerSelect"
        />
      </template>
    </Card>
  </main>
</template>

<style scoped lang="scss">
.results-page {
  display: flex;
  width: min(100%, var(--f-page-empty-content-width, 1280px));
  flex-direction: column;
  gap: 16px;
  margin: 0 auto;
}
</style>
