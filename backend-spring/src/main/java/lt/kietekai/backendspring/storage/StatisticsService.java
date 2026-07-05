package lt.kietekai.backendspring.storage;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.rest.models.ChampionshipStatistics;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<ChampionshipStatistics.PlayerPointsStat> PLAYER_POINTS_MAPPER = (rs, rowNum) ->
            new ChampionshipStatistics.PlayerPointsStat(
                    rs.getLong("user_id"),
                    rs.getString("first_name"),
                    rs.getString("last_name"),
                    rs.getInt("total")
            );

    private static final RowMapper<ChampionshipStatistics.PlayerCounterStat> PLAYER_COUNTER_MAPPER = (rs, rowNum) ->
            new ChampionshipStatistics.PlayerCounterStat(
                    rs.getLong("user_id"),
                    rs.getString("first_name"),
                    rs.getString("last_name"),
                    rs.getInt("total"),
                    rs.getInt("count")
            );

    private static final RowMapper<ChampionshipStatistics.TeamCounterStat> TEAM_COUNTER_MAPPER = (rs, rowNum) ->
            new ChampionshipStatistics.TeamCounterStat(
                    rs.getString("team"),
                    rs.getInt("count")
            );

    private static final RowMapper<ChampionshipStatistics.GamePointsStat> GAME_POINTS_MAPPER = (rs, rowNum) ->
            new ChampionshipStatistics.GamePointsStat(
                    rs.getLong("game_id"),
                    rs.getString("team1"),
                    rs.getString("team2"),
                    rs.getString("result"),
                    rs.getInt("total_points")
            );

    private static final RowMapper<ChampionshipStatistics.GameCounterStat> GAME_COUNTER_MAPPER = (rs, rowNum) ->
            new ChampionshipStatistics.GameCounterStat(
                    rs.getString("team1"),
                    rs.getString("team2"),
                    rs.getString("result"),
                    rs.getInt("count")
            );

    private static final RowMapper<ChampionshipStatistics.FavoriteScoreStat> FAVORITE_SCORE_MAPPER = (rs, rowNum) ->
            new ChampionshipStatistics.FavoriteScoreStat(
                    rs.getLong("user_id"),
                    rs.getString("first_name"),
                    rs.getString("last_name"),
                    rs.getString("score"),
                    rs.getInt("count")
            );

    private static final RowMapper<ChampionshipStatistics.PlayerAverageStat> PLAYER_AVERAGE_MAPPER = (rs, rowNum) ->
            new ChampionshipStatistics.PlayerAverageStat(
                    rs.getLong("user_id"),
                    rs.getString("first_name"),
                    rs.getString("last_name"),
                    rs.getInt("total"),
                    rs.getDouble("average_points"),
                    rs.getInt("guesses")
            );

    private static final RowMapper<ChampionshipStatistics.GameSpreadStat> GAME_SPREAD_MAPPER = (rs, rowNum) ->
            new ChampionshipStatistics.GameSpreadStat(
                    rs.getString("team1"),
                    rs.getString("team2"),
                    rs.getString("result"),
                    rs.getInt("best_points"),
                    rs.getInt("worst_points"),
                    rs.getInt("spread")
            );

    private static final RowMapper<ChampionshipStatistics.TeamAverageStat> TEAM_AVERAGE_MAPPER = (rs, rowNum) ->
            new ChampionshipStatistics.TeamAverageStat(
                    rs.getString("team"),
                    rs.getDouble("average_points"),
                    rs.getInt("games")
            );

    private static final RowMapper<ChampionshipStatistics.PlayerTeamStat> PLAYER_TEAM_MAPPER = (rs, rowNum) ->
            new ChampionshipStatistics.PlayerTeamStat(
                    rs.getLong("user_id"),
                    rs.getString("first_name"),
                    rs.getString("last_name"),
                    rs.getInt("total"),
                    rs.getString("team"),
                    rs.getInt("count")
            );

    private static final RowMapper<ChampionshipStatistics.DrawAccuracyStat> DRAW_ACCURACY_MAPPER = (rs, rowNum) ->
            new ChampionshipStatistics.DrawAccuracyStat(
                    rs.getLong("user_id"),
                    rs.getString("first_name"),
                    rs.getString("last_name"),
                    rs.getInt("total"),
                    rs.getInt("correct_draws"),
                    rs.getInt("draw_predictions"),
                    rs.getDouble("accuracy")
            );

    private static final RowMapper<ChampionshipStatistics.ReminderStat> REMINDER_MAPPER = (rs, rowNum) ->
            new ChampionshipStatistics.ReminderStat(
                    rs.getLong("user_id"),
                    rs.getString("first_name"),
                    rs.getString("last_name"),
                    rs.getInt("total"),
                    rs.getInt("reminders"),
                    rs.getInt("guesses_after_reminders")
            );

    private static final RowMapper<ChampionshipStatistics.ResultStat> RESULT_MAPPER = (rs, rowNum) ->
            new ChampionshipStatistics.ResultStat(
                    rs.getString("result"),
                    rs.getInt("count")
            );

    public ChampionshipStatistics getStatistics() {
        return new ChampionshipStatistics(
                playersByPoints(),
                correctAloneLeaders(),
                missingGuessLeaders(),
                incorrectOutcomeLeaders(),
                correctOutcomeLeaders(),
                teamsByGoals(),
                mostSuccessfulGuessingGames(),
                highestSingleGameScores(),
                gamesByGoals(),
                playersByGuessedGoals(),
                drawPredictionLeaders(),
                twoOnePredictionLeaders(),
                teamBelievers(),
                personalSignatureScores(),
                reminderLeaders(),
                bestAverageScores(),
                mostDivisiveMatches(),
                hardestTeamsToPredict(),
                favoritePredictedWinners(),
                drawAccuracyLeaders(),
                mostCommonGuessedResults(),
                mostCommonResults()
        );
    }

    private java.util.List<ChampionshipStatistics.PlayerPointsStat> playersByPoints() {
        return jdbcTemplate.query("""
                select u.id user_id, u.first_name, u.last_name, p.total
                from points p
                left join auth_user u on u.id = p.id
                order by p.total
                """, PLAYER_POINTS_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.PlayerCounterStat> correctAloneLeaders() {
        return jdbcTemplate.query("""
                select u.id user_id, u.first_name, u.last_name, p.total, p.correct_alone count
                from points p
                left join auth_user u on u.id = p.id
                where p.correct_alone > 0
                order by p.correct_alone desc, p.total
                """, PLAYER_COUNTER_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.PlayerCounterStat> missingGuessLeaders() {
        return jdbcTemplate.query("""
                select u.id user_id, u.first_name, u.last_name, p.total, p.not_given count
                from points p
                left join auth_user u on u.id = p.id
                where p.not_given > 0
                order by p.not_given desc, p.total
                """, PLAYER_COUNTER_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.PlayerCounterStat> incorrectOutcomeLeaders() {
        return jdbcTemplate.query("""
                select u.id user_id, u.first_name, u.last_name, p.total, p.incorrect count
                from points p
                left join auth_user u on u.id = p.id
                order by p.incorrect desc, p.total
                """, PLAYER_COUNTER_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.PlayerCounterStat> correctOutcomeLeaders() {
        return jdbcTemplate.query("""
                select u.id user_id, u.first_name, u.last_name, p.total, p.outcomes count
                from points p
                left join auth_user u on u.id = p.id
                order by p.outcomes desc, p.total
                """, PLAYER_COUNTER_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.TeamCounterStat> teamsByGoals() {
        return jdbcTemplate.query("""
                select t.long_code team, coalesce(team_goals.count, 0) count
                from team t
                left join (
                    select team_id, sum(goals) count
                    from (
                        select team1_id team_id, result1 goals
                        from game
                        where finished is not null
                        union all
                        select team2_id team_id, result2 goals
                        from game
                        where finished is not null
                    ) scored_games
                    group by team_id
                ) team_goals on team_goals.team_id = t.id
                order by count desc
                """, TEAM_COUNTER_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.GamePointsStat> mostSuccessfulGuessingGames() {
        return jdbcTemplate.query("""
                select t1.name team1,
                       t2.name team2,
                       sum(g.points) total_points,
                       g.game_id,
                       gm.result1 || ':' || gm.result2 result
                from guess g
                left join game gm on gm.id = g.game_id
                left join team t1 on t1.id = gm.team1_id
                left join team t2 on t2.id = gm.team2_id
                where gm.finished is not null
                  and g.points is not null
                group by g.game_id, t1.name, t2.name, gm.result1, gm.result2
                order by total_points asc
                """, GAME_POINTS_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.PlayerCounterStat> highestSingleGameScores() {
        return jdbcTemplate.query("""
                select u.id user_id, u.first_name, u.last_name, p.total, max(g.points) count
                from guess g
                left join auth_user u on u.id = g.user_id
                left join points p on p.id = u.id
                where g.points is not null
                group by u.id, p.total
                order by count desc, p.total
                """, PLAYER_COUNTER_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.GameCounterStat> gamesByGoals() {
        return jdbcTemplate.query("""
                select t1.name team1,
                       t2.name team2,
                       g.result1 || ':' || g.result2 result,
                       g.result1 + g.result2 count
                from game g
                left join team t1 on t1.id = g.team1_id
                left join team t2 on t2.id = g.team2_id
                where g.finished is not null
                  and g.result1 is not null
                  and g.result2 is not null
                order by count desc
                """, GAME_COUNTER_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.PlayerCounterStat> playersByGuessedGoals() {
        return jdbcTemplate.query("""
                select u.id user_id,
                       u.first_name,
                       u.last_name,
                       p.total,
                       sum(g.result1 + g.result2) count
                from guess g
                left join auth_user u on u.id = g.user_id
                left join points p on p.id = u.id
                where g.result1 is not null
                  and g.result2 is not null
                group by u.id, p.total
                order by count desc
                """, PLAYER_COUNTER_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.PlayerCounterStat> drawPredictionLeaders() {
        return jdbcTemplate.query("""
                select u.id user_id, u.first_name, u.last_name, p.total, count(1) count
                from guess g
                left join auth_user u on u.id = g.user_id
                left join points p on p.id = u.id
                where g.result1 = g.result2
                group by u.id, p.total
                order by count desc, p.total
                """, PLAYER_COUNTER_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.PlayerCounterStat> twoOnePredictionLeaders() {
        return jdbcTemplate.query("""
                select u.id user_id, u.first_name, u.last_name, p.total, count(1) count
                from guess g
                left join auth_user u on u.id = g.user_id
                left join points p on p.id = u.id
                where (g.result1 = 1 and g.result2 = 2)
                   or (g.result1 = 2 and g.result2 = 1)
                group by u.id, p.total
                order by count desc, p.total
                """, PLAYER_COUNTER_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.TeamCounterStat> teamBelievers() {
        return jdbcTemplate.query("""
                select predicted_winner.name team, count(*) count
                from guess g
                left join game gm on gm.id = g.game_id
                left join team predicted_winner on predicted_winner.id = case
                    when g.result1 > g.result2 then gm.team1_id
                    when g.result2 > g.result1 then gm.team2_id
                end
                where g.result1 is not null
                  and g.result2 is not null
                  and g.result1 != g.result2
                group by predicted_winner.id, predicted_winner.name
                order by count desc
                """, TEAM_COUNTER_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.FavoriteScoreStat> personalSignatureScores() {
        return jdbcTemplate.query("""
                select distinct on (u.id)
                       u.id user_id,
                       u.first_name,
                       u.last_name,
                       g.result1 || ':' || g.result2 score,
                       count(*) count
                from guess g
                left join auth_user u on u.id = g.user_id
                where g.result1 is not null
                  and g.result2 is not null
                group by u.id, g.result1, g.result2
                order by u.id, count(*) desc
                """, FAVORITE_SCORE_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.ReminderStat> reminderLeaders() {
        return jdbcTemplate.query("""
                select u.id user_id,
                       u.first_name,
                       u.last_name,
                       p.total,
                       count(*) reminders,
                       count(*) filter (
                           where g.result1 is not null
                             and g.result2 is not null
                       ) guesses_after_reminders
                from match_reminder mr
                left join auth_user u on u.id = mr.user_id
                left join points p on p.id = u.id
                left join guess g on g.user_id = mr.user_id and g.game_id = mr.game_id
                group by u.id, p.total
                order by reminders desc, guesses_after_reminders desc, p.total
                """, REMINDER_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.PlayerAverageStat> bestAverageScores() {
        return jdbcTemplate.query("""
                select u.id user_id,
                       u.first_name,
                       u.last_name,
                       p.total,
                       round(avg(g.points)::numeric, 2) average_points,
                       count(*) guesses
                from guess g
                left join auth_user u on u.id = g.user_id
                left join points p on p.id = u.id
                where g.points is not null
                  and g.result1 is not null
                  and g.result2 is not null
                group by u.id, p.total
                order by average_points, guesses desc, p.total
                """, PLAYER_AVERAGE_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.GameSpreadStat> mostDivisiveMatches() {
        return jdbcTemplate.query("""
                select t1.name team1,
                       t2.name team2,
                       gm.result1 || ':' || gm.result2 result,
                       min(g.points) best_points,
                       max(g.points) worst_points,
                       max(g.points) - min(g.points) spread
                from guess g
                left join game gm on gm.id = g.game_id
                left join team t1 on t1.id = gm.team1_id
                left join team t2 on t2.id = gm.team2_id
                where gm.finished is not null
                  and g.points is not null
                  and g.result1 is not null
                  and g.result2 is not null
                group by g.game_id, t1.name, t2.name, gm.result1, gm.result2
                order by spread desc, worst_points desc
                """, GAME_SPREAD_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.TeamAverageStat> hardestTeamsToPredict() {
        return jdbcTemplate.query("""
                select t.name team,
                       round(avg(g.points)::numeric, 2) average_points,
                       count(distinct gm.id) games
                from team t
                left join game gm on t.id in (gm.team1_id, gm.team2_id)
                left join guess g on g.game_id = gm.id
                where gm.finished is not null
                  and g.points is not null
                  and g.result1 is not null
                  and g.result2 is not null
                group by t.id, t.name
                order by average_points desc, games desc
                """, TEAM_AVERAGE_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.PlayerTeamStat> favoritePredictedWinners() {
        return jdbcTemplate.query("""
                select distinct on (u.id)
                       u.id user_id,
                       u.first_name,
                       u.last_name,
                       p.total,
                       predicted_winner.name team,
                       count(*) count
                from guess g
                left join auth_user u on u.id = g.user_id
                left join points p on p.id = u.id
                left join game gm on gm.id = g.game_id
                left join team predicted_winner on predicted_winner.id = case
                    when g.result1 > g.result2 then gm.team1_id
                    when g.result2 > g.result1 then gm.team2_id
                end
                where g.result1 is not null
                  and g.result2 is not null
                  and g.result1 != g.result2
                group by u.id, p.total, predicted_winner.id, predicted_winner.name
                order by u.id, count(*) desc, predicted_winner.name
                """, PLAYER_TEAM_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.DrawAccuracyStat> drawAccuracyLeaders() {
        return jdbcTemplate.query("""
                select u.id user_id,
                       u.first_name,
                       u.last_name,
                       p.total,
                       count(*) filter (where gm.result1 = gm.result2) correct_draws,
                       count(*) draw_predictions,
                       round(100.0 * count(*) filter (where gm.result1 = gm.result2) / count(*), 2) accuracy
                from guess g
                left join auth_user u on u.id = g.user_id
                left join points p on p.id = u.id
                left join game gm on gm.id = g.game_id
                where g.result1 = g.result2
                  and gm.finished is not null
                  and gm.result1 is not null
                  and gm.result2 is not null
                group by u.id, p.total
                order by accuracy desc, correct_draws desc, p.total
                """, DRAW_ACCURACY_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.ResultStat> mostCommonGuessedResults() {
        return jdbcTemplate.query("""
                select result, count(*) count
                from (
                    select greatest(g.result1, g.result2) || ':' || least(g.result1, g.result2) result
                    from guess g
                    where g.result1 is not null
                      and g.result2 is not null
                ) guessed_results
                group by result
                order by count desc, result
                """, RESULT_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.ResultStat> mostCommonResults() {
        return jdbcTemplate.query("""
                select result, count(*) count
                from (
                    select greatest(g.result1, g.result2) || ':' || least(g.result1, g.result2) result
                    from game g
                    where g.finished is not null
                      and g.result1 is not null
                      and g.result2 is not null
                ) match_results
                group by result
                order by count desc, result
                """, RESULT_MAPPER);
    }
}
