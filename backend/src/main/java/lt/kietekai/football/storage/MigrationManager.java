package lt.kietekai.football.storage;

import io.vertx.core.Future;
import io.vertx.sqlclient.Row;
import io.vertx.sqlclient.SqlConnection;
import io.vertx.sqlclient.Tuple;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;

public class MigrationManager {
    private static final Logger log = LogManager.getLogger("migrations");

    private final SqlConnection connection;

    private final List<ExecutableMigration> allMigrations = new ArrayList<>();
    private final MessageDigest sha256;

    public MigrationManager(SqlConnection connection) {
        this.connection = connection;
        try {
            sha256 = MessageDigest.getInstance("SHA256");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }

        addMigration("001_team_create.sql");
        addMigration("002_auth_user_create.sql");
        addMigration("003_game_create.sql");
        addMigration("004_guess_create.sql");
        addMigration("005_points_create.sql");
        addMigration("006_auth_user_add_names.sql");

    }

    public Future<Integer> migrate() {
        return loadMigrations()
                .compose(this::missingMigrations)
                .compose(this::perform);
    }

    private Future<List<Migration>> loadMigrations() {
        return ensureTable()
                .compose(unused -> connection.prepare("SELECT id, name, hash from meta_migrations order by id"))
                .compose(st -> st.query().mapping(Migration::fromRow).execute())
                .map(RowCollectors::toList);
    }

    private Future<Void> ensureTable() {
        return connection.prepare("CREATE TABLE IF NOT EXISTS meta_migrations(id bigserial primary key, name varchar not null, hash varchar not null)")
                .compose(st -> st.query().execute())
                .map((Void)null);
    }


    private Future<List<ExecutableMigration>> missingMigrations(List<Migration> knownMigrations) {
        List<ExecutableMigration> missing = new ArrayList<>(allMigrations);
        Iterator<ExecutableMigration> it = missing.iterator();
        while (it.hasNext()) {
            ExecutableMigration m = it.next();
            Optional<Migration> alreadyPerformed = knownMigrations.stream().filter(migration -> migration.name.equals(m.name)).findFirst();
            if (alreadyPerformed.isPresent()) {
                if (m.hash.equals(alreadyPerformed.get().hash)) {
                    it.remove();
                } else {
                    return Future.failedFuture(new IllegalStateException("Migration " + m.name + " was already performed but it's hash differ. You should probably recreate the whole database"));
                }
            }
        }
        return Future.succeededFuture(missing);
    }

    private Future<Integer> perform(List<ExecutableMigration> migrations) {
        Future<Integer> fut = Future.succeededFuture(0);
        for (ExecutableMigration m : migrations) {
            fut = fut.compose(count -> performSingle(m).map(count + 1));
        }

        return fut;
    }

    private Future<String> performSingle(ExecutableMigration migration) {
        log.info("Executing migration {}", migration.name);
        log.info("{}", migration.content);
        return connection.query(migration.content).execute()
                .compose(rows -> connection.prepare("INSERT INTO meta_migrations(name, hash) VALUES ($1, $2)")
                        .compose(preparedStatement -> preparedStatement.query().execute(Tuple.of(migration.name, migration.hash))))
                .map(migration.name);
    }

    private void addMigration(String name) {
        try (var is = MigrationManager.class.getResourceAsStream("/migrations/" + name)) {
            if (is == null) {
                throw new IllegalArgumentException("No such migration: " + name);
            }
            try (var r = new BufferedReader(new InputStreamReader(is))) {
                String query = r.lines().collect(Collectors.joining());
                String hash = Base64.getEncoder().encodeToString(sha256.digest(query.getBytes(StandardCharsets.UTF_8)));
                allMigrations.add(new ExecutableMigration(name, query, hash));
            }
        } catch (IOException e) {
            throw new IllegalStateException("Can't close resource stream to migration " + name);
        }
    }

    private static record Migration(long id, String name, String hash) {
        public static Migration fromRow(Row row) {
            return new Migration(row.getLong(0), row.getString(1), row.getString(2));
        }
    }

    private static record ExecutableMigration(String name, String content, String hash) {
    }
}
