import { apiClient } from '@/api/client';
import type {
  GameWithGuess,
  Guess,
  GuessPrototype,
  OngoingGame,
} from '@/models';

export const addGuess = async (guess: GuessPrototype) => {
  const response = await apiClient.post<Guess>('/guesses', guess);

  return response.data;
};

export const getGamesWithGuesses = async () => {
  const response = await apiClient.get<GameWithGuess[]>('/games/guessed', {
    params: { filter: 'upcoming-closed' },
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
