package com.project.interview.dtos.status;

import com.project.interview.enumeration.InterviewStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StatusDto {
    private InterviewStatus status;
}
