import { apiClient } from '@/api/client';
import type { Game } from '@/models';

export const getTeamGames = async (teamId: string) => {
  const response = await apiClient.get<Game[]>('/teams/games', {
    params: { code: teamId },
  });

  return response.data;
};
