<script setup lang="ts">
import { Button } from 'primevue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import { RouteName } from '@/enums';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const { t } = useTranslations();

const message = computed(() =>
  t('v1.games.championship.finished', {
    place: authStore.user?.points.place ?? '-',
    points: authStore.user?.points.total ?? '-',
  }),
);

const openStatistics = async () => {
  await router.push({ name: RouteName.Statistics });
};
</script>

<template>
  <section class="f-championship-summary" role="status">
    <div class="f-championship-summary__icon" aria-hidden="true">
      <i class="pi pi-trophy" />
    </div>

    <div class="f-championship-summary__content">
      <FText as="h2" variant="heading-3">
        {{ t('v1.games.championship.finished.title') }}
      </FText>
      <FText as="p" color="--p-text-muted-color" variant="body-2">
        {{ message }}
      </FText>
    </div>

    <div class="f-championship-summary__action">
      <Button
        icon="pi pi-chart-bar"
        :label="t('v1.statistics')"
        size="small"
        @click="openStatistics"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.f-championship-summary {
  display: grid;
  width: 100%;
  align-items: center;
  padding: var(--f-space-lg);
  border: 1px solid color-mix(in srgb, var(--p-primary-color) 24%, transparent);
  border-radius: var(--f-radius-lg);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--p-primary-color) 10%, var(--p-surface-card)),
    var(--p-surface-card)
  );
  box-shadow: var(--f-card-shadow);
  gap: var(--f-space-md);
  grid-template-columns: auto minmax(0, 1fr) auto;

  &__icon {
    display: grid;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--p-primary-color);
    color: var(--p-primary-contrast-color);
    font-size: 1.25rem;
    place-items: center;
  }

  &__content {
    display: grid;
    min-width: 0;
    gap: var(--f-space-2xs);
  }

  &__action {
    justify-self: end;
  }
}

@media (width <= 640px) {
  .f-championship-summary {
    align-items: start;
    padding: var(--f-space-md);
    grid-template-columns: auto minmax(0, 1fr);

    &__action {
      width: 100%;
      grid-column: 1 / -1;

      :deep(.p-button) {
        width: 100%;
      }
    }
  }
}
</style>
