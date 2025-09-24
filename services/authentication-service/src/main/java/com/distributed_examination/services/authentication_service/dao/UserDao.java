package com.distributed_examination.services.authentication_service.dao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.distributed_examination.services.authentication_service.model.User;

import java.sql.*;
import java.util.Optional;

@Repository
public class UserDao {
    private final JdbcTemplate jdbc;

    public UserDao(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // save and return generated id
    public int save(String email, String hashedPassword, String role) {
        final String sql = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbc.update((Connection con) -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, email);
            ps.setString(2, hashedPassword);
            ps.setString(3, role);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key == null ? -1 : key.intValue();
    }

    public Optional<User> findByEmail(String email) {
        String sql = "SELECT id, email, password, role FROM users WHERE email = ?";
        return jdbc.query(sql, new Object[]{email}, rs -> {
            if (!rs.next()) return Optional.empty();
            User u = new User(
                    rs.getInt("id"),
                    rs.getString("email"),
                    rs.getString("password"),
                    rs.getString("role")
            );
            return Optional.of(u);
        });
    }
}
