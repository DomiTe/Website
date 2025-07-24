package com.cyberpunk.neoncity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin; // Import CrossOrigin

import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class NeonCityApplication {

    public static void main(String[] args) {
        SpringApplication.run(NeonCityApplication.class, args);
    }
}