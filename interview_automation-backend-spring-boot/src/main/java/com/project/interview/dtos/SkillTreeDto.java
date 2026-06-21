package com.project.interview.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillTreeDto {
    private Long id;
    private String name;
    private List<SkillTreeDto> children;
}
