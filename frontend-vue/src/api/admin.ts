import { apiClient } from '@/api/client';
import type { Game, GamePrototype, Team } from '@/models';

export const getAdminGames = async () => {
  const response = await apiClient.get<Game[]>('/games', {
    params: { filter: 'all' },
  });

  return response.data;
};

export const getTeams = async () => {
  const response = await apiClient.get<Team[]>('/teams');

  return response.data;
};

export const addGame = async (game: GamePrototype) => {
  const response = await apiClient.post<Game>('/games', game);

  return response.data;
};

export const updateGame = async (game: GamePrototype) => {
  const response = await apiClient.put<Game>('/games', game);

  return response.data;
};
