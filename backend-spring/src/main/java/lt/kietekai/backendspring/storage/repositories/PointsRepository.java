package lt.kietekai.backendspring.storage.repositories;

import lt.kietekai.backendspring.storage.models.Points;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface PointsRepository extends CrudRepository<Points, Long> {
//    void recalculateTotals();
    //"correct = COUNT(select 1 from guess g where g.user_id = p.id and g.points < 0), "
    //void recalculateCorrect();
    // "outcomes = COUNT(select 1 from guess where g.user_id = p.id and g.outcome = 2)"
    //void recalculateOutcomes();

}
