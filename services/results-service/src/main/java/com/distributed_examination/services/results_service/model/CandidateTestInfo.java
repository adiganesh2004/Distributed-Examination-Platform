package com.distributed_examination.services.results_service.model;

public class CandidateTestInfo {
    private String testId;
    private String testName;
    private int score;

    public String getTestId() {
        return testId;
    }
    public void setTestId(String testId) {
        this.testId = testId;
    }
    public String getTestName() {
        return testName;
    }
    public void setTestName(String testName) {
        this.testName = testName;
    }
    public int getScore() {
        return score;
    }
    public void setScore(int score) {
        this.score = score;
    }
}
