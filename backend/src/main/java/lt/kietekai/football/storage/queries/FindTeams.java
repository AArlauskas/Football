package lt.kietekai.football.storage.queries;

import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.sqlclient.*;
import lt.kietekai.football.storage.RowCollectors;
import lt.kietekai.football.storage.models.Team;
import lt.kietekai.football.storage.models.Teams;

import java.util.List;
import java.util.Optional;

public class FindTeams {
    private final SqlConnection connection;

    public FindTeams(SqlConnection connection) {
        this.connection = connection;
    }

    private static Team mapRow(Row row) {
        return new Team(row.getLong(0), row.getString(1), row.getString(2), row.getString(3));
    }

    public Future<List<Team>> getAll() {
        return connection.query("SELECT id, code_short, code_long, name from team order by id")
                .mapping(FindTeams::mapRow)
                .execute()
                .map(RowCollectors::toList);
    }

    public Future<Optional<Team>> findByLongCode(String code) {
        return prepareFindByCode()
                .execute(Tuple.of(code))
                .map(RowCollectors::toFirst);
    }

    public Future<Optional<Teams>> findByCodes(String c1, String c2) {
        var p = prepareFindByCode();
        var t1f = p.execute(Tuple.of(c1)).map(RowCollectors::toFirst);
        var t2f = p.execute(Tuple.of(c2)).map(RowCollectors::toFirst);
        return CompositeFuture.all(t1f, t2f)
                .map(c -> {
                    Optional<Team> t1 = c.resultAt(0);
                    Optional<Team> t2 = c.resultAt(1);
                    if (t1.isEmpty() || t2.isEmpty()) {
                        return Optional.empty();
                    } else {
                        return Optional.of(new Teams(t1.get(), t2.get()));
                    }
                });
    }

    private PreparedQuery<RowSet<Team>> prepareFindByCode() {
        return connection.preparedQuery("SELECT id, code_short, code_long, name from team where code_long = $1")
                .mapping(FindTeams::mapRow);
    }

    public void close() {
        connection.close();
    }
}
