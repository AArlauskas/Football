package lt.kietekai.backendspring.storage;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.NullNode;
import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.storage.models.Game;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;

@Component
@RequiredArgsConstructor
public class FifaMatchClient {
    private static final Logger log = LogManager.getLogger();
    private static final Duration CACHE_TTL = Duration.ofMinutes(1);
    private static final int FINISHED_MATCH_STATUS = 0;

    private final RestTemplateBuilder restTemplateBuilder;

    @Value("${match.fifa.url:${match.current-result.url:${match.seeder.url:${match.finisher.url:https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=285023}}}}")
    private String url;

    private JsonNode cachedMatches = NullNode.getInstance();
    private Instant cachedAt = Instant.EPOCH;

    public Optional<FifaResult> currentResult(Game game) {
        return cachedSnapshot().currentResult(game);
    }

    public Optional<FifaResult> finishedResult(Game game) {
        return freshSnapshot().finishedResult(game);
    }

    public MatchSnapshot cachedSnapshot() {
        return new MatchSnapshot(cachedMatches());
    }

    public MatchSnapshot freshSnapshot() {
        return new MatchSnapshot(fetchMatches());
    }

    private Optional<FifaResult> findResult(Game game, JsonNode matches, Predicate<JsonNode> scorePredicate) {
        if (!matches.isArray()) {
            return Optional.empty();
        }

        String homeCode = game.getTeam1().getLongCode();
        String awayCode = game.getTeam2().getLongCode();
        for (JsonNode match : matches) {
            if (!scorePredicate.test(match)) {
                continue;
            }
            if (teamCodeMatches(match.get("Home"), homeCode) && teamCodeMatches(match.get("Away"), awayCode)) {
                return Optional.of(new FifaResult(
                        totalScore(match, "HomeTeamScore", "HomeTeamPenaltyScore"),
                        totalScore(match, "AwayTeamScore", "AwayTeamPenaltyScore"),
                        textOrNull(match, "MatchTime")
                ));
            }
        }

        return Optional.empty();
    }

    private synchronized JsonNode cachedMatches() {
        Instant now = Instant.now();
        if (cachedAt.plus(CACHE_TTL).isAfter(now)) {
            return cachedMatches;
        }

        cachedMatches = fetchMatches();
        cachedAt = now;
        return cachedMatches;
    }

    private JsonNode fetchMatches() {
        try {
            RestTemplate restTemplate = restTemplateBuilder.build();
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            if (response == null || response.get("Results") == null) {
                return NullNode.getInstance();
            }
            return response.get("Results");
        } catch (RestClientException e) {
            log.warn("Failed to fetch FIFA matches from {}", url, e);
            return NullNode.getInstance();
        }
    }

    private boolean isFinalWithScore(JsonNode match) {
        return match.path("MatchStatus").asInt(-1) == FINISHED_MATCH_STATUS && hasScore(match);
    }

    private boolean hasScore(JsonNode match) {
        return match.hasNonNull("HomeTeamScore") && match.hasNonNull("AwayTeamScore");
    }

    private int totalScore(JsonNode match, String regularScoreField, String penaltyScoreField) {
        return match.get(regularScoreField).asInt() + match.path(penaltyScoreField).asInt(0);
    }

    private String textOrNull(JsonNode match, String field) {
        String value = match.path(field).asText(null);
        return value == null || value.isBlank() ? null : value;
    }

    private boolean teamCodeMatches(JsonNode team, String code) {
        if (team == null || code == null) {
            return false;
        }

        return code.equalsIgnoreCase(team.path("IdCountry").asText())
                || code.equalsIgnoreCase(team.path("Abbreviation").asText())
                || code.equalsIgnoreCase(team.path("IdAssociation").asText());
    }

    public record FifaResult(int goals1, int goals2, String matchTime) {
    }

    public class MatchSnapshot {
        private final JsonNode matches;

        private MatchSnapshot(JsonNode matches) {
            this.matches = matches;
        }

        public Optional<FifaResult> currentResult(Game game) {
            return findResult(game, matches, FifaMatchClient.this::hasScore);
        }

        public Optional<FifaResult> finishedResult(Game game) {
            return findResult(game, matches, FifaMatchClient.this::isFinalWithScore);
        }

        public List<JsonNode> matches() {
            if (!matches.isArray()) {
                return List.of();
            }

            List<JsonNode> result = new ArrayList<>();
            matches.forEach(result::add);
            return result;
        }
    }
}
