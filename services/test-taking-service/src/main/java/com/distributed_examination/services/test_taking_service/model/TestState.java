package com.distributed_examination.services.test_taking_service.model;

import java.time.Instant;
import com.distributed_examination.common.model.Question;
import com.distributed_examination.common.model.QuestionResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TestState{
    private String userId;
    private String testId;
    private Instant startTime;
    private Instant endTime;
    private Instant sessionStartTime;
    private Instant sessionEndTime;
    private long duration;
    private String prevQuestionId;

    private Map<String,Question> questions;
    private Map<String,QuestionResponse> questionsResponse;

    public TestState(String userId, String testId, Instant startTime, Instant endTime, long duration, List<Question> questionList) {
        this.userId = userId;
        this.testId = testId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = duration;
        this.sessionStartTime = Instant.now();
        this.sessionEndTime = sessionStartTime.plusSeconds(duration);
        this.prevQuestionId = null;
        this.questions = new HashMap<>();
        this.questionsResponse = new HashMap<>();

        for (Question q : questionList) {
            this.questions.put(q.getId(), q);
            this.questionsResponse.put(q.getId(), new QuestionResponse(q.getId()));
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
