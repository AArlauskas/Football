<script setup lang="ts">
import { Card, Tag } from 'primevue';
import { computed } from 'vue';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';
import type { UserDetails } from '@/models';

type Props = {
  player: UserDetails;
};

const props = defineProps<Props>();

const { t } = useTranslations();

const playerInitials = computed(
  () =>
    `${props.player.firstName.at(0) ?? ''}${props.player.lastName.at(0) ?? ''}`,
);

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
  <Card class="player-profile-card">
    <template #content>
      <section class="player-profile-card__content">
        <div class="player-profile-card__header">
          <div class="player-profile-card__avatar" aria-hidden="true">
            <FText
              as="span"
              color="--p-primary-contrast-color"
              variant="body-1-bold"
            >
              {{ playerInitials }}
            </FText>
          </div>

          <div class="player-profile-card__details">
            <Tag
              class="player-profile-card__tag"
              severity="success"
              :value="t('v1.player')"
            />
            <FText
              class="player-profile-card__name"
              as="h2"
              variant="heading-2"
            >
              {{ player.firstName }} {{ player.lastName }}
            </FText>
          </div>
        </div>

        <section
          class="player-profile-card__stats"
          :aria-label="t('v1.player')"
        >
          <div
            v-for="stat in statCards"
            :key="stat.label"
            class="player-profile-card__stat"
          >
            <div class="player-profile-card__stat-header">
              <span class="player-profile-card__stat-icon">
                <i :class="stat.icon" />
              </span>
              <FText
                as="span"
                class="player-profile-card__stat-label"
                color="--p-text-muted-color"
                variant="body-3"
              >
                {{ t(stat.label) }}
              </FText>
            </div>
            <FText
              as="span"
              class="player-profile-card__stat-value"
              variant="heading-3"
            >
              {{ stat.value }}
            </FText>
          </div>
        </section>
      </section>
    </template>
  </Card>
</template>

<style scoped lang="scss">
:deep(.player-profile-card.p-card) {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--p-primary-color) 18%, transparent);
  background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--p-primary-color) 16%, transparent),
      transparent 34%
    ),
    var(--p-surface-card);
  box-shadow: var(--f-card-shadow);
}

.player-profile-card {
  &__content {
    display: grid;
    align-items: center;
    gap: var(--f-space-lg);
    grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.5fr);
  }

  &__header {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: var(--f-space-sm);
  }

  &__avatar {
    display: grid;
    width: 58px;
    height: 58px;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid
      color-mix(in srgb, var(--p-primary-color) 32%, transparent);
    border-radius: var(--f-radius-xl);
    background: linear-gradient(
      135deg,
      var(--p-primary-500),
      var(--p-primary-700)
    );
    color: var(--p-primary-contrast-color);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    box-shadow: 0 12px 28px
      color-mix(in srgb, var(--p-primary-color) 26%, transparent);
  }

  &__details {
    min-width: 0;
  }

  &__tag {
    width: fit-content;
  }

  &__name {
    margin-top: var(--f-space-xs);
    overflow-wrap: anywhere;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(120px, 1fr));
    gap: var(--f-space-sm);
  }

  &__stat {
    display: grid;
    min-width: 0;
    gap: var(--f-space-sm);
    padding: var(--f-space-md);
    border: 1px solid color-mix(in srgb, var(--p-text-color) 10%, transparent);
    border-radius: var(--f-radius-md);
    background: color-mix(in srgb, var(--p-surface-card) 82%, transparent);
    box-shadow: 0 10px 24px
      color-mix(in srgb, var(--p-text-color) 6%, transparent);
  }

  &__stat-header {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: var(--f-space-xs);
  }

  &__stat-icon {
    display: inline-grid;
    width: 22px;
    height: 22px;
    flex: 0 0 auto;
    place-items: center;
    border-radius: var(--f-radius-xs);
    background: color-mix(in srgb, var(--p-primary-color) 12%, transparent);
    color: var(--p-primary-color);

    i {
      font-size: 0.75rem;
    }
  }

  &__stat-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

@media (width <= 1040px) {
  .player-profile-card__content {
    grid-template-columns: 1fr;
  }
}

@media (width <= 760px) {
  .player-profile-card {
    &__header {
      align-items: center;
    }

    &__avatar {
      width: 50px;
      height: 50px;
      border-radius: var(--f-radius-lg);
    }

    &__name {
      white-space: normal;
    }

    &__stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}
</style>
