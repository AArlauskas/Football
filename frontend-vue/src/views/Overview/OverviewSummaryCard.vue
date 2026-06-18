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
    <FText as="span" variant="heading-3">
      {{ value }}
    </FText>
  </div>
</template>

<style scoped lang="scss">
.overview-summary-card {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: 6px;
  padding: 5px 9px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 10%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--p-surface-card) 82%, transparent);
  white-space: nowrap;
}

.overview-summary-card__icon {
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

.overview-summary-card :deep(.f-text--heading-3) {
  font-size: 1rem;
  line-height: 1;
}
</style>
