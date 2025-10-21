package com.distributed_examination.services.question_service.config;

import com.distributed_examination.services.question_service.jwt.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF since this is a stateless REST API
            .csrf(csrf -> csrf.disable())

            // Define endpoint permissions
            .authorizeHttpRequests(auth -> auth
                // restrict admin operations
                .requestMatchers("/questions/admin/**").permitAll()
                .requestMatchers("/questions/**").permitAll()
                // allow authenticated users for everything else
                .anyRequest().authenticated()
            )

            // Make Spring Security stateless (no sessions)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        // Register JWT filter before username/password authentication filter
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}