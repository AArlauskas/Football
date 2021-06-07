package lt.kietekai.backendspring.storage;

import lombok.Getter;
import lt.kietekai.backendspring.storage.models.Points;
import lt.kietekai.backendspring.storage.models.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public class FullUserDetails implements UserDetails {
    @Getter
    private final User user;
    @Getter
    private final Points points;
    private final Set<GrantedAuthority> authorities;

    public FullUserDetails(User user, Points points) {
        this.user = Objects.requireNonNull(user);
        this.points = Objects.requireNonNull(points);

        this.authorities = user.roles().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
