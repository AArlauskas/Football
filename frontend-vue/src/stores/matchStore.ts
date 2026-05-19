import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { getMatchResults } from '@/api';
import { StoreId } from '@/enums';
import type { Game, GuessWithUser } from '@/models';

export const useMatchStore = defineStore(StoreId.Match, () => {
  const game = ref<Game | null>(null);
  const guesses = ref<GuessWithUser[]>([]);
  const isLoading = ref(false);
  const requestError = ref('');

  const loadMatch = async (gameId: number) => {
    isLoading.value = true;
    requestError.value = '';

    try {
      const response = await getMatchResults(gameId);

      game.value = response.game;
      guesses.value = response.guess;
    } catch (error) {
      game.value = null;
      guesses.value = [];
      requestError.value = axios.isAxiosError(error)
        ? (error.response?.statusText ?? '')
        : '';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    game,
    guesses,
    isLoading,
    loadMatch,
    requestError,
  };
});
