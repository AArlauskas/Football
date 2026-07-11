<script setup lang="ts">
import { useSwipe } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { SelectButton } from 'primevue';
import { computed, onMounted, ref, watch } from 'vue';

import FPageFeedback from '@/components/FPageFeedback.vue';
import { useOngoingMatchesPolling } from '@/composables/useOngoingMatchesPolling';
import { usePageTitle } from '@/composables/usePageTitle';
import { useToast } from '@/composables/useToast';
import { useTranslations } from '@/composables/useTranslations';
import type { GameResult } from '@/models';
import { useAuthStore } from '@/stores/authStore';
import { usePersonalStore } from '@/stores/personalStore';
import PersonalOpenMatches from '@/views/Personal/PersonalOpenMatches.vue';
import PlayerLoadingState from '@/views/Player/PlayerLoadingState.vue';
import PlayerMatchHistory from '@/views/Player/PlayerMatchHistory.vue';
import PlayerProfileCard from '@/views/Player/PlayerProfileCard.vue';

const PersonalTab = {
  History: 'history',
  Open: 'open',
} as const;

type PersonalTabValue = (typeof PersonalTab)[keyof typeof PersonalTab];

const authStore = useAuthStore();
const personalStore = usePersonalStore();
const toast = useToast();
const { t } = useTranslations();
const {
  isLoading,
  isSavingGuess,
  openGroups,
  player,
  previousGroups,
  requestError,
  successMessageKey,
} = storeToRefs(personalStore);

const activeTab = ref<PersonalTabValue>(PersonalTab.Open);
const pageTitle = computed(() => t('v1.personal'));

const tabOptions = computed(() => [
  {
    label: t('v1.upcoming.games'),
    value: PersonalTab.Open,
  },
  {
    label: t('v1.player.match.history'),
    value: PersonalTab.History,
  },
]);
const tabContentRef = ref<HTMLElement | null>(null);

const handleSaveGuess = async (gameId: number, result: GameResult) => {
  await personalStore.saveGuess(gameId, result);
};

useSwipe(tabContentRef, {
  onSwipeEnd: (_event, direction) => {
    if (direction === 'left' && activeTab.value === PersonalTab.Open) {
      activeTab.value = PersonalTab.History;
    }

    if (direction === 'right' && activeTab.value === PersonalTab.History) {
      activeTab.value = PersonalTab.Open;
    }
  },
  threshold: 50,
});

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
  void personalStore.loadPersonal();
});

usePageTitle(pageTitle);
useOngoingMatchesPolling();
</script>

<template>
  <main class="personal">
    <FPageFeedback :error="requestError" />

    <template v-if="isLoading">
      <PlayerLoadingState />
    </template>

    <template v-else-if="player || authStore.user">
      <PlayerProfileCard :player="player ?? authStore.user!" />
      <section class="personal__matches">
        <SelectButton
          v-model="activeTab"
          :allow-empty="false"
          class="personal__section-switcher"
          option-label="label"
          option-value="value"
          :options="tabOptions"
        />

        <div ref="tabContentRef" class="personal__section-content">
          <PersonalOpenMatches
            v-if="activeTab === PersonalTab.Open"
            :groups="openGroups"
            hide-title
            :is-saving="isSavingGuess"
            @save-guess="handleSaveGuess"
          />
          <PlayerMatchHistory v-else :groups="previousGroups" hide-title />
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped lang="scss">
.personal {
  display: flex;
  width: min(100%, var(--f-page-empty-content-width, 1280px));
  flex-direction: column;
  gap: var(--f-space-md);
  margin: 0 auto;

  &__matches {
    display: grid;
    gap: var(--f-space-md);
  }

  &__section-switcher {
    width: fit-content;
  }
}

@media (width <= 760px) {
  .personal {
    &__section-switcher {
      width: 100%;
    }
  }
}
</style>
