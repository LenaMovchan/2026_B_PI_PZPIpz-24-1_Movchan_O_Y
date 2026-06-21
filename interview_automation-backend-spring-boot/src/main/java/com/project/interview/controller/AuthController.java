package com.project.interview.controller;

import com.project.interview.dtos.*;
import com.project.interview.handler.dto.ResponseExceptionDto;
import com.project.interview.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "${rest.prefix}/auth", produces = "application/json")
@Tag(name = "Auth", description = "Authentication management endpoints!")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationService service;

    @Operation(summary = "Registers a new user.")
    @ApiResponse(responseCode = "200",
            content = {@Content(schema = @Schema(implementation = Boolean.class), mediaType = "application/json")})
    @ApiResponse(responseCode = "400",
            content = {@Content(schema = @Schema(implementation = ResponseExceptionDto.class), mediaType = "application/json")})
    @PostMapping("/register")
    public boolean register(@RequestBody RegisterRequest request) {
        return service.register(request);
    }

    @Operation(summary = "Get an user authentication tokens.")
    @ApiResponse(responseCode = "200",
            content = {@Content(schema = @Schema(implementation = String.class), mediaType = "application/json")})
    @ApiResponse(responseCode = "401",
            content = {@Content(schema = @Schema(implementation = ResponseExceptionDto.class), mediaType = "application/json")})
    @ApiResponse(responseCode = "404",
            content = {@Content(schema = @Schema(implementation = ResponseExceptionDto.class), mediaType = "application/json")})
    @PostMapping("/authenticate")
    public AuthenticationResponseWithRefreshToken authenticate(@RequestBody AuthenticationRequest request) {
        return service.authenticate(request);
    }

    @Operation(summary = "Refresh an user authentication tokens.")
    @ApiResponse(responseCode = "200",
            content = {@Content(schema = @Schema(implementation = String.class), mediaType = "application/json")})
    @ApiResponse(responseCode = "401",
            content = {@Content(schema = @Schema(implementation = ResponseExceptionDto.class), mediaType = "application/json")})
    @PostMapping("/refresh-token")
    public AuthenticationResponseWithRefreshToken refreshToken(@RequestBody RefreshTokenRequestDto request) {
        return service.refreshToken(request);
    }

    @Operation(summary = "Create a new user.")
    @ApiResponse(responseCode = "201",
            content = {@Content(schema = @Schema(implementation = String.class), mediaType = "application/json")})
    @ApiResponse(responseCode = "400",
            content = {@Content(schema = @Schema(implementation = ResponseExceptionDto.class), mediaType = "application/json")})
    @GetMapping("/create-user")
    @ResponseStatus(HttpStatus.CREATED)
    public void createUser(@RequestParam(name = "token") String token,
                           HttpServletResponse response) {
        service.createUser(token, response);
    }

    @Operation(summary = "Send email for reset password.")
    @ApiResponse(responseCode = "200",
            content = {@Content(schema = @Schema(implementation = Boolean.class), mediaType = "application/json")})
    @ApiResponse(responseCode = "404",
            content = {@Content(schema = @Schema(implementation = ResponseExceptionDto.class), mediaType = "application/json")})
    @PostMapping("/send-reset-password-email")
    public boolean sendEmailForResetPassword(@RequestBody EmailDto emailDto) {
        return service.sendEmailForResetPassword(emailDto);
    }

    @Operation(summary = "Reset password.")
    @ApiResponse(responseCode = "200",
            content = {@Content(schema = @Schema(implementation = Boolean.class), mediaType = "application/json")})
    @ApiResponse(responseCode = "404",
            content = {@Content(schema = @Schema(implementation = ResponseExceptionDto.class), mediaType = "application/json")})
    @PatchMapping("/reset-password")
    public boolean resetPassword(@RequestBody ResetPasswordDto resetPasswordDto) {
        return service.resetPassword(resetPasswordDto);
    }

    @Operation(summary = "Verify reset token.")
    @ApiResponse(responseCode = "200",
            content = {@Content(schema = @Schema(implementation = Boolean.class), mediaType = "application/json")})
    @ApiResponse(responseCode = "401",
            content = {@Content(schema = @Schema(implementation = ResponseExceptionDto.class), mediaType = "application/json")})
    @PostMapping("/verify-reset-token")
    public boolean verifyResetToken(@RequestBody TokenDto tokenDto) {
        return service.verifyResetToken(tokenDto.getToken());
    }
}



