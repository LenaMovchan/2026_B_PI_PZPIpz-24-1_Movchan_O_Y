package com.project.interview.dtos.statistic;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class InterviewReportDto {
    private String interviewTitle;
    private String candidateName;
    private String interviewerName;
    private String date;
    private String feedback;
    private List<QuestionGradeDto> questions;
    private Double averageGrade;
}
