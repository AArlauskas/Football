package lt.kietekai.backendspring.rest;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.rest.models.LoginDetails;
import lt.kietekai.backendspring.rest.models.Points;
import lt.kietekai.backendspring.rest.models.UserDetails;
import lt.kietekai.backendspring.rest.models.UserPrototype;
import lt.kietekai.backendspring.storage.FullUserDetails;
import lt.kietekai.backendspring.storage.GamesService;
import lt.kietekai.backendspring.storage.models.User;
import lt.kietekai.backendspring.storage.repositories.PointsRepository;
import lt.kietekai.backendspring.storage.repositories.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;


@RestController
@RequestMapping("/api/auth/")
@RequiredArgsConstructor
public class AuthRest {
    private final UserRepository userRepository;
    private final PointsRepository pointsRepository;
    private final GamesService gamesService;

    private final PasswordEncoder passwordEncoder;

    @PostMapping("register")
    public UserDetails register(@RequestBody UserPrototype userPrototype) {
        if (userRepository.findByEmailSearch(userPrototype.email().toUpperCase()).isPresent()) {
            throw new DataIntegrityViolationException("User with this email exists");
        }
        User u = userRepository.save(User.builder()
                .email(userPrototype.email())
                .emailSearch(userPrototype.email().toUpperCase())
                .firstName(userPrototype.firstName())
                .lastName(userPrototype.lastName())
                .password(passwordEncoder.encode(userPrototype.password()))
                .roles("player")
                .build());
        var points = new lt.kietekai.backendspring.storage.models.Points();
        points.setUser(u);
        u.setPoints(points);
        pointsRepository.save(points);

        gamesService.createMissingGuesses();
        gamesService.recalculatePoints();

        u = userRepository.findById(u.getId()).orElseThrow();
        return Converters.user(u);
    }

    @PostMapping("login")
    public UserDetails login(HttpServletRequest request, @RequestBody LoginDetails loginDetails) {
        User u = userRepository.findByEmailSearch(loginDetails.email().toUpperCase()).orElseThrow(IllegalArgumentException::new);
        if (!passwordEncoder.matches(loginDetails.password(), u.getPassword())) {
            throw new IllegalArgumentException();
        }
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(loginDetails.email(), loginDetails.password());
        token.setDetails(new FullUserDetails(u, u.getPoints()));
        var securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(token);
        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

        return Converters.user(u);
    }
}
