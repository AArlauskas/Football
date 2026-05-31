package lt.kietekai.backendspring.storage;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.storage.models.Game;
import lt.kietekai.backendspring.storage.models.Team;
import lt.kietekai.backendspring.storage.repositories.GameRepository;
import lt.kietekai.backendspring.storage.repositories.TeamRepository;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.TimeZone;
import java.util.stream.Collectors;

@Service
@DependsOn("teamsService")
@RequiredArgsConstructor
public class GamesSeeder {
    private final GameRepository gameRepository;
    private final TeamRepository teamRepository;

    @PostConstruct
    public void createMissingGames() {
        for (Fixture fixture : fixtures()) {
            Team team1 = teamRepository.findByLongCode(fixture.team1()).orElseThrow();
            Team team2 = teamRepository.findByLongCode(fixture.team2()).orElseThrow();

            if (gameRepository.existsByTeam1AndTeam2(team1, team2)) {
                continue;
            }

            Game game = new Game();
            game.setTeam1(team1);
            game.setTeam2(team2);
            game.setGameDate(fixture.gameDate());
            gameRepository.save(game);
        }
    }

    private List<Fixture> fixtures() {
        try (var is = GamesSeeder.class.getResourceAsStream("/seed-games.csv")) {
            try (var r = new BufferedReader(new InputStreamReader(Objects.requireNonNull(is), StandardCharsets.UTF_8))) {
                return r.lines()
                        .filter(s -> !s.isBlank())
                        .map(this::fixture)
                        .collect(Collectors.toList());
            }
        } catch (IOException e) {
            throw new IllegalStateException("Can't close resource stream to games list");
        }
    }

    private Fixture fixture(String line) {
        String[] parts = line.split(",");
        if (parts.length != 4) {
            throw new IllegalStateException("Expected date,time,team1,team2 in games list");
        }

        try {
            Date gameDate = dateFormatter().parse(parts[0].strip() + " " + parts[1].strip());
            return new Fixture(gameDate, parts[2].strip(), parts[3].strip());
        } catch (ParseException e) {
            throw new IllegalStateException("Can't parse game date from games list", e);
        }
    }

    private SimpleDateFormat dateFormatter() {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
        return formatter;
    }

    private record Fixture(Date gameDate, String team1, String team2) {
    }
}
