package com.project.interview.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    @Value("${project.version}")
    private String projectVersion;

    @Value("${domain.back}")
    private String serverUrl;

    @Bean
    public OpenAPI customOpenApi() {
        String securitySchemeName = "jwt";

        Info info = new Info()
                .title("Snapshot API")
                .version(projectVersion)
                .description("Snapshot project endpoints");

        SecurityScheme securityScheme = new SecurityScheme()
                .name(securitySchemeName)
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT");

        Server server = new Server();
        server.setUrl(serverUrl);
        server.setDescription("Server");

        return new OpenAPI()
                .info(info)
                .components(new Components().addSecuritySchemes(securitySchemeName, securityScheme))
                .servers(List.of(server));
    }
}
