package lt.kietekai.football.storage.queries;

import io.vertx.core.Future;
import io.vertx.sqlclient.Row;
import io.vertx.sqlclient.SqlConnection;
import io.vertx.sqlclient.Tuple;
import lt.kietekai.football.storage.RowCollectors;
import lt.kietekai.football.storage.models.NewUser;
import lt.kietekai.football.storage.models.Points;
import lt.kietekai.football.storage.models.UserWithPoints;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Optional;

public class CrudUsers {
    private static final Logger log = LogManager.getLogger("crud-users");
    private final SqlConnection connection;

    public CrudUsers(SqlConnection connection) {
        this.connection = connection;
    }

    private static UserWithPoints map(Row row) {
        log.info("Mapping user");
        return new UserWithPoints(
                row.getLong(0), row.getString(1), row.getString(2), row.getString(3), row.getString(4), new Points(row.getInteger(5), row.getInteger(6))
        );
    }

    public Future<Long> create(NewUser user) {
        return connection.preparedQuery("INSERT INTO auth_user(email, search_email, password, firstName, lastName) VALUES ($1, $2, $3, $4, $5) returning id")
                .mapping(row -> row.getLong(0))
                .execute(Tuple.of(user.email(), user.email().toUpperCase(), user.password(), user.firstName(), user.lastName()))
                .map(RowCollectors::toSingle)
                .onSuccess(userId -> connection.preparedQuery("INSERT INTO points(id, points, correct_guesses) values ($1, 0, 0)")
                        .execute(Tuple.of(userId)));
    }

    public Future<Optional<UserWithPoints>> findByEmail(String email) {
        log.info("Looking for user {}", email);
        return connection.preparedQuery("SELECT au.id, au.email, au.firstname, au.lastname, au.password, p.points, p.correct_guesses from auth_user au inner join points p on au.id = p.id where au.search_email = $1")
                .mapping(CrudUsers::map)
                .execute(Tuple.of(email.toUpperCase()))
                .map(RowCollectors::toFirst);
    }
}
