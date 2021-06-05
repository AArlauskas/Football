package lt.kietekai.football.storage.queries;

import io.vertx.core.Future;
import io.vertx.sqlclient.Row;
import io.vertx.sqlclient.SqlConnection;
import io.vertx.sqlclient.Tuple;
import lt.kietekai.football.storage.RowCollectors;
import lt.kietekai.football.storage.models.GameWithGuess;
import lt.kietekai.football.storage.models.GamesQuery;
import lt.kietekai.football.storage.models.Result;
import lt.kietekai.football.storage.models.Team;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class FindGamesWithGuesses {
    private final SqlConnection connection;

    public FindGamesWithGuesses(SqlConnection connection) {
        this.connection = connection;
    }

    private static GameWithGuess mapRow(Row row) {
        return new GameWithGuess(row.getLong(0),
                new Team(row.getLong(1), row.getString(2), row.getString(3), row.getString(4)),
                new Team(row.getLong(5), row.getString(6), row.getString(7), row.getString(8)),
                row.getLocalDateTime(9),
                row.getLocalDateTime(10),
                row.getLocalDateTime(11),
                new Result(row.getInteger(12), row.getInteger(13)),
                new Result(row.getInteger(14), row.getInteger(15))
        );
    }

    public Future<List<GameWithGuess>> findByUser(GamesQuery q) {
        return connection.preparedQuery("SELECT " +
                "g.id, " +
                "t1.id, t1.code_short, t1.code_long, t1.name, " +
                "t2.id, t2.code_short, t2.code_long,t2.name, " +
                "g.game_date, g.game_closed, g.game_ended, " +
                "g.result1, g.result2, gs.result1, gs.result2 " +
                "from game g " +
                "inner join team t1 on g.team1 = t1.id " +
                "inner join team t2 on g.team2 = t2.id " +
                "left join guess gs on g.id = gs.game  and gs.author = $1 " +
                "where gs is null or gs.author = $1 " +
                "and (($2 and g.game_date > $4) or ($3 and g.game_closed is null) or (not $2 and $3)) " +
                "order by g.game_date")
                .mapping(FindGamesWithGuesses::mapRow)
                .execute(Tuple.of(q.userId(), q.includeToday(), q.includeOpen(), LocalDateTime.now().truncatedTo(ChronoUnit.DAYS)))
                .map(RowCollectors::toList);
    }

    public void close() {
        connection.close();
    }
}
