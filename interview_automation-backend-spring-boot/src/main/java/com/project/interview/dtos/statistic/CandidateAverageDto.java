package com.project.interview.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CandidateAverageDto {
    private String fullName;
    private Double averageGrade;
    private String interviewTitle;
}
