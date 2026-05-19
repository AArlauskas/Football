import { apiClient } from '@/api/client';
import type { UserDetails } from '@/models';

export const getResults = async () => {
  const response = await apiClient.get<UserDetails[]>('/points/totals');

  return response.data;
};
