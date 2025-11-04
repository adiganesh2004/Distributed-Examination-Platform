package com.distributed_examination.services.test_taking_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(scanBasePackages = {
    "com.distributed_examination.services.test_taking_service",
    "com.distributed_examination.common"
})
@EnableDiscoveryClient
public class TestTakingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TestTakingServiceApplication.class, args);
	}

}
