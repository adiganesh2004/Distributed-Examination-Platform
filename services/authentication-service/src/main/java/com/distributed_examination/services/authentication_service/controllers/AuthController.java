package com.distributed_examination.services.authentication_service.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.distributed_examination.services.authentication_service.jwt.JwtUtil;
import com.distributed_examination.services.authentication_service.service.CustomUserDetailsService;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.distributed_examination.services.authentication_service.model.CustomUserDetails;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public AuthController(JdbcTemplate jdbcTemplate,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authManager,
                          JwtUtil jwtUtil,
                          CustomUserDetailsService userDetailsService) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/{type}/signup")
    public ResponseEntity<String> signup(@PathVariable String type, @RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = passwordEncoder.encode(body.get("password"));
        String name = body.get("name");

        try {
            if (type.equalsIgnoreCase("admin")) {
                jdbcTemplate.update(
                        "INSERT INTO admin(admin_name, admin_email, admin_password) VALUES (?, ?, ?)",
                        name, email, password
                );
            } else if (type.equalsIgnoreCase("candidate")) {
                String college = body.getOrDefault("college", null);
                String skills = body.getOrDefault("skills", null);
                jdbcTemplate.update(
                        "INSERT INTO candidate(candidate_name, candidate_email, candidate_password, college, skills) VALUES (?, ?, ?, ?, ?)",
                        name, email, password, college, skills
                );
            } else {
                return ResponseEntity.badRequest().body("Invalid type");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Email already exists or invalid data");
        }

        return ResponseEntity.ok("User registered");
    }

    @PostMapping("/{type}/login")
    public ResponseEntity<Map<String, String>> login(@PathVariable String type, @RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        try {
            CustomUserDetails user = userDetailsService.loadUserByUsernameAndType(email, type.toUpperCase());
            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new BadCredentialsException("Invalid password");
            }
            String token = jwtUtil.generateToken(email, user.getId() , type.toUpperCase());
            return ResponseEntity.ok(Map.of(
            "token", token,
            "userType", type.toLowerCase()
            ));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }
}
