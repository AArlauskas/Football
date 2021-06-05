package lt.kietekai.football.api.converters;

import lt.kietekai.football.api.models.Game;
import lt.kietekai.football.api.models.GameState;
import lt.kietekai.football.api.models.GamesFilter;
import lt.kietekai.football.api.models.Result;
import lt.kietekai.football.storage.models.GameWithGuess;

import java.time.temporal.Temporal;
import java.util.function.Function;

public class GameWithGuessConverter implements Function<GameWithGuess, Game> {
    private static final TeamConverter teamConverter = new TeamConverter();
    private final boolean own;
    private final Temporal comparisonTime;

    public GameWithGuessConverter(boolean own, Temporal comparisonTime) {
        this.own = own;
        this.comparisonTime = comparisonTime;
    }

    private static Result result(lt.kietekai.football.storage.models.Result r) {
        if (r == null || r.r1() == null || r.r2() == null) {
            return null;
        }
        return new Result(r.r1(), r.r2());
    }

    private static GameState state(GameWithGuess game) {
        if (game.closed() == null && game.finished() == null) {
            return GameState.OPEN;
        }
        if (game.finished() == null) {
            return GameState.CLOSED;
        }
        return GameState.FINISHED;
    }

    @Override
    public Game apply(GameWithGuess g) {
        if (g.closed() == null && !own) {
            return new Game(g.gameId(), teamConverter.apply(g.t1()), teamConverter.apply(g.t2()), g.date(), state(g), result(g.outcome()), null);
        }
        return new Game(g.gameId(), teamConverter.apply(g.t1()), teamConverter.apply(g.t2()), g.date(), state(g), result(g.outcome()), result(g.guess()));
    }
}
