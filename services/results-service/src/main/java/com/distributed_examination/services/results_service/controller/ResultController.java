package com.distributed_examination.services.results_service.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.distributed_examination.services.results_service.service.ResultService;
import com.distributed_examination.common.model.CustomUserDetails;
import com.distributed_examination.services.results_service.model.*;

@RestController
@RequestMapping("/results")
public class ResultController {

    private final ResultService service;

    public ResultController(ResultService service) {
        this.service = service;
    }

    // ----- COMMON INSIGHTS -----
    @GetMapping("/{testId}/leaderboard")
    public List<CandidateInsight> leaderboard(@PathVariable String testId) {
        return service.fetchLeaderboard(testId);
    }

    // ----- ADMIN INSIGHTS -----
    @GetMapping("/admin/{testId}/hardest")
    public List<QuestionInsight> hardest(@PathVariable String testId) {
        return service.fetchHardestQuestions(testId);
    }

    @GetMapping("/admin/{testId}/longest")
    public List<QuestionInsight> longest(@PathVariable String testId) {
        return service.fetchLongestTimeQuestions(testId);
    }

    // ----- CANDIDATE INSIGHTS -----
    @GetMapping("/candidate/{testId}/performance")
    public CandidatePerformance performance(
            @PathVariable String testId,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return service.fetchCandidatePerformance(testId, user.getId());
    }
}