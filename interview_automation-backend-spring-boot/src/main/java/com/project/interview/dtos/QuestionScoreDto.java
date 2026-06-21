package com.project.interview.dtos;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionScoreDto {
    Long id;
    String question;
    Integer grade;
    String skillName;
    LocalDateTime createdAt;
}
