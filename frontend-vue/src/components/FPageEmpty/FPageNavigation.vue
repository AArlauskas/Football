<script setup lang="ts">
import { RouterLink } from 'vue-router';

import FText from '@/components/FText.vue';
import type { RouteName, RoutePath } from '@/enums';
import type { TranslationKey } from '@/i18n';

type NavigationItem = {
  icon: string;
  label: TranslationKey;
  name: (typeof RouteName)[keyof typeof RouteName];
  path: (typeof RoutePath)[keyof typeof RoutePath];
};

defineProps<{
  items: NavigationItem[];
}>();

defineEmits<{
  navigate: [];
}>();
</script>

<template>
  <nav class="f-page-navigation">
    <RouterLink
      v-for="item in items"
      :key="item.name"
      class="f-page-navigation__link"
      exact-active-class="f-page-navigation__link--active"
      :to="item.path"
      @click="$emit('navigate')"
    >
      <i :class="item.icon" />
      <FText as="span" color="currentColor" variant="body-2-bold">
        {{ $t(item.label) }}
      </FText>
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.f-page-navigation {
  display: flex;
  flex-direction: column;
  gap: var(--f-space-sm);

  &__link {
    display: flex;
    align-items: center;
    gap: var(--f-space-md);
    padding: var(--f-space-sm);
    border-radius: var(--f-radius-md);
    color: var(--p-text-muted-color);
    text-decoration: none;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      transform 0.2s ease;

    &:hover,
    &--active {
      background: var(--f-page-empty-nav-active-background);
      color: var(--f-page-empty-nav-active-color);
      transform: translateX(2px);
    }
  }
}
</style>
