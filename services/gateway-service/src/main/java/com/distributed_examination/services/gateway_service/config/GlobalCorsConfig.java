package com.distributed_examination.services.gateway_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class GlobalCorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("*");      // allow all origins
        config.addAllowedMethod("*");      // allow GET, POST, PUT, DELETE, etc.
        config.addAllowedHeader("*");      // allow all headers
        config.setAllowCredentials(false); // cannot use * with credentials

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // apply to all paths
        return new CorsWebFilter(source);
    }
}