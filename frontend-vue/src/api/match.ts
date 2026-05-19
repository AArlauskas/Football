import { apiClient } from '@/api/client';
import type { GameResults } from '@/models';

export const getMatchResults = async (gameId: number) => {
  const response = await apiClient.get<GameResults>('/games/results', {
    params: { game: gameId },
  });

  return response.data;
};
