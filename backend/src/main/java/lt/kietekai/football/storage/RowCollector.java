package lt.kietekai.football.storage;

import io.vertx.sqlclient.RowSet;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public class RowCollector<R> implements Function<RowSet<R>, List<R>> {

    @Override
    public List<R> apply(RowSet<R> rs) {
        var list = new ArrayList<R>(rs.size());
        for (R r : rs) {
            list.add(r);
        }
        return list;
    }
}
