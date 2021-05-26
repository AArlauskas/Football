package lt.kietekai.football.api.models;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.temporal.Temporal;

public class Formatters {
    private Formatters() {}

    private static final DateTimeFormatter dateFmt = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm");

    public static String toDate(Temporal date) {
        return dateFmt.format(date);
    }

    public static String toTime(Temporal date) {
        return timeFmt.format(date);
    }

}
