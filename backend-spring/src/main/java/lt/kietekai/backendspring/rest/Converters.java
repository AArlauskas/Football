package lt.kietekai.backendspring.rest;

import lt.kietekai.backendspring.rest.models.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Converters {
    private static final ThreadLocal<SimpleDateFormat> dateFormatter = ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
    private static final ThreadLocal<SimpleDateFormat> timeFormatter = ThreadLocal.withInitial(() -> new SimpleDateFormat("HH:mm"));
    private static final ThreadLocal<SimpleDateFormat> dateWithTimeFormatter = ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd HH:mm"));

    public static Date parseDateFromParts(String date, String time) throws ParseException {
        return dateWithTimeFormatter.get().parse(date + " " + time);
    }
    public static Game game(lt.kietekai.backendspring.storage.models.Game game) {
        return new Game(game.getId(), team(game.getTeam1()), team(game.getTeam2()), dateFormatter.get().format(game.getGameDate()), timeFormatter.get().format(game.getGameDate()), state(game), game.getResult1() == null ? null : new Result(game.getResult1(), game.getResult2()));
    }

    public static GameState state(lt.kietekai.backendspring.storage.models.Game game) {
        if (game.getFinished() != null) {
            return GameState.FINISHED;
        }
        if (game.getClosed() != null) {
            return GameState.CLOSED;
        }
        return GameState.OPEN;
    }

    public static Team team(lt.kietekai.backendspring.storage.models.Team team) {
        return new Team(team.getLongCode(), team.getName());
    }

    public static GameWithGuess gameWithGuess(lt.kietekai.backendspring.storage.models.synthetic.GameWithGuess gameWithGuess) {
        return new GameWithGuess(game(gameWithGuess.getGame()), guess(gameWithGuess.getGuess()));
    }

    public static Guess guess(lt.kietekai.backendspring.storage.models.Guess guess) {
        if (guess == null) {
            return null;
        }
        return new Guess(guess.getResult1() == null ? null : new Result(guess.getResult1(), guess.getResult2()), guess.getPoints(), outcome(guess.getOutcome()));
    }

    public static GuessOutcome outcome(lt.kietekai.backendspring.storage.models.GuessOutcome outcome) {
        if (outcome == null) {
            return null;
        }
        switch (outcome) {
            case CORRECT_ALONE -> {
                return GuessOutcome.CORRECT_ALONE;
            }
            case CORRECT -> {
                return GuessOutcome.CORRECT;
            }
            case OUTCOME_ONLY -> {
                return GuessOutcome.OUTCOME_ONLY;
            }
            case OUTCOME_INCORRECT -> {
                return GuessOutcome.OUTCOME_INCORRECT;
            }
            case NOT_GIVEN -> {return GuessOutcome.NOT_GIVEN;}
        }
        throw new IllegalStateException();
    }
}
