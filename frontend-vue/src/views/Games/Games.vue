<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Card, Skeleton } from 'primevue';
import { computed, onMounted, watch } from 'vue';

import FEmptyMessage from '@/components/FEmptyMessage.vue';
import FPageFeedback from '@/components/FPageFeedback.vue';
import FText from '@/components/FText.vue';
import { useOngoingMatchesPolling } from '@/composables/useOngoingMatchesPolling';
import { usePageTitle } from '@/composables/usePageTitle';
import { useToast } from '@/composables/useToast';
import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';
import type { GameResult } from '@/models';
import { useGamesStore } from '@/stores/gamesStore';
import GamesGameCard from '@/views/Games/GamesGameCard.vue';

const gamesStore = useGamesStore();
const toast = useToast();
const { t } = useTranslations();
const { groups, isLoading, isSavingGuess, requestError, successMessageKey } =
  storeToRefs(gamesStore);

const pageTitle = computed(() => t('v1.games'));

const handleSaveGuess = async (gameId: number, result: GameResult) => {
  await gamesStore.saveGuess(gameId, result);
};

const getDateAtStartOfDay = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  return normalizedDate;
};

const getMondayWeekStart = (date: Date) => {
  const weekStart = getDateAtStartOfDay(date);
  const daysFromMonday = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - daysFromMonday);

  return weekStart;
};

const isSameDay = (firstDate: Date, secondDate: Date) =>
  firstDate.getTime() === secondDate.getTime();

const getCalendarLabel = (date: string): TranslationKey | '' => {
  const groupDate = getDateAtStartOfDay(new Date(`${date}T00:00:00`));
  const today = getDateAtStartOfDay(new Date());
  const tomorrow = getDateAtStartOfDay(today);
  tomorrow.setDate(today.getDate() + 1);

  if (isSameDay(groupDate, today)) {
    return 'v1.calendar.today';
  }

  if (isSameDay(groupDate, tomorrow)) {
    return 'v1.calendar.tomorrow';
  }

  const weekStart = getMondayWeekStart(today);
  const nextWeekStart = new Date(weekStart);
  nextWeekStart.setDate(weekStart.getDate() + 7);

  if (groupDate >= weekStart && groupDate < nextWeekStart) {
    return 'v1.calendar.this.week';
  }

  return '';
};

const getCalendarLabelText = (date: string) => {
  const label = getCalendarLabel(date);

  return label ? t(label) : '';
};

watch(successMessageKey, (messageKey) => {
  if (!messageKey) {
    return;
  }

  toast.success({
    summary: t('v1.confirm'),
    detail: t(messageKey),
  });
});

onMounted(() => {
  void gamesStore.loadGames();
});

usePageTitle(pageTitle);
useOngoingMatchesPolling();
</script>

<template>
  <main class="games-page">
    <FPageFeedback :error="requestError" />

    <template v-if="isLoading">
      <section class="games-page__loading">
        <Skeleton height="2rem" width="12rem" />
        <div class="games-page__grid">
          <Skeleton v-for="item in 8" :key="item" height="18rem" />
        </div>
      </section>
    </template>

    <template v-else>
      <div v-if="groups.length" class="games-page__groups">
        <section
          v-for="group in groups"
          :key="group.date"
          class="games-page__group"
        >
          <Card>
            <template #title>
              <div class="games-page__group-title">
                <FText
                  v-if="getCalendarLabel(group.date)"
                  as="span"
                  color="--p-primary-color"
                  variant="body-3-bold"
                >
                  {{ getCalendarLabelText(group.date) }}
                </FText>
                <FText as="span" variant="body-1-bold">
                  {{ group.date }}
                </FText>
              </div>
            </template>
            <template #content>
              <div class="games-page__grid">
                <GamesGameCard
                  v-for="item in group.items"
                  :key="item.game.id"
                  :is-saving="isSavingGuess"
                  :item="item"
                  @save-guess="handleSaveGuess"
                />
              </div>
            </template>
          </Card>
        </section>
      </div>

      <FEmptyMessage v-else message="v1.personal.no.upcoming.matches" />
    </template>
  </main>
</template>

<style scoped lang="scss">
.games-page {
  display: flex;
  width: min(100%, var(--f-page-empty-content-width, 1280px));
  flex-direction: column;
  gap: 16px;
  margin: 0 auto;
}

.games-page__loading,
.games-page__groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.games-page__group {
  min-width: 0;
}

.games-page__group-title {
  display: grid;
  gap: 2px;
}

.games-page__grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
}

@media (width <= 960px) {
  .games-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (width <= 620px) {
  .games-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
