package lt.kietekai.backendspring.rest;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.rest.models.Guess;
import lt.kietekai.backendspring.rest.models.GuessPrototype;
import lt.kietekai.backendspring.storage.FullUserDetails;
import lt.kietekai.backendspring.storage.models.Game;
import lt.kietekai.backendspring.storage.repositories.GameRepository;
import lt.kietekai.backendspring.storage.repositories.GuessRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/guesses")
@RequiredArgsConstructor
public class GuessesRest {
    private static final Logger log = LogManager.getLogger();

    private final GameRepository gameRepository;
    private final GuessRepository guessRepository;

    @PostMapping
    public Guess makeGuess(@RequestBody GuessPrototype guess, @AuthenticationPrincipal FullUserDetails userDetails) {
        Game game = gameRepository.findById(guess.gameId()).orElseThrow(IllegalArgumentException::new);
        if (game.getClosed() != null || game.getFinished() != null) {
            throw new IllegalArgumentException();
        }
        lt.kietekai.backendspring.storage.models.Guess storedGuess = guessRepository.findByUserAndGame(userDetails.getUser(), game).orElseGet(() ->
                new lt.kietekai.backendspring.storage.models.Guess(game, userDetails.getUser()));

        storedGuess.setResult1(guess.result().goals1());
        storedGuess.setResult2(guess.result().goals2());
        lt.kietekai.backendspring.storage.models.Guess savedGuess = guessRepository.save(storedGuess);
        log.info("Saved guess {} for user {} and game {} with result {}-{}",
                savedGuess.getId(), userDetails.getUser().getId(), game.getId(), savedGuess.getResult1(), savedGuess.getResult2());
        return Converters.guess(savedGuess);
    }
}
