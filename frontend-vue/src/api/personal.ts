import { apiClient } from '@/api/client';
import type {
  GameWithGuess,
  Guess,
  GuessPrototype,
  UserDetails,
} from '@/models';

export const getPersonalUser = async () => {
  const response = await apiClient.get<UserDetails>('/users');

  return response.data;
};

export const getPersonalGames = async () => {
  const response = await apiClient.get<GameWithGuess[]>('/games/guessed', {
    params: { filter: 'all' },
  });

  return response.data;
};

export const addGuess = async (guess: GuessPrototype) => {
  const response = await apiClient.post<Guess>('/guesses', guess);

  return response.data;
};
