package com.distributed_examination.services.question_service.repository;

import com.distributed_examination.services.question_service.model.Question;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class QuestionRepository {

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public QuestionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Question> rowMapper = (rs, rowNum) -> {
        List<String> options = null;
        try {
            options = objectMapper.readValue(
                rs.getString("options"),
                new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {}
            );
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return new Question(
            rs.getInt("question_id"),
            rs.getString("question"),
            options,
            rs.getInt("answer_index")
        );
    };


    public List<Question> findAll() {
        return jdbcTemplate.query("SELECT * FROM questions", rowMapper);
    }

    public Question findById(int id) {
        return jdbcTemplate.queryForObject("SELECT * FROM questions WHERE question_id = ?", new Object[]{id}, rowMapper);
    }

    public void save(Question q) {
        try {
            String optionsJson = objectMapper.writeValueAsString(q.getOptions());
            jdbcTemplate.update("INSERT INTO questions (question, options, answer_index) VALUES (?, ?, ?)",
                    q.getQuestion(), optionsJson, q.getAnswerIndex());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteById(int id) {
        jdbcTemplate.update("DELETE FROM questions WHERE question_id = ?", id);
    }
}
