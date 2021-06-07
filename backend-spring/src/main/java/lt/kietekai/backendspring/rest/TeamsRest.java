package lt.kietekai.backendspring.rest;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.rest.models.Team;
import lt.kietekai.backendspring.storage.repositories.TeamRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/teams")
public class TeamsRest {
    private final TeamRepository teamRepository;

    @GetMapping
    public List<Team> all() {
        return teamRepository.findAll(Sort.by("longCode")).stream()
                .map(t -> new Team(t.getLongCode(), t.getName()))
                .collect(Collectors.toList());
    }
}
