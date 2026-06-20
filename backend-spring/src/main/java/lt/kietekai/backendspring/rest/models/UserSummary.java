package lt.kietekai.backendspring.rest.models;

import java.util.Collection;

public record UserSummary(long id, String email, String firstName, String lastName, Collection<String> roles) {
}
