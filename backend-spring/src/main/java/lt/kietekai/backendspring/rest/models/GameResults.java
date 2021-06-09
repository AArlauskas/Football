package lt.kietekai.backendspring.rest.models;

import java.util.List;

public record GameResults(Game game, List<GuessWithUser> guess) {
}
