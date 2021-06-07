package lt.kietekai.backendspring.rest.models;

import java.util.Collection;

public record UserDetails(long id, String email, String firstName, String lastName, Points points,
                          Collection<String> roles) {
}
