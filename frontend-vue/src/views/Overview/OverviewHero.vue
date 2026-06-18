<script setup lang="ts">
import { Card } from 'primevue';

import FText from '@/components/FText.vue';
import type { TranslationKey } from '@/i18n';
import OverviewSummaryCard from '@/views/Overview/OverviewSummaryCard.vue';

defineProps<{
  initials: string;
  name: string;
  summaryCards: Array<{
    icon: string;
    label: TranslationKey;
    value: number | string;
  }>;
}>();
</script>

<template>
  <Card class="overview-hero">
    <template #content>
      <section class="overview-hero__content">
        <div class="overview-hero__header">
          <div class="overview-hero__avatar" aria-hidden="true">
            {{ initials }}
          </div>

          <div class="overview-hero__copy">
            <FText as="h2" class="overview-hero__title" variant="heading-2">
              {{ name }}
            </FText>
          </div>
        </div>

        <div class="overview-hero__summary">
          <OverviewSummaryCard
            v-for="card in summaryCards"
            :key="card.label"
            :icon="card.icon"
            :label="card.label"
            :value="card.value"
          />
        </div>
      </section>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.overview-hero {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--p-primary-color) 18%, transparent);
}

.overview-hero :deep(.p-card-body) {
  padding: 14px 16px;
  background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--p-primary-color) 16%, transparent),
      transparent 34%
    ),
    var(--p-surface-card);
}

.overview-hero__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.overview-hero__header {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
}

.overview-hero__avatar {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--p-primary-color) 32%, transparent);
  border-radius: 14px;
  background: linear-gradient(
    135deg,
    var(--p-primary-500),
    var(--p-primary-700)
  );
  color: var(--p-primary-contrast-color);
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  box-shadow: 0 8px 18px
    color-mix(in srgb, var(--p-primary-color) 22%, transparent);
}

.overview-hero__copy {
  display: grid;
  min-width: 0;
}

.overview-hero__title {
  overflow-wrap: anywhere;
  font-size: clamp(1.35rem, 2vw, 1.75rem);
}

.overview-hero__summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: auto;
  justify-content: flex-end;
}

@media (width <= 640px) {
  .overview-hero__content {
    align-items: flex-start;
    flex-direction: column;
  }

  .overview-hero__avatar {
    width: 50px;
    height: 50px;
    border-radius: 16px;
    font-size: 1.05rem;
  }

  .overview-hero__summary {
    width: 100%;
    margin-left: 0;
    justify-content: flex-start;
  }
}
</style>
