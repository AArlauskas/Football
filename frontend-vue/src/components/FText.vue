<script setup lang="ts">
import { computed } from 'vue';

import type { FTextElement, FTextVariant } from '@/types';

export type FTextProps = {
  as: FTextElement;
  clickable?: boolean;
  color?: string;
  variant: FTextVariant;
};

const props = withDefaults(defineProps<FTextProps>(), {
  clickable: false,
  color: undefined,
});

const textColor = computed(() => {
  if (!props.color) {
    return undefined;
  }

  return props.color.startsWith('--') ? `var(${props.color})` : props.color;
});
</script>

<template>
  <Component
    :is="as"
    class="f-text"
    :class="[
      `f-text--${variant}`,
      {
        'f-text--clickable': clickable,
      },
    ]"
    :style="{ color: textColor }"
  >
    <slot />
  </Component>
</template>

<style scoped lang="scss">
.f-text {
  margin: 0;
  color: var(--p-text-color);
  font-family: inherit;

  &--heading-1 {
    font-size: clamp(2.25rem, 6vw, 5rem);
    font-weight: 800;
    line-height: 0.95;
  }

  &--heading-2 {
    font-size: 1.75rem;
    font-weight: 800;
    line-height: 1.15;
  }

  &--heading-3 {
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1.2;
  }

  &--body-1,
  &--body-1-bold {
    font-size: 1.125rem;
    line-height: 1.5;
  }

  &--body-2,
  &--body-2-bold {
    font-size: 1rem;
    line-height: 1.5;
  }

  &--body-3,
  &--body-3-bold {
    font-size: 0.85rem;
    line-height: 1.35;
  }

  &--body-1-bold,
  &--body-2-bold,
  &--body-3-bold {
    font-weight: 700;
  }

  &--clickable {
    cursor: pointer;
    text-decoration: none;
    transition:
      color 0.2s,
      text-decoration-color 0.2s;

    &:hover,
    &:focus-visible {
      color: var(--p-primary-hover-color);
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 3px;
    }
  }
}
</style>
