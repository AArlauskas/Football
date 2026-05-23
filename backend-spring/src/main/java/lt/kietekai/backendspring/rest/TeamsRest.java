package lt.kietekai.backendspring.rest;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.rest.models.Game;
import lt.kietekai.backendspring.rest.models.Team;
import lt.kietekai.backendspring.rest.models.TeamsStatistics;
import lt.kietekai.backendspring.storage.repositories.GameRepository;
import lt.kietekai.backendspring.storage.repositories.TeamRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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

    @GetMapping("/statistics")
    public List<TeamsStatistics> statistics() {
        Map<Long, TeamsStatisticsCounter> statistics = new LinkedHashMap<>();
        teamRepository.findAll(Sort.by("longCode")).forEach(team ->
                statistics.put(team.getId(), new TeamsStatisticsCounter(Converters.team(team))));

        gameRepository.getFinishedWithResults().forEach(game -> {
            TeamsStatisticsCounter team1 = statistics.get(game.getTeam1().getId());
            TeamsStatisticsCounter team2 = statistics.get(game.getTeam2().getId());

            if (game.getResult1().equals(game.getResult2())) {
                team1.ties++;
                team2.ties++;
            } else if (game.getResult1() > game.getResult2()) {
                team1.won++;
                team2.lost++;
            } else {
                team1.lost++;
                team2.won++;
            }
        });

        return statistics.values().stream()
                .map(TeamsStatisticsCounter::toStatistics)
                .collect(Collectors.toList());
    }

    @GetMapping("/games")
    public List<Game> teamGames(@RequestParam(required = false) String code) {
        lt.kietekai.backendspring.storage.models.Team team = teamRepository.findByLongCode(code).orElseThrow(ResourceNotFoundException::new);
        return gameRepository.getFinishedWithTeam(team).stream()
                .map(Converters::game)
                .collect(Collectors.toList());
    }


    private static class TeamsStatisticsCounter {
        private final Team team;
        private int won;
        private int lost;
        private int ties;

        private TeamsStatisticsCounter(Team team) {
            this.team = team;
        }

        private TeamsStatistics toStatistics() {
            return new TeamsStatistics(team, won, lost, ties);
        }
    }
}
