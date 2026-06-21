package com.project.interview.dtos;

import com.project.interview.dtos.interview.ShortInterviewDto;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;
import java.util.Set;

@Data
@Accessors(chain = true)
public class UserByIdDto {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String avatarImgUrl;
    private String description;
    private Set<RoleWithSkillsDto> roles;
    private List<ShortInterviewDto> completedInterviews;
}
