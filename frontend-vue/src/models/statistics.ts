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

export interface ChampionshipStatistics {
  correctAloneLeaders: PlayerCounterStat[];
  correctOutcomeLeaders: PlayerCounterStat[];
  drawPredictionLeaders: PlayerCounterStat[];
  gamesByGoals: GameCounterStat[];
  highestSingleGameScores: PlayerCounterStat[];
  incorrectOutcomeLeaders: PlayerCounterStat[];
  missingGuessLeaders: PlayerCounterStat[];
  mostSuccessfulGuessingGames: GamePointsStat[];
  personalSignatureScores: FavoriteScoreStat[];
  playersByGuessedGoals: PlayerCounterStat[];
  playersByPoints: PlayerPointsStat[];
  reminderGuessLeaders: PlayerCounterStat[];
  reminderLeaders: PlayerCounterStat[];
  teamBelievers: TeamCounterStat[];
  teamsByGoals: TeamCounterStat[];
  twoOnePredictionLeaders: PlayerCounterStat[];
}
