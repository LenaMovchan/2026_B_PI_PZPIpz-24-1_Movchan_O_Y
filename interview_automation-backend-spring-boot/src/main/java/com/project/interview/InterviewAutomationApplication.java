package com.project.interview;

import com.project.interview.config.AppProps;
import com.project.interview.test.DataGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@RequiredArgsConstructor
@EnableConfigurationProperties(AppProps.class)
@EnableScheduling
@EnableCaching
public class InterviewAutomationApplication implements ApplicationRunner {

    private final DataGeneratorService dataGeneratorService;

    @Value("${h2.enable-test-data}")
    private boolean isTestDataEnabled;

    public static void main(String[] args) {
        SpringApplication.run(InterviewAutomationApplication.class, args);
    }

    //for test, delete later
    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (isTestDataEnabled) {
            dataGeneratorService.insertData();
        }
    }
}
