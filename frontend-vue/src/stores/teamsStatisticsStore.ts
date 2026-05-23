import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { getTeamsStatistics } from '@/api';
import { StoreId } from '@/enums';
import type { TeamsStatistics } from '@/models';

export const useTeamsStatisticsStore = defineStore(
  StoreId.TeamsStatistics,
  () => {
    const isLoading = ref(false);
    const requestError = ref('');
    const statistics = ref<TeamsStatistics[]>([]);

    const sortedStatistics = computed(() =>
      [...statistics.value].sort((firstItem, secondItem) => {
        const firstGamesPlayed =
          firstItem.won + firstItem.lost + firstItem.ties;
        const secondGamesPlayed =
          secondItem.won + secondItem.lost + secondItem.ties;

        return (
          secondItem.won - firstItem.won ||
          firstItem.lost - secondItem.lost ||
          secondItem.ties - firstItem.ties ||
          secondGamesPlayed - firstGamesPlayed ||
          firstItem.team.name.localeCompare(secondItem.team.name)
        );
      }),
    );

    const loadStatistics = async () => {
      isLoading.value = true;
      requestError.value = '';

      try {
        statistics.value = await getTeamsStatistics();
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
      sortedStatistics,
      statistics,
    };
  },
);
