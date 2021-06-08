package lt.kietekai.backendspring.rest;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.rest.models.Points;
import lt.kietekai.backendspring.rest.models.UserDetails;
import lt.kietekai.backendspring.storage.FullUserDetails;
import lt.kietekai.backendspring.storage.repositories.PointsRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/points")
@RequiredArgsConstructor
public class PointsRest {
    private final PointsRepository pointsRepository;

    @GetMapping
    public Points get(@RequestParam(required = false) Long userId, @AuthenticationPrincipal FullUserDetails userDetails) {
        long id = Optional.ofNullable(userId).orElse(userDetails.getUser().getId());
        lt.kietekai.backendspring.storage.models.Points p = pointsRepository.findById(id).orElseThrow(IllegalArgumentException::new);
        return new Points(p.getTotal(), p.getCorrect(), p.getOutcomes());
    }

    @GetMapping("/totals")
    public List<UserDetails> getTotals() {
        List<lt.kietekai.backendspring.storage.models.Points> points = pointsRepository.findAll(Sort.by(Sort.Order.asc("total"), Sort.Order.desc("correct"), Sort.Order.asc("id")));
        return points.stream()
                .map(Converters::usersPoints)
                .collect(Collectors.toList());
    }
}
