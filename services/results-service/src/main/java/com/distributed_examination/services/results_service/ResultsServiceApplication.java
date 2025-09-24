package com.distributed_examination.services.results_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ResultsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ResultsServiceApplication.class, args);
	}

}
