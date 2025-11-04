package com.distributed_examination.services.test_taking_service.model;

public class TestAction {
    private String token;
    private String userId;
    private String type;
    private String testId;
    private String nextQuestionId;
    private String currentQuestionId;
    private int chosenOption;

    public TestAction() {
    }

    public TestAction(String token, String userId, String type, String testId,
                      String nextQuestionId, String currentQuestionId, int chosenOption) {
        this.token = token;
        this.userId = userId;
        this.type = type;
        this.testId = testId;
        this.nextQuestionId = nextQuestionId;
        this.currentQuestionId = currentQuestionId;
        this.chosenOption = chosenOption;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTestId() {
        return testId;
    }

    public void setTestId(String testId) {
        this.testId = testId;
    }

    public String getNextQuestionId() {
        return nextQuestionId;
    }

    public void setNextQuestionId(String nextQuestionId) {
        this.nextQuestionId = nextQuestionId;
    }

    public String getCurrentQuestionId() {
        return currentQuestionId;
    }

    public void setCurrentQuestionId(String currentQuestionId) {
        this.currentQuestionId = currentQuestionId;
    }

    public int getChosenOption() {
        return chosenOption;
    }

    public void setChosenOption(int chosenOption) {
        this.chosenOption = chosenOption;
    }

    @Override
    public String toString() {
        return "TestAction{" +
                "token='" + token + '\'' +
                ", userId='" + userId + '\'' +
                ", type='" + type + '\'' +
                ", testId='" + testId + '\'' +
                ", nextQuestionId='" + nextQuestionId + '\'' +
                ", currentQuestionId='" + currentQuestionId + '\'' +
                ", chosenOption=" + chosenOption +
                '}';
    }
}
