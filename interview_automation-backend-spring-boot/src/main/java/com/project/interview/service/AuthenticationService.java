package com.project.interview.service;

import com.project.interview.dtos.*;
import com.project.interview.entity.TempUserEntity;
import com.project.interview.entity.UserEntity;
import com.project.interview.mapper.UserMapper;
import com.project.interview.repository.TempUserRepository;
import com.project.interview.security.JwtService;
import com.project.interview.security.token.RefreshToken;
import com.project.interview.security.token.RefreshTokenService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final RefreshTokenService refreshTokenService;
    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final TempUserRepository tempUserRepository;
    private final UserMapper userMapper;
    private final MailService mailService;

    @Value("${user.create.redirect}")
    private String submitRedirectUri;

    public boolean register(RegisterRequest request) {
        tempUserRepository.deleteByEmail(request.getEmail());

        if (userService.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists!");
        }

        TempUserEntity tempUserEntity = tempUserRepository.save(userMapper.registerToTemp(request));
        mailService.sendEmailSubmitLetter(
                tempUserEntity.getEmail(),
                jwtService.generateTempUserToken(tempUserEntity.getId()));
        return true;
    }

    public AuthenticationResponseWithRefreshToken authenticate(AuthenticationRequest request) {

        UserEntity user = userService.getByEmail(request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials!");
        }

        String jwt = jwtService.generateUserToken(user.getId());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
        return new AuthenticationResponseWithRefreshToken(jwt, refreshToken.getToken());
    }

    public AuthenticationResponseWithRefreshToken refreshToken(RefreshTokenRequestDto refreshTokenRequestDto) {

        refreshTokenService.deleteByExpiryDateBefore(Instant.now());

        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenRequestDto.getRefreshToken());
        if (refreshToken == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh Token not found.");
        }

        refreshTokenService.save(refreshToken
                .setToken(UUID.randomUUID().toString())
                .setExpiryDate(refreshTokenService.createExpiryDate()));

        String jwt = jwtService.generateUserToken(refreshToken.getUserEntity().getId());

        return AuthenticationResponseWithRefreshToken.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken()).build();

    }

    public void createUser(String token,
                           HttpServletResponse response) {
        long tempUserId = jwtService.getTempUserIdFromToken(token);
        tempUserRepository.deleteAllByExpireAtBefore(LocalDateTime.now(ZoneOffset.UTC));

        Optional<TempUserEntity> tempUserEntity = tempUserRepository.findById(tempUserId);
        UriComponentsBuilder redirectUriComponentBuilder = UriComponentsBuilder.fromUriString(submitRedirectUri);

        if (tempUserEntity.isPresent()) {
            UserEntity user = userService.saveNewUserWithDefaultRole(userMapper.tempUserToUser(tempUserEntity.get()));
            tempUserRepository.deleteById(tempUserId);
            String jwt = jwtService.generateUserToken(user.getId());
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
            redirectUriComponentBuilder
                    .queryParam("token", jwt)
                    .queryParam("refresh", refreshToken.getToken());
        } else {
            redirectUriComponentBuilder
                    .queryParam("error", "Invalid link!");
        }

        try {
            response.sendRedirect(redirectUriComponentBuilder.build().toUriString());
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Redirect failed!");
        }
    }

    public boolean sendEmailForResetPassword(EmailDto emailDto) {
        UserEntity user;
        try {
            user = userService.getByEmail(emailDto.getEmail());
        } catch (ResponseStatusException e) {
            return false;
        }

        String token = jwtService.generateResetPasswordToken(user.getId());
        mailService.sendResetPasswordEmail(user.getEmail(), token);
        return true;
    }

    public boolean resetPassword(ResetPasswordDto resetPasswordDto) {
        if (!StringUtils.equals(resetPasswordDto.getPassword(), resetPasswordDto.getRepeatPassword())) {
            return false;
        }

        long userId = jwtService.getUserIdFromResetPasswordToken(resetPasswordDto.getToken());
        UserEntity user = userService.findById(userId);

        userService.setPasswordForUserById(
                passwordEncoder.encode(resetPasswordDto.getPassword()),
                user.getId());

        return true;
    }

    public boolean verifyResetToken(String token) {
        jwtService.getUserIdFromResetPasswordToken(token);
        return true;
    }
}
