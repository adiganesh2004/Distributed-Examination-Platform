package com.example.question_creation_service.services;

import com.distributed_examination.services.question_service.models.Question;
import com.distributed_examination.services.question_service.repositories.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    public List<Question> addQuestionsFromCSV(MultipartFile file) throws Exception {
        List<Question> questions = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            while ((line = br.readLine()) != null) {
                // CSV format: question,option1,option2,option3,option4,answerIndex
                String[] parts = line.split(",");
                if (parts.length != 6) continue;

                Question q = new Question();
                q.setQuestion(parts[0]);
                List<String> options = new ArrayList<>();
                options.add(parts[1]);
                options.add(parts[2]);
                options.add(parts[3]);
                options.add(parts[4]);
                q.setOptions(options);
                q.setAnswerIndex(Integer.parseInt(parts[5]));

                questions.add(q);
            }
        }

        return questionRepository.saveAll(questions);
    }
}
