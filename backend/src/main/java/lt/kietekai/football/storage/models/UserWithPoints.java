package lt.kietekai.football.storage.models;

public record UserWithPoints(long id, String email, String firstName, String lastName, String password, Points points) {
}
