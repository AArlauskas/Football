package lt.kietekai.backendspring.rest;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.rest.models.ResetPasswordRequest;
import lt.kietekai.backendspring.rest.models.ResetPasswordResponse;
import lt.kietekai.backendspring.rest.models.UserSummary;
import lt.kietekai.backendspring.rest.models.UserDetails;
import lt.kietekai.backendspring.storage.FullUserDetails;
import lt.kietekai.backendspring.storage.repositories.PointsRepository;
import lt.kietekai.backendspring.storage.repositories.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserRest {
    private static final int GENERATED_PASSWORD_BYTES = 18;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final PointsRepository pointsRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public UserDetails get(@RequestParam(required = false) Long user, @AuthenticationPrincipal FullUserDetails userDetails) {
        long id = Optional.ofNullable(user).orElse(userDetails.getUser().getId());
        lt.kietekai.backendspring.storage.models.Points p = pointsRepository.findById(id).orElseThrow(IllegalArgumentException::new);
        return Converters.usersPoints(p);
    }

    @GetMapping("/list")
    @PreAuthorize("hasAuthority('admin')")
    public List<UserSummary> listUsers() {
        return StreamSupport.stream(userRepository.findAll().spliterator(), false)
                .sorted(Comparator.comparing(user -> user.getFirstName() + " " + user.getLastName()))
                .map(user -> new UserSummary(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.roles()))
                .toList();
    }

    @PostMapping("/reset-password")
    @PreAuthorize("hasAuthority('admin')")
    public ResetPasswordResponse resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException();
        }

        var user = userRepository.findByEmailSearch(request.email().toUpperCase(Locale.ROOT))
                .orElseThrow(ResourceNotFoundException::new);
        var password = generatePassword();
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        return new ResetPasswordResponse(user.getEmail(), password);
    }

    private static String generatePassword() {
        var bytes = new byte[GENERATED_PASSWORD_BYTES];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
