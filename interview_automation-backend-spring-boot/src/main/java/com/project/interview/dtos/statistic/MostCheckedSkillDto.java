package com.project.interview.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MostCheckedSkillDto {
    private String skillName;      // Назва навички
    private Long usageCount;       // Кількість використань
    private Double averageGrade;   // Середня оцінка
}
