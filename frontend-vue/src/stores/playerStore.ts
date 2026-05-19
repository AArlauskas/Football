import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { getPlayer, getPlayerGames } from '@/api';
import { StoreId } from '@/enums';
import type { GameWithGuess, UserDetails } from '@/models';
import { GameState } from '@/models/game';

export const usePlayerStore = defineStore(StoreId.Player, () => {
  const games = ref<GameWithGuess[]>([]);
  const isLoading = ref(false);
  const player = ref<UserDetails | null>(null);
  const requestError = ref('');

  const closedGames = computed(() =>
    games.value.filter((item) => item.game.state !== GameState.OPEN),
  );
  const groupedGames = computed(() => {
    const groups = closedGames.value.reduce<Record<string, GameWithGuess[]>>(
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
        secondGroup.date.localeCompare(firstGroup.date),
      );
  });

  const loadPlayer = async (playerId: number) => {
    isLoading.value = true;
    requestError.value = '';

    try {
      const [playerResponse, gamesResponse] = await Promise.all([
        getPlayer(playerId),
        getPlayerGames(playerId),
      ]);

      player.value = playerResponse;
      games.value = gamesResponse;
    } catch (error) {
      requestError.value = axios.isAxiosError(error)
        ? (error.response?.statusText ?? '')
        : '';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    games,
    groupedGames,
    isLoading,
    loadPlayer,
    player,
    requestError,
  };
});
