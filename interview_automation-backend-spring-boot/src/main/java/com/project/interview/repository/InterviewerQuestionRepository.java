package com.project.interview.repository;

import com.project.interview.entity.InterviewerQuestionEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface InterviewerQuestionRepository extends JpaRepository<InterviewerQuestionEntity, Long> {

    boolean existsBySkillIdAndQuestion(Long skillId, String questionText);

    Set<InterviewerQuestionEntity> findAllByInterviewerIdAndSkillId(long interviewerId,
                                                                    long skillId,
                                                                    Sort sort);
    Optional<InterviewerQuestionEntity> findBySkillIdAndQuestion(Long skillId, String questionText);

    Optional<InterviewerQuestionEntity> findByInterviewerIdAndSkillIdAndQuestion(long interviewerId,
                                                                                 long skillId,
                                                                                 String question);
}
