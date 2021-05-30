package lt.kietekai.football.storage.models;

import io.vertx.sqlclient.Row;

public record Team(long id, String shortCode, String longCode, String name) {
    public static Team fromRow(Row row) {
        return new Team(row.getLong(0), row.getString(1), row.getString(2), row.getString(3));

    }
}
