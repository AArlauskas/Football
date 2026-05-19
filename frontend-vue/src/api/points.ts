import { apiClient } from '@/api/client';
import type { Points } from '@/models';

export const getPersonalPoints = async () => {
  const response = await apiClient.get<Points>('/points');

  return response.data;
};
