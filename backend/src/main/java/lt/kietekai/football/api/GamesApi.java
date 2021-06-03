package lt.kietekai.football.api;

import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import lt.kietekai.football.api.converters.GameWithGuessConverter;
import lt.kietekai.football.api.models.GamePrototype;
import lt.kietekai.football.storage.models.GameWithGuess;
import lt.kietekai.football.storage.models.NewGame;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class GamesApi {
    private final Vertx vertx;

    public GamesApi(Vertx vertx) {
        this.vertx = vertx;
    }

    public Router mount(Router router) {

        router.get("/").handler(this::getGames);
        router.post("/").handler(this::createGame);
        return router;
    }

    private void getGames(RoutingContext ctx) {
        var converter = new GameWithGuessConverter(false, Instant.now());
        vertx.eventBus().<List<GameWithGuess>>request("storage/player/games", -1L)
                .map(listMessage -> listMessage.body().stream().map(converter).collect(Collectors.toList()))
                .onSuccess(ctx::json)
                .onFailure(ctx::fail);
    }

    private void createGame(RoutingContext ctx) {
        var converter = new GameWithGuessConverter(false, Instant.now());
        GamePrototype prototype = ctx.getBodyAsJson().mapTo(GamePrototype.class);
        vertx.eventBus().<Optional<GameWithGuess>>request("storage/games/create", new NewGame(prototype.team1(), prototype.team2(), prototype.fullDate()))
                .onSuccess(message ->
                        message.body().map(converter).ifPresentOrElse(ctx::json, () -> ctx.response().setStatusCode(400).end())
                )
                .onFailure(ctx::fail);
    }
}