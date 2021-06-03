package lt.kietekai.football.api;

import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.User;
import io.vertx.ext.auth.VertxContextPRNG;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import lt.kietekai.football.api.models.UserDetails;
import lt.kietekai.football.api.models.UserPrototype;
import lt.kietekai.football.storage.models.NewUser;
import lt.kietekai.football.storage.models.UserWithPoints;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
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
                        var user = message.body().get();
                        validatePassword(plaintext, message.body().get().password())
                                .onFailure(ctx::fail)
                                .onSuccess(authenticated -> {
                                    if (!authenticated) {
                                        ctx.clearUser();
                                        ctx.response().setStatusCode(400).end();
                                    } else {
                                        ctx.setUser(User.create(new JsonObject().put("id", user.id())));
                                        ctx.json(ctx.user().principal());
                                    }
                                });
                    }
                });
    }


    private void logout(RoutingContext ctx) {
        ctx.clearUser();
        ctx.json(new JsonObject());
    }

    private Future<String> hashPassword(String plaintext) {
        return hashPassword(plaintext, VertxContextPRNG.current().nextString(8));
    }

    private Future<String> hashPassword(String plaintext, String salt) {
        return vertx.executeBlocking(promise -> {
            MessageDigest sha256;
            try {
                sha256 = MessageDigest.getInstance("SHA256");
            } catch (NoSuchAlgorithmException e) {
                throw new IllegalStateException("No sha256", e);
            }
            var srcSink = new ByteArrayOutputStream();
            try {
                srcSink.write(salt.getBytes(StandardCharsets.UTF_8));
                srcSink.write(plaintext.getBytes(StandardCharsets.UTF_8));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            var hash = srcSink.toByteArray();
            for (int i = 0; i < 1000; i++) {
                hash = sha256.digest(hash);
            }
            promise.complete(salt + "|" + Base64.getEncoder().encodeToString(hash));
        });
    }

    private Future<Boolean> validatePassword(String plaintext, String hash) {
        var parts = hash.split("\\|");
        if (parts.length != 2) {
            return Future.succeededFuture(false);
        }
        return hashPassword(plaintext, parts[0])
                .map(calculatedHash -> calculatedHash.equals(hash));
    }

}
