package com.project.interview.test;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@Slf4j
public class DataGeneratorService {
    public void insertData() {
        Random random = new Random();
        List<List<String>> questions = generateQuestions();
        try (Connection connection = DriverManager.getConnection("jdbc:h2:mem:snapshot", "username", "password")) {
            String sql = "INSERT INTO interview_questions (interview_id, skill_id, question, grade, create_at) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement statement = connection.prepareStatement(sql);
            for (int interviewId = 21; interviewId <= 56; interviewId++) {
                for (int skillId = 19; skillId <= 96; skillId++) {
                    List<String> skillQuestions = questions.get(skillId - 19);
                    for (String question : skillQuestions) {
                        statement.setInt(1, interviewId);
                        statement.setInt(2, skillId);
                        statement.setString(3, question);
                        statement.setInt(4, random.nextInt(101));
                        statement.setString(5, "2025-04-30 09:05:00.000001");
                        statement.executeUpdate();
                    }
                }
            }
            log.info("Data inserted successfully.");
        } catch (SQLException e) {
            log.error("Error ", e);
        }
    }

    private List<List<String>> generateQuestions() {
        List<List<String>> questionsPerSkill = new ArrayList<>();

        for (int i = 19; i <= 96; i++) {
            List<String> skillQuestions = new ArrayList<>();
            skillQuestions.add("Question 1 for skill " + i);
            skillQuestions.add("Question 2 for skill " + i);
            skillQuestions.add("Question 3 for skill " + i);
            questionsPerSkill.add(skillQuestions);
        }

        return questionsPerSkill;
    }
}



