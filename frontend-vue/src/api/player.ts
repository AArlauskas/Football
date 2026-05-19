import { apiClient } from '@/api/client';
import type { GameWithGuess, UserDetails } from '@/models';

export const getPlayer = async (userId: number) => {
  const response = await apiClient.get<UserDetails>('/users', {
    params: { user: userId },
  });

  return response.data;
};

export const getPlayerGames = async (userId: number) => {
  const response = await apiClient.get<GameWithGuess[]>('/games/guessed', {
    params: { filter: 'all', user: userId },
  });

  return response.data;
};
