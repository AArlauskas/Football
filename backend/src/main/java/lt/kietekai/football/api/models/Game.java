package lt.kietekai.football.api.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.time.temporal.Temporal;

public record Game(long id, Team team1, Team team2, String date, String time, GameState state, Result result, @JsonInclude(JsonInclude.Include.NON_NULL) Result guess) {

    public Game(long id, Team team1, Team team2, Temporal date, GameState state, Result result, Result guess) {
        this(id, team1, team2, Formatters.toDate(date), Formatters.toTime(date), state, result, guess);
    }
}
