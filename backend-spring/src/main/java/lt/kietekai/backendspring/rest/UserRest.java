package lt.kietekai.backendspring.rest;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.rest.models.UserDetails;
import lt.kietekai.backendspring.storage.FullUserDetails;
import lt.kietekai.backendspring.storage.repositories.PointsRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserRest {
    private final PointsRepository pointsRepository;

    @GetMapping
    public UserDetails get(@RequestParam(required = false) Long user, @AuthenticationPrincipal FullUserDetails userDetails) {
        long id = Optional.ofNullable(user).orElse(userDetails.getUser().getId());
        lt.kietekai.backendspring.storage.models.Points p = pointsRepository.findById(id).orElseThrow(IllegalArgumentException::new);
        return Converters.usersPoints(p);
    }
}
