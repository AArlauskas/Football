package lt.kietekai.football.storage;

import io.vertx.sqlclient.RowSet;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class RowCollectors {
    private RowCollectors() {
    }

    public static <R> List<R> toList(RowSet<R> rs) {
        var list = new ArrayList<R>(rs.size());
        for (R r : rs) {
            list.add(r);
        }
        return list;
    }

    public static <T> Optional<T> toFirst(RowSet<T> row) {
        if (row.size() == 0) {
            return Optional.empty();
        }
        return Optional.of(row.iterator().next());
    }

    public static <T> T toSingle(RowSet<T> row) {
        if (row.size() == 0) {
            return null;
        }
        return row.iterator().next();
    }

}
