package com.example.backendprj.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) // Uses WebConfig CORS beans
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/formations/**").permitAll()
                .anyRequest().permitAll() // Temporarily permit all for easy testing
            );
        
        return http.build();
    }
}
