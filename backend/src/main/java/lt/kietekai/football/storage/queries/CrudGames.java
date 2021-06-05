package lt.kietekai.football.storage.queries;

import io.vertx.core.Future;
import io.vertx.sqlclient.SqlConnection;
import io.vertx.sqlclient.Tuple;
import lt.kietekai.football.storage.RowCollectors;
import lt.kietekai.football.storage.models.Result;

import java.time.LocalDateTime;

public class CrudGames {
    private final SqlConnection connection;

    public CrudGames(SqlConnection connection) {
        this.connection = connection;
    }

    public Future<Long> create(long t1, long t2, LocalDateTime date) {
        return connection.preparedQuery("INSERT INTO game(team1, team2, game_date) VALUES ($1, $2, $3) RETURNING id")
                .mapping(row -> row.getLong(0))
                .execute(Tuple.of(t1, t2, date))
                .map(RowCollectors::toSingle);
    }

    public Future<Void> makeGuess(long userId, long gameId, Result guess) {
        return connection.preparedQuery(
                "insert into guess(author, game, result1, result2) " +
                        "select $1, $2, $3, $4 where exists (" +
                        "select 1 from game where id=$2 and game_closed is null and game_ended is null)" +
                        "  on conflict on constraint guess_unique_game_author do update set result1 = $3, result2 = $4"
        ).execute(Tuple.of(userId, gameId, guess.r1(), guess.r2()))
                .map(rows -> null);
    }
}
