<script setup lang="ts">
import { Button, Card } from 'primevue';
import { useRouter } from 'vue-router';

import FEmptyMessage from '@/components/FEmptyMessage.vue';
import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import { RouteName } from '@/enums';
import type { Game } from '@/models';

defineProps<{
  groups: Array<{
    date: string;
    items: Game[];
  }>;
}>();

const router = useRouter();
const { t } = useTranslations();

const goToMatch = async (gameId: number) => {
  await router.push({ name: RouteName.Match, params: { gameId } });
};

const goToTeam = async (teamId: string) => {
  await router.push({ name: RouteName.Team, params: { teamId } });
};
</script>

<template>
  <section class="team-match-history">
    <FText as="h2" variant="heading-3">
      {{ t('v1.team.match.history') }}
    </FText>

    <div v-if="groups.length" class="team-match-history__list">
      <section
        v-for="group in groups"
        :key="group.date"
        class="team-match-history__group"
      >
        <Card>
          <template #title>{{ group.date }}</template>
          <template #content>
            <div class="team-match-history__day-games">
              <article
                v-for="game in group.items"
                :key="game.id"
                class="team-match-history__match-card"
              >
                <button
                  class="team-match-history__match-time"
                  type="button"
                  @click="goToMatch(game.id)"
                >
                  <FText as="span" variant="body-2-bold">
                    {{ game.time }}
                  </FText>
                </button>

                <div class="team-match-history__match-main">
                  <Button
                    class="team-match-history__team-button team-match-history__team-button--home"
                    link
                    @click="goToTeam(game.t1.code)"
                  >
                    <FText as="span" clickable variant="body-2-bold">
                      {{ game.t1.name }}
                    </FText>
                  </Button>
                  <FText
                    as="span"
                    class="team-match-history__score team-match-history__score--home"
                    variant="heading-3"
                  >
                    {{ game.result?.goals1 ?? '-' }}
                  </FText>
                  <FText
                    as="span"
                    class="team-match-history__score-separator"
                    color="--p-text-muted-color"
                    variant="body-2-bold"
                  >
                    :
                  </FText>
                  <FText
                    as="span"
                    class="team-match-history__score team-match-history__score--away"
                    variant="heading-3"
                  >
                    {{ game.result?.goals2 ?? '-' }}
                  </FText>
                  <Button
                    class="team-match-history__team-button team-match-history__team-button--away"
                    link
                    @click="goToTeam(game.t2.code)"
                  >
                    <FText as="span" clickable variant="body-2-bold">
                      {{ game.t2.name }}
                    </FText>
                  </Button>
                </div>

                <button
                  class="team-match-history__details-button"
                  type="button"
                  @click="goToMatch(game.id)"
                >
                  <FText
                    as="span"
                    color="--p-primary-contrast-color"
                    variant="body-2-bold"
                  >
                    {{ t('v1.match') }}
                  </FText>
                  <i class="pi pi-arrow-right" />
                </button>
              </article>
            </div>
          </template>
        </Card>
      </section>
    </div>

    <FEmptyMessage v-else message="v1.team.no.matches" />
  </section>
</template>

<style scoped lang="scss">
.team-match-history {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-match-history__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.team-match-history__group {
  min-width: 0;
}

.team-match-history__day-games {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.team-match-history__match-card {
  display: grid;
  overflow: hidden;
  border: var(--f-card-border);
  border-radius: var(--f-card-radius);
  background: var(--p-surface-card);
  box-shadow: var(--f-card-shadow);
}

.team-match-history__match-time {
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-bottom: var(--f-match-time-border);
  background: var(--f-match-time-background);
  cursor: pointer;
  font: inherit;
  text-align: center;
}

.team-match-history__match-main {
  display: grid;
  align-items: center;
  gap: 12px;
  grid-template-areas: 'team-home score-home separator score-away team-away';
  grid-template-columns: minmax(0, 1fr) 32px 12px 32px minmax(0, 1fr);
  padding: 14px 12px;
  text-align: center;
}

.team-match-history__score {
  display: block;
}

.team-match-history__score--home {
  grid-area: score-home;
}

.team-match-history__score--away {
  grid-area: score-away;
}

.team-match-history__score-separator {
  grid-area: separator;
}

.team-match-history__team-button--home {
  grid-area: team-home;
}

.team-match-history__team-button--away {
  grid-area: team-away;
}

.team-match-history__team-button {
  min-width: 0;
  padding: 0;
  color: var(--p-text-color);

  :deep(.p-button-label) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.team-match-history__details-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-top: 1px solid var(--p-primary-color);
  border-radius: 0;
  background: var(--p-primary-color);
  cursor: pointer;
  font: inherit;
  transition:
    background-color 0.2s,
    border-color 0.2s;

  &:hover,
  &:focus-visible {
    border-top-color: var(--p-primary-hover-color);
    background: var(--p-primary-hover-color);
  }
}

@media (width <= 760px) {
  .team-match-history__match-main {
    gap: 10px;
    grid-template-columns: minmax(0, 1fr) 24px 8px 24px minmax(0, 1fr);
    padding: 12px;
  }

  .team-match-history__team-button {
    justify-content: center;

    :deep(.p-button-label) {
      white-space: nowrap;
    }
  }
}
</style>
