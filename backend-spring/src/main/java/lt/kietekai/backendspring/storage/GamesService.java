package lt.kietekai.backendspring.storage;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.storage.models.Game;
import lt.kietekai.backendspring.storage.models.Guess;
import lt.kietekai.backendspring.storage.repositories.GameRepository;
import lt.kietekai.backendspring.storage.repositories.GuessRepository;
import lt.kietekai.backendspring.storage.repositories.PointsRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GamesService {
    private final GuessRepository guessRepository;
    private final GameRepository gameRepository;
    private final PointsRepository pointsRepository;
    private final ScoreCalculator scoreCalculator;

    public void createMissingGuesses() {
        guessRepository.createMissingGuesses();
    }

    public Game openGame(Game game) {
        boolean wasFinished = game.getFinished() != null;
        game.setResult1(null);
        game.setResult2(null);
        game.setClosed(null);
        game.setFinished(null);
        game = gameRepository.save(game);

        if (wasFinished) {
            recalculate(game);
        }
        return game;
    }

    public Game closeGame(Game game) {
        boolean wasFinished = game.getFinished() != null;
        game.setResult1(null);
        game.setResult2(null);
        game.setClosed(new Date());
        game.setFinished(null);
        game = gameRepository.save(game);

        if (wasFinished) {
            recalculate(game);
        } else {
            guessRepository.createMissingGuesses();
        }
        return game;
    }

    public Game finishGame(Game game) {
        if (game.getClosed() == null) {
            game.setClosed(new Date());
            game = gameRepository.save(game);
            createMissingGuesses();
        }
        game.setFinished(new Date());
        game = gameRepository.save(game);

        recalculate(game);

        return game;
    }

    private void recalculate(Game game) {
        List<Guess> guesses = guessRepository.findAllByGame(game);
        if (game.getFinished() == null) {
            for (Guess g : guesses) {
                g.setPoints(0);
                g.setOutcome(null);
            }
        } else {
            for (ScoreCalculator.ScoredGuess scoredGuess : scoreCalculator.calculate(guesses, game.getResult1(), game.getResult2())) {
                scoredGuess.guess().setPoints(scoredGuess.points());
                scoredGuess.guess().setOutcome(scoredGuess.outcome());
            }
        }
        guessRepository.saveAllAndFlush(guesses);
        recalculatePoints();
    }

    public void recalculatePoints() {
        pointsRepository.recalculateTotals();
        pointsRepository.recalculatePlaces();
    }

    public void autoClose(Date cutoff) {
        gameRepository.closeStartingBefore(cutoff);
        guessRepository.createMissingGuesses();
    }

}
