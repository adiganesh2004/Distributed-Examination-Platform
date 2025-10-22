package com.distributed_examination.services.question_service.controller;

import com.distributed_examination.services.question_service.model.Question;
import com.distributed_examination.services.question_service.service.QuestionService;
import com.distributed_examination.common.model.CustomUserDetails;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
public class QuestionController {

    private final QuestionService service;

    public QuestionController(QuestionService service) {
        this.service = service;
    }

    @GetMapping
    public List<Question> getAll(@AuthenticationPrincipal CustomUserDetails user) {
        return service.getAllQuestions();
    }

    @GetMapping("/{id}")
    public Question getById(@PathVariable int id, @AuthenticationPrincipal CustomUserDetails user) {
        return service.getQuestion(id);
    }

    @PostMapping("/admin/create")
    public void createQuestion(@RequestBody Question q, @AuthenticationPrincipal CustomUserDetails user) {
        service.createQuestion(q, user.getId());
    }

    @DeleteMapping("/admin/delete/{id}")
    public void deleteQuestion(@PathVariable int id, @AuthenticationPrincipal CustomUserDetails user) {
        service.deleteQuestion(id);
    }
}
