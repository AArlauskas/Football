package lt.kietekai.backendspring.storage;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.storage.models.Game;
import lt.kietekai.backendspring.storage.models.Guess;
import lt.kietekai.backendspring.storage.models.GuessOutcome;
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

    private static GameOutcome outcomeOf(int r1, int r2) {
        if (r1 == r2) {
            return GameOutcome.EQ;
        }
        if (r1 > r2) {
            return GameOutcome.T1;
        } else {
            return GameOutcome.T2;
        }
    }

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
            int countCorrect = 0;
            for (Guess g : guesses) {
                if (g.getResult1().equals(game.getResult1()) && g.getResult2().equals(game.getResult2())) {
                    g.setPoints(-3);
                    g.setOutcome(GuessOutcome.CORRECT);
                    countCorrect++;
                } else {
                    if (outcomeOf(g.getResult1(), g.getResult2()) == outcomeOf(game.getResult1(), game.getResult2())) {
                        g.setPoints(0);
                        g.setOutcome(GuessOutcome.OUTCOME_ONLY);
                    } else {
                        g.setPoints(3);
                        g.setOutcome(GuessOutcome.OUTCOME_INCORRECT);
                    }
                    g.setPoints(g.getPoints() + Math.abs(g.getResult1() - game.getResult1()) + Math.abs(g.getResult2() - game.getResult2()));
                }
            }
            if (countCorrect == 1) {
                for (Guess g : guesses) {
                    if (g.getOutcome() == GuessOutcome.CORRECT) {
                        g.setOutcome(GuessOutcome.CORRECT_ALONE);
                        g.setPoints(-7);
                    }
                }
            }
        }
        guessRepository.saveAllAndFlush(guesses);
        // TODO
        //pointsRepository.recalculateTotals();
    }

    private enum GameOutcome {
        EQ, T1, T2
    }
}
