export interface PlayerPointsStat {
  firstName: string;
  lastName: string;
  total: number;
  userId: number;
}

export interface PlayerCounterStat extends PlayerPointsStat {
  count: number;
}

export interface TeamCounterStat {
  count: number;
  team: string;
}

export interface GamePointsStat {
  gameId: number;
  result: string;
  team1: string;
  team2: string;
  totalPoints: number;
}

export interface GameCounterStat {
  count: number;
  result: string;
  team1: string;
  team2: string;
}

export interface FavoriteScoreStat {
  count: number;
  firstName: string;
  lastName: string;
  score: string;
  userId: number;
}

export interface PlayerAverageStat extends PlayerPointsStat {
  averagePoints: number;
  guesses: number;
}

export interface GameSpreadStat {
  bestPoints: number;
  result: string;
  spread: number;
  team1: string;
  team2: string;
  worstPoints: number;
}

export interface TeamAverageStat {
  averagePoints: number;
  games: number;
  team: string;
}

export interface PlayerTeamStat extends PlayerPointsStat {
  count: number;
  team: string;
}

export interface DrawAccuracyStat extends PlayerPointsStat {
  accuracy: number;
  correctDraws: number;
  drawPredictions: number;
}

export interface ReminderStat extends PlayerPointsStat {
  guessesAfterReminders: number;
  reminders: number;
}

export interface OutcomeStat {
  count: number;
  outcome: string;
}

export interface ChampionshipStatistics {
  bestAverageScores: PlayerAverageStat[];
  correctAloneLeaders: PlayerCounterStat[];
  correctOutcomeLeaders: PlayerCounterStat[];
  drawPredictionLeaders: PlayerCounterStat[];
  drawAccuracyLeaders: DrawAccuracyStat[];
  favoritePredictedWinners: PlayerTeamStat[];
  gamesByGoals: GameCounterStat[];
  hardestTeamsToPredict: TeamAverageStat[];
  highestSingleGameScores: PlayerCounterStat[];
  incorrectOutcomeLeaders: PlayerCounterStat[];
  missingGuessLeaders: PlayerCounterStat[];
  mostDivisiveMatches: GameSpreadStat[];
  mostCommonGuessedOutcomes: OutcomeStat[];
  mostCommonOutcomes: OutcomeStat[];
  mostSuccessfulGuessingGames: GamePointsStat[];
  personalSignatureScores: FavoriteScoreStat[];
  playersByGuessedGoals: PlayerCounterStat[];
  playersByPoints: PlayerPointsStat[];
  reminderLeaders: ReminderStat[];
  teamBelievers: TeamCounterStat[];
  teamsByGoals: TeamCounterStat[];
  twoOnePredictionLeaders: PlayerCounterStat[];
}
