package lt.kietekai.backendspring.rest.models;

import java.util.List;

public record ChampionshipStatistics(
        List<PlayerPointsStat> playersByPoints,
        List<PlayerCounterStat> correctAloneLeaders,
        List<PlayerCounterStat> missingGuessLeaders,
        List<PlayerCounterStat> incorrectOutcomeLeaders,
        List<PlayerCounterStat> correctOutcomeLeaders,
        List<TeamCounterStat> teamsByGoals,
        List<GamePointsStat> mostSuccessfulGuessingGames,
        List<PlayerCounterStat> highestSingleGameScores,
        List<GameCounterStat> gamesByGoals,
        List<PlayerCounterStat> playersByGuessedGoals,
        List<PlayerCounterStat> drawPredictionLeaders,
        List<PlayerCounterStat> twoOnePredictionLeaders,
        List<TeamCounterStat> teamBelievers,
        List<FavoriteScoreStat> personalSignatureScores,
        List<ReminderStat> reminderLeaders,
        List<PlayerAverageStat> bestAverageScores,
        List<GameSpreadStat> mostDivisiveMatches,
        List<TeamAverageStat> hardestTeamsToPredict,
        List<PlayerTeamStat> favoritePredictedWinners,
        List<DrawAccuracyStat> drawAccuracyLeaders,
        List<OutcomeStat> mostCommonGuessedOutcomes,
        List<OutcomeStat> mostCommonOutcomes
) {
    public record PlayerPointsStat(long userId, String firstName, String lastName, int total) {
    }

    public record PlayerCounterStat(long userId, String firstName, String lastName, int total, int count) {
    }

    public record TeamCounterStat(String team, int count) {
    }

    public record GamePointsStat(long gameId, String team1, String team2, String result, int totalPoints) {
    }

    public record GameCounterStat(String team1, String team2, String result, int count) {
    }

    public record FavoriteScoreStat(long userId, String firstName, String lastName, String score, int count) {
    }

    public record PlayerAverageStat(long userId, String firstName, String lastName, int total, double averagePoints, int guesses) {
    }

    public record GameSpreadStat(String team1, String team2, String result, int bestPoints, int worstPoints, int spread) {
    }

    public record TeamAverageStat(String team, double averagePoints, int games) {
    }

    public record PlayerTeamStat(long userId, String firstName, String lastName, int total, String team, int count) {
    }

    public record DrawAccuracyStat(long userId, String firstName, String lastName, int total, int correctDraws, int drawPredictions, double accuracy) {
    }

    public record ReminderStat(long userId, String firstName, String lastName, int total, int reminders, int guessesAfterReminders) {
    }

    public record OutcomeStat(String outcome, int count) {
    }
}
