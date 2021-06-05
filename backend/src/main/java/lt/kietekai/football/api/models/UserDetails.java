package lt.kietekai.football.api.models;

public record UserDetails(long id, String email, String firstName, String lastName, int points, int correct, int correctOutcomes) {
}
