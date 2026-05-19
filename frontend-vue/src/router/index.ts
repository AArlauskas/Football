import { createRouter, createWebHistory } from 'vue-router';

import { RouteName, RoutePath } from '@/enums';
import { useAuthStore } from '@/stores/authStore';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: RoutePath.Root,
      redirect: RoutePath.Games,
    },
    {
      path: RoutePath.Home,
      redirect: RoutePath.Games,
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
      component: () => import('@/views/Personal/Personal.vue'),
      meta: { requiresAuth: true },
      name: RouteName.Personal,
      path: RoutePath.Personal,
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
      meta: { requiresGuest: true },
      name: RouteName.Register,
      path: RoutePath.Register,
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
});
