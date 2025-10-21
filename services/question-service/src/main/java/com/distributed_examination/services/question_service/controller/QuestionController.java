package com.distributed_examination.services.question_service.controller;

import com.distributed_examination.services.question_service.model.Question;
import com.distributed_examination.services.question_service.service.QuestionService;

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
    public List<Question> getAll() {
        return service.getAllQuestions();
    }

    @GetMapping("/{id}")
    public Question getById(@PathVariable int id) {
        return service.getQuestion(id);
    }

    @PostMapping("/admin/create")
    public void createQuestion(@RequestBody Question q) {
        service.createQuestion(q);
    }

    @DeleteMapping("/admin/delete/{id}")
    public void deleteQuestion(@PathVariable int id) {
        service.deleteQuestion(id);
    }
}
