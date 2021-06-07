package lt.kietekai.backendspring.rest.models;

import java.time.LocalDateTime;

public record Version(String version, LocalDateTime date) {
}
