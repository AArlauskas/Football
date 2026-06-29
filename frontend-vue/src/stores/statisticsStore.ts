import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { getChampionshipStatistics } from '@/api';
import { StoreId } from '@/enums';
import type { ChampionshipStatistics } from '@/models';

export const useStatisticsStore = defineStore(StoreId.Statistics, () => {
  const isLoading = ref(false);
  const requestError = ref('');
  const statistics = ref<ChampionshipStatistics | null>(null);

  const loadStatistics = async () => {
    isLoading.value = true;
    requestError.value = '';

    try {
      statistics.value = await getChampionshipStatistics();
    } catch (error) {
      requestError.value = axios.isAxiosError(error)
        ? (error.response?.statusText ?? '')
        : '';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    loadStatistics,
    requestError,
    statistics,
  };
});
