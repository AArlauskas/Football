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
                reminderGuessLeaders()
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

    private java.util.List<ChampionshipStatistics.PlayerCounterStat> reminderLeaders() {
        return jdbcTemplate.query("""
                select u.id user_id, u.first_name, u.last_name, p.total, count(*) count
                from match_reminder mr
                left join auth_user u on u.id = mr.user_id
                left join points p on p.id = u.id
                group by u.id, p.total
                order by count desc, p.total
                """, PLAYER_COUNTER_MAPPER);
    }

    private java.util.List<ChampionshipStatistics.PlayerCounterStat> reminderGuessLeaders() {
        return jdbcTemplate.query("""
                select u.id user_id, u.first_name, u.last_name, p.total, count(*) count
                from match_reminder mr
                left join auth_user u on u.id = mr.user_id
                left join points p on p.id = u.id
                left join guess g on g.user_id = mr.user_id and g.game_id = mr.game_id
                where g.result1 is not null
                  and g.result2 is not null
                group by u.id, p.total
                order by count desc, p.total
                """, PLAYER_COUNTER_MAPPER);
    }
}
