package com.distributed_examination.services.test_creation_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(scanBasePackages = {
	    "com.distributed_examination.services.test_creation_service",
	    "com.distributed_examination.common"
	})
@EnableDiscoveryClient
public class TestCreationServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TestCreationServiceApplication.class, args);
	}

}
