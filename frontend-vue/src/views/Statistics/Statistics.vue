<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Skeleton } from 'primevue';
import { computed, onMounted } from 'vue';

import FPageFeedback from '@/components/FPageFeedback.vue';
import FText from '@/components/FText.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';
import type {
  DrawAccuracyStat,
  FavoriteScoreStat,
  GameCounterStat,
  GamePointsStat,
  GameSpreadStat,
  PlayerAverageStat,
  PlayerCounterStat,
  PlayerPointsStat,
  PlayerTeamStat,
  ReminderStat,
  ResultStat,
  TeamAverageStat,
  TeamCounterStat,
} from '@/models';
import { useStatisticsStore } from '@/stores/statisticsStore';
import StatisticsSection from '@/views/Statistics/StatisticsSection.vue';
import type {
  StatisticsColumn,
  StatisticsRow,
} from '@/views/Statistics/statisticsSectionTypes';

interface StatisticsSectionConfig {
  columns: StatisticsColumn[];
  description: TranslationKey;
  rows: StatisticsRow[];
  title: TranslationKey;
}

const statisticsStore = useStatisticsStore();
const { t } = useTranslations();
const { isLoading, requestError, statistics } = storeToRefs(statisticsStore);

const pageTitle = computed(() => t('v1.statistics'));

const fullName = (item: { firstName: string; lastName: string }) =>
  `${item.firstName} ${item.lastName}`;

const playerPointsRows = (items: PlayerPointsStat[]): StatisticsRow[] =>
  items.map((item) => ({
    id: `player-points-${item.userId}`,
    title: fullName(item),
    values: {
      total: item.total,
    },
  }));

const playerCounterRows = (key: string, items: PlayerCounterStat[]) =>
  items.map((item) => ({
    id: `${key}-${item.userId}`,
    title: fullName(item),
    values: {
      count: item.count,
      total: item.total,
    },
  }));

const teamCounterRows = (key: string, items: TeamCounterStat[]) =>
  items.map((item) => ({
    id: `${key}-${item.team}`,
    title: item.team,
    values: {
      count: item.count,
    },
  }));

const gamePointsRows = (items: GamePointsStat[]): StatisticsRow[] =>
  items.map((item) => ({
    id: `successful-game-${item.gameId}`,
    title: `${item.team1} - ${item.team2}`,
    values: {
      result: item.result,
      totalPoints: item.totalPoints,
    },
  }));

const gameCounterRows = (key: string, items: GameCounterStat[]) =>
  items.map((item, index) => ({
    id: `${key}-${index}`,
    title: `${item.team1} - ${item.team2}`,
    values: {
      count: item.count,
      result: item.result,
    },
  }));

const favoriteScoreRows = (items: FavoriteScoreStat[]) =>
  items.map((item) => ({
    id: `favorite-score-${item.userId}`,
    title: fullName(item),
    values: {
      count: item.count,
      score: item.score,
    },
  }));

const playerAverageRows = (items: PlayerAverageStat[]): StatisticsRow[] =>
  items.map((item) => ({
    id: `player-average-${item.userId}`,
    title: fullName(item),
    values: {
      averagePoints: item.averagePoints,
      guesses: item.guesses,
      total: item.total,
    },
  }));

const gameSpreadRows = (items: GameSpreadStat[]): StatisticsRow[] =>
  items.map((item, index) => ({
    id: `game-spread-${index}`,
    title: `${item.team1} - ${item.team2}`,
    values: {
      bestPoints: item.bestPoints,
      result: item.result,
      spread: item.spread,
      worstPoints: item.worstPoints,
    },
  }));

const teamAverageRows = (key: string, items: TeamAverageStat[]) =>
  items.map((item) => ({
    id: `${key}-${item.team}`,
    title: item.team,
    values: {
      averagePoints: item.averagePoints,
      games: item.games,
    },
  }));

const playerTeamRows = (items: PlayerTeamStat[]) =>
  items.map((item) => ({
    id: `favorite-winner-${item.userId}`,
    title: fullName(item),
    values: {
      count: item.count,
      team: item.team,
      total: item.total,
    },
  }));

const drawAccuracyRows = (items: DrawAccuracyStat[]) =>
  items.map((item) => ({
    id: `draw-accuracy-${item.userId}`,
    title: fullName(item),
    values: {
      accuracy: item.accuracy,
      correctDraws: item.correctDraws,
      drawPredictions: item.drawPredictions,
      total: item.total,
    },
  }));

const reminderRows = (items: ReminderStat[]) =>
  items.map((item) => ({
    id: `reminders-${item.userId}`,
    title: fullName(item),
    values: {
      guessesAfterReminders: item.guessesAfterReminders,
      reminders: item.reminders,
      total: item.total,
    },
  }));

const resultRows = (key: string, items: ResultStat[]): StatisticsRow[] =>
  items.map((item) => ({
    id: `${key}-${item.result}`,
    title: item.result,
    values: {
      count: item.count,
    },
  }));

const playerTotalColumns = [
  { field: 'total', label: 'v1.statistics.column.points' },
] satisfies StatisticsColumn[];

const playerCountColumns = (countLabel: TranslationKey) =>
  [
    { field: 'count', label: countLabel },
    { field: 'total', label: 'v1.statistics.column.points' },
  ] satisfies StatisticsColumn[];

const statisticsSections = computed<StatisticsSectionConfig[]>(() => {
  if (!statistics.value) {
    return [];
  }

  return [
    {
      columns: playerTotalColumns,
      description: 'v1.statistics.players.by.points.description',
      rows: playerPointsRows(statistics.value.playersByPoints),
      title: 'v1.statistics.players.by.points',
    },
    {
      columns: [
        {
          field: 'averagePoints',
          label: 'v1.statistics.column.average.points',
        },
        { field: 'guesses', label: 'v1.statistics.column.guesses' },
        { field: 'total', label: 'v1.statistics.column.points' },
      ],
      description: 'v1.statistics.best.average.score.description',
      rows: playerAverageRows(statistics.value.bestAverageScores),
      title: 'v1.statistics.best.average.score',
    },
    {
      columns: playerCountColumns('v1.statistics.column.correct.alone'),
      description: 'v1.statistics.correct.alone.description',
      rows: playerCounterRows(
        'correct-alone',
        statistics.value.correctAloneLeaders,
      ),
      title: 'v1.statistics.correct.alone',
    },
    {
      columns: playerCountColumns('v1.statistics.column.missing.guesses'),
      description: 'v1.statistics.missing.guesses.description',
      rows: playerCounterRows(
        'missing-guesses',
        statistics.value.missingGuessLeaders,
      ),
      title: 'v1.statistics.missing.guesses',
    },
    {
      columns: playerCountColumns('v1.statistics.column.incorrect.outcomes'),
      description: 'v1.statistics.incorrect.outcomes.description',
      rows: playerCounterRows(
        'incorrect-outcomes',
        statistics.value.incorrectOutcomeLeaders,
      ),
      title: 'v1.statistics.incorrect.outcomes',
    },
    {
      columns: playerCountColumns('v1.statistics.column.correct.outcomes'),
      description: 'v1.statistics.correct.outcomes.description',
      rows: playerCounterRows(
        'correct-outcomes',
        statistics.value.correctOutcomeLeaders,
      ),
      title: 'v1.statistics.correct.outcomes',
    },
    {
      columns: [{ field: 'count', label: 'v1.statistics.column.predictions' }],
      description: 'v1.statistics.common.guessed.result.description',
      rows: resultRows(
        'guessed-result',
        statistics.value.mostCommonGuessedResults,
      ),
      title: 'v1.statistics.common.guessed.result',
    },
    {
      columns: [{ field: 'count', label: 'v1.statistics.column.games' }],
      description: 'v1.statistics.common.result.description',
      rows: resultRows('result', statistics.value.mostCommonResults),
      title: 'v1.statistics.common.result',
    },
    {
      columns: [{ field: 'count', label: 'v1.statistics.column.goals' }],
      description: 'v1.statistics.teams.by.goals.description',
      rows: teamCounterRows('team-goals', statistics.value.teamsByGoals),
      title: 'v1.statistics.teams.by.goals',
    },
    {
      columns: [
        {
          field: 'averagePoints',
          label: 'v1.statistics.column.average.points',
        },
        { field: 'games', label: 'v1.statistics.column.games' },
      ],
      description: 'v1.statistics.hardest.teams.description',
      rows: teamAverageRows(
        'hardest-team',
        statistics.value.hardestTeamsToPredict,
      ),
      title: 'v1.statistics.hardest.teams',
    },
    {
      columns: [
        { field: 'result', label: 'v1.statistics.column.result' },
        { field: 'totalPoints', label: 'v1.statistics.column.total.points' },
      ],
      description: 'v1.statistics.successful.games.description',
      rows: gamePointsRows(statistics.value.mostSuccessfulGuessingGames),
      title: 'v1.statistics.successful.games',
    },
    {
      columns: [
        { field: 'result', label: 'v1.statistics.column.result' },
        { field: 'spread', label: 'v1.statistics.column.point.spread' },
        { field: 'bestPoints', label: 'v1.statistics.column.best.points' },
        { field: 'worstPoints', label: 'v1.statistics.column.worst.points' },
      ],
      description: 'v1.statistics.most.divisive.matches.description',
      rows: gameSpreadRows(statistics.value.mostDivisiveMatches),
      title: 'v1.statistics.most.divisive.matches',
    },
    {
      columns: playerCountColumns('v1.statistics.column.highest.points'),
      description: 'v1.statistics.highest.single.game.description',
      rows: playerCounterRows(
        'highest-single-game',
        statistics.value.highestSingleGameScores,
      ),
      title: 'v1.statistics.highest.single.game',
    },
    {
      columns: [
        { field: 'result', label: 'v1.statistics.column.result' },
        { field: 'count', label: 'v1.statistics.column.goals' },
      ],
      description: 'v1.statistics.games.by.goals.description',
      rows: gameCounterRows('game-goals', statistics.value.gamesByGoals),
      title: 'v1.statistics.games.by.goals',
    },
    {
      columns: playerCountColumns('v1.statistics.column.guessed.goals'),
      description: 'v1.statistics.players.by.guessed.goals.description',
      rows: playerCounterRows(
        'guessed-goals',
        statistics.value.playersByGuessedGoals,
      ),
      title: 'v1.statistics.players.by.guessed.goals',
    },
    {
      columns: playerCountColumns('v1.statistics.column.draws'),
      description: 'v1.statistics.draw.predictions.description',
      rows: playerCounterRows('draws', statistics.value.drawPredictionLeaders),
      title: 'v1.statistics.draw.predictions',
    },
    {
      columns: [
        { field: 'accuracy', label: 'v1.statistics.column.draw.accuracy' },
        {
          field: 'correctDraws',
          label: 'v1.statistics.column.correct.draws',
        },
        {
          field: 'drawPredictions',
          label: 'v1.statistics.column.draw.predictions',
        },
        { field: 'total', label: 'v1.statistics.column.points' },
      ],
      description: 'v1.statistics.draw.accuracy.description',
      rows: drawAccuracyRows(statistics.value.drawAccuracyLeaders),
      title: 'v1.statistics.draw.accuracy',
    },
    {
      columns: playerCountColumns('v1.statistics.column.predictions'),
      description: 'v1.statistics.two.one.predictions.description',
      rows: playerCounterRows(
        'two-one',
        statistics.value.twoOnePredictionLeaders,
      ),
      title: 'v1.statistics.two.one.predictions',
    },
    {
      columns: [
        { field: 'count', label: 'v1.statistics.column.predicted.wins' },
      ],
      description: 'v1.statistics.team.believers.description',
      rows: teamCounterRows('team-believers', statistics.value.teamBelievers),
      title: 'v1.statistics.team.believers',
    },
    {
      columns: [
        { field: 'team', label: 'v1.statistics.column.team' },
        { field: 'count', label: 'v1.statistics.column.predicted.wins' },
        { field: 'total', label: 'v1.statistics.column.points' },
      ],
      description: 'v1.statistics.favorite.predicted.winners.description',
      rows: playerTeamRows(statistics.value.favoritePredictedWinners),
      title: 'v1.statistics.favorite.predicted.winners',
    },
    {
      columns: [
        { field: 'score', label: 'v1.statistics.column.score' },
        { field: 'count', label: 'v1.statistics.column.predictions' },
      ],
      description: 'v1.statistics.signature.scores.description',
      rows: favoriteScoreRows(statistics.value.personalSignatureScores),
      title: 'v1.statistics.signature.scores',
    },
    {
      columns: [
        { field: 'reminders', label: 'v1.statistics.column.reminders' },
        {
          field: 'guessesAfterReminders',
          label: 'v1.statistics.column.guesses.after.reminders',
        },
        { field: 'total', label: 'v1.statistics.column.points' },
      ],
      description: 'v1.statistics.reminders.description',
      rows: reminderRows(statistics.value.reminderLeaders),
      title: 'v1.statistics.reminders',
    },
  ];
});

onMounted(() => {
  void statisticsStore.loadStatistics();
});

usePageTitle(pageTitle);
</script>

<template>
  <main class="statistics">
    <FPageFeedback :error="requestError" />

    <header class="statistics__hero">
      <FText as="h1" variant="heading-2">
        {{ t('v1.statistics') }}
      </FText>
      <FText as="p" color="--p-text-muted-color" variant="body-1">
        {{ t('v1.statistics.subtitle') }}
      </FText>
    </header>

    <div v-if="isLoading" class="statistics__skeleton">
      <Skeleton v-for="item in 6" :key="item" height="180px" />
    </div>

    <FText
      v-else-if="statisticsSections.length === 0"
      as="p"
      color="--p-text-muted-color"
      variant="body-2"
    >
      {{ t('v1.statistics.no.data') }}
    </FText>

    <StatisticsSection
      v-for="section in statisticsSections"
      v-else
      :key="section.title"
      :columns="section.columns"
      :description="section.description"
      :rows="section.rows"
      :title="section.title"
    />
  </main>
</template>

<style scoped lang="scss">
.statistics {
  display: flex;
  width: min(100%, var(--f-page-empty-content-width, 1280px));
  flex-direction: column;
  gap: var(--f-space-lg);
  margin: 0 auto;

  &__hero {
    display: flex;
    flex-direction: column;
    gap: var(--f-space-xs);
  }

  &__skeleton {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--f-space-md);
  }
}

@media (width <= 960px) {
  .statistics {
    &__skeleton {
      grid-template-columns: 1fr;
    }
  }
}
</style>
