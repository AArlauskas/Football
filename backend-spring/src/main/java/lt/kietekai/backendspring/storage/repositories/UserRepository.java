package lt.kietekai.backendspring.storage.repositories;

import lt.kietekai.backendspring.storage.models.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByEmailSearch(String email);
}
