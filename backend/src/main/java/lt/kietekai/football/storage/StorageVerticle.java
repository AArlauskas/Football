package lt.kietekai.football.storage;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.pgclient.PgConnectOptions;
import io.vertx.pgclient.PgPool;
import io.vertx.sqlclient.PoolOptions;
import io.vertx.sqlclient.RowSet;
import io.vertx.sqlclient.SqlConnection;
import io.vertx.sqlclient.Tuple;
import lt.kietekai.football.storage.models.Team;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

public class StorageVerticle extends AbstractVerticle {
    private static final Logger log = LogManager.getLogger("storage");
    private PgPool client;

    private static <T> Optional<T> single(RowSet<T> row) {
        if (row.size() == 0) {
            return Optional.empty();
        }
        if (row.size() > 1) {
            log.warn("More than one record found, returning first one.");
        }
        return Optional.of(row.iterator().next());
    }

    @Override
    public void start(Promise<Void> startPromise) {
        log.info("Deploying storage verticle");
        var options = PgConnectOptions.fromUri(System.getenv("PG_URI"))
                .setPassword(System.getenv("PG_PASSWORD"));

        log.info("Creating postgres connection to {}", System.getenv("PG_URI"));
        client = PgPool.pool(vertx, options, new PoolOptions());

        client.getConnection()
                .onFailure(cause -> {
                    log.error("Initial connection to the database failed", cause);
                    startPromise.fail(cause);
                })
                .compose(con -> {
                    log.info("Connected to {} version {}", con.databaseMetadata().productName(), con.databaseMetadata().fullVersion());
                    return new MigrationManager(con).migrate();
                })
                .onSuccess(count -> log.info("Migrations performed: {}", count))
                .compose(ignored -> client.getConnection())
                .compose(this::createTeams)
                .onSuccess(count -> {
                    log.info("{} teams created", count);
                    startPromise.complete();
                })
                .onFailure(cause -> {
                    log.error("Migration failed", cause);
                    startPromise.fail(cause);
                });
    }

    private Future<Integer> createTeams(SqlConnection connection) {
        Future<Integer> fut = Future.succeededFuture(0);
        List<Team> teams = teams();
        for (Team t : teams) {
            fut = fut.compose(count -> ensureTeam(connection, t).map(added -> added ? count + 1 : count));
        }
        return fut;
    }

    private Future<Boolean> ensureTeam(SqlConnection connection, Team team) {
        return findTeamByLongCode(connection, team.longCode())
                .compose(savedTeam -> {
                    if (savedTeam.isPresent()) {
                        // Team is already present, no need to add it
                        return Future.succeededFuture(false);
                    } else {
                        return connection.prepare("INSERT into team(code_short, code_long, name) values ($1, $2, $3)")
                                .compose(st -> st.query().execute(Tuple.of(team.shortCode(), team.longCode(), team.name())))
                                .map(true);
                    }
                });
    }

    private Future<Optional<Team>> findTeamByLongCode(SqlConnection connection, String code) {
        return connection.prepare("SELECT id, id, code_short, code_long, name from team where code_long = $1")
                .compose(st -> st.query().mapping(Team::fromRow).execute(Tuple.of(code)))
                .map(StorageVerticle::single);
    }

    private List<Team> teams() {
        try (var is = StorageVerticle.class.getResourceAsStream("/teams.csv")) {
            try (var r = new BufferedReader(new InputStreamReader(Objects.requireNonNull(is)))) {
                return r.lines()
                        .filter(s -> !s.isBlank())
                        .map(s -> {
                            String[] parts = s.split(",");
                            return new Team(-1, parts[0].strip().toUpperCase(), parts[1].strip().toUpperCase(), parts[2].strip());
                        })
                        .collect(Collectors.toList());
            }
        } catch (IOException e) {
            throw new IllegalStateException("Can't close resource stream to teams list");
        }

    }
}
