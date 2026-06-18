package lt.kietekai.backendspring.storage.models;

import lombok.*;

import javax.persistence.*;
import java.util.Collection;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@AllArgsConstructor
@Builder
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "auth_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String emailSearch;
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String roles;
    @Column(nullable = false, columnDefinition = "boolean default false")
    @Builder.Default
    private boolean matchReminderDisabled = false;

    @OneToOne(cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    private Points points;

    @Transient
    public Collection<String> roles() {
        return Stream.of(roles.split("\\|"))
                .collect(Collectors.toSet());
    }
}
