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

    public void UpdateQuestion(String nextQuestionId){
        if(prevQuestionId!=null){
            QuestionResponse prevQuestionResonse = questionsResponse.get(prevQuestionId);
            prevQuestionResonse.updateTimeSpent(Instant.now());
        }
        prevQuestionId = nextQuestionId;
        QuestionResponse currentQuestionResponse = questionsResponse.get(nextQuestionId);
        currentQuestionResponse.setLastOpened(Instant.now());
        currentQuestionResponse.setQuestionSeen(true);
    }

    public void ChangeAnswer(String questionId, int chosenOption){
        if(questionId!=null){
            QuestionResponse response = questionsResponse.get(questionId);
            response.setChosenOption(chosenOption);
            response.incrementAnswerChangedTimes();
        }
    }
}
