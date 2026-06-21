package com.project.interview.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillComplianceDto {
    private String skillName;      // Назва навички
    private Long candidateCount;   // Кількість оцінених кандидатів
    private Double averageGrade;   // Середня оцінка по навичці
}
