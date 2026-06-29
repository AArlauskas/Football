import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { getOngoingGames } from '@/api';
import { StoreId } from '@/enums';
import type { OngoingGame } from '@/models';

const ONGOING_MATCHES_POLL_INTERVAL_MS = 30_000;

export const useOngoingMatchesStore = defineStore(
  StoreId.OngoingMatches,
  () => {
    const ongoingGames = ref<OngoingGame[]>([]);
    const isLoading = ref(false);
    const requestError = ref('');
    let isRefreshing = false;
    let pollingInterval: ReturnType<typeof window.setInterval> | undefined;

    const ongoingGamesById = computed(() =>
      ongoingGames.value.reduce<Record<number, OngoingGame>>(
        (accumulator, item) => {
          accumulator[item.game.id] = item;

          return accumulator;
        },
        {},
      ),
    );

    const loadOngoingGames = async () => {
      if (isRefreshing) {
        return;
      }

      isRefreshing = true;
      isLoading.value = true;
      requestError.value = '';

      try {
        ongoingGames.value = await getOngoingGames();
      } catch (error) {
        ongoingGames.value = [];
        requestError.value = axios.isAxiosError(error)
          ? (error.response?.statusText ?? '')
          : '';
      } finally {
        isRefreshing = false;
        isLoading.value = false;
      }
    };

    const getOngoingGame = (gameId: number) => ongoingGamesById.value[gameId];

    const stopPolling = () => {
      if (pollingInterval === undefined) {
        return;
      }

      window.clearInterval(pollingInterval);
      pollingInterval = undefined;
    };

    const startPolling = () => {
      stopPolling();
      void loadOngoingGames();
      pollingInterval = window.setInterval(() => {
        void loadOngoingGames();
      }, ONGOING_MATCHES_POLL_INTERVAL_MS);
    };

    return {
      getOngoingGame,
      isLoading,
      loadOngoingGames,
      ongoingGames,
      requestError,
      startPolling,
      stopPolling,
    };
  },
);
