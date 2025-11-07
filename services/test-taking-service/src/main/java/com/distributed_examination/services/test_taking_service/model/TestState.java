package com.distributed_examination.services.test_taking_service.model;

import java.time.Instant;
import com.distributed_examination.common.model.Question;
import com.distributed_examination.common.model.QuestionResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class TestState{
    private String userId;
    private String testId;
    private String testName;
    private String description;
    private Instant startTime;
    private Instant endTime;
    private Instant sessionStartTime;
    private Instant sessionEndTime;
    private long duration;
    private String prevQuestionId;

    private Map<String, Question> questions;
    private Map<String, QuestionResponse> questionsResponse;

    public TestState(String userId, String testId, String testName, String description,
                     Instant startTime, Instant endTime, long duration, List<Question> questionList) {
        this.userId = userId;
        this.testId = testId;
        this.testName = testName;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = duration;
        this.sessionStartTime = Instant.now();
        this.sessionEndTime = sessionStartTime.plusSeconds(duration*60);
        this.prevQuestionId = null;
        this.questions = new HashMap<>();
        this.questionsResponse = new HashMap<>();

        for (Question q : questionList) {
            this.questions.put(q.getId(), q);
            this.questionsResponse.put(q.getId(), new QuestionResponse(q.getId()));
        }
    }

    public int calculateScore(){
        int score = 0;

        for (Map.Entry<String, Question> entry : questions.entrySet()) {
            String qId = entry.getKey();
            Question question = entry.getValue();
            QuestionResponse response = questionsResponse.get(qId);

            if (question != null && response != null) {
                Integer chosen = response.getChosenOption();
                Integer correct = question.getAnswerIndex(); // assumes such a getter exists

                if (chosen != null && correct != null && chosen.equals(correct)) {
                    score++;
                    response.setCorrectAnswer(true);
                }
            }
        }

        return score;
    }

    public String toJsonFromMap() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            List<Map<String, Object>> sanitizedQuestions = new ArrayList<>();
    
            for (Question q : questions.values()) {
                Map<String, Object> qMap = new HashMap<>();
                qMap.put("id", q.getId());
                qMap.put("question", q.getQuestion());
                qMap.put("options", q.getOptions());
                sanitizedQuestions.add(qMap);
            }
    
            Map<String, Object> wrapper = new HashMap<>();
            wrapper.put("testName", testName);
            wrapper.put("description", description);
            wrapper.put("duration", duration);
            wrapper.put("questions", sanitizedQuestions);
    
            return mapper.writeValueAsString(wrapper);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize questions map to JSON", e);
        }
    }
    

    public boolean isWithinSessionTime() {
        Instant now = Instant.now();
        return !now.isBefore(sessionStartTime) && !now.isAfter(sessionEndTime);
    }

    public void UpdateQuestion(String nextQuestionId) {
        if (!isWithinSessionTime()) {
            return;
        }

        if (prevQuestionId != null) {
            QuestionResponse prevResponse = questionsResponse.get(prevQuestionId);
            if (prevResponse != null) {
                prevResponse.updateTimeSpent(Instant.now());
            }
        }

        prevQuestionId = nextQuestionId;
        QuestionResponse currentResponse = questionsResponse.get(nextQuestionId);
        if (currentResponse != null) {
            currentResponse.setLastOpened(Instant.now());
            currentResponse.setQuestionSeen(true);
        }
    }

    public void ChangeAnswer(String questionId, int chosenOption) {
        if (!isWithinSessionTime()) {
            return;
        }

        if (questionId != null) {
            QuestionResponse response = questionsResponse.get(questionId);
            if (response != null) {
                response.setChosenOption(chosenOption);
                response.incrementAnswerChangedTimes();
            }
        }
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTestId() {
        return testId;
    }

    public void setTestId(String testId) {
        this.testId = testId;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Instant getSessionStartTime() {
        return sessionStartTime;
    }

    public void setSessionStartTime(Instant sessionStartTime) {
        this.sessionStartTime = sessionStartTime;
    }

    public Instant getSessionEndTime() {
        return sessionEndTime;
    }

    public void setSessionEndTime(Instant sessionEndTime) {
        this.sessionEndTime = sessionEndTime;
    }

    public long getDuration() {
        return duration;
    }

    public void setDuration(long duration) {
        this.duration = duration;
    }

    public String getPrevQuestionId() {
        return prevQuestionId;
    }

    public void setPrevQuestionId(String prevQuestionId) {
        this.prevQuestionId = prevQuestionId;
    }

    public Map<String, Question> getQuestions() {
        return questions;
    }

    public void setQuestions(Map<String, Question> questions) {
        this.questions = questions;
    }

    public Map<String, QuestionResponse> getQuestionsResponse() {
        return questionsResponse;
    }

    public void setQuestionsResponse(Map<String, QuestionResponse> questionsResponse) {
        this.questionsResponse = questionsResponse;
    }
}
