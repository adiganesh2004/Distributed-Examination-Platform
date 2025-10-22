package com.distributed_examination.services.question_service.service;

import com.distributed_examination.services.question_service.model.Question;
import com.distributed_examination.services.question_service.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository repository;

    public QuestionService(QuestionRepository repository) {
        this.repository = repository;
    }

    public List<Question> getAllQuestionsFromUser(String admin_id) {
        return repository.findAll(admin_id);
    }

    public Question getQuestion(int id) {
        return repository.findById(id);
    }

    public void createQuestion(Question q, String admin_id) {
        repository.save(q, admin_id);
    }

    public void deleteQuestion(int id) {
        repository.deleteById(id);
    }
}
