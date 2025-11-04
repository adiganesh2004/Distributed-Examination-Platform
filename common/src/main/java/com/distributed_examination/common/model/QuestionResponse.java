package com.distributed_examination.common.model;

import java.time.Duration;
import java.time.Instant;

public class QuestionResponse {
    private String id;
    private int chosenOption;
    private long timeSpent;
    private int answerChangedTimes;
    private boolean correctAnswer;
    private boolean questionSeen;
    private Instant lastOpened;

    public QuestionResponse() {}

    public QuestionResponse(String id) {
        this.id = id;
        this.chosenOption = -1;
        this.timeSpent = 0;
        this.answerChangedTimes = 0;
        this.correctAnswer = false;
        this.questionSeen = false;
        this.lastOpened = null;
    }

    public void updateTimeSpent(Instant now) {
        if (lastOpened != null) {
            long seconds = Duration.between(lastOpened, now).getSeconds();
            if (seconds > 0) {
                this.timeSpent += seconds;
            }
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getChosenOption() {
        return chosenOption;
    }

    public void setChosenOption(int chosenOption) {
        this.chosenOption = chosenOption;
    }

    public long getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(long timeSpent) {
        this.timeSpent = timeSpent;
    }

    public int getAnswerChangedTimes() {
        return answerChangedTimes;
    }

    public void setAnswerChangedTimes(int answerChangedTimes) {
        this.answerChangedTimes = answerChangedTimes;
    }

    public boolean isCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(boolean correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public boolean isQuestionSeen() {
        return questionSeen;
    }

    public void setQuestionSeen(boolean questionSeen) {
        this.questionSeen = questionSeen;
    }

    public Instant getLastOpened() {
        return lastOpened;
    }

    public void setLastOpened(Instant lastOpened) {
        this.lastOpened = lastOpened;
    }

    public void incrementAnswerChangedTimes() {
        this.answerChangedTimes++;
    }

    @Override
    public String toString() {
        return "QuestionResponse{" +
                "id='" + id + '\'' +
                ", chosenOption=" + chosenOption +
                ", timeSpent=" + timeSpent +
                ", answerChangedTimes=" + answerChangedTimes +
                ", correctAnswer=" + correctAnswer +
                ", questionSeen=" + questionSeen +
                ", lastOpened=" + lastOpened +
                '}';
    }
}
