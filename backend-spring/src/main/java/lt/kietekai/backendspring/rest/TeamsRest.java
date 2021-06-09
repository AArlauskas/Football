package lt.kietekai.backendspring.rest;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.rest.models.Game;
import lt.kietekai.backendspring.rest.models.Team;
import lt.kietekai.backendspring.storage.repositories.GameRepository;
import lt.kietekai.backendspring.storage.repositories.TeamRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/teams")
public class TeamsRest {
    private final TeamRepository teamRepository;
    private final GameRepository gameRepository;

    @GetMapping
    public List<Team> all() {
        return teamRepository.findAll(Sort.by("longCode")).stream()
                .map(t -> new Team(t.getLongCode(), t.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/games")
    public List<Game> teamGames(@RequestParam(required = false) String code) {
        lt.kietekai.backendspring.storage.models.Team team = teamRepository.findByLongCode(code).orElseThrow(ResourceNotFoundException::new);
        return gameRepository.getFinishedWithTeam(team).stream()
                .map(Converters::game)
                .collect(Collectors.toList());
    }


}
