import { apiClient } from '@/api/client';
import type { UserSummary } from '@/models';

export interface ResetPasswordResponse {
  email: string;
  password: string;
}

export const getAdminUsers = async () => {
  const response = await apiClient.get<UserSummary[]>('/users/list');

  return response.data;
};

export const resetUserPassword = async (email: string) => {
  const response = await apiClient.post<ResetPasswordResponse>(
    '/users/reset-password',
    { email },
  );

  return response.data;
};
