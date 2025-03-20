package com.marija.task_manager.config;  // or the same root package

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow all requests from frontend (localhost:5173)
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // Update with your frontend's URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow all necessary methods
                .allowedHeaders("*")
                .allowCredentials(true);  // Allow credentials (cookies, etc.)
    }
}
