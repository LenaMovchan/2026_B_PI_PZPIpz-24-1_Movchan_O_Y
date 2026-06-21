package com.project.interview.dtos.question;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InterviewQuestionRequestDto {

    @NotNull(message = "Interview ID is required.")
    private Long interviewId;

    @NotNull(message = "Interviewer ID is required.")
    private Long interviewerId;

    @NotNull(message = "Skill ID is required.")
    private Long skillId;

    @NotNull(message = "Question is required.")
    @NotBlank(message = "Question must be entered.")
    private String question;

}
