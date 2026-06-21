package com.project.interview.dtos.interview;

import com.project.interview.dtos.QuestionScoreDto;
import com.project.interview.dtos.UserResponseDto;
import com.project.interview.enumeration.InterviewStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class InterviewFullDto {
    private Long id;
    private String title;
    private InterviewStatus status;
    private UserResponseDto interviewer;
    private UserResponseDto searcher;
    private LocalDateTime plannedDateTime;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private List<QuestionScoreDto> questions;
    private String feedback;
}
