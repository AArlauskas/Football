import { apiClient } from '@/api/client';
import type { GameWithGuess, OngoingGame } from '@/models';

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

export const getOngoingGames = async () => {
  const response = await apiClient.get<OngoingGame[]>('/games/ongoing');

  return response.data;
};
