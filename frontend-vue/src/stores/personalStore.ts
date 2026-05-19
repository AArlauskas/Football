import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { addGuess, getPersonalGames, getPersonalUser } from '@/api';
import { StoreId } from '@/enums';
import type { TranslationKey } from '@/i18n';
import type { GameResult, GameWithGuess, UserDetails } from '@/models';
import { GameState } from '@/models/game';

const groupGames = (games: GameWithGuess[], direction: 'asc' | 'desc') => {
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
      direction === 'asc'
        ? firstGroup.date.localeCompare(secondGroup.date)
        : secondGroup.date.localeCompare(firstGroup.date),
    );
};

export const usePersonalStore = defineStore(StoreId.Personal, () => {
  const games = ref<GameWithGuess[]>([]);
  const isLoading = ref(false);
  const isSavingGuess = ref(false);
  const player = ref<UserDetails | null>(null);
  const requestError = ref('');
  const successMessageKey = ref<TranslationKey | ''>('');

  const openGroups = computed(() =>
    groupGames(
      games.value.filter((item) => item.game.state === GameState.OPEN),
      'asc',
    ),
  );
  const previousGroups = computed(() =>
    groupGames(
      games.value.filter((item) => item.game.state !== GameState.OPEN),
      'desc',
    ),
  );

  const loadPersonal = async () => {
    isLoading.value = true;
    requestError.value = '';
    successMessageKey.value = '';

    try {
      const [playerResponse, gamesResponse] = await Promise.all([
        getPersonalUser(),
        getPersonalGames(),
      ]);

      player.value = playerResponse;
      games.value = gamesResponse;
    } catch (error) {
      player.value = null;
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
    isLoading,
    isSavingGuess,
    loadPersonal,
    openGroups,
    player,
    previousGroups,
    requestError,
    saveGuess,
    successMessageKey,
  };
});
