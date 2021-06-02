package lt.kietekai.football.storage.models;


import java.time.LocalDateTime;

public record NewGame(String t1Code, String t2Code, LocalDateTime date) {
}
