import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { getTeamGames, getTeams } from '@/api';
import { StoreId } from '@/enums';
import type { Game, Team } from '@/models';

export const useTeamStore = defineStore(StoreId.Team, () => {
  const games = ref<Game[]>([]);
  const isLoading = ref(false);
  const requestError = ref('');
  const team = ref<Team | null>(null);

  const groupedGames = computed(() => {
    const groups = games.value.reduce<Record<string, Game[]>>(
      (accumulator, item) => {
        accumulator[item.date] ??= [];
        accumulator[item.date].push(item);

        return accumulator;
      },
      {},
    );

    return Object.entries(groups)
      .map(([date, items]) => ({
        date,
        items: [...items].sort((firstItem, secondItem) =>
          firstItem.time.localeCompare(secondItem.time),
        ),
      }))
      .sort((firstGroup, secondGroup) =>
        secondGroup.date.localeCompare(firstGroup.date),
      );
  });

  const loadTeam = async (teamId: string) => {
    isLoading.value = true;
    requestError.value = '';

    try {
      const [teamsResponse, gamesResponse] = await Promise.all([
        getTeams(),
        getTeamGames(teamId),
      ]);

      const gameTeam = gamesResponse[0]
        ? [gamesResponse[0].t1, gamesResponse[0].t2].find(
            (item) => item.code === teamId,
          )
        : null;

      team.value =
        teamsResponse.find((item) => item.code === teamId) ?? gameTeam ?? null;
      games.value = gamesResponse;
    } catch (error) {
      team.value = null;
      games.value = [];
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
    loadTeam,
    requestError,
    team,
  };
});
