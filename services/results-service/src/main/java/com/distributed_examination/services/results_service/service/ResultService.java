package com.distributed_examination.services.results_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.distributed_examination.services.results_service.model.CandidateInsight;
import com.distributed_examination.services.results_service.model.CandidatePerformance;
import com.distributed_examination.services.results_service.model.CandidateTestInfo;
import com.distributed_examination.services.results_service.model.QuestionInsight;
import com.distributed_examination.services.results_service.repository.ResultRepository;

@Service
public class ResultService {

    private final ResultRepository repository;

    public ResultService(ResultRepository repository) {
        this.repository = repository;
    }

    public List<QuestionInsight> fetchHardestQuestions(String testId) {
        return repository.hardestQuestions(testId);
    }

    public List<QuestionInsight> fetchLongestTimeQuestions(String testId) {
        return repository.longestTimeQuestions(testId);
    }

    public List<CandidateInsight> fetchLeaderboard(String testId) {
        return repository.leaderboard(testId);
    }

    public CandidatePerformance fetchCandidatePerformance(String testId, String candidate_id) {
        return repository.candidatePerformance(testId, candidate_id);
    }

    public List<CandidateTestInfo> fetchTestsGivenByCandidate(String candidateId) {
        return repository.testsGivenByCandidate(candidateId);
    }

}
