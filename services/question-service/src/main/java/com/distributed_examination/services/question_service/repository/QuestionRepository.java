package com.distributed_examination.services.question_service.repository;

import com.distributed_examination.services.question_service.model.Question;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Arrays;


@Repository
public class QuestionRepository {

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public QuestionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Question> rowMapper = (rs, rowNum) -> {
        Question q = new Question();
        q.setQuestion(rs.getString("question"));
        q.setId(rs.getString("question_id"));
        String[] optionsArray = (String[]) rs.getArray("options").getArray();
        q.setOptions(Arrays.asList(optionsArray));
        q.setAnswerIndex(rs.getInt("answer_index"));
        return q;
    };


    public List<Question> findAll(String admin_id) {
        return jdbcTemplate.query("SELECT * FROM questions where admin_id = ?", new Object[]{admin_id}, rowMapper);
    }

    public Question findById(int id) {
        return jdbcTemplate.queryForObject("SELECT * FROM questions WHERE question_id = ?", new Object[]{id}, rowMapper);
    }

    public void save(Question q, String admin_id) {
        try {
            String pgArray = "{" + String.join(",", q.getOptions()) + "}";
            jdbcTemplate.update("INSERT INTO questions (question, options, answer_index, admin_id) VALUES (?, ?, ?, ?)",
                    q.getQuestion(), pgArray, q.getAnswerIndex(), admin_id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteById(int id) {
        jdbcTemplate.update("DELETE FROM questions WHERE question_id = ?", id);
    }
}
