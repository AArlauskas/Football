<script setup lang="ts">
import { Card, Tag } from 'primevue';
import { computed } from 'vue';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import { teamFlags } from '@/constants/teamFlags';
import type { TranslationKey } from '@/i18n';
import { translateTeamName } from '@/lib/teamName';
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
const teamName = computed(() => translateTeamName(props.team, t));
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
  <Card class="team-profile-card-shell">
    <template #content>
      <section class="team-profile-card">
        <div class="team-profile-card__header">
          <img
            v-if="flagUrl"
            class="team-profile-card__flag"
            :alt="teamName"
            :src="flagUrl"
          />
          <div v-else class="team-profile-card__flag-fallback">
            <FText as="span" variant="body-2-bold">{{ team.code }}</FText>
          </div>

          <div class="team-profile-card__details">
            <Tag
              class="team-profile-card__tag"
              severity="success"
              :value="t('v1.team')"
            />
            <FText class="team-profile-card__name" as="h2" variant="heading-2">
              {{ teamName }}
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
            <div class="team-profile-card__stat-header">
              <span class="team-profile-card__stat-icon">
                <i :class="stat.icon" />
              </span>
              <FText
                as="span"
                class="team-profile-card__stat-label"
                color="--p-text-muted-color"
                variant="body-3"
              >
                {{ t(stat.label) }}
              </FText>
            </div>
            <FText
              as="span"
              class="team-profile-card__stat-value"
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
:deep(.team-profile-card-shell.p-card) {
  overflow: hidden;
  border: 1px solid
    color-mix(in srgb, var(--p-primary-color) 18%, transparent);
  background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--p-primary-color) 16%, transparent),
      transparent 34%
    ),
    var(--p-surface-card);
  box-shadow: var(--f-card-shadow);
}

.team-profile-card {
  display: grid;
  align-items: center;
  gap: 20px;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.5fr);
}

.team-profile-card__header {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 14px;
}

.team-profile-card__flag,
.team-profile-card__flag-fallback {
  width: 58px;
  height: 58px;
  flex: 0 0 auto;
}

.team-profile-card__flag {
  object-fit: contain;
}

.team-profile-card__flag-fallback {
  display: grid;
  place-items: center;
  border: 1px solid
    color-mix(in srgb, var(--p-primary-color) 32%, transparent);
  border-radius: 18px;
  background: color-mix(in srgb, var(--p-primary-color) 12%, transparent);
  color: var(--p-primary-color);
  font-weight: 800;
}

.team-profile-card__details {
  min-width: 0;
}

.team-profile-card__tag {
  width: fit-content;
}

.team-profile-card__name {
  margin-top: 8px;
  overflow-wrap: anywhere;
}

.team-profile-card__stats {
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
}

.team-profile-card__stat {
  display: grid;
  min-width: 0;
  gap: 10px;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--p-surface-card) 82%, transparent);
  box-shadow: 0 10px 24px
    color-mix(in srgb, var(--p-text-color) 6%, transparent);
}

.team-profile-card__stat-header {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
}

.team-profile-card__stat-icon {
  display: inline-grid;
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 8px;
  background: color-mix(in srgb, var(--p-primary-color) 12%, transparent);
  color: var(--p-primary-color);

  i {
    font-size: 0.75rem;
  }
}

.team-profile-card__stat-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.team-profile-card__stat-value {
  line-height: 1;
}

@media (width <= 1040px) {
  .team-profile-card {
    grid-template-columns: 1fr;
  }
}

@media (width <= 560px) {
  .team-profile-card__header {
    align-items: flex-start;
  }

  .team-profile-card__flag,
  .team-profile-card__flag-fallback {
    width: 50px;
    height: 50px;
  }

  .team-profile-card__flag-fallback {
    border-radius: 16px;
    font-size: 0.9rem;
  }

  .team-profile-card__name {
    white-space: normal;
  }

  .team-profile-card__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
