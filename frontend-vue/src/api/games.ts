import { apiClient } from '@/api/client';
import type { GameWithGuess } from '@/models';

export const getGamesWithGuesses = async () => {
  const response = await apiClient.get<GameWithGuess[]>('/games/guessed', {
    params: { filter: 'today' },
  });

  return response.data;
};

export const getOverviewGamesWithGuesses = async () => {
  const response = await apiClient.get<GameWithGuess[]>('/games/guessed', {
    params: { filter: 'overview' },
  });

  return response.data;
};
