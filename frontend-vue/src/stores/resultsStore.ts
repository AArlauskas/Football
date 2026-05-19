import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { getResults } from '@/api';
import { StoreId } from '@/enums';
import type { UserDetails } from '@/models';

type ResultItem = UserDetails[];

export const useResultsStore = defineStore(StoreId.Results, () => {
  const isLoading = ref(false);
  const requestError = ref('');
  const results = ref<ResultItem>([]);

  const loadResults = async () => {
    isLoading.value = true;
    requestError.value = '';

    try {
      results.value = await getResults();
    } catch (error) {
      requestError.value = axios.isAxiosError(error)
        ? (error.response?.statusText ?? '')
        : '';

      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    loadResults,
    requestError,
    results,
  };
});
