package lt.kietekai.backendspring.storage.repositories;

import lt.kietekai.backendspring.storage.models.Game;
import lt.kietekai.backendspring.storage.models.Guess;
import lt.kietekai.backendspring.storage.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface GuessRepository extends JpaRepository<Guess, Long> {
    @Transactional
    @Modifying
    @Query(value = "insert into guess (game_id, user_id) select g.id, u.id from game g cross join auth_user u where g.closed is not null and not exists (select 1 from guess gs where gs.game_id=g.id and gs.user_id=u.id)", nativeQuery = true)
    void createMissingGuesses();

    List<Guess> findAllByGame(Game game);

    Optional<Guess> findByUserAndGame(User user, Game game);
}
