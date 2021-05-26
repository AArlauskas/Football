package lt.kietekai.football.api;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.SessionHandler;
import io.vertx.ext.web.sstore.SessionStore;
import lt.kietekai.football.api.models.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.*;
import java.util.function.Supplier;

public class ApiVerticle extends AbstractVerticle {
    private static final Logger log = LogManager.getLogger("api");

    @Override
    public void start(Promise<Void> startPromise) {
        var port = 8080;
        var host = "localhost";
        log.info("Creating http server");
        var server = vertx.createHttpServer();
        var rootRouter = Router.router(vertx);

        rootRouter.route().handler(SessionHandler.create(SessionStore.create(vertx)));
        rootRouter.get("/api/version").handler(this::handleVersion);
        rootRouter.get("/api/games").handler(this::handleGames);

        rootRouter.errorHandler(500, e -> log.error("Error while handing request", e.failure()));

        server.requestHandler(rootRouter);

        log.info("Starting http server at {}:{}", host, port);
        server.listen(port, host)
                .onSuccess(ev -> log.info("Server started"))
                .onSuccess(ev -> startPromise.complete())
                .onFailure(startPromise::fail);
    }

    private void handleVersion(RoutingContext ctx) {
        ctx.json(new Version("1.0.0", Instant.now()));
    }

    private void handleGames(RoutingContext ctx) {
        List<Game> games = new ArrayList<>();
        var g = new GameGenerator();
        games.addAll(g.genOpen());
        games.addAll(g.genClosed());
        games.addAll(g.genFinished());
        ctx.json(games);
    }

    private class GameGenerator {
        private final Random r = new Random(42);
        private final Instant now = Instant.now();

        private List<Game> genOpen() {
            return gen(now.plus(Duration.ofHours(2)), now.plus(Duration.ofDays(12)), GameState.OPEN);
        }

        private List<Game> genClosed() {
            return gen(now.minus(Duration.ofMinutes(5)), now.plus(Duration.ofHours(2)), GameState.CLOSED);
        }

        private List<Game> genFinished() {
            return gen(now.minus(Duration.ofDays(12)), now.plus(Duration.ofMinutes(5)), GameState.FINISHED);

        }

        private List<Game> gen(Instant from, Instant to, GameState state) {
            Supplier<Result> resultGen = () -> state != GameState.FINISHED ? null : new Result(r.nextInt(5), r.nextInt(5));

            return r.longs(7, from.getEpochSecond(), to.getEpochSecond())
                    .boxed()
                    .sorted(Collections.reverseOrder())
                    .map(Instant::ofEpochSecond)
                    .map(instant -> instant.atZone(ZoneOffset.systemDefault()))
                    .map(date -> new Game(Math.abs(r.nextLong()), t(), t(), date, state, resultGen.get()))
                    .toList();
        }

        private Team t() {
            var teams = Arrays.asList(
                    new Team("LTU", "Lietuva"),
                    new Team("ALB", "Albanija"),
                    new Team("BRG", "Bulgarija"),
                    new Team("FRA", "Prancūzija"),
                    new Team("DEU", "Vokietija"),
                    new Team("PER", "Peru")
            );
            return teams.get(r.nextInt(teams.size()));
        }

    }


}
