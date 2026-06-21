package com.project.interview.dtos;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Set;

@Data
@Accessors(chain = true)
public class UserResponseDto {

    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String avatarImgUrl;
    private String description;
    private Set<RoleWithSkillsDto> roles;

}
