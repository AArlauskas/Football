package lt.kietekai.football.api;

import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import lt.kietekai.football.api.models.GuessPrototype;
import lt.kietekai.football.storage.models.NewGuess;
import lt.kietekai.football.storage.models.Result;

public record GuessesApi(Vertx vertx) {
    public Router mount(Router router) {
        router.route().handler(new RestrictedHandler());

        router.post("/").handler(this::makeGuess);

        return router;
    }

    private void makeGuess(RoutingContext ctx) {
        GuessPrototype guess = ctx.getBodyAsJson().mapTo(GuessPrototype.class);
        if (guess.result() == null) {
            ctx.response().setStatusCode(400).end();
            return;
        }

        vertx.eventBus().request("storage/guesses/make", new NewGuess(ctx.user().get("id"), guess.gameId(), new Result(guess.result().goals1(), guess.result().goals2())))
                .onFailure(ctx::fail)
                .onSuccess(m -> ctx.end());
    }
}
