package com.distributed_examination.services.test_creation_service.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.distributed_examination.services.test_creation_service.model.Test;
import com.distributed_examination.services.test_creation_service.repository.TestRepository;
import com.distributed_examination.services.test_creation_service.service.TestService;
import com.distributed_examination.common.model.CustomUserDetails;

import java.util.List;

@RestController
@RequestMapping("/tests")
public class TestController {

    private final TestService service;

    public TestController(TestService service) {
        this.service = service;
    }

    @GetMapping("/admin/getall")
    public List<Test> getAll(@AuthenticationPrincipal CustomUserDetails user) {
        return service.getAllTestsFromUser(user.getId());
    }

    @GetMapping("/{id}")
    public Test getById(@PathVariable String id) {
        return service.getTest(id);
    }

    @PostMapping("/admin/create")
    public void createTest(@RequestBody Test t, @AuthenticationPrincipal CustomUserDetails user) {
        service.createTest(t, user.getId());
    }

    @GetMapping("/getcurrent")
        public List<Test> getCurrentTests() {
            return service.getCurrentTests();
    }


    @DeleteMapping("/admin/delete/{id}")
    public void deleteTest(@PathVariable String id) {
        service.deleteTest(id);
    }
}
