package com.project.interview.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@Slf4j
public class SpaWebFilter extends OncePerRequestFilter {

    @Value("${back.not-redirect-to-front.start-with}")
    private List<String> startWith;

    @Value("${back.not-redirect-to-front.ends-with}")
    private List<String> endsWith;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI().toLowerCase();
        log.info("SpaWebFilter path: " + path);
        log.info("Server name: {}", request.getServerName());

        if ("/actuator/shutdown".equals(path) && !"localhost".equals(request.getServerName())) {
            log.info("Access denied!");
            request.getRequestDispatcher("/index.html").forward(request, response);
            return;
        }

        if (!path.equals("/")
                && startWith.stream().noneMatch(path::startsWith)
                && endsWith.stream().noneMatch(path::endsWith)) {
            log.info("SpaWebFilter forwarding to /index.html from path: " + path);
            request.getRequestDispatcher("/index.html").forward(request, response);
            return;
        }

        log.info("SpaWebFilter sent along its way path: " + path);
        filterChain.doFilter(request, response);
    }
}
