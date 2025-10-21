package com.distributed_examination.services.question_service.controllers;

import com.distributed_examination.services.question_service.models.Question;
import com.distributed_examination.services.question_service.services.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/question")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // Add a single question manually
    @PostMapping("/add")
    public ResponseEntity<Question> addQuestion(@RequestBody Question question) {
        Question saved = questionService.addQuestion(question);
        return ResponseEntity.ok(saved);
    }

    // Upload CSV to add multiple questions
    @PostMapping("/csv")
    public ResponseEntity<List<Question>> uploadCSV(@RequestParam("file") MultipartFile file) {
        try {
            List<Question> savedQuestions = questionService.addQuestionsFromCSV(file);
            return ResponseEntity.ok(savedQuestions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
