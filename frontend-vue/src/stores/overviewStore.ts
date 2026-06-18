import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { getOverviewGamesWithGuesses, getResults } from '@/api';
import { StoreId } from '@/enums';
import type { GameWithGuess, UserDetails } from '@/models';

export const useOverviewStore = defineStore(StoreId.Overview, () => {
  const games = ref<GameWithGuess[]>([]);
  const isLoading = ref(false);
  const requestError = ref('');
  const results = ref<UserDetails[]>([]);

  const loadOverview = async () => {
    isLoading.value = true;
    requestError.value = '';

    try {
      const [loadedResults, loadedGames] = await Promise.all([
        getResults(),
        getOverviewGamesWithGuesses(),
      ]);

      games.value = loadedGames;
      results.value = loadedResults;
    } catch (error) {
      games.value = [];
      results.value = [];
      requestError.value = axios.isAxiosError(error)
        ? (error.response?.statusText ?? '')
        : '';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    games,
    isLoading,
    loadOverview,
    requestError,
    results,
  };
});
