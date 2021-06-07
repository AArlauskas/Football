package lt.kietekai.backendspring.storage.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(indexes = {
        @Index(columnList = "longCode", unique = true),
        @Index(columnList = "shortCode", unique = true),
})
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shortCode;
    private String longCode;
    private String name;
}
