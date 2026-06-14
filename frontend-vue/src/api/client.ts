import axios from 'axios';

import { RoutePath, StorePersistentKey } from '@/enums';

const getBaseUrl = () => {
  return '/api';
};

const AUTH_FAILURE_STATUSES = new Set([401, 403, 503]);

const handleAuthFailure = () => {
  window.localStorage.removeItem(StorePersistentKey.Auth);

  if (window.location.pathname !== RoutePath.SignIn) {
    window.location.assign(RoutePath.SignIn);
  }
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status &&
      AUTH_FAILURE_STATUSES.has(error.response.status)
    ) {
      handleAuthFailure();
    }

    return Promise.reject(error);
  },
);
