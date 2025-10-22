package com.distributed_examination.services.authentication_service.service;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.distributed_examination.services.authentication_service.model.CustomUserDetails;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final JdbcTemplate jdbcTemplate;

    public CustomUserDetailsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Load user by email and type (admin or candidate)
     */
    public CustomUserDetails loadUserByUsernameAndType(String username, String type) throws UsernameNotFoundException {
        if (type.equalsIgnoreCase("admin")) {
            try {
                return jdbcTemplate.queryForObject(
                    "SELECT admin_id, admin_email, admin_password FROM admin WHERE admin_email = ?",
                    new Object[]{username},
                    (rs, rowNum) -> new CustomUserDetails(
                        rs.getString("admin_id"),
                        rs.getString("admin_email"),
                        rs.getString("admin_password"),
                        "ADMIN"
                    )
                );
            } catch (EmptyResultDataAccessException e) {
                throw new UsernameNotFoundException("Admin not found with email: " + username);
            }
        } else if (type.equalsIgnoreCase("candidate")) {
            try {
                return jdbcTemplate.queryForObject(
                    "SELECT candidate_id, candidate_email, candidate_password FROM candidate WHERE candidate_email = ?",
                    new Object[]{username},
                    (rs, rowNum) -> new CustomUserDetails(
                        rs.getString("candidate_id"),
                        rs.getString("candidate_email"),
                        rs.getString("candidate_password"),
                        "CANDIDATE"
                    )
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
    public CustomUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        throw new UnsupportedOperationException("Use loadUserByUsernameAndType instead");
    }
}
