package com.project.interview.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InterviewerStatsDto {
    private String firstName;    // Ім'я інтерв'юера
    private String lastName;     // Прізвище інтерв'юера
    private Long interviewCount; // Кількість проведених співбесід
}
