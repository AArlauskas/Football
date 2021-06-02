package lt.kietekai.football.api.models;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.Temporal;
import java.time.temporal.TemporalQueries;

public class Formatters {
    private static final DateTimeFormatter dateFmt = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm");
    private Formatters() {
    }

    public static String toDate(Temporal date) {
        return dateFmt.format(date);
    }

    public static String toTime(Temporal date) {
        return timeFmt.format(date);
    }

    public static LocalDateTime fromParts(String date, String time) {
        return LocalDateTime.of(
                dateFmt.parse(date, TemporalQueries.localDate()),
                timeFmt.parse(time, TemporalQueries.localTime())
        );
    }
}
