package lt.kietekai.football.api;

import io.vertx.core.Handler;
import io.vertx.ext.web.RoutingContext;

public class RestrictedHandler implements Handler<RoutingContext> {
    @Override
    public void handle(RoutingContext ctx) {
        if (ctx.user() == null || ctx.user().get("id") == null) {
            ctx.fail(401);
        } else {
            ctx.next();
        }
    }
}
