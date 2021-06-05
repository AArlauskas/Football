package lt.kietekai.football.api;

import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import lt.kietekai.football.storage.models.Points;

import java.util.Optional;

public class PointsApi {
    private final Vertx vertx;

    public PointsApi(Vertx vertx) {
        this.vertx = vertx;
    }

    public Router mount(Router router) {
        router.route().handler(new RestrictedHandler());

        router.get().handler(this::getPoints);
        return router;
    }

    private void getPoints(RoutingContext ctx) {
        Long ownId = ctx.user().get("id");
        Long queryId = Optional.ofNullable(ctx.request().getParam("user")).map(Long::valueOf).orElse(ownId);
        vertx.eventBus().<Points>request("storage/points/users", queryId)
                .onFailure(ctx::fail)
                .onSuccess(message -> ctx.json(new lt.kietekai.football.api.models.Points(message.body().points(), message.body().correct(), message.body().outcomes())));
    }
}
