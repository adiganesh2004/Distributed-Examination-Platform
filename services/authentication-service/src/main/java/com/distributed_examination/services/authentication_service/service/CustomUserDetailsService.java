package com.distributed_examination.services.authentication_service.service;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final JdbcTemplate jdbcTemplate;

    public CustomUserDetailsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Load user by email and type (admin or candidate)
     */
    public UserDetails loadUserByUsernameAndType(String username, String type) throws UsernameNotFoundException {
        if (type.equalsIgnoreCase("admin")) {
            try {
                return jdbcTemplate.queryForObject(
                    "SELECT admin_email, admin_password FROM admin WHERE admin_email = ?",
                    new Object[]{username},
                    (rs, rowNum) -> User.builder()
                                        .username(rs.getString("admin_email"))
                                        .password(rs.getString("admin_password"))
                                        .roles("ADMIN")  // Spring Security role
                                        .build()
                );
            } catch (EmptyResultDataAccessException e) {
                throw new UsernameNotFoundException("Admin not found with email: " + username);
            }
        } else if (type.equalsIgnoreCase("candidate")) {
            try {
                return jdbcTemplate.queryForObject(
                    "SELECT candidate_email, candidate_password FROM candidate WHERE candidate_email = ?",
                    new Object[]{username},
                    (rs, rowNum) -> User.builder()
                                        .username(rs.getString("candidate_email"))
                                        .password(rs.getString("candidate_password"))
                                        .roles("CANDIDATE")  // Spring Security role
                                        .build()
                );
            } catch (EmptyResultDataAccessException e) {
                throw new UsernameNotFoundException("Candidate not found with email: " + username);
            }
        } else {
            throw new UsernameNotFoundException("Invalid user type: " + type);
        }
    }

    /**
     * Standard method required by UserDetailsService
     * Not used directly; we use loadUserByUsernameAndType
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        throw new UnsupportedOperationException("Use loadUserByUsernameAndType instead");
    }
}
