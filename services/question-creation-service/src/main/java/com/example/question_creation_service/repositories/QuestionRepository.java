package com.distributed_examination.services.question_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.distributed_examination.services.question_service.models.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
}
