package com.project.interview.dtos;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.Accessors;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@Accessors(chain = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserSearchResponseDto {

    Long id;
    String firstname;
    String lastname;
    String email;
    String avatarImgUrl;
    Map<String, Integer> skillGrades;

}
