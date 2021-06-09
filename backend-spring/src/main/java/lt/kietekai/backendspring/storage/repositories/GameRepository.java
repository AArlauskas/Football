package lt.kietekai.backendspring.storage.repositories;

import lt.kietekai.backendspring.storage.models.Game;
import lt.kietekai.backendspring.storage.models.Team;
import lt.kietekai.backendspring.storage.models.synthetic.GameWithGuess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {
    @Query("select new lt.kietekai.backendspring.storage.models.synthetic.GameWithGuess(g, gs) from Game g left join Guess gs on g.id = gs.game.id where (gs.user.id=:userId or gs.user.id is null) order by g.gameDate")
    List<GameWithGuess> getAllGamesWithGuesses(long userId);

    @Query("select new lt.kietekai.backendspring.storage.models.synthetic.GameWithGuess(g, gs) from Game g left join Guess gs on g.id = gs.game.id where (gs.user.id=:userId or gs.user.id is null) and g.closed is not null order by g.gameDate ")
    List<GameWithGuess> getClosedGamesWithGuesses(long userId);

    @Query("select new lt.kietekai.backendspring.storage.models.synthetic.GameWithGuess(g, gs) from Game g left join Guess gs on g.id = gs.game.id where (gs.user.id=:userId or gs.user.id is null) and g.gameDate > :limit order by g.gameDate")
    List<GameWithGuess> getFutureGamesWithGuesses(long userId, Date limit);

    @Transactional
    @Modifying
    @Query(value = "update Game g set g.closed=current_timestamp where g.gameDate < :cutoff")
    void closeStartingBefore(Date cutoff);

    @Query("select g from Game g where (g.team1=:team or g.team2=:team) and g.finished is not null order by g.gameDate")
    List<Game> getFinishedWithTeam(Team team);
}
