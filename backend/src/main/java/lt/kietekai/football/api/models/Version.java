package lt.kietekai.football.api.models;

import java.time.Instant;

public record Version(
        String version,
        Instant datetime
) {
}
