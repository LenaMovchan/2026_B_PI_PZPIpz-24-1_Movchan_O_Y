package com.project.interview.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SkillCoverageDto {
    private Long interviewId;
    private String interviewTitle;
    private Integer evaluatedCount;      // К-сть оцінених
    private List<String> evaluatedSkills; // Список оцінених
    private Integer expectedCount;       // К-сть очікуваних
    private List<String> missingSkills;   // Список НЕ оцінених (очікувані мінус оцінені)
}
