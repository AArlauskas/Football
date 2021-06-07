package lt.kietekai.backendspring.storage;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.storage.models.User;
import lt.kietekai.backendspring.storage.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsProvider implements UserDetailsService {
    private final UserRepository userRepository;

    private static FullUserDetails toDetails(User user) {
        return new FullUserDetails(user, user.getPoints());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmailSearch(username.toUpperCase())
                .map(UserDetailsProvider::toDetails)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));
    }


}
