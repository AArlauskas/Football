import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { getPersonalPoints, login, register } from '@/api';
import { StoreId, StorePersistentKey } from '@/enums';
import type { LoginDetails, UserDetails, UserPrototype } from '@/models';

const PERSONAL_POINTS_POLL_INTERVAL_MS = 15_000;

export const useAuthStore = defineStore(
  StoreId.Auth,
  () => {
    const isSubmitting = ref(false);
    const user = ref<UserDetails | null>(null);
    const requestStatus = ref<number | null>(null);
    let isRefreshingPoints = false;
    let pointsPollingInterval:
      | ReturnType<typeof window.setInterval>
      | undefined;

    const isAdmin = computed(
      () => user.value?.roles.includes('admin') ?? false,
    );

    const clearRequestStatus = () => {
      requestStatus.value = null;
    };

    const refreshPersonalPoints = async () => {
      if (!user.value || isRefreshingPoints) {
        return;
      }

      isRefreshingPoints = true;

      try {
        const points = await getPersonalPoints();

        if (user.value) {
          user.value.points = points;
        }
      } catch {
      } finally {
        isRefreshingPoints = false;
      }
    };

    const stopPersonalPointsPolling = () => {
      if (pointsPollingInterval === undefined) {
        return;
      }

      window.clearInterval(pointsPollingInterval);
      pointsPollingInterval = undefined;
    };

    const startPersonalPointsPolling = () => {
      if (!user.value) {
        return;
      }

      stopPersonalPointsPolling();
      void refreshPersonalPoints();
      pointsPollingInterval = window.setInterval(() => {
        void refreshPersonalPoints();
      }, PERSONAL_POINTS_POLL_INTERVAL_MS);
    };

    const signIn = async (loginDetails: LoginDetails) => {
      isSubmitting.value = true;
      clearRequestStatus();

      try {
        user.value = await login(loginDetails);
      } catch (error) {
        requestStatus.value = axios.isAxiosError(error)
          ? (error.response?.status ?? null)
          : null;

        throw error;
      } finally {
        isSubmitting.value = false;
      }
    };

    const signUp = async (userPrototype: UserPrototype) => {
      isSubmitting.value = true;
      clearRequestStatus();

      try {
        await register(userPrototype);
      } catch (error) {
        requestStatus.value = axios.isAxiosError(error)
          ? (error.response?.status ?? null)
          : null;

        throw error;
      } finally {
        isSubmitting.value = false;
      }
    };

    const signOut = () => {
      stopPersonalPointsPolling();
      user.value = null;
      clearRequestStatus();
    };

    return {
      clearRequestStatus,
      isAdmin,
      isSubmitting,
      requestStatus,
      refreshPersonalPoints,
      signIn,
      signOut,
      signUp,
      startPersonalPointsPolling,
      stopPersonalPointsPolling,
      user,
    };
  },
  {
    persist: { key: StorePersistentKey.Auth },
  },
);
