package lt.kietekai.football;

import io.vertx.core.Vertx;
import lt.kietekai.football.api.ApiVerticle;
import lt.kietekai.football.storage.StorageVerticle;

public class Main {
    public static void main(String[] args) {
        var vertx = Vertx.vertx();

        vertx.deployVerticle(new ApiVerticle());
        vertx.deployVerticle(new StorageVerticle());
    }
}
