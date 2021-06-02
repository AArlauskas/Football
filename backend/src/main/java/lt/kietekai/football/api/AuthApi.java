package lt.kietekai.football.api;

import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.User;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import lt.kietekai.football.api.models.UserDetails;
import lt.kietekai.football.api.models.UserPrototype;
import lt.kietekai.football.storage.models.NewUser;
import lt.kietekai.football.storage.models.UserWithPoints;

import java.util.Optional;

public class AuthApi {
    private final Vertx vertx;

    public AuthApi(Vertx vertx) {
        this.vertx = vertx;
    }

    Router mount(Router route) {
        route.post("/register").handler(this::register);
        route.post("/login").handler(this::login);
        route.post("/logout").handler(this::logout);
        return route;
    }

    private void register(RoutingContext ctx) {
        var prototype = ctx.getBodyAsJson().mapTo(UserPrototype.class);
        hashPassword(prototype.password())
                .map(hashedPassword -> new NewUser(prototype.email(), prototype.firstName(), prototype.lastName(), hashedPassword))
                .compose(newUser -> vertx.eventBus().<Optional<UserWithPoints>>request("storage/users/create", newUser))
                .onFailure(ctx::fail)
                .onSuccess(message -> message.body().map(u -> new UserDetails(u.id(), u.email(), u.firstName(), u.lastName(), u.points().points(), u.points().correct()))
                        .ifPresentOrElse(ctx::json, () -> ctx.response().setStatusCode(409).end()));
    }

    private void login(RoutingContext ctx) {
        var email = ctx.getBodyAsJson().getString("email");
        var plaintext = ctx.getBodyAsJson().getString("password");
        vertx.eventBus().<Optional<UserWithPoints>>request("storage/users/findByEmail", email)
                .onFailure(ctx::fail)
                .onSuccess(message -> {
                    if (message.body().isEmpty()) {
                        ctx.response().setStatusCode(400).end();
                    } else {
                        validatePassword(plaintext, message.body().get().password())
                                .onFailure(ctx::fail)
                                .onSuccess(authenticated -> {
                                    if (!authenticated) {
                                        ctx.clearUser();
                                        ctx.response().setStatusCode(400).end();
                                    } else {
                                        ctx.setUser(User.create(new JsonObject().put("id", message.body().get().id())));
                                        ctx.response().end();
                                    }
                                });
                    }
                });
    }


    private void logout(RoutingContext ctx) {
        ctx.clearUser();
        ctx.response().end();
    }

    private Future<String> hashPassword(String plaintext) {
        return Future.succeededFuture(plaintext);
    }

    private Future<Boolean> validatePassword(String plaintext, String hash) {
        return Future.succeededFuture(plaintext.equals(hash));
    }

}
