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
  selectPlayer: [player: UserDetails];
}>();

const { t } = useTranslations();

const getFullName = (player: UserDetails) =>
  `${player.firstName} ${player.lastName}`;
</script>

<template>
  <Card>
    <template #title>
      <div class="overview-nearby-leaderboard__title">
        <FText as="span" variant="body-1-bold">
          {{ t('v1.overview.around.you') }}
        </FText>
      </div>
    </template>
    <template #content>
      <ol v-if="players.length" class="overview-nearby-leaderboard">
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
.overview-nearby-leaderboard__title {
  display: grid;
  gap: 2px;
}

.overview-nearby-leaderboard {
  display: grid;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.overview-nearby-leaderboard__row {
  display: grid;
  min-width: 0;
  align-items: center;
  gap: 10px;
  grid-template-columns: auto minmax(0, 1fr);
  padding: 10px;
  border-radius: 14px;
  background: var(--p-content-hover-background);
}

.overview-nearby-leaderboard__row--current {
  background: var(--f-current-background);
}

.overview-nearby-leaderboard__place {
  width: 36px;
  height: 36px;
  font-weight: 700;
}

.overview-nearby-leaderboard__details {
  display: grid;
  min-width: 0;
  align-items: center;
  gap: 10px;
  grid-template-columns: minmax(0, 1fr) auto;
}

.overview-nearby-leaderboard__player-button {
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

.overview-nearby-leaderboard__stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

@media (width <= 640px) {
  .overview-nearby-leaderboard__row {
    align-items: flex-start;
    gap: 10px;
  }

  .overview-nearby-leaderboard__player-button {
    width: 100%;
    justify-content: flex-start;
    align-self: center;
  }

  .overview-nearby-leaderboard__place {
    width: 34px;
    height: 34px;
  }

  .overview-nearby-leaderboard__details {
    display: contents;
  }

  .overview-nearby-leaderboard__stats {
    grid-column: 1 / -1;
    width: 100%;
    justify-content: flex-start;
    gap: 8px;
  }
}
</style>
