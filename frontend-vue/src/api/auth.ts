import { apiClient } from '@/api/client';
import type { LoginDetails, UserDetails, UserPrototype } from '@/models';

export const login = async (loginDetails: LoginDetails) => {
  const response = await apiClient.post<UserDetails>(
    '/auth/login',
    loginDetails,
  );

  return response.data;
};

export const register = async (userPrototype: UserPrototype) => {
  const response = await apiClient.post<UserDetails>(
    '/auth/register',
    userPrototype,
  );

  return response.data;
};
