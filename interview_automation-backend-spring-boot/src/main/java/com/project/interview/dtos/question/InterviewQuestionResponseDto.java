package com.project.interview.dtos.question;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InterviewQuestionResponseDto {

    private Long id;
    private String skillName;
    private String question;
    private LocalDateTime createdAt;

}
