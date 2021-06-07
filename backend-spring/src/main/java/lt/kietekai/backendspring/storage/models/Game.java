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
        @Index(columnList = "team1_id, team2_id", unique = true)
})
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Team team1;

    @ManyToOne(optional = false)
    private Team team2;

    @Column(nullable = false)
    private Date gameDate;
    private Date closed;
    private Date finished;

    private Integer result1;
    private Integer result2;

    private GameType gameType = GameType.REGULAR;
}
