package com.project.interview.dtos.interview;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class InterviewUpdateDto {
    @NotBlank
    private String title;
    @Future
    private LocalDateTime plannedDateTime;
}
