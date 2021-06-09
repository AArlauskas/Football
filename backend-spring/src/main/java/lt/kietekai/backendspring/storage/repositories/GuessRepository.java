package lt.kietekai.backendspring.storage.repositories;

import lt.kietekai.backendspring.storage.models.Game;
import lt.kietekai.backendspring.storage.models.Guess;
import lt.kietekai.backendspring.storage.models.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface GuessRepository extends JpaRepository<Guess, Long> {
    @Transactional
    @Modifying
    @Query(value = "insert into guess (game_id, user_id, points, outcome) select g.id, u.id, coalesce((select min(og.points) from guess og where og.game_id=g.id), 0), 4 from game g cross join auth_user u where g.closed is not null and not exists (select 1 from guess gs where gs.game_id=g.id and gs.user_id=u.id)", nativeQuery = true)
    void createMissingGuesses();

    List<Guess> findAllByGame(Game game);
    List<Guess> findAllByGame(Game game, Sort sort);

    Optional<Guess> findByUserAndGame(User user, Game game);
}
