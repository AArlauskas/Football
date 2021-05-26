package lt.kietekai.football;

import io.vertx.core.Vertx;
import lt.kietekai.football.api.ApiVerticle;

public class Main {
    public static void main(String[] args) {
        var vertx = Vertx.vertx();

        vertx.deployVerticle(new ApiVerticle());
    }
}
