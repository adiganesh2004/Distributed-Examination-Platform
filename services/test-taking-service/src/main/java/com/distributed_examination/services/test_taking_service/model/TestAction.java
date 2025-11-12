package com.distributed_examination.services.test_taking_service.model;


import java.util.Base64;

public class TestAction {
    public String token;
    public String userId;
    public String type;
    public String testId;
    public String nextQuestionId;
    public String currentQuestionId;
    public int chosenOption;
    public String imageBase64;

    public TestAction() {
    }

    public TestAction(String token, String userId, String type, String testId,
                      String nextQuestionId, String currentQuestionId, int chosenOption, String imageBase64) {
        this.token = token;
        this.userId = userId;
        this.type = type;
        this.testId = testId;
        this.nextQuestionId = nextQuestionId;
        this.currentQuestionId = currentQuestionId;
        this.chosenOption = chosenOption;
        this.imageBase64 = imageBase64;
    }

    public byte[] toByteArray() {
        try {
            String base64 = this.imageBase64;

            // Strip data URL prefix (e.g. "data:image/png;base64,")
            if (base64.contains(",")) {
                base64 = base64.split(",")[1];
            }

            byte[] imageBytes = Base64.getDecoder().decode(base64);

            // Create a MultipartFile (Spring Mock implementation)
            return imageBytes;
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert Base64 to MultipartFile: " + e.getMessage(), e);
        }
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
