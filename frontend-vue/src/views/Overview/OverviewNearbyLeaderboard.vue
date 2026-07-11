<script setup lang="ts">
import { Button, Card, Tag } from 'primevue';

import FEmptyMessage from '@/components/FEmptyMessage.vue';
import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import type { UserDetails } from '@/models';
import OverviewSummaryCard from '@/views/Overview/OverviewSummaryCard.vue';

defineProps<{
  currentUserId?: number;
  players: UserDetails[];
}>();

const emit = defineEmits<{
  openResults: [];
  selectPlayer: [player: UserDetails];
}>();

const { t } = useTranslations();

const getFullName = (player: UserDetails) =>
  `${player.firstName} ${player.lastName}`;
</script>

<template>
  <Card class="overview-nearby-leaderboard">
    <template #title>
      <div class="overview-nearby-leaderboard__title">
        <FText
          as="span"
          class="overview-nearby-leaderboard__title-label"
          variant="body-1-bold"
        >
          {{ t('v1.overview.around.you') }}
        </FText>
        <Button
          class="overview-nearby-leaderboard__results-button"
          icon="pi pi-trophy"
          :aria-label="t('v1.results')"
          severity="secondary"
          size="small"
          @click="emit('openResults')"
        />
      </div>
    </template>
    <template #content>
      <ol v-if="players.length" class="overview-nearby-leaderboard__list">
        <li
          v-for="player in players"
          :key="player.id"
          class="overview-nearby-leaderboard__row"
          :class="{
            'overview-nearby-leaderboard__row--current':
              player.id === currentUserId,
          }"
        >
          <Tag
            class="overview-nearby-leaderboard__place"
            rounded
            :value="player.points.place"
          />

          <div class="overview-nearby-leaderboard__details">
            <Button
              class="overview-nearby-leaderboard__player-button"
              link
              @click="emit('selectPlayer', player)"
            >
              <FText as="span" clickable variant="body-2-bold">
                {{ getFullName(player) }}
              </FText>
            </Button>

            <div class="overview-nearby-leaderboard__stats">
              <OverviewSummaryCard
                icon="pi pi-chart-line"
                label="v1.points"
                :value="player.points.total"
              />
              <OverviewSummaryCard
                icon="pi pi-check-circle"
                label="v1.overview.correct.short"
                :value="player.points.correctGuesses"
              />
            </div>
          </div>
        </li>
      </ol>

      <FEmptyMessage v-else message="v1.overview.no.leaderboard" />
    </template>
  </Card>
</template>

<style scoped lang="scss">
.overview-nearby-leaderboard {
  &__title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--f-space-md);
  }

  &__title-label {
    min-width: 0;
    flex: 1 1 10rem;
  }

  &__results-button.p-button {
    flex: 0 0 auto;
    margin-inline-start: auto;
  }

  &__list {
    display: grid;
    gap: var(--f-space-xs);
    padding: 0;
    margin: 0;
    list-style: none;
  }

  &__row {
    display: grid;
    min-width: 0;
    align-items: center;
    gap: var(--f-space-sm);
    grid-template-columns: auto minmax(0, 1fr);
    padding: var(--f-space-sm);
    border-radius: var(--f-radius-md);
    background: var(--p-content-hover-background);

    &--current {
      background: var(--f-current-background);
    }
  }

  &__place {
    width: 36px;
    height: 36px;
    font-weight: 700;
  }

  &__details {
    display: grid;
    min-width: 0;
    align-items: center;
    gap: var(--f-space-sm);
    grid-template-columns: minmax(0, 1fr) auto;
  }

  &__player-button {
    justify-self: start;
    min-width: 0;
    max-width: 100%;
    padding: 0;
    color: var(--p-text-color);
    text-align: left;

    :deep(.p-button-label) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--f-space-sm);
  }
}

@media (width <= 640px) {
  .overview-nearby-leaderboard {
    &__row {
      align-items: flex-start;
      gap: var(--f-space-sm);
    }

    &__player-button {
      width: 100%;
      justify-content: flex-start;
      align-self: center;
    }

    &__place {
      width: 34px;
      height: 34px;
    }

    &__details {
      display: contents;
    }

    &__stats {
      grid-column: 1 / -1;
      width: 100%;
      justify-content: flex-start;
      gap: var(--f-space-xs);
    }
  }
}
</style>
