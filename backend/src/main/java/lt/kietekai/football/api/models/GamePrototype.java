package lt.kietekai.football.api.models;

import java.time.LocalDateTime;

public record GamePrototype(String team1, String team2, String date, String time) {
    public LocalDateTime fullDate() {
        return Formatters.fromParts(date, time);
    }
}
