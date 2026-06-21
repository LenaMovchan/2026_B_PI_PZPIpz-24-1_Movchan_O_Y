package com.project.interview.repository;

import com.project.interview.entity.InterviewQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestionEntity, Long> {

    List<InterviewQuestionEntity> findByInterviewId(Long interviewId);

    Optional<InterviewQuestionEntity> findById(Long id);

    boolean existsByInterviewIdAndSkillIdAndQuestion(Long interviewId, Long skillId, String questionText);

    Optional<InterviewQuestionEntity> findByInterviewIdAndSkillIdAndQuestion(Long interviewId, Long skillId, String questionText);
}
