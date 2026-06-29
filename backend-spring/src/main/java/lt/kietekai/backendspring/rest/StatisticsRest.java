package lt.kietekai.backendspring.rest;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.rest.models.ChampionshipStatistics;
import lt.kietekai.backendspring.storage.StatisticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/statistics")
public class StatisticsRest {
    private final StatisticsService statisticsService;

    @GetMapping
    public ChampionshipStatistics getStatistics() {
        return statisticsService.getStatistics();
    }
}
