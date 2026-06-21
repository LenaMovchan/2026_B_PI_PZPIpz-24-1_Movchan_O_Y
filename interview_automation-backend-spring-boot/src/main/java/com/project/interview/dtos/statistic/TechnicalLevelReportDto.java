package com.project.interview.dtos.statistic;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TechnicalLevelReportDto {
    private List<CandidateAverageDto> candidates;
    private List<String> hardestSkills; // Найнижчі оцінки
    private List<String> easiestSkills; // Найвищі оцінки
    private String period;
}
