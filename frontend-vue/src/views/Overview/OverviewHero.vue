<script setup lang="ts">
import { Card } from 'primevue';

import FText from '@/components/FText.vue';
import type { TranslationKey } from '@/i18n';
import OverviewSummaryCard from '@/views/Overview/OverviewSummaryCard.vue';

type Props = {
  initials: string;
  name: string;
  summaryCards: Array<{
    icon: string;
    label: TranslationKey;
    value: number | string;
  }>;
};

defineProps<Props>();
</script>

<template>
  <Card class="overview-hero">
    <template #content>
      <section class="overview-hero__content">
        <div class="overview-hero__header">
          <div class="overview-hero__avatar" aria-hidden="true">
            <FText
              as="span"
              color="--p-primary-contrast-color"
              variant="body-2-bold"
            >
              {{ initials }}
            </FText>
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

  :deep(.p-card-body) {
    background:
      radial-gradient(
        circle at top left,
        color-mix(in srgb, var(--p-primary-color) 16%, transparent),
        transparent 34%
      ),
      var(--p-surface-card);
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--f-space-md);
  }

  &__header {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: var(--f-space-md);
  }

  &__avatar {
    display: grid;
    width: 46px;
    height: 46px;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid
      color-mix(in srgb, var(--p-primary-color) 32%, transparent);
    border-radius: var(--f-radius-md);
    background: linear-gradient(
      135deg,
      var(--p-primary-500),
      var(--p-primary-700)
    );
    color: var(--p-primary-contrast-color);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    box-shadow: 0 8px 18px
      color-mix(in srgb, var(--p-primary-color) 22%, transparent);
  }

  &__copy {
    display: grid;
    min-width: 0;
  }

  &__title {
    overflow-wrap: anywhere;
  }

  &__summary {
    display: flex;
    flex-wrap: wrap;
    gap: var(--f-space-xs);
    margin-left: auto;
    justify-content: flex-end;
  }
}

@media (width <= 640px) {
  .overview-hero {
    &__content {
      align-items: flex-start;
      flex-direction: column;
    }

    &__avatar {
      width: 50px;
      height: 50px;
      border-radius: var(--f-radius-lg);
    }

    &__summary {
      width: 100%;
      margin-left: 0;
      justify-content: flex-start;
    }
  }
}
</style>
