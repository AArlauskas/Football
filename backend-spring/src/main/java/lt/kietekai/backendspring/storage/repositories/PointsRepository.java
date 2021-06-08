package lt.kietekai.backendspring.storage.repositories;

import lt.kietekai.backendspring.storage.models.Points;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;

public interface PointsRepository extends CrudRepository<Points, Long> {
    @Transactional
    @Modifying
    @Query(value = "update points p set " +
            "total = (select sum(g.points) from guess g where g.user_id = p.id), " +
            "correct = (select COUNT(*) from guess g where g.user_id = p.id and g.points < 0), " +
            "outcomes = (select COUNT(*) from guess g where g.user_id = p.id and g.outcome = 2)", nativeQuery = true)
    void recalculateTotals();
}
