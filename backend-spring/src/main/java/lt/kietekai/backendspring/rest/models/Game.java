package lt.kietekai.backendspring.rest.models;

public record Game(Long id, Team t1, Team t2, String date, String time, GameState state, Result result) {
}
