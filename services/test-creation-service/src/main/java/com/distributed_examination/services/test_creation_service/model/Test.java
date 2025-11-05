package com.distributed_examination.services.test_creation_service.model;

import java.util.List;

public class Test {
    private String id;
    private String name;
    private String description;
    private int duration;
    private String startTime;
    private String endTime;
    private List<String> questionIds;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public int getDuration() {
		return duration;
	}
	public void setDuration(int duration) {
		this.duration = duration;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public List<String> getQuestionIds() {
		return questionIds;
	}
	public void setQuestionIds(List<String> questionIds) {
		this.questionIds = questionIds;
	}
    
    
}