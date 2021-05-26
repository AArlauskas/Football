package lt.kietekai.football.api.models;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.Instant;

public record Version(
        String version,
        Instant datetime
) {
}
