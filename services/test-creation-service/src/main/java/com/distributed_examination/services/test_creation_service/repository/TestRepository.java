package com.distributed_examination.services.test_creation_service.repository;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.distributed_examination.services.test_creation_service.model.Test;

@Repository
public class TestRepository {

    private JdbcTemplate jdbcTemplate = new JdbcTemplate();

    public TestRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Test> testRowMapper = (rs, rowNum) -> {
        Test t = new Test();
        t.setId(rs.getString("test_id"));
        t.setName(rs.getString("test_name"));
        t.setDescription(rs.getString("description"));
        t.setDuration(rs.getInt("duration"));
        t.setStartTime(rs.getString("start_time"));
        t.setEndTime(rs.getString("end_time"));

        // fetch question IDs
        List<String> qIds = jdbcTemplate.queryForList(
                "SELECT question_id FROM test_questions WHERE test_id = ?",
                String.class,
                rs.getString("test_id")
        );
        t.setQuestionIds(qIds);

        return t;
    };

    public List<Test> findAll(String adminId) {
        return jdbcTemplate.query(
                "SELECT * FROM tests WHERE admin_id = ?",
                new Object[]{adminId},
                testRowMapper
        );
    }
    
    public List<Test> findCurrentTests() {
        return jdbcTemplate.query(
            "SELECT * FROM tests WHERE start_time <= NOW() AND end_time >= NOW()",
            testRowMapper
        );
    }

    public Test findById(String id) {
        return jdbcTemplate.queryForObject(
                "SELECT * FROM tests WHERE test_id = ?",
                new Object[]{id},
                testRowMapper
        );
    }

    public void save(Test t, String adminId) {
        // Insert test; DB generates UUID
        String testId = jdbcTemplate.queryForObject(
                "INSERT INTO tests (test_name, description, duration, start_time, end_time, admin_id) " +
                "VALUES (?, ?, ?, ?, ?, ?) RETURNING test_id",
                String.class,
                t.getName(), t.getDescription(), t.getDuration(),
                t.getStartTime(), t.getEndTime(), adminId
        );

        // Insert mappings
        for (String qId : t.getQuestionIds()) {
            jdbcTemplate.update(
                    "INSERT INTO test_questions (test_id, question_id) VALUES (?, ?)",
                    testId, qId
            );
        }
    }

    public void deleteById(String id) {
        jdbcTemplate.update("DELETE FROM tests WHERE test_id = ?", id);
    }
}
