package com.project.interview.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserChangePasswordDto {

    @NotBlank
    private String password;

    @NotBlank
    private String newPassword;

    @NotBlank
    private String repeatNewPassword;
}
