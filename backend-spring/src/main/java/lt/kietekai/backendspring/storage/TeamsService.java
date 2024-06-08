package lt.kietekai.backendspring.storage;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.storage.models.Team;
import lt.kietekai.backendspring.storage.repositories.TeamRepository;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamsService {
    private final TeamRepository teamRepository;
    @PostConstruct
    public void createMissingTeams() {
        for (Team t : teams()) {
            if (teamRepository.findByLongCode(t.getLongCode()).isEmpty()) {
                teamRepository.save(t);
            }
        }
    }

    private List<Team> teams() {
        try (var is = TeamsService.class.getResourceAsStream("/teams.csv")) {
            try (var r = new BufferedReader(new InputStreamReader(Objects.requireNonNull(is), StandardCharsets.UTF_8))) {
                return r.lines()
                        .filter(s -> !s.isBlank())
                        .map(s -> {
                            String[] parts = s.split(",");
                            return new Team(null, parts[0].strip().toUpperCase(), parts[1].strip().toUpperCase(), parts[2].strip());
                        })
                        .collect(Collectors.toList());
            }
        } catch (IOException e) {
            throw new IllegalStateException("Can't close resource stream to teams list");
        }
    }
}
