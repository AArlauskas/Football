package lt.kietekai.football.api;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpMethod;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;
import io.vertx.ext.web.handler.SessionHandler;
import io.vertx.ext.web.sstore.SessionStore;
import lt.kietekai.football.api.models.Version;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.Instant;

public class ApiVerticle extends AbstractVerticle {
    private static final Logger log = LogManager.getLogger("api");

    @Override
    public void start(Promise<Void> startPromise) {
        var port = 8080;
        var host = "localhost";
        log.info("Creating http server");
        var server = vertx.createHttpServer();
        var rootRouter = Router.router(vertx);

        rootRouter.route("/api/*").handler(SessionHandler.create(SessionStore.create(vertx)));
        rootRouter.route("/api/*").handler(BodyHandler.create(false));
        rootRouter.route("/api/*").failureHandler(this::handleFailure);
        rootRouter.route().handler(CorsHandler.create(".*.")
                .allowedMethod(HttpMethod.GET)
                .allowedMethod(HttpMethod.POST)
                .allowedMethod(HttpMethod.OPTIONS)
                .allowedMethod(HttpMethod.DELETE)
                .allowedMethod(HttpMethod.PUT)
                .allowedHeader("Access-Control-Request-Method")
                .allowedHeader("Access-Control-Allow-Credentials")
                .allowedHeader("Access-Control-Allow-Origin")
                .allowedHeader("Access-Control-Allow-Headers")
                .allowedHeader("Content-Type"));

        rootRouter.get("/api/version").handler(this::getVersion);

        rootRouter.mountSubRouter("/api/auth", new AuthApi(vertx).mount(Router.router(vertx)));
        rootRouter.mountSubRouter("/api/games", new GamesApi(vertx).mount(Router.router(vertx)));
        rootRouter.mountSubRouter("/api/teams", new TeamsApi(vertx).mount(Router.router(vertx)));
        rootRouter.mountSubRouter("/api/guesses", new GuessesApi(vertx).mount(Router.router(vertx)));
        rootRouter.mountSubRouter("/api/points", new PointsApi(vertx).mount(Router.router(vertx)));

        rootRouter.errorHandler(500, e -> log.error("Error while handing request", e.failure()));

        server.requestHandler(rootRouter);

        log.info("Starting http server at {}:{}", host, port);
        server.listen(port, host)
                .onSuccess(ev -> log.info("Server started"))
                .onSuccess(ev -> startPromise.complete())
                .onFailure(cause -> {
                    log.error("Server didn't start", cause);
                    startPromise.fail(cause);
                });
    }

    private void getVersion(RoutingContext ctx) {
        ctx.json(new Version("1.0.0", Instant.now()));
    }

    private void handleFailure(RoutingContext ctx) {
        if (ctx.failure() != null) {
            log.error("Error while handling a request", ctx.failure());
        }
        if (ctx.failure() instanceof IllegalArgumentException) {
            ctx.response().setStatusCode(400).end();
        } else {
            ctx.response().setStatusCode(ctx.statusCode()).end();
        }
    }
}
