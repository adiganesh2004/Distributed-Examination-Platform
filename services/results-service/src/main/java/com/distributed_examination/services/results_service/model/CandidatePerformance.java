package com.distributed_examination.services.results_service.model;

public class CandidatePerformance {
    private String candidateName;
    private int score;
    private double avgTimePerQuestion;
    private int totalQuestions;
    private int correctAnswers;
	public String getCandidateName() {
		return candidateName;
	}
	public void setCandidateName(String candidateName) {
		this.candidateName = candidateName;
	}
	public int getScore() {
		return score;
	}
	public void setScore(int score) {
		this.score = score;
	}
	public double getAvgTimePerQuestion() {
		return avgTimePerQuestion;
	}
	public void setAvgTimePerQuestion(double avgTimePerQuestion) {
		this.avgTimePerQuestion = avgTimePerQuestion;
	}
	public int getTotalQuestions() {
		return totalQuestions;
	}
	public void setTotalQuestions(int totalQuestions) {
		this.totalQuestions = totalQuestions;
	}
	public int getCorrectAnswers() {
		return correctAnswers;
	}
	public void setCorrectAnswers(int correctAnswers) {
		this.correctAnswers = correctAnswers;
	}

    // getters & setters
    
}