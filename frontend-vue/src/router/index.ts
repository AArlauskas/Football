import { computed } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { useExperiment } from '@/composables/useExperiment';
import { Experiment, RouteName, RoutePath } from '@/enums';
import { isRegistrationOpen } from '@/lib/registration';
import { isStatisticsDatePassed } from '@/lib/statistics';
import { useAuthStore } from '@/stores/authStore';

const {
  isActive: isStatisticsExperimentActive,
  setActive: setStatisticsExperimentActive,
} = useExperiment(Experiment.Statistics);

const isStatisticsAvailable = computed(
  () => isStatisticsDatePassed() || isStatisticsExperimentActive.value,
);

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: RoutePath.Root,
      redirect: RoutePath.Overview,
    },
    {
      path: RoutePath.Home,
      redirect: RoutePath.Overview,
    },
    {
      component: () => import('@/views/Overview/Overview.vue'),
      meta: { requiresAuth: true },
      name: RouteName.Overview,
      path: RoutePath.Overview,
    },
    {
      component: () => import('@/views/Rules/Rules.vue'),
      meta: { requiresAuth: true },
      name: RouteName.Rules,
      path: RoutePath.Rules,
    },
    {
      component: () => import('@/views/Games/Games.vue'),
      meta: { requiresAuth: true },
      name: RouteName.Games,
      path: RoutePath.Games,
    },
    {
      component: () => import('@/views/Match/Match.vue'),
      meta: { requiresAuth: true },
      name: RouteName.Match,
      path: RoutePath.Match,
    },
    {
      path: '/personal',
      redirect: () => {
        const userId = useAuthStore().user?.id;

        return userId
          ? { name: RouteName.Player, params: { userId } }
          : RoutePath.SignIn;
      },
    },
    {
      component: () => import('@/views/Player/Player.vue'),
      meta: { requiresAuth: true },
      name: RouteName.Player,
      path: RoutePath.Player,
    },
    {
      component: () => import('@/views/Team/Team.vue'),
      meta: { requiresAuth: true },
      name: RouteName.Team,
      path: RoutePath.Team,
    },
    {
      component: () => import('@/views/TeamsStatistics/TeamsStatistics.vue'),
      meta: { requiresAuth: true },
      name: RouteName.TeamsStatistics,
      path: RoutePath.TeamsStatistics,
    },
    {
      component: () => import('@/views/Statistics/Statistics.vue'),
      meta: { requiresAuth: true, requiresStatisticsAvailable: true },
      name: RouteName.Statistics,
      path: RoutePath.Statistics,
    },
    {
      component: () => import('@/views/Results/Results.vue'),
      meta: { requiresAuth: true },
      name: RouteName.Results,
      path: RoutePath.Results,
    },
    {
      component: () => import('@/views/Admin/Admin.vue'),
      meta: { requiresAdmin: true, requiresAuth: true },
      name: RouteName.Admin,
      path: RoutePath.Admin,
    },
    {
      component: () => import('@/views/SignIn/SignIn.vue'),
      meta: { requiresGuest: true },
      name: RouteName.SignIn,
      path: RoutePath.SignIn,
    },
    {
      component: () => import('@/views/Register/Register.vue'),
      meta: { requiresGuest: true, requiresRegistrationOpen: true },
      name: RouteName.Register,
      path: RoutePath.Register,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: RoutePath.Root,
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const isLoggedIn = Boolean(authStore.user);

  if (to.meta.requiresAuth && !isLoggedIn) {
    return RoutePath.SignIn;
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return RoutePath.Root;
  }

  if (to.meta.requiresGuest && isLoggedIn) {
    return RoutePath.Root;
  }

  if (to.meta.requiresRegistrationOpen && !isRegistrationOpen()) {
    return RoutePath.SignIn;
  }

  if (to.meta.requiresStatisticsAvailable) {
    if (to.query.activate === 'true') {
      setStatisticsExperimentActive(true);
    }

    if (!isStatisticsAvailable.value) {
      return RoutePath.Root;
    }
  }
});
