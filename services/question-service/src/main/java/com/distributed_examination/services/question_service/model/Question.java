package com.distributed_examination.services.question_service.model;

import java.util.List;

public class Question {

    private String id;
    private String question;
    private List<String> options;
    private int answerIndex;

    public Question() {}

    public Question(String id, String question, List<String> options, int answerIndex) {
        this.id = id;
        this.question = question;
        this.options = options;
        this.answerIndex = answerIndex;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public int getAnswerIndex() { return answerIndex; }
    public void setAnswerIndex(int answerIndex) { this.answerIndex = answerIndex; }
}
