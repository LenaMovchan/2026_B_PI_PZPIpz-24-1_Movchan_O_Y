package com.project.interview.dtos.result;

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
public class UserResultsByInterviewsResponseDto {

    private Long interviewId;
    private Long userId;
    private LocalDateTime interviewDateTime;
    private List<SkillResultDto> skillResults;
}
