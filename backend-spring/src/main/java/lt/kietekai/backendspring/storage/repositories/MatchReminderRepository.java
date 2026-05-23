package lt.kietekai.backendspring.storage.repositories;

import lt.kietekai.backendspring.storage.models.Game;
import lt.kietekai.backendspring.storage.models.MatchReminder;
import lt.kietekai.backendspring.storage.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchReminderRepository extends JpaRepository<MatchReminder, Long> {
    boolean existsByGameAndUser(Game game, User user);
}
