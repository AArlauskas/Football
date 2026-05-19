<script setup lang="ts">
import { Card, Tag } from 'primevue';
import { computed } from 'vue';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import { teamFlags } from '@/constants/teamFlags';
import type { TranslationKey } from '@/i18n';
import type { Team } from '@/models';

const props = defineProps<{
  stats: {
    gamesPlayed: number;
    losses: number;
    ties: number;
    victories: number;
  };
  team: Team;
}>();

const { t } = useTranslations();

const flagUrl = computed(() => teamFlags[props.team.code]);
const statCards = computed<
  Array<{
    icon: string;
    label: TranslationKey;
    value: number;
  }>
>(() => [
  {
    icon: 'pi pi-list-check',
    label: 'v1.team.games.played',
    value: props.stats.gamesPlayed,
  },
  {
    icon: 'pi pi-trophy',
    label: 'v1.team.victories',
    value: props.stats.victories,
  },
  {
    icon: 'pi pi-minus-circle',
    label: 'v1.team.ties',
    value: props.stats.ties,
  },
  {
    icon: 'pi pi-times-circle',
    label: 'v1.team.losses',
    value: props.stats.losses,
  },
]);
</script>

<template>
  <Card>
    <template #content>
      <section class="team-profile-card">
        <div class="team-profile-card__header">
          <img
            v-if="flagUrl"
            class="team-profile-card__flag"
            :alt="team.name"
            :src="flagUrl"
          />
          <div v-else class="team-profile-card__flag-fallback">
            <FText as="span" variant="body-2-bold">{{ team.code }}</FText>
          </div>

          <div>
            <Tag severity="success" :value="t('v1.team')" />
            <FText class="team-profile-card__name" as="h2" variant="heading-2">
              {{ team.name }}
            </FText>
          </div>
        </div>

        <section
          class="team-profile-card__stats"
          :aria-label="t('v1.team.stats')"
        >
          <div
            v-for="stat in statCards"
            :key="stat.label"
            class="team-profile-card__stat"
          >
            <i :class="stat.icon" />
            <FText as="span" color="--p-text-muted-color" variant="body-3">
              {{ t(stat.label) }}
            </FText>
            <FText as="span" variant="heading-3">{{ stat.value }}</FText>
          </div>
        </section>
      </section>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.team-profile-card {
  display: grid;
  gap: 24px;
}

.team-profile-card__header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.team-profile-card__flag,
.team-profile-card__flag-fallback {
  width: 64px;
  height: 64px;
  flex: 0 0 auto;
}

.team-profile-card__flag {
  object-fit: contain;
}

.team-profile-card__flag-fallback {
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--p-content-hover-background);
}

.team-profile-card__name {
  margin-top: 8px;
}

.team-profile-card__stats {
  display: grid;
  width: 100%;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.team-profile-card__stat {
  display: grid;
  min-width: 0;
  justify-items: center;
  gap: 6px;
  padding: 12px;
  border-radius: var(--p-content-border-radius);
  background: var(--p-content-hover-background);

  i {
    color: var(--p-text-muted-color);
  }
}

@media (width <= 560px) {
  .team-profile-card__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
