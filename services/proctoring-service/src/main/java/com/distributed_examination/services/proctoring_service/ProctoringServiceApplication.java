package com.distributed_examination.services.proctoring_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(scanBasePackages = {
    "com.distributed_examination.services.question_service",
    "com.distributed_examination.common"
})
@EnableDiscoveryClient
public class ProctoringServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProctoringServiceApplication.class, args);
	}

}
