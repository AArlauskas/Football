package lt.kietekai.football;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.CorsHandler;
import io.vertx.ext.web.handler.SessionHandler;
import io.vertx.ext.web.sstore.SessionStore;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Date;

public class ApiVerticle extends AbstractVerticle {
    private static final Logger log = LogManager.getLogger("api");

    @Override
    public void start(Promise<Void> startPromise) {
        var port = 8080;
        var host = "192.168.88.15";
        log.info("Creating http server");
        var server = vertx.createHttpServer();


        var rootRouter = Router.router(vertx);
        rootRouter.route().handler(CorsHandler.create("((http://)|(https://))localhost\\:\\d+")
                .allowedMethod(HttpMethod.GET)
                .allowedMethod(HttpMethod.POST)
                .allowedMethod(HttpMethod.OPTIONS)
                .allowCredentials(true)
                .allowedHeader("Access-Control-Allow-Method")
                .allowedHeader("Access-Control-Allow-Origin")
                .allowedHeader("Access-Control-Allow-Credentials")
                .allowedHeader("Content-Type")
                .allowedHeader("Authorization")
            );

        rootRouter.route().handler(SessionHandler.create(SessionStore.create(vertx)));
        rootRouter.get("/api/version").handler(event -> {
            System.out.println("Request from " + event.session().id());
            event.json(new JsonObject()
                            .put("version", "1.0.0")
                            .put("serverTime", new Date().getTime()));
                }
        );


        server.requestHandler(rootRouter);

        log.info("Starting http server at {}:{}", host, port);
        server.listen(port, host)
                .onSuccess(ev -> log.info("Server started"))
                .onSuccess(ev -> startPromise.complete())
                .onFailure(startPromise::fail);
    }
}
