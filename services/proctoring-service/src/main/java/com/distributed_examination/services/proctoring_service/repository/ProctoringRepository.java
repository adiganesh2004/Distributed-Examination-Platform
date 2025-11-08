package com.distributed_examination.services.proctoring_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;


@Repository
public class ProctoringRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProctoringRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void recordFaceCount(String testId, String candidateId, int faceCount) {
        String flagType;
        if (faceCount == 0) {
            flagType = "yellow";
        } else if (faceCount == 1) {
            flagType = "green";
        } else {
            flagType = "red";
        }

        String sql = """
            INSERT INTO candidate_tests_proctoring
                (test_id, candidate_id, number_images, number_red_flags, number_yellow_flags, number_green_flags)
            VALUES (?, ?, 1,
                CASE WHEN ? = 'red' THEN 1 ELSE 0 END,
                CASE WHEN ? = 'yellow' THEN 1 ELSE 0 END,
                CASE WHEN ? = 'green' THEN 1 ELSE 0 END)
            ON CONFLICT (test_id, candidate_id) DO UPDATE
            SET
                number_images = candidate_tests_proctoring.number_images + 1,
                number_red_flags = candidate_tests_proctoring.number_red_flags + CASE WHEN EXCLUDED.number_red_flags = 1 THEN 1 ELSE 0 END,
                number_yellow_flags = candidate_tests_proctoring.number_yellow_flags + CASE WHEN EXCLUDED.number_yellow_flags = 1 THEN 1 ELSE 0 END,
                number_green_flags = candidate_tests_proctoring.number_green_flags + CASE WHEN EXCLUDED.number_green_flags = 1 THEN 1 ELSE 0 END;
        """;

        jdbcTemplate.update(sql, testId, candidateId, flagType, flagType, flagType);
    }
}
