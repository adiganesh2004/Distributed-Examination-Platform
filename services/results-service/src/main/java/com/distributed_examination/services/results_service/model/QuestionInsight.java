package com.distributed_examination.services.results_service.model;

public class QuestionInsight {
    private String questionId;
    private String question;
    private double avgTime;
    private double correctnessRate;
	public String getQuestionId() {
		return questionId;
	}
	public void setQuestionId(String questionId) {
		this.questionId = questionId;
	}
	public String getQuestion() {
		return question;
	}
	public void setQuestion(String question) {
		this.question = question;
	}
	public double getAvgTime() {
		return avgTime;
	}
	public void setAvgTime(double avgTime) {
		this.avgTime = avgTime;
	}
	public double getCorrectnessRate() {
		return correctnessRate;
	}
	public void setCorrectnessRate(double correctnessRate) {
		this.correctnessRate = correctnessRate;
	}

    // getters & setters
    
}