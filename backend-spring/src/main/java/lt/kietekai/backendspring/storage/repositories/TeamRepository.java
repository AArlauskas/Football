package lt.kietekai.backendspring.storage.repositories;

import lt.kietekai.backendspring.storage.models.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByLongCode(String code);
}
