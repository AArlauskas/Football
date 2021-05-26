package lt.kietekai.football.api.models;

import java.time.Instant;
import java.time.temporal.Temporal;

public record Game(long id, Team team1, Team team2, String date, String time, GameState state, Result result) {

    public Game(long id, Team team1, Team team2, Instant date, GameState state, Result result) {
        this(id, team1, team2, Formatters.toDate(date), Formatters.toTime(date), state, result);
    }

    public Game(long id, Team team1, Team team2, Temporal date, GameState state, Result result) {
        this(id, team1, team2, Formatters.toDate(date), Formatters.toTime(date), state, result);
    }

}
