package lt.kietekai.backendspring.storage;

import lt.kietekai.backendspring.storage.models.Guess;
import lt.kietekai.backendspring.storage.models.GuessOutcome;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ScoreCalculator {
    public List<ScoredGuess> calculate(List<Guess> guesses, int result1, int result2) {
        List<ScoredGuessDraft> drafts = new ArrayList<>();
        int countOutcome = 0;
        int countCorrect = 0;

        for (Guess guess : guesses) {
            ScoredGuessDraft draft;
            if (guess.getResult1() == null || guess.getResult2() == null) {
                draft = new ScoredGuessDraft(guess, 0, GuessOutcome.NOT_GIVEN);
            } else if (guess.getResult1().equals(result1) && guess.getResult2().equals(result2)) {
                draft = new ScoredGuessDraft(guess, -3, GuessOutcome.CORRECT);
                countOutcome++;
                countCorrect++;
            } else {
                int points;
                GuessOutcome outcome;
                if (outcomeOf(guess.getResult1(), guess.getResult2()) == outcomeOf(result1, result2)) {
                    points = 0;
                    outcome = GuessOutcome.OUTCOME_ONLY;
                    countOutcome++;
                } else {
                    points = 3;
                    outcome = GuessOutcome.OUTCOME_INCORRECT;
                }
                points += Math.abs(guess.getResult1() - result1) + Math.abs(guess.getResult2() - result2);
                draft = new ScoredGuessDraft(guess, points, outcome);
            }
            drafts.add(draft);
        }

        int maxPoints = drafts.stream()
                .filter(guess -> guess.outcome != GuessOutcome.NOT_GIVEN)
                .map(guess -> guess.points)
                .reduce(0, Integer::max);
        for (ScoredGuessDraft draft : drafts) {
            if (draft.outcome == GuessOutcome.NOT_GIVEN) {
                draft.points = maxPoints;
            }
        }
        if (countCorrect == 1 && countOutcome != 1) {
            for (ScoredGuessDraft draft : drafts) {
                if (draft.outcome == GuessOutcome.CORRECT) {
                    draft.outcome = GuessOutcome.CORRECT_ALONE;
                    draft.points = -7;
                }
            }
        }

        if (countOutcome == 1) {
            for (ScoredGuessDraft draft : drafts) {
                if (draft.outcome == GuessOutcome.CORRECT) {
                    draft.outcome = GuessOutcome.CORRECT_ALONE;
                    draft.points = -11;
                }
            }
        }

        return drafts.stream()
                .map(draft -> new ScoredGuess(draft.guess, draft.points, draft.outcome))
                .toList();
    }

    private static GameOutcome outcomeOf(int r1, int r2) {
        if (r1 == r2) {
            return GameOutcome.EQ;
        }
        if (r1 > r2) {
            return GameOutcome.T1;
        }
        return GameOutcome.T2;
    }

    public record ScoredGuess(Guess guess, Integer points, GuessOutcome outcome) {
    }

    private enum GameOutcome {
        EQ, T1, T2
    }

    private static class ScoredGuessDraft {
        private final Guess guess;
        private Integer points;
        private GuessOutcome outcome;

        private ScoredGuessDraft(Guess guess, Integer points, GuessOutcome outcome) {
            this.guess = guess;
            this.points = points;
            this.outcome = outcome;
        }
    }
}
