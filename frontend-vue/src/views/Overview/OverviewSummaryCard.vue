<script setup lang="ts">
import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';

type Props = {
  icon: string;
  label: TranslationKey;
  value: number | string;
};

defineProps<Props>();

const { t } = useTranslations();
</script>

<template>
  <div class="overview-summary-card">
    <span class="overview-summary-card__icon">
      <i :class="icon" />
    </span>
    <FText as="span" color="--p-text-muted-color" variant="body-3">
      {{ t(label) }}
    </FText>
    <FText as="span" variant="body-2-bold">
      {{ value }}
    </FText>
  </div>
</template>

<style scoped lang="scss">
.overview-summary-card {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: var(--f-space-xs);
  padding: var(--f-space-2xs) var(--f-space-xs);
  border: 1px solid color-mix(in srgb, var(--p-text-color) 10%, transparent);
  border-radius: var(--f-radius-full);
  background: color-mix(in srgb, var(--p-surface-card) 82%, transparent);
  white-space: nowrap;

  &__icon {
    display: inline-grid;
    width: 18px;
    height: 18px;
    place-items: center;
    border-radius: 50%;
    background: color-mix(in srgb, var(--p-primary-color) 12%, transparent);
    color: var(--p-primary-color);

    i {
      font-size: 0.65rem;
    }
  }
}
</style>
