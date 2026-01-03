package salonce.dev.todolist.account.infrastructure.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Profile("dev") // only active in dev
public class H2ConsoleSecurityConfig {

    @Bean
    @Order(1) // <- high priority
    public SecurityFilterChain h2ConsoleSecurity(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/h2-console/**") // only for H2
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // allow everything
                )
                .csrf(csrf -> csrf.disable()) // disable CSRF
                .headers(headers -> headers.frameOptions(frame -> frame.disable())); // allow iframe

        return http.build();
    }
}