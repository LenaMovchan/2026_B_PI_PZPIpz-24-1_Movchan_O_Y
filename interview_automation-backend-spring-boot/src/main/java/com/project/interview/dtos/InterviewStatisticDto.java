package com.project.interview.dtos;


public class InterviewStatisticDto {

    private String lastName;
    private Long totalInterviews;
    private Long totalQuestions;

    public InterviewStatisticDto(String lastName, Long totalInterviews, Long totalQuestions) {
        this.lastName = lastName;
        this.totalInterviews = totalInterviews;
        this.totalQuestions = totalQuestions;
    }

    public String getLastName() {
        return lastName;
    }

    public Long getTotalInterviews() {
        return totalInterviews;
    }

    public Long getTotalQuestions() {
        return totalQuestions;
    }
}

