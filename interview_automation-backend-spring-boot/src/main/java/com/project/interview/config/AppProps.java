package com.project.interview.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@Getter
@Setter
@ConfigurationProperties(prefix = "app")
public class AppProps {
    private final JwtProps jwt = new JwtProps();
    private final SecurityProps security = new SecurityProps();
    private final OAuth2Props oauth2 = new OAuth2Props();
    private final GeminiProps gemini = new GeminiProps();

    @Getter
    @Setter
    public static class JwtProps {
        private String secret;
        private long expirationTimeInMinutes;
        private long jwtRefreshExpirationTimeInDays;
    }

    @Getter
    @Setter
    public static class SecurityProps {
        private String[] permitAllUris;
        private String[] securedUris;
    }

    @Getter
    @Setter
    public static class OAuth2Props {
        private List<String> authorizedRedirectUris;
        private int cookieExpireSeconds;
        private String authorizationBaseUri;
        private String redirectionBaseUri;
    }

    @Getter
    @Setter
    public static class GeminiProps {
        private String url;
    }
}
