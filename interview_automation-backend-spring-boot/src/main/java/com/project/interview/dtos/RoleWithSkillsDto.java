package com.project.interview.dtos;

import lombok.Builder;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@Builder
@Accessors(chain = true)
public class RoleWithSkillsDto {
    private long id;
    private String name;
    private List<SkillTreeDto> skills;
}
