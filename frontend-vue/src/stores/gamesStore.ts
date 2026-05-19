import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { addGuess, getGamesWithGuesses } from '@/api';
import { StoreId } from '@/enums';
import type { TranslationKey } from '@/i18n';
import type { GameResult, GameWithGuess } from '@/models';

const groupGames = (games: GameWithGuess[]) => {
  const groups = games.reduce<Record<string, GameWithGuess[]>>(
    (accumulator, item) => {
      accumulator[item.game.date] ??= [];
      accumulator[item.game.date].push(item);

      return accumulator;
    },
    {},
  );

  return Object.entries(groups)
    .map(([date, items]) => ({
      date,
      items: [...items].sort((firstItem, secondItem) =>
        firstItem.game.time.localeCompare(secondItem.game.time),
      ),
    }))
    .sort((firstGroup, secondGroup) =>
      firstGroup.date.localeCompare(secondGroup.date),
    );
};

export const useGamesStore = defineStore(StoreId.Games, () => {
  const games = ref<GameWithGuess[]>([]);
  const isLoading = ref(false);
  const isSavingGuess = ref(false);
  const requestError = ref('');
  const successMessageKey = ref<TranslationKey | ''>('');

  const groups = computed(() => groupGames(games.value));

  const loadGames = async () => {
    isLoading.value = true;
    requestError.value = '';
    successMessageKey.value = '';

    try {
      games.value = await getGamesWithGuesses();
    } catch (error) {
      games.value = [];
      requestError.value = axios.isAxiosError(error)
        ? (error.response?.statusText ?? '')
        : '';
    } finally {
      isLoading.value = false;
    }
  };

  const saveGuess = async (gameId: number, result: GameResult) => {
    isSavingGuess.value = true;
    requestError.value = '';
    successMessageKey.value = '';

    try {
      const guess = await addGuess({ gameId, result });
      const game = games.value.find((item) => item.game.id === gameId);

      if (game) {
        game.guess = guess;
      }

      successMessageKey.value = 'v1.sucessful.guess.submit';
    } catch (error) {
      requestError.value = axios.isAxiosError(error)
        ? (error.response?.statusText ?? '')
        : '';

      throw error;
    } finally {
      isSavingGuess.value = false;
    }
  };

  return {
    games,
    groups,
    isLoading,
    isSavingGuess,
    loadGames,
    requestError,
    saveGuess,
    successMessageKey,
  };
});
