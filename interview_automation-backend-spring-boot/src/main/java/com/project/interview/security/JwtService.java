package com.project.interview.security;

import com.project.interview.config.AppProps;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
@Slf4j
public class JwtService {
    private static final String AUTH_KEY = "auth";
    private static final String SUBMIT_KEY = "submit";
    private static final String RESET_PASSWORD_KEY = "reset";
    private static final String KEY_NAME = "key";

    private final AppProps appProps;
    private final SecretKey secretKey;

    @Autowired
    public JwtService(AppProps appProps) {
        this.appProps = appProps;
        this.secretKey = Keys.hmacShaKeyFor(appProps.getJwt().getSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateUserToken(long userId) {
        return generateToken(userId, AUTH_KEY);
    }

    public String generateTempUserToken(long tempUserId) {
        return generateToken(tempUserId, SUBMIT_KEY);
    }

    public String generateResetPasswordToken(long userId) {
        return generateToken(userId, RESET_PASSWORD_KEY);
    }

    public long getUserIdFromToken(String token) {
        return getUserIdFromTokenWithKey(token, AUTH_KEY);
    }

    public long getTempUserIdFromToken(String token) {
        return getUserIdFromTokenWithKey(token, SUBMIT_KEY);
    }

    public long getUserIdFromResetPasswordToken(String token) {
        return getUserIdFromTokenWithKey(token, RESET_PASSWORD_KEY);
    }

    private long getUserIdFromTokenWithKey(String token,
                                           String key) {
        try {
            Claims claims = getClaims(token);

            if (!key.equals(claims.get(KEY_NAME, String.class))) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token key!");
            }

            return Long.parseLong(claims.getSubject());
        } catch (ExpiredJwtException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Expired token time!", e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token!", e);
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private String generateToken(long id,
                                 String key) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        return Jwts.builder()
                .subject(String.valueOf(id))
                .claim(KEY_NAME, key)
                .issuedAt(Date.from(currentDateTime
                        .atZone(ZoneId.systemDefault())
                        .toInstant()))
                .expiration(Date.from(currentDateTime
                        .plusMinutes(appProps.getJwt().getExpirationTimeInMinutes())
                        .atZone(ZoneId.systemDefault())
                        .toInstant()))
                .signWith(secretKey)
                .compact();
    }
}
