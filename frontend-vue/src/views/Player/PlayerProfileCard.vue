<script setup lang="ts">
import { Card, Tag } from 'primevue';
import { computed } from 'vue';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';
import type { UserDetails } from '@/models';

const props = defineProps<{
  player: UserDetails;
}>();

const { t } = useTranslations();

const statCards = computed<
  Array<{
    icon: string;
    label: TranslationKey;
    value: number | string;
  }>
>(() => [
  {
    icon: 'pi pi-chart-line',
    label: 'v1.points',
    value: props.player.points.total,
  },
  {
    icon: 'pi pi-trophy',
    label: 'v1.place',
    value: props.player.points.place ?? '-',
  },
  {
    icon: 'pi pi-check-circle',
    label: 'v1.correct.guesses',
    value: props.player.points.correctGuesses,
  },
  {
    icon: 'pi pi-bullseye',
    label: 'v1.correct.outcomes',
    value: props.player.points.correctOutcomes,
  },
  {
    icon: 'pi pi-times-circle',
    label: 'v1.incorrect',
    value: props.player.points.incorrect,
  },
  {
    icon: 'pi pi-minus-circle',
    label: 'v1.not.given.guess',
    value: props.player.points.notGiven,
  },
]);
</script>

<template>
  <Card>
    <template #content>
      <section class="player-profile-card">
        <div>
          <Tag severity="success" :value="t('v1.player')" />
          <FText class="player-profile-card__name" as="h2" variant="heading-2">
            {{ player.firstName }} {{ player.lastName }}
          </FText>
        </div>

        <div class="player-profile-card__stats">
          <div
            v-for="stat in statCards"
            :key="stat.label"
            class="player-profile-card__stat"
          >
            <i :class="stat.icon" />
            <FText as="span" color="--p-text-muted-color" variant="body-3">
              {{ t(stat.label) }}
            </FText>
            <FText as="span" variant="heading-3">{{ stat.value }}</FText>
          </div>
        </div>
      </section>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.player-profile-card {
  display: grid;
  gap: 24px;
}

.player-profile-card__name {
  margin-top: 8px;
}

.player-profile-card__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.player-profile-card__stat {
  display: grid;
  min-width: 0;
  gap: 6px;
  padding: 12px;
  border-radius: var(--p-content-border-radius);
  background: var(--p-content-hover-background);

  i {
    color: var(--p-text-muted-color);
  }
}

@media (width <= 760px) {
  .player-profile-card__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
