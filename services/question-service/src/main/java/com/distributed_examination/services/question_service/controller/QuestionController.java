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

    @GetMapping("/admin/getall")
    public List<Question> getAllFromUser(@AuthenticationPrincipal CustomUserDetails user) {
        return service.getAllQuestionsFromUser(user.getId());
    }

    @GetMapping("/{id}")
    public Question getById(@PathVariable String id, @AuthenticationPrincipal CustomUserDetails user) {
        return service.getQuestion(id);
    }

    @PostMapping("/admin/create")
    public void createQuestion(@RequestBody Question q, @AuthenticationPrincipal CustomUserDetails user) {
        service.createQuestion(q, user.getId());
    }

    @DeleteMapping("/admin/delete/{id}")
    public void deleteQuestion(@PathVariable String id, @AuthenticationPrincipal CustomUserDetails user) {
        service.deleteQuestion(id);
    }
}
