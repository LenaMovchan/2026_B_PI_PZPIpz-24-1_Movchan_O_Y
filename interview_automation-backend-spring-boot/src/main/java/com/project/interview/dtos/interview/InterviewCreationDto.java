package com.project.interview.dtos.interview;

import com.project.interview.enumeration.InterviewStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class InterviewCreationDto {
    @NotBlank
    private String title;
    @NotNull
    private Long searcherId;
    @NotNull
    private InterviewStatus status;
    private LocalDateTime plannedDateTime;
}
