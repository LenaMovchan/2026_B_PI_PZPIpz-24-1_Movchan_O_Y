package com.project.interview.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Entity(name = "interview_questions")
public class InterviewQuestionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "interview_id")
    private Long interviewId;
    @ManyToOne
    @JoinColumn(name = "skill_id", referencedColumnName = "id")
    private SkillEntity skill;
    @Column(name = "question")
    private String question;
    @Column(name = "grade")
    private Integer grade;
    @Column(name = "create_at")
    private LocalDateTime createAt;
}
