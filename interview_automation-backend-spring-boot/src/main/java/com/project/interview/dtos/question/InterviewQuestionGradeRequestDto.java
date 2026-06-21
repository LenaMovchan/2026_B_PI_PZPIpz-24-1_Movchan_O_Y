package com.project.interview.dtos.question;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestionGradeRequestDto {

    @NotNull(message = "Question ID is required.")
    private Long id;

    @NotNull(message = "Interview ID is required.")
    private Long interviewId;

    @NotNull(message = "Grade is required.")
//    @NotBlank(message = "An estimate must be issued.")
//    @Pattern(regexp = "^(100|[1-9]?[0-9])%$", message = "Grade must be in the format X%, where X is a number from 0 to 100.")
    private Integer grade;
}
