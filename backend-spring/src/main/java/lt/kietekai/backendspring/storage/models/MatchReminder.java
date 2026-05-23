package lt.kietekai.backendspring.storage.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(indexes = {
        @Index(columnList = "game_id, user_id", unique = true)
})
public class MatchReminder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Game game;

    @ManyToOne(optional = false)
    private User user;

    @Column(nullable = false)
    private Date sentAt;

    public MatchReminder(Game game, User user) {
        this.game = game;
        this.user = user;
        this.sentAt = new Date();
    }
}
