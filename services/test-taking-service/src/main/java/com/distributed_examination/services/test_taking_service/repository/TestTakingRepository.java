package com.distributed_examination.services.test_taking_service.repository;

import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

import com.distributed_examination.services.test_taking_service.model.TestState;
import com.distributed_examination.common.jwt.JwtUtil;
import com.distributed_examination.services.test_taking_service.model.TestAction;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.HashMap;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;



@Component
public class TestTakingRepository{
    private final Map<String, TestState> testStates = new ConcurrentHashMap<>();

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TestTakingRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String startTest(String sessionId, TestAction testAction){
        try {
            if (testStates.containsKey(sessionId)) {
                return "{\"error\":\"Test already started for this session\"}";
            }

            // TestState state = new TestState(testAction.getUserId(), testAction.getTestId(), questions);
            // testStates.put(sessionId, state);

            return objectMapper.writeValueAsString("");
            
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"Failed to start test\"}";
        }
    }

    public String changeQuestion(String sessionId, TestAction testAction) {
        try {
            if (!testStates.containsKey(sessionId)) {
                return "{\"error\":\"No active test found for this session\"}";
            }
            TestState testState = testStates.get(sessionId);
            testState.UpdateQuestion(testAction.getNextQuestionId());
    
            return null;
    
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"Failed to change question\"}";
        }
    }

    public String changeAnswer(String sessionId, TestAction testAction){
        try {
            if (!testStates.containsKey(sessionId)) {
                return "{\"error\":\"No active test found for this session\"}";
            }
            TestState testState = testStates.get(sessionId);
            testState.ChangeAnswer(testAction.getCurrentQuestionId(),testAction.getChosenOption());
    
            return null;
    
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"Failed to change question\"}";
        }
    }

    public String endTest(String sessionId, TestAction testAction){
        return null;
    }
}