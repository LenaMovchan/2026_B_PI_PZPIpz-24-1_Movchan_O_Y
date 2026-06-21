//package com.project.interview.gemini;
//
//import com.project.interview.config.AppProps;
//import com.project.interview.gemini.dto.Request;
//import com.project.interview.gemini.dto.Response;
//import lombok.extern.slf4j.Slf4j;
//import org.apache.commons.lang3.StringUtils;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cache.annotation.Cacheable;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestClient;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;
//
//@Service
//@Slf4j
//public class GeminiService {
//    private static final String QUESTION_REGEX = "\\*{2}[^*]+\\*{2}";
//    private static final String GEMINI_QUESTION_TEMPLATE = "Згенеруй 10 питань по %s на українській мові";
//    private final RestClient geminiRestClient;
//    private final Pattern questionPattern = Pattern.compile(QUESTION_REGEX);
//
//    @Autowired
//    public GeminiService(AppProps appProps) {
//        this.geminiRestClient = RestClient.builder()
//                .baseUrl(appProps.getGemini().getUrl())
//                .defaultHeader("Content-Type", "application/json")
//                .defaultHeader("Accept", "application/json")
//                .build();
//    }
//
//    @Cacheable("geminiQuestions")
//    public List<String> generateQuestionsBySkillName(String skillName) {
//        String message = String.format(GEMINI_QUESTION_TEMPLATE, skillName);
//        return parseQuestions(processMessage(message));
//    }
//
//    private String processMessage(String question) {
//        log.info("question = {}", question);
//
//        Request request = new Request();
//        request.setQuestion(question);
//
//        Response response;
//        try {
//            response = geminiRestClient
//                    .post()
//                    .body(request)
//                    .retrieve()
//                    .body(Response.class);
//        } catch (Exception e) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Some problems with gemini ai!");
//        }
//
//        return response.getAnswer();
//    }
//
//    private List<String> parseQuestions(String questions) {
//        List<String> listOfQuestions = new ArrayList<>();
//
//        if (StringUtils.isBlank(questions)) {
//            return listOfQuestions;
//        }
//
//        Matcher matcher = questionPattern.matcher(questions);
//        while (matcher.find()) {
//            listOfQuestions.add(questions.substring(matcher.start() + 2, matcher.end() - 2));
//        }
//
//        return listOfQuestions;
//    }
//}
