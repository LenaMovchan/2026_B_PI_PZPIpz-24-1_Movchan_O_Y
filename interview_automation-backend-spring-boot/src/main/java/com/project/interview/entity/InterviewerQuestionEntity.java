package com.project.interview.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Entity(name = "interviewer_questions")
public class InterviewerQuestionEntity {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "skill_id", referencedColumnName = "id")
    private SkillEntity skill;
    @ManyToOne
    @JoinColumn(name = "interviewer_id", referencedColumnName = "id")
    private UserEntity interviewer;
    @Column(name = "question")
    private String question;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
