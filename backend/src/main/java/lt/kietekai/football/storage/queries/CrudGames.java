package lt.kietekai.football.storage.queries;

import io.vertx.core.Future;
import io.vertx.sqlclient.SqlConnection;
import io.vertx.sqlclient.Tuple;
import lt.kietekai.football.storage.RowCollectors;

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
}
