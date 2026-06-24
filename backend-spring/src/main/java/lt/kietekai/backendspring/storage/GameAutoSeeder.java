package lt.kietekai.backendspring.storage;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.storage.models.Game;
import lt.kietekai.backendspring.storage.models.Team;
import lt.kietekai.backendspring.storage.repositories.GameRepository;
import lt.kietekai.backendspring.storage.repositories.TeamRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.DependsOn;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.Optional;

@Component
@DependsOn("teamsService")
@RequiredArgsConstructor
public class GameAutoSeeder {
    private static final Logger log = LogManager.getLogger();
    private static final String[] TEAM_CODE_FIELDS = {"IdCountry", "Abbreviation", "IdAssociation"};

    private final GameRepository gameRepository;
    private final TeamRepository teamRepository;
    private final RestTemplateBuilder restTemplateBuilder;

    @Value("${match.seeder.enabled:true}")
    private boolean enabled;

    @Value("${match.seeder.url:https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=285023}")
    private String url;

    @PostConstruct
    public void seedOnStartup() {
        createMissingGames();
    }

    @Transactional
    @Scheduled(cron = "0 0 0/6 * * ?")
    public void createMissingGames() {
        if (!enabled) {
            return;
        }

        JsonNode matches = getMatches();
        if (matches == null || !matches.isArray()) {
            log.warn("Match seeder endpoint did not return a Results array");
            return;
        }

        int created = 0;
        int skipped = 0;
        for (JsonNode match : matches) {
            if (createGameIfMissing(match)) {
                created++;
            } else {
                skipped++;
            }
        }

        log.info("Game auto-seeder created {} games and skipped {}", created, skipped);
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
            log.warn("Failed to fetch match fixtures from {}", url, e);
            return null;
        }
    }

    private boolean createGameIfMissing(JsonNode match) {
        Optional<Team> team1 = findTeam(match.get("Home"));
        Optional<Team> team2 = findTeam(match.get("Away"));
        Optional<Date> gameDate = gameDate(match);
        if (team1.isEmpty() || team2.isEmpty() || gameDate.isEmpty()) {
            return false;
        }

        if (gameRepository.existsByTeam1AndTeam2(team1.get(), team2.get())) {
            return false;
        }

        Game game = new Game();
        game.setTeam1(team1.get());
        game.setTeam2(team2.get());
        game.setGameDate(gameDate.get());
        gameRepository.save(game);
        return true;
    }

    private Optional<Team> findTeam(JsonNode fifaTeam) {
        if (fifaTeam == null) {
            return Optional.empty();
        }

        for (String field : TEAM_CODE_FIELDS) {
            String code = fifaTeam.path(field).asText("");
            if (code.isBlank()) {
                continue;
            }

            Optional<Team> team = teamRepository.findByLongCode(code);
            if (team.isPresent()) {
                return team;
            }
        }

        return Optional.empty();
    }

    private Optional<Date> gameDate(JsonNode match) {
        String date = match.path("Date").asText("");
        if (date.isBlank()) {
            return Optional.empty();
        }

        try {
            return Optional.of(Date.from(Instant.parse(date)));
        } catch (DateTimeParseException e) {
            log.warn("Failed to parse FIFA match date {}", date, e);
            return Optional.empty();
        }
    }
}
