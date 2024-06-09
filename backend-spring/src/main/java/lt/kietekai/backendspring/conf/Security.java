package lt.kietekai.backendspring.conf;

import lombok.RequiredArgsConstructor;
import lt.kietekai.backendspring.storage.UserDetailsProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;

import java.time.Duration;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class Security extends WebSecurityConfigurerAdapter {
    private final UserDetailsProvider userDetailsProvider;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsProvider).passwordEncoder(passwordEncoder());
    }
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/api/auth/**", "/api/version").permitAll()
                .anyRequest().authenticated()
                .and()
            .rememberMe()
                .rememberMeServices(rememberMeServices())
                .tokenValiditySeconds((int) Duration.ofDays(14).toSeconds())
                .alwaysRemember(true)
                .and()
            .formLogin().disable()
            .httpBasic().disable()
            .csrf().disable()
            .cors().disable();
    }

    @Bean
    public RememberMeServices rememberMeServices() {
        TokenBasedRememberMeServices s =  new TokenBasedRememberMeServices("football2020", userDetailsProvider);
        s.setAlwaysRemember(true);
        return s;
    }
}
