import { apiClient } from '@/api/client';
import type { Game, TeamsStatistics } from '@/models/game';

export const getTeamsStatistics = async () => {
  const response = await apiClient.get<TeamsStatistics[]>('/teams/statistics');

  return response.data;
};

export const getTeamGames = async (teamId: string) => {
  const response = await apiClient.get<Game[]>('/teams/games', {
    params: { code: teamId },
  });

  return response.data;
};
