package lt.kietekai.football.storage;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.pgclient.PgConnectOptions;
import io.vertx.pgclient.PgPool;
import io.vertx.sqlclient.PoolOptions;
import io.vertx.sqlclient.SqlConnection;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class StorageVerticle extends AbstractVerticle {
    private static final Logger log = LogManager.getLogger("storage");
    private PgPool client;

    @Override
    public void start(Promise<Void> startPromise) {
        log.info("Deploying storage verticle");
        var options = PgConnectOptions.fromUri(System.getenv("PG_URI"))
                .setPassword(System.getenv("PG_PASSWORD"));

        log.info("Creating postgres connection to {}", System.getenv("PG_URI"));
        client = PgPool.pool(vertx, options, new PoolOptions());

        client.getConnection()
                .onFailure(cause -> {
                    log.error("Initial connection to the database failed", cause);
                    startPromise.fail(cause);
                })
                .compose(con -> {
                    log.info("Connected to {} version {}", con.databaseMetadata().productName(), con.databaseMetadata().fullVersion());
                    return new MigrationManager(con).migrate();
                })
                .onSuccess(count -> log.info("Migrations performed: {}", count))
                .compose(ignored -> client.getConnection())
                .compose(this::createTeams)
                .onSuccess(count -> {
                    log.info("{} teams created", count);
                    startPromise.complete();
                })
                .onFailure(cause -> {
                    log.error("Migration failed", cause);
                    startPromise.fail(cause);
                });
    }

    private Future<Integer> createTeams(SqlConnection connection) {
        Future<Integer> fut = Future.succeededFuture(0);
        return fut;
    }
}
