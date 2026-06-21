package com.project.interview.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class InterviewQuestionController {
    @MessageMapping("/questions")
    public void sendQuestion() {
        log.info("Test message received");
    }
}
