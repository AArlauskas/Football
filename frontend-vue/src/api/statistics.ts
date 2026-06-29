import { apiClient } from '@/api/client';
import type { ChampionshipStatistics } from '@/models';

export const getChampionshipStatistics = async () => {
  const response = await apiClient.get<ChampionshipStatistics>('/statistics');

  return response.data;
};
