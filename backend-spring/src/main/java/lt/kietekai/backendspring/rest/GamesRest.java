package lt.kietekai.backendspring.rest;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.rest.models.*;
import lt.kietekai.backendspring.storage.FullUserDetails;
import lt.kietekai.backendspring.storage.GamesService;
import lt.kietekai.backendspring.storage.repositories.GameRepository;
import lt.kietekai.backendspring.storage.repositories.GuessRepository;
import lt.kietekai.backendspring.storage.repositories.TeamRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/games")
public class GamesRest {
    private final GameRepository gameRepository;
    private final TeamRepository teamRepository;
    private final GuessRepository guessRepository;
    private final GamesService gamesService;

    @PreAuthorize("hasAuthority('admin')")
    @GetMapping
    public List<Game> allGames() {
        return gameRepository.findAll(Sort.by("gameDate", "id")).stream()
                .map(Converters::game)
                .collect(Collectors.toList());
    }

    @GetMapping("/guessed")
    public List<GameWithGuess> usersGames(@RequestParam(required = false) Long user, @RequestParam(required = false, defaultValue = "all") String filter, @AuthenticationPrincipal FullUserDetails userDetails) {
        GamesFilter queryFilter = GamesFilter.parse(filter);
        long id = Optional.ofNullable(user).orElse(userDetails.getUser().getId());
        boolean own = id == userDetails.getUser().getId();

        return queryGamesWithGuesses(queryFilter, id).stream()
                .map(Converters::gameWithGuess)
                .map(g -> {
                    if (!own && g.game().state() == GameState.OPEN) {
                        return new GameWithGuess(g.game(), null);
                    } else {
                        return g;
                    }
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/results")
    public GameResults results(@RequestParam Long game, @AuthenticationPrincipal FullUserDetails userDetails) {
        lt.kietekai.backendspring.storage.models.Game gameE = gameRepository.findById(game).orElseThrow(ResourceNotFoundException::new);
        List<lt.kietekai.backendspring.storage.models.Guess> guesses = guessRepository.findAllByGame(gameE, Sort.by(Sort.Order.asc("points"), Sort.Order.asc("id")));
        return new GameResults(Converters.game(gameE), guesses.stream()
                .map(Converters::guessWithUser)
                .map(g -> {
                    boolean own = g.user().id() == userDetails.getUser().getId();
                    if (!own && gameE.getClosed() == null) {
                        return new GuessWithUser(null, g.user());
                    } else {
                        return g;
                    }
                }).collect(Collectors.toList()));
    }


    private List<lt.kietekai.backendspring.storage.models.synthetic.GameWithGuess> queryGamesWithGuesses(GamesFilter filter, Long userId) {
        switch (filter) {
            case ALL -> {
                return gameRepository.getAllGamesWithGuesses(userId);
            }
            case TODAY -> {
                Calendar cal = Calendar.getInstance();
                cal.add(Calendar.HOUR_OF_DAY, 3);
                cal.set(Calendar.HOUR_OF_DAY, 0);
                cal.set(Calendar.MINUTE, 0);
                cal.set(Calendar.SECOND, 0);
                cal.set(Calendar.MILLISECOND, 0);
                return gameRepository.getFutureGamesWithGuesses(userId, cal.getTime());
            }
            case CLOSED -> {
                return gameRepository.getClosedGamesWithGuesses(userId);
            }
        }
        throw new IllegalArgumentException();
    }

    @PreAuthorize("hasAuthority('admin')")
    @PostMapping
    public Game createGame(@RequestBody Game game) throws ParseException {
        if (game.id() != null) {
            throw new IllegalArgumentException();
        }
        if (game.state() != null && game.state() != GameState.OPEN) {
            throw new IllegalArgumentException("Only open games can be created");
        }
        if (game.result() != null) {
            throw new IllegalArgumentException("New game shouldn't have a result");
        }
        lt.kietekai.backendspring.storage.models.Game g = new lt.kietekai.backendspring.storage.models.Game();
        g.setTeam1(teamRepository.findByLongCode(game.t1().code()).orElseThrow(IllegalArgumentException::new));
        g.setTeam2(teamRepository.findByLongCode(game.t2().code()).orElseThrow(IllegalArgumentException::new));
        g.setGameDate(Converters.parseDateFromParts(game.date(), game.time()));

        return Converters.game(gameRepository.save(g));
    }

    @PreAuthorize("hasAuthority('admin')")
    @PutMapping
    public Game updateGame(@RequestBody Game game) throws ParseException {
        lt.kietekai.backendspring.storage.models.Game stored = gameRepository.findById(game.id()).orElseThrow(ResourceNotFoundException::new);
        stored.setGameDate(Converters.parseDateFromParts(game.date(), game.time()));
        stored.setTeam1(teamRepository.findByLongCode(game.t1().code()).orElseThrow(IllegalArgumentException::new));
        stored.setTeam2(teamRepository.findByLongCode(game.t2().code()).orElseThrow(IllegalArgumentException::new));
        if (game.state() == null) {
            throw new IllegalArgumentException("No state set");
        }
        if (game.result() != null) {
            if (game.state() != GameState.FINISHED) {
                throw new IllegalArgumentException("Only finished games can have result");
            }
            stored.setResult1(game.result().goals1());
            stored.setResult2(game.result().goals2());
        }
        if (game.state() == GameState.OPEN) {
            return Converters.game(gamesService.openGame(stored));
        }
        if (game.state() == GameState.CLOSED) {
            return Converters.game(gamesService.closeGame(stored));
        }
        return Converters.game(gamesService.finishGame(stored));
    }
}
