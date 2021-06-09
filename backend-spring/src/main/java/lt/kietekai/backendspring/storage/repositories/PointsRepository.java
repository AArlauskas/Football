package lt.kietekai.backendspring.storage.repositories;

import lt.kietekai.backendspring.storage.models.Points;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;

public interface PointsRepository extends JpaRepository<Points, Long> {
    @Transactional
    @Modifying
    @Query(value = "update points p set " +
            "total = coalesce((select sum(g.points) from guess g where g.user_id = p.id), 0), " +
            "correct = (select COUNT(*) from guess g where g.user_id = p.id and g.outcome = 1), " +
            "outcomes = (select COUNT(*) from guess g where g.user_id = p.id and g.outcome = 2), " +
            "correct_alone = (select COUNT(*) from guess g where g.user_id = p.id and g.outcome = 0), " +
            "incorrect = (select COUNT(*) from guess g where g.user_id = p.id and g.outcome = 3), " +
            "not_given = (select COUNT(*) from guess g where g.user_id = p.id and g.outcome = 4)" +
            "", nativeQuery = true)
    void recalculateTotals();

    @Transactional
    @Modifying
    @Query(value = "update points set place = (select row_number() over (order by total , correct desc, id) from points)" , nativeQuery = true)
    void recalculatePlaces();

}
