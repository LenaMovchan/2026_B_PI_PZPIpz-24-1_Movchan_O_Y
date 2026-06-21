package com.project.interview.security.token;

import com.project.interview.config.AppProps;
import com.project.interview.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.UUID;

@Service
@AllArgsConstructor
public class RefreshTokenService {

    private final AppProps appProps;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public RefreshToken createRefreshToken(long userId) {
        RefreshToken refreshToken = RefreshToken.builder()
                .userEntity(userRepository.findById(userId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "User not found")))
                .token(UUID.randomUUID().toString())
                .expiryDate(createExpiryDate())
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public Instant createExpiryDate() {
        return LocalDateTime.now(ZoneId.of("Z"))
                .plusDays(appProps.getJwt().getJwtRefreshExpirationTimeInDays())
                .toInstant(ZoneOffset.UTC);
    }

    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Refresh Token is not in db..!!"));
    }

    public void deleteByExpiryDateBefore(Instant date) {
        refreshTokenRepository.deleteByExpiryDateBefore(date);
    }

    public void save(RefreshToken refreshToken) {
        refreshTokenRepository.save(refreshToken);
    }

}
