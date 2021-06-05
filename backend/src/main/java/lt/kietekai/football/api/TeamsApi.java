package lt.kietekai.football.api;

import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import lt.kietekai.football.api.converters.TeamConverter;
import lt.kietekai.football.storage.models.Team;

import java.util.List;
import java.util.stream.Collectors;

public class TeamsApi {
    private static final TeamConverter teamConverter = new TeamConverter();

    private final Vertx vertx;

    public TeamsApi(Vertx vertx) {
        this.vertx = vertx;
    }

    public Router mount(Router router) {
        router.route().handler(new RestrictedHandler());

        router.get("/").handler(this::getTeams);
        return router;
    }

    private void getTeams(RoutingContext ctx) {
        vertx.eventBus().<List<Team>>request("storage/teams", null)
                .map(listMessage -> listMessage.body().stream().map(teamConverter).collect(Collectors.toList()))
                .onSuccess(ctx::json)
                .onFailure(ctx::fail);
    }
}
