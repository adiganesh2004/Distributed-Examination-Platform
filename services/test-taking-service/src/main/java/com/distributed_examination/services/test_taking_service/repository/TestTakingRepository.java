package com.distributed_examination.services.test_taking_service.repository;

import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.time.Instant;
import com.distributed_examination.common.model.Question;
import com.distributed_examination.common.model.QuestionResponse;
import java.sql.Array;
import com.distributed_examination.services.test_taking_service.model.TestState;
import com.distributed_examination.common.jwt.JwtUtil;
import com.distributed_examination.services.test_taking_service.model.TestAction;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.HashMap;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.concurrent.*;
import java.util.Arrays;
import java.sql.Timestamp;

@Component
public class TestTakingRepository{
    private final Map<String, TestState> testStates = new ConcurrentHashMap<>();

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);


    public TestTakingRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String startTest(String sessionId, TestAction testAction){
        try {
            if (testStates.containsKey(sessionId)) {
                return "{\"error\":\"Test already started for this session\"}";
            }

            TestState testState = loadTestState(testAction.userId, testAction.testId);
            if(!testState.isWithinSessionTime()){
                return "{\"error\":\"Test cant be taken now\"}";
            }

            testStates.put(sessionId, testState);
            scheduler.schedule(() -> endTest(sessionId), testState.getDuration(), TimeUnit.SECONDS);
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
            return "{\"error\":\"Failed to change answer\"}";
        }
    }

    public String endTest(String sessionId){
        try {
            if (!testStates.containsKey(sessionId)) {
                return "{\"error\":\"No active test found for this session\"}";
            }
            TestState testState = testStates.get(sessionId);
            
            testState.setSessionEndTime(Instant.now());
            saveCandidateTest(testState);

            testStates.remove(sessionId);

            return null;
    
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"Failed to submit\"}";
        }
    }

    public TestState loadTestState(String userId, String testId) {
        String testQuery = """
            SELECT test_id, start_time, end_time, duration
            FROM tests
            WHERE test_id = ?
        """;

        Map<String, Object> testRow = jdbcTemplate.queryForMap(testQuery, testId);
        Instant startTime = ((java.sql.Timestamp) testRow.get("start_time")).toInstant();
        Instant endTime = ((java.sql.Timestamp) testRow.get("end_time")).toInstant();
        long duration = ((Number) testRow.get("duration")).longValue();

        String questionsQuery = """
            SELECT q.question_id, q.question, q.options, q.answer_index
            FROM questions q
            JOIN test_questions tq ON q.question_id = tq.question_id
            WHERE tq.test_id = ?
        """;

        List<Question> questionList = jdbcTemplate.query(
            questionsQuery,
            new Object[]{testId},
            questionRowMapper()
        );

        return new TestState(
            userId,
            testId,
            startTime,
            endTime,
            duration,
            questionList
        );
    }

    private RowMapper<Question> questionRowMapper() {
        return (rs, rowNum) -> {
            String id = rs.getObject("question_id").toString();
            String questionText = rs.getString("question");

            Array sqlArray = rs.getArray("options");
            List<String> options = Arrays.asList((String[]) sqlArray.getArray());

            int answerIndex = rs.getInt("answer_index");

            return new Question(id, questionText, options, answerIndex);
        };
    }

    public void saveCandidateTest(TestState testState) {
        String testId = testState.getTestId();
        String candidateId = testState.getUserId();
        Instant startTime = testState.getSessionStartTime();
        Instant endTime = testState.getSessionEndTime();

        String insertTestSql = """
            INSERT INTO candidate_tests (test_id, candidate_id, start_time, end_time, score)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT (test_id, candidate_id)
            DO UPDATE SET 
                start_time = EXCLUDED.start_time,
                end_time = EXCLUDED.end_time,
                score = EXCLUDED.score
        """;

        jdbcTemplate.update(
            insertTestSql,
            testId,
            candidateId,
            Timestamp.from(startTime),
            Timestamp.from(endTime),
            0
        );

        String insertResponseSql = """
            INSERT INTO candidate_responses (
                test_id, candidate_id, question_id,
                chosen_option, time_spent, answer_changed_times, correct_answer, question_seen
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (test_id, candidate_id, question_id)
            DO UPDATE SET
                chosen_option = EXCLUDED.chosen_option,
                time_spent = EXCLUDED.time_spent,
                answer_changed_times = EXCLUDED.answer_changed_times,
                correct_answer = EXCLUDED.correct_answer,
                question_seen = EXCLUDED.question_seen
        """;

        for (Map.Entry<String, QuestionResponse> entry : testState.getQuestionsResponse().entrySet()) {
            QuestionResponse response = entry.getValue();

            jdbcTemplate.update(
                insertResponseSql,
                testId,
                candidateId,
                response.getId(),
                response.getChosenOption(),
                response.getTimeSpent(),
                response.getAnswerChangedTimes(),
                response.isCorrectAnswer(),
                response.isQuestionSeen()
            );
        }
    }
}