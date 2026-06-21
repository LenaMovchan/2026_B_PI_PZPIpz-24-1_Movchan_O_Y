package com.project.interview.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserStatisticsPeriodDto {
    private String skillName;
    private Double grade;
    private LocalDateTime date;
    private List<QuestionGradeDto> questions;
}
