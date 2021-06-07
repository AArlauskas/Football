package lt.kietekai.backendspring.storage.repositories;

import lt.kietekai.backendspring.storage.models.Game;
import lt.kietekai.backendspring.storage.models.synthetic.GameWithGuess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {
    @Query("select new lt.kietekai.backendspring.storage.models.synthetic.GameWithGuess(g, gs) from Game g left join Guess gs on g.id = gs.game.id where (gs.user.id=:userId or gs.user.id is null) order by g.gameDate")
    List<GameWithGuess> getAllGamesWithGuesses(long userId);

    @Query("select new lt.kietekai.backendspring.storage.models.synthetic.GameWithGuess(g, gs) from Game g left join Guess gs on g.id = gs.game.id where (gs.user.id=:userId or gs.user.id is null) and g.closed is not null order by g.gameDate ")
    List<GameWithGuess> getClosedGamesWithGuesses(long userId);

    @Query("select new lt.kietekai.backendspring.storage.models.synthetic.GameWithGuess(g, gs) from Game g left join Guess gs on g.id = gs.game.id where (gs.user.id=:userId or gs.user.id is null) and g.gameDate > :limit order by g.gameDate")
    List<GameWithGuess> getFutureGamesWithGuesses(long userId, Date limit);

}
