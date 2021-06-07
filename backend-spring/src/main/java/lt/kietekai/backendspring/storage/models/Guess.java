package lt.kietekai.backendspring.storage.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(indexes = {
        @Index(columnList = "game_id, user_id", unique = true)
})
public class Guess {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Game game;
    @ManyToOne
    private User user;

    private Integer result1;
    private Integer result2;

    private Integer points;
    private Integer place;
    private GuessOutcome outcome;

    public Guess(Game game, User user) {
        this.game = game;
        this.user = user;
    }
}
