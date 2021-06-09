package lt.kietekai.backendspring.storage.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class Points {
    @Id
    private Long id;

    private int total = 0;
    private int place = 1;

    private int correctAlone = 0;
    private int correct = 0;
    private int outcomes = 0;
    private int incorrect = 0;
    private int notGiven = 0;

    @MapsId
    @OneToOne(mappedBy = "points")
    @JoinColumn(name = "id")
    private User user;
}
