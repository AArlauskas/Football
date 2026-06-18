<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import FPageDrawer from '@/components/FPageEmpty/FPageDrawer.vue';
import FPageSidebar from '@/components/FPageEmpty/FPageSidebar.vue';
import FPageTopbar from '@/components/FPageEmpty/FPageTopbar.vue';
import { useExperiment } from '@/composables/useExperiment';
import { useTheme } from '@/composables/useTheme';
import { useTranslations } from '@/composables/useTranslations';
import { Experiment, RouteName, RoutePath } from '@/enums';
import { setLocale, type AppLocale, type TranslationKey } from '@/i18n';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { isActive: isOverviewExperimentActive } = useExperiment(
  Experiment.Overview,
);
const { locale, t } = useTranslations();
const { isDark, toggleTheme } = useTheme();

const isDrawerVisible = ref(false);

const localeOptions: { label: string; value: AppLocale }[] = [
  { label: 'LT', value: 'lt-LT' },
  { label: 'EN', value: 'en-US' },
  { label: 'MK', value: 'mk-MK' },
];

const routeTitleMap: Partial<Record<string, TranslationKey>> = {
  [RouteName.Admin]: 'v1.admin',
  [RouteName.Games]: 'v1.games',
  [RouteName.Match]: 'v1.match',
  [RouteName.Overview]: 'v1.overview',
  [RouteName.Personal]: 'v1.personal',
  [RouteName.Player]: 'v1.player',
  [RouteName.Results]: 'v1.results',
  [RouteName.Rules]: 'v1.rules',
  [RouteName.Team]: 'v1.team',
  [RouteName.TeamsStatistics]: 'v1.teams.statistics',
};

const navigationItems = computed(() => [
  ...(isOverviewExperimentActive.value
    ? [
        {
          icon: 'pi pi-home',
          label: 'v1.overview' as TranslationKey,
          name: RouteName.Overview,
          path: RoutePath.Overview,
        },
      ]
    : []),
  {
    icon: 'pi pi-calendar',
    label: 'v1.games' as TranslationKey,
    name: RouteName.Games,
    path: RoutePath.Games,
  },
  {
    icon: 'pi pi-trophy',
    label: 'v1.results' as TranslationKey,
    name: RouteName.Results,
    path: RoutePath.Results,
  },
  {
    icon: 'pi pi-table',
    label: 'v1.teams.statistics' as TranslationKey,
    name: RouteName.TeamsStatistics,
    path: RoutePath.TeamsStatistics,
  },
  {
    icon: 'pi pi-user',
    label: 'v1.personal' as TranslationKey,
    name: RouteName.Personal,
    path: RoutePath.Personal,
  },
  {
    icon: 'pi pi-list-check',
    label: 'v1.rules' as TranslationKey,
    name: RouteName.Rules,
    path: RoutePath.Rules,
  },
  ...(authStore.isAdmin
    ? [
        {
          icon: 'pi pi-cog',
          label: 'v1.admin' as TranslationKey,
          name: RouteName.Admin,
          path: RoutePath.Admin,
        },
      ]
    : []),
]);

const currentTitle = computed(() => {
  const titleKey = routeTitleMap[String(route.name)];

  return titleKey ? t(titleKey) : '';
});

const currentPlayerName = computed(() => {
  if (!authStore.user) {
    return '';
  }

  return `${authStore.user.firstName} ${authStore.user.lastName}`;
});
const currentPlayerPlace = computed(() => authStore.user?.points.place ?? '-');
const currentPoints = computed(() => authStore.user?.points.total ?? '-');
const logoSrc = computed(() => {
  if (isDark.value) {
    return '/fifa-world-cup-2026-white.png';
  }

  return '/fifa-world-cup-2026.png';
});
const themeLabel = computed(() =>
  isDark.value ? t('v1.light.mode') : t('v1.dark.mode'),
);

const selectedLocale = computed({
  get: () => locale.value as AppLocale,
  set: (value: AppLocale) => {
    setLocale(value);
  },
});

const closeDrawer = () => {
  isDrawerVisible.value = false;
};

const handleSignOut = async () => {
  authStore.signOut();
  closeDrawer();
  await router.push(RoutePath.SignIn);
};

onMounted(() => {
  if (authStore.user) {
    authStore.startPersonalPointsPolling();
  }
});

onUnmounted(() => {
  authStore.stopPersonalPointsPolling();
});
</script>

<template>
  <main class="f-page-empty" :class="{ 'f-page-empty--dark': isDark }">
    <FPageTopbar
      v-model:selected-locale="selectedLocale"
      :current-player-place="currentPlayerPlace"
      :current-points="currentPoints"
      :current-title="currentTitle"
      :is-dark="isDark"
      :locale-options="localeOptions"
      :logo-src="logoSrc"
      :theme-label="themeLabel"
      @open-menu="isDrawerVisible = true"
      @toggle-theme="toggleTheme"
    />

    <div class="f-page-empty__body">
      <slot />
    </div>

    <FPageSidebar
      :current-player-name="currentPlayerName"
      :current-player-place="currentPlayerPlace"
      :navigation-items="navigationItems"
      @sign-out="handleSignOut"
    />

    <FPageDrawer
      v-model:selected-locale="selectedLocale"
      v-model:visible="isDrawerVisible"
      :current-player-name="currentPlayerName"
      :current-player-place="currentPlayerPlace"
      :is-dark="isDark"
      :locale-options="localeOptions"
      :navigation-items="navigationItems"
      :theme-label="themeLabel"
      @close="closeDrawer"
      @sign-out="handleSignOut"
      @toggle-theme="toggleTheme"
    />
  </main>
</template>

<style scoped lang="scss">
.f-page-empty {
  --f-page-empty-background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--p-primary-400) 24%, transparent),
      transparent 34rem
    ),
    var(--p-surface-100);
  --f-page-empty-border: var(--p-surface-200);
  --f-page-empty-content-width: 1280px;
  --f-page-empty-logo-height: 36px;
  --f-page-empty-nav-active-background: color-mix(
    in srgb,
    var(--p-primary-100) 92%,
    transparent
  );
  --f-page-empty-nav-active-color: var(--p-primary-700);
  --f-page-empty-panel-background: color-mix(
    in srgb,
    var(--p-surface-0) 82%,
    transparent
  );
  --f-page-empty-sidebar-background: color-mix(
    in srgb,
    var(--p-surface-0) 74%,
    transparent
  );
  --f-page-empty-sidebar-width: 280px;
  --f-page-empty-topbar-height: 64px;

  display: grid;
  min-height: 100vh;
  grid-template-areas:
    'topbar topbar'
    'sidebar content';
  grid-template-columns: var(--f-page-empty-sidebar-width) minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr);
  background: var(--f-page-empty-background);
  color: var(--p-text-color);
}

.f-page-empty--dark {
  --f-page-empty-background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--p-primary-color) 30%, transparent),
      transparent 34rem
    ),
    var(--p-surface-950);
  --f-page-empty-border: var(--p-surface-800);
  --f-page-empty-nav-active-background: color-mix(
    in srgb,
    var(--p-primary-500) 22%,
    transparent
  );
  --f-page-empty-nav-active-color: var(--p-primary-200);
  --f-page-empty-panel-background: color-mix(
    in srgb,
    var(--p-surface-900) 82%,
    transparent
  );
  --f-page-empty-sidebar-background: color-mix(
    in srgb,
    var(--p-surface-900) 74%,
    transparent
  );
}

.f-page-empty__body {
  grid-area: content;
  width: min(100%, var(--f-page-empty-content-width));
  min-width: 0;
  padding: 48px 24px;
  margin: 0 auto;
  box-sizing: border-box;
}

@media (width <= 920px) {
  .f-page-empty {
    --f-page-empty-logo-height: 28px;
    --f-page-empty-sidebar-width: 0px;
    --f-page-empty-topbar-height: 56px;

    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  .f-page-empty__body {
    width: 100%;
    padding: 24px 16px;
  }
}
</style>
