<script setup lang="ts">
import Button from 'primevue/button';
import Divider from 'primevue/divider';

import FPageNavigation from '@/components/FPageEmpty/FPageNavigation.vue';
import FPagePlayerSummary from '@/components/FPageEmpty/FPagePlayerSummary.vue';
import type { RouteName, RoutePath } from '@/enums';
import type { TranslationKey } from '@/i18n';

type NavigationItem = {
  icon: string;
  label: TranslationKey;
  name: (typeof RouteName)[keyof typeof RouteName];
  path: (typeof RoutePath)[keyof typeof RoutePath];
};

type Props = {
  currentPlayerName: string;
  currentPlayerPlace: number | string;
  navigationItems: NavigationItem[];
};

defineProps<Props>();

type Emits = {
  signOut: [];
};

defineEmits<Emits>();
</script>

<template>
  <aside
    class="f-page-sidebar"
    data-football-container="true"
    :aria-label="$t('v1.navigation')"
  >
    <FPagePlayerSummary
      :current-player-name="currentPlayerName"
      :current-player-place="currentPlayerPlace"
    />
    <Divider v-if="currentPlayerName" class="f-page-sidebar__player-divider" />

    <FPageNavigation :items="navigationItems" />

    <Button
      class="f-page-sidebar__sign-out"
      icon="pi pi-sign-out"
      :label="$t('v1.log.out')"
      severity="secondary"
      outlined
      @click="$emit('signOut')"
    />
  </aside>
</template>

<style scoped lang="scss">
.f-page-sidebar {
  position: sticky;
  top: var(--f-page-empty-topbar-height);
  display: flex;
  height: calc(100vh - var(--f-page-empty-topbar-height));
  flex-direction: column;
  grid-area: sidebar;
  gap: var(--f-space-md);
  overflow: hidden;
  padding: var(--f-space-xl);
  border-right: 1px solid var(--f-page-empty-border);
  background: var(--f-page-empty-sidebar-background);

  &__player-divider {
    margin-block: var(--f-space-2xs) var(--f-space-2xs);
  }

  &__sign-out {
    margin-top: auto;
  }
}

@media (width <= 920px) {
  .f-page-sidebar {
    display: none;
  }
}
</style>
