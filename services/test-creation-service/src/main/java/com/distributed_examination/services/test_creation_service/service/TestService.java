package com.distributed_examination.services.test_creation_service.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.distributed_examination.services.test_creation_service.model.Test;
import com.distributed_examination.services.test_creation_service.repository.TestRepository;

@Service
public class TestService {

    private final TestRepository repository;

    public TestService(TestRepository repository) {
        this.repository = repository;
    }

    public List<Test> getAllTestsFromUser(String adminId) {
        return repository.findAll(adminId);
    }

    public Test getTest(String id) {
        return repository.findById(id);
    }

    public void createTest(Test t, String adminId) {
        repository.save(t, adminId);
    }

    public List<Test> getCurrentTests() {
        return repository.findCurrentTests();
    }

    public void deleteTest(String id) {
        repository.deleteById(id);
    }
}
