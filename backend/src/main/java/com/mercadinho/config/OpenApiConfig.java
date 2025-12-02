package com.mercadinho.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI mercadinhoOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Mercadinho Admin API")
                        .description("API para gestão de estoque do Mercadinho do Povo.")
                        .version("1.0.0")
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")));
    }

    @Bean
    public GroupedOpenApi productsGroup() {
        return GroupedOpenApi.builder()
                .group("products")
                .pathsToMatch("/api/**")
                .build();
    }
}
