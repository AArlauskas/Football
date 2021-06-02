package lt.kietekai.football.storage.models;

import java.time.temporal.Temporal;

public record GameWithGuess(long gameId, Team t1, Team t2, Temporal date, Temporal closed, Temporal finished,
                            Result outcome, Result guess) {
    public GameWithGuess(long gameId, Team t1, Team t2, Temporal date) {
        this(gameId, t1, t2, date, null, null, null, null);
    }
}
