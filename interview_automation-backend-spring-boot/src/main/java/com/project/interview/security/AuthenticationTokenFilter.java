package com.project.interview.security;

import com.project.interview.config.AppProps;
import com.project.interview.security.oauth2.model.AuthDetails;
import com.project.interview.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Arrays;

@Component
@Slf4j
@RequiredArgsConstructor
public class AuthenticationTokenFilter extends OncePerRequestFilter {
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String HEADER_NAME = "Authorization";
    private final JwtService jwtService;
    private final UserService userService;
    private final AppProps appProps;

    @Value("${rest.prefix}")
    private String restPrefix;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain
    ) throws ServletException, IOException {
        log.info("Request to uri - {}", request.getRequestURI());

        boolean isPermitAllUri = Arrays
                .stream(appProps.getSecurity().getPermitAllUris())
                .anyMatch(url -> request.getRequestURI().startsWith(url.replace("/**", "")));
        boolean isUriNotStartFromRestPrefix = !request.getRequestURI().startsWith(restPrefix);

        if (isPermitAllUri || isUriNotStartFromRestPrefix) {
            log.info("Permit all uri!");
            filterChain.doFilter(request, response);
            return;
        }

        var authHeader = request.getHeader(HEADER_NAME);
        log.info("{} header = {}", HEADER_NAME, authHeader);
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            log.error("No bearer header!");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String jwt = authHeader.substring(BEARER_PREFIX.length());
        long userId;
        AuthDetails authDetails;
        try {
            userId = jwtService.getUserIdFromToken(jwt);
            log.info("User id = {}", userId);
            authDetails = new AuthDetails(userService.findById(userId));
            SecurityContextHolder
                    .getContext()
                    .setAuthentication(new UsernamePasswordAuthenticationToken(
                            authDetails,
                            null,
                            authDetails.getAuthorities()));
            filterChain.doFilter(request, response);
        } catch (ResponseStatusException exception) {
            log.error("No user in database", exception);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
