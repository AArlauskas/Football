package lt.kietekai.backendspring.rest;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.rest.models.Guess;
import lt.kietekai.backendspring.rest.models.GuessWithUser;
import lt.kietekai.backendspring.rest.models.OngoingGame;
import lt.kietekai.backendspring.rest.models.Result;
import lt.kietekai.backendspring.storage.FifaMatchClient;
import lt.kietekai.backendspring.storage.ScoreCalculator;
import lt.kietekai.backendspring.storage.repositories.GameRepository;
import lt.kietekai.backendspring.storage.repositories.GuessRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OngoingGamesService {
    private final GameRepository gameRepository;
    private final GuessRepository guessRepository;
    private final FifaMatchClient fifaMatchClient;
    private final ScoreCalculator scoreCalculator;

    public List<OngoingGame> ongoingGames() {
        FifaMatchClient.MatchSnapshot fifaMatches = fifaMatchClient.cachedSnapshot();

        return gameRepository.getOngoingGames().stream()
                .map(game -> ongoingGame(game, fifaMatches))
                .collect(Collectors.toList());
    }

    private OngoingGame ongoingGame(lt.kietekai.backendspring.storage.models.Game game, FifaMatchClient.MatchSnapshot fifaMatches) {
        Optional<FifaMatchClient.FifaResult> currentResult = fifaMatches.currentResult(game);
        if (currentResult.isEmpty()) {
            return new OngoingGame(Converters.game(game), null, null, List.of());
        }

        Result result = new Result(currentResult.get().goals1(), currentResult.get().goals2());

        return new OngoingGame(
                Converters.game(game),
                result,
                currentResult.get().matchTime(),
                estimatedGuesses(game, result)
        );
    }

    private List<GuessWithUser> estimatedGuesses(lt.kietekai.backendspring.storage.models.Game game, Result result) {
        return scoreCalculator.calculate(
                        guessRepository.findAllByGame(game),
                        result.goals1(),
                        result.goals2()
                ).stream()
                .sorted(Comparator
                        .comparing(ScoreCalculator.ScoredGuess::points)
                        .thenComparing(scoredGuess -> scoredGuess.guess().getId()))
                .map(this::estimatedGuessWithUser)
                .collect(Collectors.toList());
    }

    private GuessWithUser estimatedGuessWithUser(ScoreCalculator.ScoredGuess scoredGuess) {
        lt.kietekai.backendspring.storage.models.Guess guess = scoredGuess.guess();
        Result result = guess.getResult1() == null ? null : new Result(guess.getResult1(), guess.getResult2());

        return new GuessWithUser(
                new Guess(result, scoredGuess.points(), Converters.outcome(scoredGuess.outcome())),
                Converters.user(guess.getUser())
        );
    }
}
