package lt.kietekai.football.storage.models;

public record GamesQuery(long userId, boolean includeToday, boolean includeOpen) {
}
