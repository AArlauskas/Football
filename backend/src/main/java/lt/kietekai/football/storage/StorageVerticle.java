package lt.kietekai.football.storage;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.eventbus.Message;
import io.vertx.pgclient.PgConnectOptions;
import io.vertx.pgclient.PgPool;
import io.vertx.sqlclient.PoolOptions;
import io.vertx.sqlclient.SqlConnection;
import io.vertx.sqlclient.Tuple;
import lt.kietekai.football.storage.models.*;
import lt.kietekai.football.storage.queries.CrudGames;
import lt.kietekai.football.storage.queries.CrudUsers;
import lt.kietekai.football.storage.queries.FindGamesWithGuesses;
import lt.kietekai.football.storage.queries.FindTeams;
import lt.kietekai.football.utils.MessageAsHandler;
import lt.kietekai.football.utils.SimpleCodec;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

public class StorageVerticle extends AbstractVerticle {
    private static final Logger log = LogManager.getLogger("storage");
    private PgPool client;

    @Override
    public void start(Promise<Void> startPromise) {
        log.info("Deploying storage verticle");

        vertx.eventBus().registerDefaultCodec(ArrayList.class, new SimpleCodec<>());
        vertx.eventBus().registerDefaultCodec(Optional.class, new SimpleCodec<>());
        vertx.eventBus().registerDefaultCodec(NewGame.class, new SimpleCodec<>());
        vertx.eventBus().registerDefaultCodec(NewUser.class, new SimpleCodec<>());
        vertx.eventBus().registerDefaultCodec(NewGuess.class, new SimpleCodec<>());
        vertx.eventBus().registerDefaultCodec(GamesQuery.class, new SimpleCodec<>());

        vertx.eventBus().consumer("storage/teams", this::getTeams);
        vertx.eventBus().consumer("storage/player/games", this::getPlayerGames);
        vertx.eventBus().consumer("storage/games/create", this::createGame);
        vertx.eventBus().consumer("storage/users/create", this::createUser);
        vertx.eventBus().consumer("storage/users/findByEmail", this::findUserByEmail);
        vertx.eventBus().consumer("storage/guesses/make", this::makeGuess);


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
                    return new MigrationManager(con).migrate().onComplete(event -> con.close());
                })
                .onSuccess(count -> log.info("Migrations performed: {}", count))
                .compose(ignored -> client.getConnection())
                .compose(connection -> createTeams(connection).onComplete(event -> connection.close()))
                .onSuccess(count -> {
                    log.info("{} teams created", count);
                    startPromise.complete();
                })
                .onFailure(cause -> {
                    log.error("Migration failed", cause);
                    startPromise.fail(cause);
                });
    }

    private void getTeams(Message<Void> message) {
        client.getConnection()
                .map(FindTeams::new)
                .compose(q -> q.getAll().onComplete(event -> q.close()))
                .onComplete(new MessageAsHandler<>(message));
    }

    private void getPlayerGames(Message<GamesQuery> message) {
        if (message.body() == null) {
            message.reply(new GameWithGuess[0]);
            return;
        }
        client.getConnection()
                .map(FindGamesWithGuesses::new)
                .compose(q -> q.findByUser(message.body()).onComplete(event -> q.close()))
                .onComplete(new MessageAsHandler<>(message));
    }

    private void createGame(Message<NewGame> message) {
        if (message.body() == null) {
            message.reply(Optional.empty());
            return;
        }
        client.getConnection()
                .compose(connection -> new FindTeams(connection).findByCodes(message.body().t1Code(), message.body().t2Code())
                        .<Optional<GameWithGuess>>compose(teams -> {
                            if (teams.isEmpty()) {
                                return Future.succeededFuture(Optional.empty());
                            } else {
                                return new CrudGames(connection).create(teams.get().t1().id(), teams.get().t2().id(), message.body().date())
                                        .map(id -> Optional.of(new GameWithGuess(id, teams.get().t1(), teams.get().t2(), message.body().date())));
                            }
                        }).onComplete(event -> connection.close())
                )
                .onComplete(new MessageAsHandler<>(message));
    }

    private void createUser(Message<NewUser> message) {
        if (message.body() == null) {
            message.reply(Optional.empty());
            return;
        }
        client.getConnection()
                .compose(connection -> new CrudUsers(connection).create(message.body()).onComplete(event -> connection.close()))
                .map(userId -> Optional.of(new UserWithPoints(userId, message.body().email(), message.body().firstName(), message.body().lastName(), message.body().password(), new Points(0, 0))))
                .otherwise(cause -> {
                    log.error("Failed to create a user", cause);
                    return Optional.empty();
                })
                .onComplete(new MessageAsHandler<>(message));
    }

    private void findUserByEmail(Message<String> message) {
        client.getConnection()
                .compose(connection -> new CrudUsers(connection).findByEmail(message.body()).onComplete(event -> connection.close()))
                .onComplete(new MessageAsHandler<>(message));
    }

    private void makeGuess(Message<NewGuess> message) {
        client.getConnection()
                .compose(connection -> new CrudGames(connection).makeGuess(message.body().userId(), message.body().gameId(), message.body().guess()).onComplete(event -> connection.close()))
                .onComplete(new MessageAsHandler<>(message));
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
        return new FindTeams(connection).findByLongCode(team.longCode())
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
