package lt.kietekai.backendspring.rest.models;

import java.util.List;

public record OngoingGame(Game game, Result currentResult, String matchTime, List<GuessWithUser> estimatedGuesses) {
}
