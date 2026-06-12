package lt.kietekai.backendspring;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.storage.GamesService;
import lt.kietekai.backendspring.storage.models.Game;
import lt.kietekai.backendspring.storage.repositories.GameRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import javax.transaction.Transactional;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class GameAutoFinisher {
    private static final Logger log = LogManager.getLogger();
    // 45 + 45 + 15 + 5 = 110 minutes (first half + second half + break + approximate extra time)
    private static final int EXPECTED_MATCH_DURATION_MINUTES = 110;

    private final GameRepository gameRepository;
    private final GamesService gamesService;
    private final RestTemplateBuilder restTemplateBuilder;

    @Value("${match.finisher.enabled:true}")
    private boolean enabled;

    @Value("${match.finisher.url:https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=285023}")
    private String url;

    @Transactional
    @Scheduled(cron = "0 * * * * ?")
    public void finishClosedMatches() {
        if (!enabled) {
            return;
        }

        List<Game> games = gameRepository.getClosedUnfinishedStartedBefore(matchEndCutoff());
        if (games.isEmpty()) {
            return;
        }

        JsonNode matches = getMatches();
        if (matches == null || !matches.isArray()) {
            log.warn("Match finisher endpoint did not return a Results array");
            return;
        }

        games.forEach(game -> finishIfResultFound(game, matches));
    }

    private Date matchEndCutoff() {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.MINUTE, -EXPECTED_MATCH_DURATION_MINUTES);
        return cal.getTime();
    }

    private JsonNode getMatches() {
        try {
            RestTemplate restTemplate = restTemplateBuilder.build();
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            if (response == null) {
                return null;
            }
            return response.get("Results");
        } catch (RestClientException e) {
            log.warn("Failed to fetch match results from {}", url, e);
            return null;
        }
    }

    private void finishIfResultFound(Game game, JsonNode matches) {
        Optional<JsonNode> match = findMatch(game, matches);
        if (match.isEmpty()) {
            log.info("No finished FIFA result found for game {}", game.getId());
            return;
        }

        JsonNode fifaMatch = match.get();
        game.setResult1(fifaMatch.get("HomeTeamScore").asInt());
        game.setResult2(fifaMatch.get("AwayTeamScore").asInt());
        gamesService.finishGame(game);

        log.info("Finished game {} with result {}-{}", game.getId(), game.getResult1(), game.getResult2());
    }

    private Optional<JsonNode> findMatch(Game game, JsonNode matches) {
        String homeCode = game.getTeam1().getLongCode();
        String awayCode = game.getTeam2().getLongCode();

        for (JsonNode match : matches) {
            if (!isFinalWithScore(match)) {
                continue;
            }
            if (teamCodeMatches(match.get("Home"), homeCode) && teamCodeMatches(match.get("Away"), awayCode)) {
                return Optional.of(match);
            }
        }

        return Optional.empty();
    }

    private boolean isFinalWithScore(JsonNode match) {
        return match.path("MatchStatus").asInt(-1) == 0
                && match.hasNonNull("HomeTeamScore")
                && match.hasNonNull("AwayTeamScore");
    }

    private boolean teamCodeMatches(JsonNode team, String code) {
        if (team == null || code == null) {
            return false;
        }

        return code.equalsIgnoreCase(team.path("IdCountry").asText())
                || code.equalsIgnoreCase(team.path("Abbreviation").asText())
                || code.equalsIgnoreCase(team.path("IdAssociation").asText());
    }
}
